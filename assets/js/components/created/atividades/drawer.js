import React, { Component } from "react"
import { Drawer, Tabs } from 'antd'
import PropTypes from 'prop-types'
import { UILoading } from "~/components/created/UISerriu";

const {TabPane} = Tabs

class DrawerComponent extends Component {
	constructor(props) {
		super(props)

		this.state = {
			visible: false
		}
	}

	onShow = () => {
		this.setState({
			visible: true
		})
	}

	onClose = () => {
		this.setState({
			visible: false
		})
	}

	_renderTitle = () => {
		let title = null

		if( this.props.title !== false && this.props.title !== null )
		{
			if( React.isValidElement(this.props.title) )
			{
				title = this.props.title;
			}

			else if( typeof this.props.title === "function" )
			{
				title = this.props.title();
			}
			else if( typeof this.props.title === "string" )
			{
				title = this.props.title;
			}
		}

		return title
	}

	render() {
		return (
			<Drawer
				destroyOnClose
				width={this.props.width}
				closable={false}
				onClose={this.onClose}
				visible={this.state.visible}
				footer={this.props.footer}
				title={this._renderTitle()}
				headerStyle={this.props.headerStyle}
			>
				{this.props.children ? this.props.children : <UILoading />}
			</Drawer>
		)
	}
}

Drawer.propTypes = {
	width: PropTypes.number
}

export default DrawerComponent