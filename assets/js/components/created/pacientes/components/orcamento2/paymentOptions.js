import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Select, Input, Button, DatePicker, } from 'antd';

import { store, index, show } from "~/services/controller";

import {
	ContainerDashed,
	FormFixed,
	FormFixedLabel,
} from "./components/total/styles";
import local from "antd/es/date-picker/locale/pt_BR";

import InputCurrency from "~/utils/Currency";
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import moment from "moment"

class PaymentOptions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			valorEntrada: 0
		}
	}

	returnOptions = () => {
		const {clinic} = this.props

		if( clinic.config.workBoletos )
		{
			return [
				{
					label: "Total",
					value: "total",
				},
				{
					label: "Boleto",
					value: "boleto",
				},
			]
		}

		return [
			{
				label: "Total",
				value: "total",
			},
		]
	}

	returnValorSelecionado = () => {
		const {procedimentosSelecionados} = this.props
		return procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0);
	};

	returnPorcentagem = () => {
		const {clinic} = this.props
		return (this.returnValorSelecionado() * clinic.config.entMinima) / 100;
	};

	returnEntradaMinima = () => {
		const {laboratoriosSelecionados} = this.props
		return (
			this.returnPorcentagem() +
			laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0)
		);
	};

	isDisable = () => {
		const {laboratoriosSelecionados, boletoParams, valorDigitado} = this.props
		const {valorEntrada}                                          = this.state

		if( !valorDigitado || valorDigitado === 0 )
		{
			return true;
		}

		if(
			valorEntrada < this.returnEntradaMinima()
		)
		{
			return true;
		}

		if( !boletoParams.parcelas )
		{
			return true;
		}

		if( !boletoParams.vencimento )
		{
			return true;
		}
	};

	_changeMetodoPagamento = (e) => {
		this.props.changeMetodoPagamento(e)
	}

	_returnClienteVerificado = () => { //TODO
		// if(
		// 	paciente.cpf_verified === 0 ||
		// 	paciente.rg_verified === 0 ||
		// 	paciente.address_verified === 0
		// )
		// {
		// 	return true; // true = desabilitado
		// }

		return false;
	}; // náo verificado = true

	returnDescricao = () => {
		const {boletoParams, valorDigitado, paciente, dentista, clinic} = this.props

		return `Total: ${convertMoney(
			this.returnValorSelecionado()
		)}, sendo entrada de ${convertMoney(boletoParams.entrada)} + ${
			boletoParams.parcelas
		} parcelas de ${convertMoney(
			(this.returnValorSelecionado() - boletoParams.entrada) / boletoParams.parcelas
		)} Paciente: ${paciente.firstName + " " + paciente.lastName}, Dr(a). ${dentista.firstName
		+ " " +
		dentista.lastName}, Clinica: ${clinic.name}	`;

	};

	_setResumoCobranca = (data) => {
		this.props.setResumoCobranca(data)
	}

	_setBoletoParams = (data) => {
		this.props.setBoletoParams(data)
	}

	_changeValorDigitado = (e) => {
		this.props.changeValorDigitado(e)
	}

	_handleResetar = () => {
		this.props.handleResetar()
	}

	_returnEntradaMinima = () => {
		const {clinic, laboratoriosSelecionados} = this.props

		return (
			<>
				Entrada mínima de {clinic.config.entMinima}% ={" "}
				{convertMoney(this.returnPorcentagem())} + Lab ={" "}
				{convertMoney(
					laboratoriosSelecionados.reduce(
						(a, b) => a + Number(b.restante),
						0
					)
				)}{" "}
				{" | "}
				{convertMoney(this.returnEntradaMinima())}
			</>
		)
	}

	render() {
		const {
				  clinic,
				  valorLaboratorio,
				  procedimentosSelecionados,
				  laboratoriosSelecionados,
				  metodoPagamento,
				  valorDigitado
			  } = this.props

		const {valorEntrada} = this.state

		return (
			<div className="container-dashed">
				<Select
					style={{width: '100%'}}
					onChange={this._changeMetodoPagamento}
					disabled={this.props.disabled}
					value={metodoPagamento}
					placeholder="Condição de pagamento..."
					options={this.returnOptions()}
				/>

				{metodoPagamento === "total" && (
					<ContainerDashed centered width="100">
						<FormFixed border={0} block>
							<FormFixedLabel>Total a pagar</FormFixedLabel>
							<InputCurrency
								defaultValue={this.returnValorSelecionado()}
								onChange={e => {
									this._changeValorDigitado(e)
								}}
							/>
						</FormFixed>

						<FormFixed border={0} block>
							<FormFixedLabel>Contém laboratório</FormFixedLabel>
							<Input
								style={{width: "100%", marginBottom: 10}}
								disabled
								value={convertMoney(valorLaboratorio)}
							/>
						</FormFixed>

						<Button
							onClick={this.props.handleNegociar}
							disabled={!procedimentosSelecionados.length}
							type="primary"
							block
						>
							Negociar
						</Button>
						<Button
							className="mt-2"
							onClick={this._handleResetar}
							block
						>
							Resetar
						</Button>
					</ContainerDashed>
				)}

				{metodoPagamento === "boleto" ? (
					<ContainerDashed centered width="100">
						<FormFixed border={0} block>
							<FormFixedLabel>Total a pagar</FormFixedLabel>
							<InputCurrency disabled value={procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0)} />
						</FormFixed>
						<FormFixed border={0} block>
							<FormFixedLabel>Entrada</FormFixedLabel>
							<InputCurrency
								max={procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0)}
								onChange={(e) => {
									this._setBoletoParams({
										entrada: e
									})
									this.setState({valorEntrada: e})
								}}
							/>
							<span>{this._returnEntradaMinima()}</span>
						</FormFixed>

						<FormFixed border={0} block>
							<FormFixedLabel>Parcelas</FormFixedLabel>
							<Select
								disabled={!valorEntrada}
								style={{width: "100%"}}
								options={[
									...Array(clinic.config.maxParcelas).keys()
								].map(item => ({
									label:
										item +
										1 +
										"X" +
										convertMoney(
											(procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0) - valorEntrada) /
											(item + 1)
										),
									value: item + 1
								}))}
								onChange={e =>
									this._setBoletoParams({
										parcelas: e
									})
								}
							/>
						</FormFixed>

						<FormFixed border={0} block>
							<FormFixedLabel>Vencimento</FormFixedLabel>
							<DatePicker
								disabled={!valorDigitado}
								disabledDate={data => (data < moment() ? true : false)}
								locale={local}
								format="DD/MM/YYYY"
								style={{width: "100%"}}
								onChange={e => {
									this._setBoletoParams({
										vencimento: e
									})
								}}
							/>
						</FormFixed>

						<Button
							onClick={this.props.handleNegociar}
							disabled={this.isDisable()}
							type="primary"
							block
						>
							Mostrar resumo
						</Button>
					</ContainerDashed>
				) : (
					<></>
				)}
			</div>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		clinic: state.clinic.selectedClinic,
	};
};

export default connect(mapStateToProps, null)(PaymentOptions)