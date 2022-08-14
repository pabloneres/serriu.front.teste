import React, { Component, Fragment } from 'react'

import ShowProcedimentos from './showProcedimentos'
import PaymentOptions from './paymentOptions'
import RigthSide from './rigthSide'

import { index, show } from '~/services/controller'
import { Spin } from 'antd'
import InfoValues from "~/components/created/pacientes/components/orcamento2/infoValues";

class Collapse extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading                : true,
			data                     : {},
			procedimentosSelecionados: [],
			laboratoriosSelecionados : [],
			paymentOptions           : null,
		}
	}

	onOpen = (id) => {
		this.setState({
			isLoading: true
		})

		let orcamento

		show("orcamentos", id).then((response) => {
			orcamento = response.data

			const paciente = response.data

			this.setState({
				data     : {...orcamento, paciente},
				isLoading: false
			})
		})
		// .then((response) => {
		//     const paciente = response.data

		//     this.setState({
		//         data: {...orcamento, paciente},
		//         isLoading: false
		//     })
		// })
	}

	onClose = () => {
		this.setState({
			isLoading: true,
			data     : {},
		})
	}

	_changeSelected = (procedimentosSelecionados) => {
		this.setState({
			procedimentosSelecionados
		}, () => {
			this._handleChangeLabs()
		})
	}

	_handleChangeLabs = () => {
		const {procedimentosSelecionados} = this.state

		if( !procedimentosSelecionados.length )
		{
			return;
		}

		let labs = procedimentosSelecionados.filter(item => item.procedimento.lab);

		let arrLabs = labs.map(item => ({
			id   : item.procedimento.lab.id,
			name : item.procedimento.lab.name,
			valor: Number(item.procedimento.lab.valor)
		}));

		let valores = [];

		arrLabs.forEach(item => {
			if( !valores.some((el, i) => el.id === item.id) )
			{
				valores.push(item);
			}
			else
			{
				var index = valores.findIndex(current => item.id === current.id);

				valores[index].valor = valores[index].valor + item.valor;
			}
		});

		labs = valores.map(item => ({
			...item,
			restante: Number(item.valor)
		}));

		this.setState({
			laboratoriosSelecionados: labs
		})
	}

	_returnSelectedValue = () => {
		const {procedimentosSelecionados} = this.state
		return procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0)
	}

	_returnValorLaboratorio = () => {
		const {laboratoriosSelecionados} = this.state
		return laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0)
	}

	_onPressAdd = (data) => {
		this.setState({
			paymentOptions: data
		})
	}

	render() {
		const {data, isLoading, procedimentosSelecionados, paymentOptions} = this.state
		return (
			<div className='orcamento-collapse'>
				{
					isLoading ? (
						<Spin />
					) : (
						<Fragment>
							<div className="container-side">
								<ShowProcedimentos
									data={data.procedimentos}
									onChangeSelected={this._changeSelected}
								/>
								<div className="container-footer">
									<InfoValues />
									<PaymentOptions
										valorDigitado={this._returnSelectedValue()}
										valorLaboratorio={this._returnValorLaboratorio()}
										procedimentosSelecionados={procedimentosSelecionados}
										onPressAdd={this._onPressAdd}
									/>
								</div>
							</div>
							{/*<div className="container-side">*/}
							<RigthSide
								paymentOptions={paymentOptions}
								valorDigitado={this._returnSelectedValue()}
							/>
							{/*</div>*/}
						</Fragment>
					)
				}
			</div>
		)
	}
}

export default Collapse