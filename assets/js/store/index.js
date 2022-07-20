import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import clinic from "./modules/clinic/Clinic.reducer";
import auth from "./modules/auth/Auth.reducer";
import user from "./modules/user/reducer";
import agenda from "./modules/agenda/reducer";
import settings from "./modules/settings/reducer";
import notifications from "./modules/notifications/reducer";

const rootReducer = combineReducers({
	auth,
	clinic,
	user,
	agenda,
	settings,
	notifications
});

const persistConfig = {
	key      : "root",
	storage  : storage,
	whitelist: ["auth", "clinic", "user", "router", "settings", "notifications"]
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

// if( IS_DEBUG )
// {
// 	middleware.push(logger);
// }

export const store     = createStore(persistedReducer, applyMiddleware(...middleware));
export const persistor = persistStore(store);