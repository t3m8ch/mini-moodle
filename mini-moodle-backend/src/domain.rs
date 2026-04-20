use std::collections::HashMap;

use uuid::Uuid;

#[derive(Clone, Debug)]
pub struct AppStore {
    pub users: HashMap<Uuid, UserRecord>,
    pub sessions: HashMap<String, Uuid>,
    pub courses: HashMap<Uuid, CourseRecord>,
    pub assignments: HashMap<Uuid, AssignmentRecord>,
    pub submissions: HashMap<Uuid, SubmissionRecord>,
}

#[derive(Clone, Debug)]
pub struct UserRecord {
    pub id: Uuid,
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Clone, Debug)]
pub struct CourseRecord {
    pub id: Uuid,
    pub title: String,
    pub description: String,
    pub teacher_name: String,
    pub students_count: u32,
    pub enrolled_user_ids: Vec<Uuid>,
}

#[derive(Clone, Debug)]
pub struct AssignmentRecord {
    pub id: Uuid,
    pub course_id: Uuid,
    pub title: String,
    pub description: String,
    pub deadline: String,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum SubmissionStatus {
    InProgress,
    Submitted,
    Graded,
}

#[derive(Clone, Debug)]
pub struct SubmissionRecord {
    pub id: Uuid,
    pub assignment_id: Uuid,
    pub user_id: Uuid,
    pub notes: String,
    pub status: SubmissionStatus,
    pub updated_at: String,
}

impl UserRecord {
    pub fn full_name(&self) -> String {
        let mut parts = vec![self.first_name.trim(), self.last_name.trim()]
            .into_iter()
            .filter(|part| !part.is_empty())
            .map(ToOwned::to_owned)
            .collect::<Vec<_>>();

        if let Some(patronymic) = self.patronymic.as_deref() {
            if !patronymic.trim().is_empty() {
                parts.push(patronymic.trim().to_string());
            }
        }

        parts.join(" ")
    }

    pub fn avatar_fallback(&self) -> String {
        let mut initials = String::new();

        if let Some(ch) = self.first_name.chars().next() {
            initials.push(ch.to_ascii_uppercase());
        }

        if let Some(ch) = self.last_name.chars().next() {
            initials.push(ch.to_ascii_uppercase());
        }

        if initials.is_empty() {
            initials.push_str("MM");
        }

        initials
    }
}

impl AppStore {
    pub fn seed() -> Self {
        let user_id = Uuid::from_u128(0x1000);
        let second_user_id = Uuid::from_u128(0x1001);

        let rust_course_id = Uuid::from_u128(0x2000);
        let frontend_course_id = Uuid::from_u128(0x2001);
        let db_course_id = Uuid::from_u128(0x2002);

        let rust_assignment_id = Uuid::from_u128(0x3000);
        let router_assignment_id = Uuid::from_u128(0x3001);
        let sql_assignment_id = Uuid::from_u128(0x3002);
        let safety_assignment_id = Uuid::from_u128(0x3003);

        let first_submission_id = Uuid::from_u128(0x4000);
        let second_submission_id = Uuid::from_u128(0x4001);
        let third_submission_id = Uuid::from_u128(0x4002);

        let users = HashMap::from([
            (
                user_id,
                UserRecord {
                    id: user_id,
                    email: "student@example.com".to_string(),
                    password: "password123".to_string(),
                    first_name: "Alex".to_string(),
                    last_name: "Carter".to_string(),
                    patronymic: Some("Ivanovich".to_string()),
                },
            ),
            (
                second_user_id,
                UserRecord {
                    id: second_user_id,
                    email: "guest@example.com".to_string(),
                    password: "guestpass".to_string(),
                    first_name: "Taylor".to_string(),
                    last_name: "Guest".to_string(),
                    patronymic: None,
                },
            ),
        ]);

        let courses = HashMap::from([
            (
                rust_course_id,
                CourseRecord {
                    id: rust_course_id,
                    title: "Программирование на Rust".to_string(),
                    description: "Основы системного программирования и модель владения."
                        .to_string(),
                    teacher_name: "John Smith".to_string(),
                    students_count: 42,
                    enrolled_user_ids: vec![user_id],
                },
            ),
            (
                frontend_course_id,
                CourseRecord {
                    id: frontend_course_id,
                    title: "Архитектура фронтенда".to_string(),
                    description:
                        "Проектирование современных React-приложений с роутингом и паттернами компонентов."
                            .to_string(),
                    teacher_name: "Alice Johnson".to_string(),
                    students_count: 31,
                    enrolled_user_ids: vec![user_id],
                },
            ),
            (
                db_course_id,
                CourseRecord {
                    id: db_course_id,
                    title: "Базы данных: базовый курс".to_string(),
                    description:
                        "Реляционное моделирование, основы SQL и стратегии индексирования."
                            .to_string(),
                    teacher_name: "Michael Brown".to_string(),
                    students_count: 27,
                    enrolled_user_ids: vec![user_id],
                },
            ),
        ]);

        let assignments = HashMap::from([
            (
                rust_assignment_id,
                AssignmentRecord {
                    id: rust_assignment_id,
                    course_id: rust_course_id,
                    title: "Практика по владению".to_string(),
                    description:
                        "Реализуйте небольшое CLI-приложение, демонстрирующее правила заимствования."
                            .to_string(),
                    deadline: "2026-05-10".to_string(),
                },
            ),
            (
                router_assignment_id,
                AssignmentRecord {
                    id: router_assignment_id,
                    course_id: frontend_course_id,
                    title: "Лабораторная по роутингу React".to_string(),
                    description:
                        "Создайте вложенные маршруты с общим макетом и защитой переходов."
                            .to_string(),
                    deadline: "2026-05-14".to_string(),
                },
            ),
            (
                sql_assignment_id,
                AssignmentRecord {
                    id: sql_assignment_id,
                    course_id: db_course_id,
                    title: "Практикум по SQL".to_string(),
                    description:
                        "Напишите запросы с объединениями, агрегированием и фильтрацией по дате."
                            .to_string(),
                    deadline: "2026-05-18".to_string(),
                },
            ),
            (
                safety_assignment_id,
                AssignmentRecord {
                    id: safety_assignment_id,
                    course_id: rust_course_id,
                    title: "Заметки по безопасности памяти".to_string(),
                    description:
                        "Подготовьте краткий отчёт о безопасных абстракциях в Rust."
                            .to_string(),
                    deadline: "2026-05-04".to_string(),
                },
            ),
        ]);

        let submissions = HashMap::from([
            (
                first_submission_id,
                SubmissionRecord {
                    id: first_submission_id,
                    assignment_id: rust_assignment_id,
                    user_id,
                    notes: "Готовлю CLI-утилиту и уже описал правила владения в README."
                        .to_string(),
                    status: SubmissionStatus::InProgress,
                    updated_at: "2026-04-18T12:00:00Z".to_string(),
                },
            ),
            (
                second_submission_id,
                SubmissionRecord {
                    id: second_submission_id,
                    assignment_id: sql_assignment_id,
                    user_id,
                    notes: "Запросы готовы, осталось оформить пояснения к индексам."
                        .to_string(),
                    status: SubmissionStatus::Submitted,
                    updated_at: "2026-04-17T09:30:00Z".to_string(),
                },
            ),
            (
                third_submission_id,
                SubmissionRecord {
                    id: third_submission_id,
                    assignment_id: safety_assignment_id,
                    user_id,
                    notes: "Отчёт проверен преподавателем, замечаний нет."
                        .to_string(),
                    status: SubmissionStatus::Graded,
                    updated_at: "2026-04-15T15:45:00Z".to_string(),
                },
            ),
        ]);

        Self {
            users,
            sessions: HashMap::new(),
            courses,
            assignments,
            submissions,
        }
    }

    pub fn find_user_by_email(&self, email: &str) -> Option<&UserRecord> {
        let normalized = email.trim().to_lowercase();

        self.users
            .values()
            .find(|user| user.email.eq_ignore_ascii_case(&normalized))
    }

    pub fn user_courses(&self, user_id: Uuid) -> Vec<&CourseRecord> {
        let mut courses = self
            .courses
            .values()
            .filter(|course| course.enrolled_user_ids.contains(&user_id))
            .collect::<Vec<_>>();

        courses.sort_by(|left, right| left.title.cmp(&right.title));
        courses
    }

    pub fn assignments_for_course(&self, course_id: Uuid) -> Vec<&AssignmentRecord> {
        let mut assignments = self
            .assignments
            .values()
            .filter(|assignment| assignment.course_id == course_id)
            .collect::<Vec<_>>();

        assignments.sort_by(|left, right| left.deadline.cmp(&right.deadline));
        assignments
    }

    pub fn submissions_for_user(&self, user_id: Uuid) -> Vec<&SubmissionRecord> {
        let mut submissions = self
            .submissions
            .values()
            .filter(|submission| submission.user_id == user_id)
            .collect::<Vec<_>>();

        submissions.sort_by(|left, right| right.updated_at.cmp(&left.updated_at));
        submissions
    }

    pub fn submission_for_assignment(
        &self,
        user_id: Uuid,
        assignment_id: Uuid,
    ) -> Option<&SubmissionRecord> {
        self.submissions.values().find(|submission| {
            submission.user_id == user_id && submission.assignment_id == assignment_id
        })
    }
}
