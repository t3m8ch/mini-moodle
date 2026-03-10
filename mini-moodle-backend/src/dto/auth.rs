use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Deserialize, Clone, Debug)]
pub struct RegisterReq {
    pub email: String,
    pub password: String,
    pub first_name: String,
    pub last_name: String,
    pub patronymic: Option<String>,
}

#[derive(Deserialize, Clone, Debug)]
pub struct LoginReq {
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Clone, Debug)]
pub struct RegisterRes {
    pub id: Uuid,
}
