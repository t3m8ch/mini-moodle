use serde::{Deserialize, Serialize};

use crate::domain::{
    AssignmentRecord, CourseRecord, SubmissionRecord, SubmissionStatus, UserRecord,
};

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProfileDto {
    pub id: String,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
    pub full_name: String,
    pub avatar_fallback: String,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UpdateProfileReq {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CourseDto {
    pub id: String,
    pub title: String,
    pub description: String,
    pub teacher_name: String,
    pub students_count: u32,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum AssignmentStatusDto {
    NotStarted,
    InProgress,
    Submitted,
    Graded,
}

#[derive(Serialize, Deserialize, Clone, Copy, Debug, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionStatusDto {
    InProgress,
    Submitted,
    Graded,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AssignmentSummaryDto {
    pub id: String,
    pub title: String,
    pub description: String,
    pub deadline: String,
    pub course_id: String,
    pub course_title: String,
    pub status: AssignmentStatusDto,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SubmissionDto {
    pub id: String,
    pub assignment_id: String,
    pub notes: String,
    pub status: SubmissionStatusDto,
    pub updated_at: String,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AssignmentDetailDto {
    pub assignment: AssignmentSummaryDto,
    pub submission: Option<SubmissionDto>,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ProgressEntryDto {
    pub course: CourseDto,
    pub assignment: AssignmentSummaryDto,
    pub submission: SubmissionDto,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DashboardProgressDto {
    pub total_assignments: usize,
    pub submitted_count: usize,
    pub graded_count: usize,
    pub in_progress_count: usize,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DashboardDto {
    pub profile: ProfileDto,
    pub courses: Vec<CourseDto>,
    pub recent_assignments: Vec<AssignmentSummaryDto>,
    pub progress: DashboardProgressDto,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CourseDetailDto {
    pub course: CourseDto,
    pub assignments: Vec<AssignmentSummaryDto>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct CreateSubmissionReq {
    pub notes: String,
    pub status: Option<SubmissionStatusDto>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UpdateSubmissionReq {
    pub notes: String,
    pub status: SubmissionStatusDto,
}

impl From<&UserRecord> for ProfileDto {
    fn from(value: &UserRecord) -> Self {
        Self {
            id: value.id.to_string(),
            email: value.email.clone(),
            first_name: value.first_name.clone(),
            last_name: value.last_name.clone(),
            patronymic: value.patronymic.clone(),
            full_name: value.full_name(),
            avatar_fallback: value.avatar_fallback(),
        }
    }
}

impl From<&CourseRecord> for CourseDto {
    fn from(value: &CourseRecord) -> Self {
        Self {
            id: value.id.to_string(),
            title: value.title.clone(),
            description: value.description.clone(),
            teacher_name: value.teacher_name.clone(),
            students_count: value.students_count,
        }
    }
}

impl From<SubmissionStatus> for SubmissionStatusDto {
    fn from(value: SubmissionStatus) -> Self {
        match value {
            SubmissionStatus::InProgress => Self::InProgress,
            SubmissionStatus::Submitted => Self::Submitted,
            SubmissionStatus::Graded => Self::Graded,
        }
    }
}

impl From<SubmissionStatusDto> for SubmissionStatus {
    fn from(value: SubmissionStatusDto) -> Self {
        match value {
            SubmissionStatusDto::InProgress => Self::InProgress,
            SubmissionStatusDto::Submitted => Self::Submitted,
            SubmissionStatusDto::Graded => Self::Graded,
        }
    }
}

pub fn submission_to_dto(submission: &SubmissionRecord) -> SubmissionDto {
    SubmissionDto {
        id: submission.id.to_string(),
        assignment_id: submission.assignment_id.to_string(),
        notes: submission.notes.clone(),
        status: submission.status.into(),
        updated_at: submission.updated_at.clone(),
    }
}

pub fn assignment_to_dto(
    assignment: &AssignmentRecord,
    course: &CourseRecord,
    submission: Option<&SubmissionRecord>,
) -> AssignmentSummaryDto {
    let status = match submission.map(|item| item.status) {
        Some(SubmissionStatus::InProgress) => AssignmentStatusDto::InProgress,
        Some(SubmissionStatus::Submitted) => AssignmentStatusDto::Submitted,
        Some(SubmissionStatus::Graded) => AssignmentStatusDto::Graded,
        None => AssignmentStatusDto::NotStarted,
    };

    AssignmentSummaryDto {
        id: assignment.id.to_string(),
        title: assignment.title.clone(),
        description: assignment.description.clone(),
        deadline: assignment.deadline.clone(),
        course_id: assignment.course_id.to_string(),
        course_title: course.title.clone(),
        status,
    }
}

pub fn build_dashboard_progress(assignments: &[AssignmentSummaryDto]) -> DashboardProgressDto {
    let submitted_count = assignments
        .iter()
        .filter(|assignment| assignment.status == AssignmentStatusDto::Submitted)
        .count();
    let graded_count = assignments
        .iter()
        .filter(|assignment| assignment.status == AssignmentStatusDto::Graded)
        .count();
    let in_progress_count = assignments
        .iter()
        .filter(|assignment| assignment.status == AssignmentStatusDto::InProgress)
        .count();

    DashboardProgressDto {
        total_assignments: assignments.len(),
        submitted_count,
        graded_count,
        in_progress_count,
    }
}
