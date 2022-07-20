import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Alert, Button, Form, Icon, Input } from "antd";

import { FORM_VALIDATION_MESSAGES } from "~/config/lang";

import { authActions } from "~/redux/actions";
const FormItem = Form.Item;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferrer: false,
        };
    }

    fieldOptions = {
        email: {
            label: "E-mail",
            decorator: {
                rules: [
                    { required: true, message: "Campo obrigatório." },
                    { type: "email", message: "Informe um e-mail válido." },
                ],
            },
        },
        password: {
            label: "Senha",
            decorator: {
                rules: [
                    { required: true, message: "Campo obrigatório." },
                ],
            },
        },
    };

    onSubmit = (values) => {
        console.log(values)
        this.props.doLogin(values);
    };

    render() {
        return (
            // <LoginTemplate className="page-login">
            <div className="page-content" key="1">
                <Form layout="vertical" onFinish={this.onSubmit}>
                    <Form.Item name="username">
                        <Input placeholder={this.fieldOptions.email.label} />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input type="password" placeholder={this.fieldOptions.password.label} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" size="large" block loading={this.props.isLoggingIn}>Entrar</Button>
                </Form>
                <div className="text-center">
                    <br /><br />
                    <Link to="/recovery-password">Esqueci minha senha</Link>
                </div>
            </div>
            // </LoginTemplate>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isLoggingIn: state.auth.isLoggingIn,
        loginError: state.auth.loginError,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doLogin: ({ username, password }) => {
            dispatch(authActions.login({ username, password }));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Login)
