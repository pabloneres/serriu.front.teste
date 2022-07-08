import React, { Component } from "react"

import { Container } from './styles'

import { Dropdown } from 'antd'

class UIDropdown extends Component {
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

	handleVisibleChange = (action) => {
		this.setState({
			visible: action
		})
	}

	render() {
		return (
			<Dropdown
				visible={this.state.visible}
				trigger="click"
				onVisibleChange={this.handleVisibleChange}
				overlay={<Container>{this.props.overlay}</Container>}
			>
				{this.props.children}
			</Dropdown>
		)
	}
}

export default UIDropdown