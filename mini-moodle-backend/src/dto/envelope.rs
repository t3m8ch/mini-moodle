use axum::{
    Json,
    http::StatusCode,
    response::{IntoResponse, Response},
};
use serde::Serialize;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
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
pub enum ApiError {
    BadRequest(String),
    Unauthorized(String),
    Forbidden(String),
    NotFound(String),
    Conflict(String),
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
struct ErrorResponse<T> {
    status: &'static str,
    msg: String,
    details: Option<T>,
}

impl ApiError {
    pub fn status_code(&self) -> StatusCode {
        match self {
            Self::BadRequest(_) => StatusCode::BAD_REQUEST,
            Self::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            Self::Forbidden(_) => StatusCode::FORBIDDEN,
            Self::NotFound(_) => StatusCode::NOT_FOUND,
            Self::Conflict(_) => StatusCode::CONFLICT,
        }
    }

    pub fn message(&self) -> &str {
        match self {
            Self::BadRequest(message)
            | Self::Unauthorized(message)
            | Self::Forbidden(message)
            | Self::NotFound(message)
            | Self::Conflict(message) => message,
        }
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let status = self.status_code();
        let body = ErrorResponse::<()> {
            status: "ERROR",
            msg: self.message().to_string(),
            details: None,
        };

        (status, Json(body)).into_response()
    }
}
