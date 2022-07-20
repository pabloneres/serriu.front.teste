import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { InfoPatientContainer } from '../styles.js'

class InfoPatient extends Component {
	static propTypes = {
		imageUrl: PropTypes.string
	}

	constructor(props) {
		super(props);

		this.state = {}
	}

	render() {
		const { imageUrl } = this.props

		return (
			<InfoPatientContainer>
				<img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80" />
				<div className="infos_container">
					<div className="info">
						<h3>Nome:</h3>
						<span>Pablo Neres</span>
					</div>
					<div className="info">
						<h3>CPF:</h3>
						<span>Pablo Neres</span>
					</div>
					<div className="info">
						<h3>Data nascimento:</h3>
						<span>Pablo Neres</span>
					</div>
				</div>

			</InfoPatientContainer>
		)
	}
}

export default InfoPatient