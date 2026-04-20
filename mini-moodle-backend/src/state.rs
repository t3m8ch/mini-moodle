use std::sync::Arc;

use parking_lot::RwLock;

use crate::domain::AppStore;

#[derive(Clone, Debug)]
pub struct AppState {
    pub store: Arc<RwLock<AppStore>>,
}
