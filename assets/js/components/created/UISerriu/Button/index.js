import React, { Component } from "react"
import { ContainetButton } from './styles'

class UIButton extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<ContainetButton {...this.props} />
		)
	}
}

export default UIButton