import React from "react";
import { connect } from "react-redux";
import { Redirect, Route} from "react-router-dom";

const RoutePrivate = ({component: Component, path, exact, isAuthenticated}) => {
	return (
		<Route
			path={path}
			exact={exact}
			render={(props) => (
				isAuthenticated ? <Component {...props} /> : <Redirect to="/entrar" />
			)}
		/>
	)
};

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: !!state.auth.user,
	};
};

export default connect(mapStateToProps)(RoutePrivate);
