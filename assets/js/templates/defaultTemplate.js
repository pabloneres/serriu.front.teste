import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { connect } from "react-redux";
import { BackTop, Drawer, Layout, Icon } from "antd";
// import QueueAnim from "rc-queue-anim";
// import enquire from "enquire.js";


import { AsideMenu } from "../_metronic/layout/components/aside/Aside";
import { Aside } from "~/_metronic/layout/components/aside/Aside";
const { Content, Footer, Header, Sider } = Layout;

class DefaultTemplate extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	static defaultProps = {
		className: "",
	};

	constructor(props) {
		super(props);

		this.state = {
			siderBarDrawer: false,
		};
	}

	componentDidMount() {
		// Listen Media Querie sideBar
		// enquire.register(SIDEBAR_DRAWER_MEDIA_QUERIE, {
		// 	match  : () => {
		// 		this.setState({
		// 			siderBarDrawer: true,
		// 		})
		// 	},
		// 	unmatch: () => {
		// 		this.setState({
		// 			siderBarDrawer: false,
		// 		})
		// 	}
		// });
	};

	componentWillUnmount() {
		// Unlisten Media Querie sideBar
		// enquire.unregister(SIDEBAR_DRAWER_MEDIA_QUERIE);
	};

	toggle = () => {
		this.props.siderToggle(!this.props.siderCollapsed);
	};

	hideSubMenu = () => {
		document.querySelector(".sub-menu-container").classList.remove("active-submenu")
	}


	render() {
		const { siderBarDrawer } = this.state;
		const { className, siderCollapsed } = this.props;

		const siderWidth = siderBarDrawer ? 0 : (siderCollapsed ? 80 : 256);

		return (
			<Layout style={{ display: "flex", flexDirection: "row", maxHeight: "100vh" }}>
				{/* <Sider
					theme="dark"
					trigger={null}
					collapsible={true}
					collapsed={siderCollapsed}
					breakpoint="lg"
					collapsedWidth={80}
					width={256}
					className="site-menu">
					<div className="logo">
						<img src="images/logos/logo.svg" alt="" />
					</div>
					<MainNavigation />
				</Sider> */}
				<Aside />
				<Layout>
					<Content onClick={this.hideSubMenu} className="site-content" style={{ backgroundColor: "#fff", height: '100vh', marginLeft: 70, padding: 15 }}>
						{this.props.children}
					</Content>
				</Layout>
			</Layout>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		siderCollapsed: false,
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// siderToggle: (collapsed) => {
		// 	dispatch(generalActions.siderToggle(collapsed));
		// }
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(DefaultTemplate);
