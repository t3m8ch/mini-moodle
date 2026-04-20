use axum::{
    Json, Router,
    extract::State,
    routing::{delete, get, post},
};
use axum_extra::extract::CookieJar;
use uuid::Uuid;

use crate::{
    domain::UserRecord,
    dto::{
        auth::{AuthRes, AuthUser, LoginReq, RegisterReq},
        envelope::{ApiError, ApiOk},
    },
    rest::helpers::{build_logout_cookie, build_session_cookie, require_user},
    state::AppState,
};

pub fn auth_router() -> Router<AppState> {
    Router::new()
        .route("/register", post(register))
        .route("/login", post(login))
        .route("/me", get(me))
        .route("/session", delete(logout))
}

async fn register(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(req): Json<RegisterReq>,
) -> Result<(CookieJar, Json<ApiOk<AuthRes>>), ApiError> {
    let email = req.email.trim().to_lowercase();
    let password = req.password.trim().to_string();
    let first_name = req.first_name.trim().to_string();
    let last_name = req.last_name.trim().to_string();
    let patronymic = req
        .patronymic
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned);

    if email.is_empty() || password.is_empty() || first_name.is_empty() || last_name.is_empty() {
        return Err(ApiError::BadRequest(
            "Заполните email, пароль, имя и фамилию".to_string(),
        ));
    }

    let user = UserRecord {
        id: Uuid::new_v4(),
        email: email.clone(),
        password,
        first_name,
        last_name,
        patronymic,
    };
    let session_id = Uuid::new_v4().to_string();

    {
        let mut store = state.store.write();
        if store.find_user_by_email(&email).is_some() {
            return Err(ApiError::Conflict(
                "Пользователь с таким email уже существует".to_string(),
            ));
        }

        store.users.insert(user.id, user.clone());
        store.sessions.insert(session_id.clone(), user.id);
    }

    let jar = jar.add(build_session_cookie(session_id));

    Ok((
        jar,
        Json(ApiOk::new(AuthRes {
            user: AuthUser::from(&user),
        })),
    ))
}

async fn login(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(req): Json<LoginReq>,
) -> Result<(CookieJar, Json<ApiOk<AuthRes>>), ApiError> {
    let email = req.email.trim().to_lowercase();
    let password = req.password.trim();

    if email.is_empty() || password.is_empty() {
        return Err(ApiError::BadRequest(
            "Введите email и пароль".to_string(),
        ));
    }

    let user = {
        let store = state.store.read();
        let user = store
            .find_user_by_email(&email)
            .cloned()
            .ok_or_else(|| ApiError::Unauthorized("Неверный email или пароль".to_string()))?;

        if user.password != password {
            return Err(ApiError::Unauthorized(
                "Неверный email или пароль".to_string(),
            ));
        }

        user
    };

    let session_id = Uuid::new_v4().to_string();
    {
        let mut store = state.store.write();
        store.sessions.insert(session_id.clone(), user.id);
    }

    let jar = jar.add(build_session_cookie(session_id));

    Ok((
        jar,
        Json(ApiOk::new(AuthRes {
            user: AuthUser::from(&user),
        })),
    ))
}

async fn me(State(state): State<AppState>, jar: CookieJar) -> Result<Json<ApiOk<AuthRes>>, ApiError> {
    let user = require_user(&state, &jar)?;

    Ok(Json(ApiOk::new(AuthRes {
        user: AuthUser::from(&user),
    })))
}

async fn logout(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<(CookieJar, Json<ApiOk<()>>), ApiError> {
    if let Some(cookie) = jar.get(crate::constants::SESSION_COOKIE_NAME) {
        let session_id = cookie.value().to_string();
        let mut store = state.store.write();
        store.sessions.remove(&session_id);
    }

    let jar = jar.remove(build_logout_cookie());

    Ok((jar, Json(ApiOk::empty())))
}
