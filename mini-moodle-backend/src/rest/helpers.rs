use axum_extra::extract::{
    CookieJar,
    cookie::{Cookie, SameSite},
};
use uuid::Uuid;

use crate::{
    constants::SESSION_COOKIE_NAME,
    domain::UserRecord,
    dto::envelope::ApiError,
    state::AppState,
};

pub fn build_session_cookie(session_id: String) -> Cookie<'static> {
    let mut cookie = Cookie::new(SESSION_COOKIE_NAME.to_string(), session_id);
    cookie.set_http_only(true);
    cookie.set_same_site(SameSite::Lax);
    cookie.set_path("/");
    cookie
}

pub fn build_logout_cookie() -> Cookie<'static> {
    let mut cookie = Cookie::new(SESSION_COOKIE_NAME.to_string(), String::new());
    cookie.set_http_only(true);
    cookie.set_same_site(SameSite::Lax);
    cookie.set_path("/");
    cookie
}

pub fn require_user_id(state: &AppState, jar: &CookieJar) -> Result<Uuid, ApiError> {
    let session_id = jar
        .get(SESSION_COOKIE_NAME)
        .map(|cookie| cookie.value().to_string())
        .ok_or_else(|| ApiError::Unauthorized("Требуется авторизация".to_string()))?;

    let store = state.store.read();
    store
        .sessions
        .get(&session_id)
        .copied()
        .ok_or_else(|| ApiError::Unauthorized("Сессия недействительна".to_string()))
}

pub fn require_user(state: &AppState, jar: &CookieJar) -> Result<UserRecord, ApiError> {
    let user_id = require_user_id(state, jar)?;
    let store = state.store.read();

    store
        .users
        .get(&user_id)
        .cloned()
        .ok_or_else(|| ApiError::Unauthorized("Пользователь не найден".to_string()))
}
