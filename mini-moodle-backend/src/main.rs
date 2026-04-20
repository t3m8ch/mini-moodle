mod config;
mod constants;
mod domain;
mod dto;
mod rest;
mod state;

use std::sync::Arc;

use axum::Router;
use tower_http::trace::TraceLayer;
use tracing::level_filters::LevelFilter;
use tracing_subscriber::EnvFilter;

use crate::{config::Config, domain::AppStore, state::AppState};

#[tokio::main]
#[tracing::instrument]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt()
        .with_env_filter(
            EnvFilter::builder()
                .with_default_directive(LevelFilter::INFO.into())
                .from_env_lossy(),
        )
        .init();

    dotenvy::dotenv().ok();
    let config: Config = envy::from_env()?;

    let state = AppState {
        store: Arc::new(parking_lot::RwLock::new(AppStore::seed())),
    };

    let app = Router::new()
        .nest(
            "/api",
            Router::new()
                .nest("/auth", rest::auth_router())
                .nest("/profile", rest::profile_router())
                .merge(rest::learning_router()),
        )
        .nest("/hello", rest::hello_router())
        .with_state(state)
        .layer(TraceLayer::new_for_http());

    let addr = format!("{}:{}", config.host, config.port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("Listening on {}", &addr);
    axum::serve(listener, app).await?;

    Ok(())
}
