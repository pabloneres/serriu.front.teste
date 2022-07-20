import React, { Component } from "react";
import * as PropTypes from "prop-types";
import { Layout } from "antd";
import QueueAnim from "rc-queue-anim";

const {Content, Footer} = Layout;

class loginTemplate extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	static defaultProps = {
		className: "",
	};

	render() {
		const {className} = this.props;

		return (
			<Layout className={`template-login ${className}`}>
				<Content className="site-content">
					<div className="site-content-logo">
						<img src="images/logos/logo.svg" alt="" />
					</div>
					<QueueAnim type="right" className="site-content-inner">
						{this.props.children}
					</QueueAnim>
				</Content>
				<Footer className="site-footer">
					<a target="_blank" href="http://www.clickweb.com.br/?utm_source=admin_agroapp&utm_medium=link+copyright&utm_content=link+copyright&utm_campaign=link+copyright">
						<img src="images/developer.svg" alt="" />
					</a>
				</Footer>
			</Layout>
		)
	}
}

export default loginTemplate;
