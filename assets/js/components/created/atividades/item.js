import React, { Component } from "react"

import { IconContainer, Row } from './styles'

class Item extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<Row>
				<IconContainer>
					{this.props.icon}
				</IconContainer>
				{this.props.children}
			</Row>
		)
	}
}

export default Item