use axum::{
    Json, Router,
    extract::{Path, State},
    routing::{get, patch, post},
};
use axum_extra::extract::CookieJar;
use chrono::Utc;
use uuid::Uuid;

use crate::{
    domain::SubmissionRecord,
    dto::{
        envelope::{ApiError, ApiOk},
        learning::{
            AssignmentDetailDto, CourseDetailDto, CourseDto, CreateSubmissionReq,
            DashboardDto, ProgressEntryDto, ProfileDto, SubmissionStatusDto, UpdateSubmissionReq,
            assignment_to_dto, build_dashboard_progress, submission_to_dto,
        },
    },
    rest::helpers::require_user_id,
    state::AppState,
};

pub fn learning_router() -> Router<AppState> {
    Router::new()
        .route("/dashboard", get(get_dashboard))
        .route("/courses", get(list_courses))
        .route("/courses/{course_id}", get(get_course_detail))
        .route("/assignments/{assignment_id}", get(get_assignment_detail))
        .route("/progress", get(list_progress))
        .route("/assignments/{assignment_id}/submission", post(create_submission))
        .route(
            "/submissions/{submission_id}",
            patch(update_submission).delete(delete_submission),
        )
}

async fn get_dashboard(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<ApiOk<DashboardDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();
    let user = store
        .users
        .get(&user_id)
        .ok_or_else(|| ApiError::NotFound("Пользователь не найден".to_string()))?;

    let courses = store.user_courses(user_id);
    let course_dtos = courses
        .iter()
        .map(|course| CourseDto::from(*course))
        .collect::<Vec<_>>();

    let mut assignments = courses
        .iter()
        .flat_map(|course| {
            store
                .assignments_for_course(course.id)
                .into_iter()
                .map(|assignment| {
                    assignment_to_dto(
                        assignment,
                        course,
                        store.submission_for_assignment(user_id, assignment.id),
                    )
                })
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();

    assignments.sort_by(|left, right| left.deadline.cmp(&right.deadline));
    let progress = build_dashboard_progress(&assignments);
    let recent_assignments = assignments.into_iter().take(4).collect::<Vec<_>>();

    Ok(Json(ApiOk::new(DashboardDto {
        profile: ProfileDto::from(user),
        courses: course_dtos,
        recent_assignments,
        progress,
    })))
}

async fn list_courses(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<ApiOk<Vec<CourseDto>>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();

    let courses = store
        .user_courses(user_id)
        .into_iter()
        .map(CourseDto::from)
        .collect::<Vec<_>>();

    Ok(Json(ApiOk::new(courses)))
}

async fn get_course_detail(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(course_id): Path<Uuid>,
) -> Result<Json<ApiOk<CourseDetailDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();

    let course = store
        .courses
        .get(&course_id)
        .ok_or_else(|| ApiError::NotFound("Курс не найден".to_string()))?;

    if !course.enrolled_user_ids.contains(&user_id) {
        return Err(ApiError::Forbidden(
            "У вас нет доступа к этому курсу".to_string(),
        ));
    }

    let assignments = store
        .assignments_for_course(course_id)
        .into_iter()
        .map(|assignment| {
            assignment_to_dto(
                assignment,
                course,
                store.submission_for_assignment(user_id, assignment.id),
            )
        })
        .collect::<Vec<_>>();

    Ok(Json(ApiOk::new(CourseDetailDto {
        course: CourseDto::from(course),
        assignments,
    })))
}

async fn get_assignment_detail(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(assignment_id): Path<Uuid>,
) -> Result<Json<ApiOk<AssignmentDetailDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();

    let assignment = store
        .assignments
        .get(&assignment_id)
        .ok_or_else(|| ApiError::NotFound("Задание не найдено".to_string()))?;
    let course = store
        .courses
        .get(&assignment.course_id)
        .ok_or_else(|| ApiError::NotFound("Курс не найден".to_string()))?;

    if !course.enrolled_user_ids.contains(&user_id) {
        return Err(ApiError::Forbidden(
            "У вас нет доступа к этому заданию".to_string(),
        ));
    }

    let submission = store.submission_for_assignment(user_id, assignment_id);

    Ok(Json(ApiOk::new(AssignmentDetailDto {
        assignment: assignment_to_dto(assignment, course, submission),
        submission: submission.map(submission_to_dto),
    })))
}

async fn list_progress(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<ApiOk<Vec<ProgressEntryDto>>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();

    let progress = store
        .submissions_for_user(user_id)
        .into_iter()
        .filter_map(|submission| {
            let assignment = store.assignments.get(&submission.assignment_id)?;
            let course = store.courses.get(&assignment.course_id)?;
            Some(ProgressEntryDto {
                course: CourseDto::from(course),
                assignment: assignment_to_dto(assignment, course, Some(submission)),
                submission: submission_to_dto(submission),
            })
        })
        .collect::<Vec<_>>();

    Ok(Json(ApiOk::new(progress)))
}

async fn create_submission(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(assignment_id): Path<Uuid>,
    Json(req): Json<CreateSubmissionReq>,
) -> Result<Json<ApiOk<AssignmentDetailDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let notes = req.notes.trim().to_string();

    if notes.is_empty() {
        return Err(ApiError::BadRequest(
            "Комментарий к сдаче не может быть пустым".to_string(),
        ));
    }

    let (assignment, course, submission) = {
        let mut store = state.store.write();
        let assignment = store
            .assignments
            .get(&assignment_id)
            .cloned()
            .ok_or_else(|| ApiError::NotFound("Задание не найдено".to_string()))?;
        let course = store
            .courses
            .get(&assignment.course_id)
            .cloned()
            .ok_or_else(|| ApiError::NotFound("Курс не найден".to_string()))?;

        if !course.enrolled_user_ids.contains(&user_id) {
            return Err(ApiError::Forbidden(
                "У вас нет доступа к этому заданию".to_string(),
            ));
        }

        if store.submission_for_assignment(user_id, assignment_id).is_some() {
            return Err(ApiError::Conflict(
                "Для этого задания уже существует сдача".to_string(),
            ));
        }

        let submission = SubmissionRecord {
            id: Uuid::new_v4(),
            assignment_id,
            user_id,
            notes,
            status: req.status.unwrap_or(SubmissionStatusDto::InProgress).into(),
            updated_at: Utc::now().to_rfc3339(),
        };

        store.submissions.insert(submission.id, submission.clone());
        (assignment, course, submission)
    };

    Ok(Json(ApiOk::new(AssignmentDetailDto {
        assignment: assignment_to_dto(&assignment, &course, Some(&submission)),
        submission: Some(submission_to_dto(&submission)),
    })))
}

async fn update_submission(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(submission_id): Path<Uuid>,
    Json(req): Json<UpdateSubmissionReq>,
) -> Result<Json<ApiOk<AssignmentDetailDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let notes = req.notes.trim().to_string();

    if notes.is_empty() {
        return Err(ApiError::BadRequest(
            "Комментарий к сдаче не может быть пустым".to_string(),
        ));
    }

    let (assignment, course, submission) = {
        let mut store = state.store.write();
        let submission = store
            .submissions
            .get_mut(&submission_id)
            .ok_or_else(|| ApiError::NotFound("Сдача не найдена".to_string()))?;

        if submission.user_id != user_id {
            return Err(ApiError::Forbidden(
                "Нельзя изменять чужую сдачу".to_string(),
            ));
        }

        submission.notes = notes;
        submission.status = req.status.into();
        submission.updated_at = Utc::now().to_rfc3339();
        let submission = submission.clone();

        let assignment = store
            .assignments
            .get(&submission.assignment_id)
            .cloned()
            .ok_or_else(|| ApiError::NotFound("Задание не найдено".to_string()))?;
        let course = store
            .courses
            .get(&assignment.course_id)
            .cloned()
            .ok_or_else(|| ApiError::NotFound("Курс не найден".to_string()))?;

        (assignment, course, submission)
    };

    Ok(Json(ApiOk::new(AssignmentDetailDto {
        assignment: assignment_to_dto(&assignment, &course, Some(&submission)),
        submission: Some(submission_to_dto(&submission)),
    })))
}

async fn delete_submission(
    State(state): State<AppState>,
    jar: CookieJar,
    Path(submission_id): Path<Uuid>,
) -> Result<Json<ApiOk<()>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let mut store = state.store.write();
    let submission = store
        .submissions
        .get(&submission_id)
        .cloned()
        .ok_or_else(|| ApiError::NotFound("Сдача не найдена".to_string()))?;

    if submission.user_id != user_id {
        return Err(ApiError::Forbidden(
            "Нельзя удалить чужую сдачу".to_string(),
        ));
    }

    store.submissions.remove(&submission_id);

    Ok(Json(ApiOk::empty()))
}
