import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { ConfigProvider } from "antd";

import pt_BR from "antd/es/locale/pt_BR"

import { ROUTES } from "../../config/routes";
import DefaultTemplate from "../../templates/defaultTemplate";

class Main extends Component {
	componentDidMount() {
		if (this.props.isAuthenticated) {
			console.log(this.props.accessToken)
			// Get usar data
			// this.props.refreshUserData();
		}
	}

	render() {
		console.log(this.props.isAuthenticated)
		return (
			<ConfigProvider locale={pt_BR}>
				<BrowserRouter basename="/">
					<Switch>
						{ROUTES.map((route, i) => {
							return (
								<Route
									key={i}
									exact={route?.exact ?? true}
									path={route.path}
									render={(props) => {
										if (route.hasOwnProperty('logged')) {
											// Only logged
											if (route.logged && !this.props.isAuthenticated) {
												return <Redirect to="/entrar" />
											}
											// Only logged out
											else if (!route.logged && this.props.isAuthenticated) {
												return <Redirect to="/" />;
											}
										}

										return (
											<Fragment>
												{
													!route.logged ? (
														<route.component {...props} />
													) : (
														<DefaultTemplate>
															{/* <Fragment> */}
															<route.component {...props} />
															{/* </Fragment> */}
														</DefaultTemplate>
													)
												}
											</Fragment>

										);
									}}
								/>
							)
						})}
					</Switch>
				</BrowserRouter>
			</ConfigProvider>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAuthenticated: state.auth.isAuthenticated,
		accessToken: state.auth.accessToken,
	};
};


export default connect(mapStateToProps, null)(Main);
