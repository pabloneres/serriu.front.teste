import React, { Component } from "react"
import { Popover } from "antd";

class UIPopover extends Component {
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

	onHide = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		return (
			<Popover onVisibleChange={() => this.setState(state => ({
				visible: !state.visible
			}))} visible={this.state.visible} {...this.props} />
		)
	}
}

export default UIPopover