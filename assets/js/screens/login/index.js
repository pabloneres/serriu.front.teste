import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { NavLink, Link } from "react-router-dom";
import { authActions } from "~/redux/actions";
import { connect } from "react-redux";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isSending: false,
		}
	}

	onSubmit = (values) => {
		this.setState({
			isSending: true
		})

		this.props.doLogin(values);
	};

	render() {
		return (
			<div className="page-login">
				<div className="site-content">

					<div className="logo-container">
						<img src="images/logos/serriu_logo.png" />
					</div>

					<Form layout="vertical" onFinish={this.onSubmit}>
						<Form.Item
							label="Usuário"
							name="username"
							rules={[{required: true, message: 'Informe seu usuário!'}]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="Senha"
							name="password"
							rules={[{required: true, message: 'Informe sua senha!'}]}
						>
							<Input.Password />
						</Form.Item>

						<div className="recovery-password">
							<Link to="/recuperar-senha">Recuperar senha</Link>
						</div>

						<Button block htmlType="submit" type="primary" loading={this.state.isSending}>Entrar</Button>
					</Form>
				</div>
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isLoggingIn: state.auth.isLoggingIn,
		loginError : state.auth.loginError,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		doLogin: ({username, password}) => {
			dispatch(authActions.login({username, password}));
		}
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)