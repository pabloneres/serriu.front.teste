import React, { Component } from 'react'
import { convertMoney } from "~/modules/Util";

import propTypes from 'prop-types'

class InfoValues extends Component {
	static props = {
		total        : propTypes.number,
		totalDesconto: propTypes.number,
		totalPago    : propTypes.number,
	}

	static defaultProps = {
		total        : 0,
		totalDesconto: 0,
		totalPago    : 0,
	}

	render() {
		const {total, totalDesconto, totalPago} = this.props

		return (
			<div className="container-dashed">
				<div className="form-item">
					<span className="label-value">Total</span>
					<span className="value">{convertMoney(total)}</span>
				</div>

				<div className="form-item">
					<span className="label-value">Total com desconto</span>
					<span className="value">{convertMoney(totalDesconto)}</span>
				</div>

				<div className="form-item">
					<span className="label-value">Total pago</span>
					<span className="value">{convertMoney(totalPago)}</span>
				</div>

				<div className="form-item">
					<span className="label-value">Saldo a pagar</span>
					<span className="value">
						{convertMoney(totalDesconto - totalPago)}
					</span>
				</div>
			</div>
		)
	}
}

export default InfoValues