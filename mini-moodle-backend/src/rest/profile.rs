use axum::{Json, Router, extract::State, routing::get};
use axum_extra::extract::CookieJar;

use crate::{
    dto::{
        envelope::{ApiError, ApiOk},
        learning::{ProfileDto, UpdateProfileReq},
    },
    rest::helpers::require_user_id,
    state::AppState,
};

pub fn profile_router() -> Router<AppState> {
    Router::new().route("/", get(get_profile).put(update_profile))
}

async fn get_profile(
    State(state): State<AppState>,
    jar: CookieJar,
) -> Result<Json<ApiOk<ProfileDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let store = state.store.read();
    let user = store
        .users
        .get(&user_id)
        .ok_or_else(|| ApiError::NotFound("Профиль не найден".to_string()))?;

    Ok(Json(ApiOk::new(ProfileDto::from(user))))
}

async fn update_profile(
    State(state): State<AppState>,
    jar: CookieJar,
    Json(req): Json<UpdateProfileReq>,
) -> Result<Json<ApiOk<ProfileDto>>, ApiError> {
    let user_id = require_user_id(&state, &jar)?;
    let email = req.email.trim().to_lowercase();
    let first_name = req.first_name.trim().to_string();
    let last_name = req.last_name.trim().to_string();
    let patronymic = req
        .patronymic
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToOwned::to_owned);

    if email.is_empty() || first_name.is_empty() || last_name.is_empty() {
        return Err(ApiError::BadRequest(
            "Заполните email, имя и фамилию".to_string(),
        ));
    }

    let updated_user = {
        let mut store = state.store.write();

        if store
            .users
            .values()
            .any(|user| user.id != user_id && user.email.eq_ignore_ascii_case(&email))
        {
            return Err(ApiError::Conflict(
                "Этот email уже используется другим пользователем".to_string(),
            ));
        }

        let user = store
            .users
            .get_mut(&user_id)
            .ok_or_else(|| ApiError::NotFound("Профиль не найден".to_string()))?;

        user.email = email;
        user.first_name = first_name;
        user.last_name = last_name;
        user.patronymic = patronymic;
        user.clone()
    };

    Ok(Json(ApiOk::new(ProfileDto::from(&updated_user))))
}
