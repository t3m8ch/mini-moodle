use axum::{
    Json, Router,
    routing::{get, post},
};
use axum_extra::extract::CookieJar;

use crate::dto::{
    auth::{LoginReq, RegisterReq, RegisterRes},
    envelope::ApiResult,
};

pub fn auth_router() -> Router {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/me", get(me))
}

async fn register(Json(req): Json<RegisterReq>) -> ApiResult<RegisterRes> {
    todo!()
}

async fn login(Json(req): Json<LoginReq>) -> ApiResult<()> {
    todo!()
}

async fn me(jar: CookieJar) -> ApiResult<()> {
    todo!()
}
