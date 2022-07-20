import { combineReducers } from "redux";

import clinic from "./clinic/Clinic.reducer";
import auth from "./auth/Auth.reducer";
import user from "./user/reducer";
import agenda from "./agenda/reducer";
import settings from "./settings/reducer";
import notifications from "./notifications/reducer";

export default 	combineReducers({
		auth,
		clinic,
		user,
		agenda,
		settings,
		notifications
	});
