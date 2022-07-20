import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, Dropdown, Icon, Menu, Spin } from "antd";

import { authActions } from "./../redux/actions";

class UserDropdownNavigation extends Component {
	render() {
		const {first_name, avatar} = this.props.user;

		const menu = (
			<Menu>
				<Menu.Item key="0">
					<Link to="/account">Meus dados</Link>
				</Menu.Item>
				<Menu.Item key="1">
					<Link to="/account/password">Alterar senha</Link>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="2">
					<a onClick={() => this.props.doLogout()}>Logout</a>
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={menu} className="user-dropdown" placement="bottomRight">
				<div className="ant-dropdown-link">
					{avatar ? <Avatar size="large" src={avatar} /> : <Avatar size="large" icon="user" />}
					{first_name} <Icon type="down" />
					{this.props.isLoadingUserData && <Spin />}
				</div>
			</Dropdown>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		user             : state.auth.userData,
		isLoadingUserData: state.auth.isLoadingUserData,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		doLogout: () => dispatch(authActions.logout())
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDropdownNavigation);
