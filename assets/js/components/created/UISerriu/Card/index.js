import React, { Component } from "react"

import { Card, Extra, Header, Title, ButtonContainer } from "./styles"

class UICard extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	render() {
		return (
			<Card>
				<Header>
					<Title>{this.props.title}</Title>
					<Extra>{this.props.extra}</Extra>
					<ButtonContainer>{this.props.button}</ButtonContainer>
				</Header>
				{this.props.children}
			</Card>
		)
	}
}

export default UICard