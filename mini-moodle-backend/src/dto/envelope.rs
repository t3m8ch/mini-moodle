use axum::{
    Json,
    response::{IntoResponse, Response},
};
use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
pub struct ApiOk<T> {
    status: &'static str,
    payload: Option<T>,
}

impl<T> ApiOk<T> {
    pub fn new(payload: T) -> Self {
        Self {
            status: "OK",
            payload: Some(payload),
        }
    }

    pub fn empty() -> Self {
        Self {
            status: "OK",
            payload: None,
        }
    }
}

#[derive(Clone, Debug)]
pub enum ApiError {}

pub type ApiResult<T> = Result<Json<ApiOk<T>>, ApiError>;

pub fn api_ok<T>(payload: T) -> ApiResult<T> {
    Ok(Json(ApiOk::new(payload)))
}

pub fn api_ok_empty() -> ApiResult<()> {
    Ok(Json(ApiOk::empty()))
}

#[derive(Serialize, Clone, Debug)]
struct ErrorResponse<T> {
    status: &'static str,
    msg: String,
    details: Option<T>,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        todo!()
    }
}
