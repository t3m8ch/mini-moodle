use serde::{Deserialize, Serialize};

use crate::domain::UserRecord;

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct RegisterReq {
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LoginReq {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthUser {
    pub id: String,
    pub email: String,
    pub full_name: String,
    pub avatar_fallback: String,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AuthRes {
    pub user: AuthUser,
}

impl From<&UserRecord> for AuthUser {
    fn from(value: &UserRecord) -> Self {
        Self {
            id: value.id.to_string(),
            email: value.email.clone(),
            full_name: value.full_name(),
            avatar_fallback: value.avatar_fallback(),
        }
    }
}
