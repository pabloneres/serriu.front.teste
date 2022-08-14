import React, { Component, Fragment } from 'react'
import { ContainerSide, EspecialidadeContainer, EspecialidadeContainerAll, Especialidades } from "~/components/created/pacientes/components/financeiro/components/modalPayment/components/total/styles";
import { convertMoney } from "~/modules/Util";
import Especialidade from "./components/especialidades";
import Laboratorio from "./components/laboratorio";
import { Button, Select, Spin } from "antd";
import Negociacao from "./components/negociacao";
import Resumo from "./components/resumoBoleto";

import propTypes from 'prop-types'

class RigthSide extends Component {
	static props = {
		data: propTypes.object,
	}

	static defaultProps = {
		data: [],
	}

	constructor(props) {
		super(props);

		this.state = {
			valorPagamento  : 0,
			formaPagamento  : "",
			totalDistribuido: 0,
			labValue        : 0,
			showResumo      : false,
			showNegociacao  : true,
			showDistribuir  : true
		}
	}

	send = () => {
	}

	returnLabValue = () => {
		const {laboratoriosSelecionados, metodoPagamento, data} = this.props

		if( metodoPagamento === "boleto" )
		{
			return laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0);
		}

		return data.lab; //TODO
	};

	_renderResumo = () => {
		const {
				  formaPagamento,
				  data,
				  paciente,
				  resumoCobranca,
				  boletoParams,
				  procedimentosSelecionados
			  } = this.props

		return (
			<Resumo
				handleSubmit={this._handleSubmit}
				paciente={paciente}
				resumoCobranca={resumoCobranca}
				data={data}
				boletoParams={boletoParams}
				valor={procedimentosSelecionados.reduce((a, b) => a + Number(b.desconto), 0)}
				back={() => {
				}}
				sendBoleto={(sendBoleto) => {
				}}
				loadingGerar={(loadingGerar => {
				})}
				formaPagamento={formaPagamento}
				setFormaPagamento={(setFormaPagamento) => {
				}}
			/>
		)
	}

	distribuirAtualizado = () => {
		const {totalDistribuido, labValue} = this.state
		const {valorDigitado}              = this.props
		return valorDigitado - totalDistribuido - labValue;
	};

	changeEspecialidadeValue = (value, index) => {
		const {
				  especialidadesSelecionado,
			  } = this.props

		let arr = especialidadesSelecionado;
		arr.splice(index, 1, {...arr[index], valorAplicado: value});

		this.setState({
			totalDistribuido: arr.reduce((a, b) => a + Number(b.valorAplicado), 0)
		})

		// setTotalDistribuido(arr.reduce((a, b) => a + Number(b.valorAplicado), 0));
		// setEspecialidadesSelecionado(arr);
	};

	_changeFormaPagamento = (e) => {
		this.props.changeFormaPagamento(e)
	}

	_handleSubmit = (props) => {
		const {labValue} = this.state
		this.props.submit({labValue, ...props})
	}

	_handleShowResumo = () => {
		const {
				  metodoPagamento,
			  } = this.props

		if( metodoPagamento === "boleto" )
		{
			this.setState({
				showResumo    : true,
				showNegociacao: false,
				showDistribuir: false
			})
		}

		this._handleSubmit()
	}

	render() {
		const {loadingButton, showResumo, showNegociacao, showDistribuir} = this.state
		const {
				  formaPagamento,
				  data,
				  paymentOptions,
				  paciente,
				  resumoCobranca,
				  metodoPagamento,
				  valorDigitado,
				  procedimentosSelecionados,
				  especialidadesSelecionado,
				  laboratoriosSelecionados
			  }                                                           = this.props

		return (
			<Fragment>
				{(paymentOptions && showDistribuir) && (
					<ContainerSide>
						<div className="pagamento-receber">

							<div
								className="infos-pagamento"
								style={{
									marginTop     : 20,
									display       : "flex",
									justifyContent: "space-between"
								}}
							>
								<div className="info">
									<h2>Total á pagar</h2>
									<span>{convertMoney(valorDigitado)}</span>
								</div>
								<div className="info">
									<h2>Á Distribuir</h2>
									<span
										style={{
											color: this.distribuirAtualizado() < 0 ? "red" : "green"
										}}
									>
									  {convertMoney(this.distribuirAtualizado())}
									</span>
								</div>
							</div>
						</div>

						<EspecialidadeContainerAll>
							<EspecialidadeContainer>
								{metodoPagamento === "boleto" ? (
									<Especialidade
										restante={valorDigitado - this.returnLabValue()}
										value={valorDigitado - this.returnLabValue()}
										disabled
										title="Disponivel para executar"
									/>
								) : (
									<Especialidades>
										{especialidadesSelecionado.map((item, index) => {
											return (
												<Especialidade
													key={index}
													onChange={value =>
														this.changeEspecialidadeValue(value, index)
													}
													title={item.name}
													restante={item.restante}
													max={this.distribuirAtualizado()}
												/>
											);
										})}
									</Especialidades>
								)}

								{laboratoriosSelecionados.length && (
									<Laboratorio
										disabled={metodoPagamento === "boleto"}
										value={this.returnLabValue()}
										retido={this.returnLabValue()}
										labValue={laboratoriosSelecionados.reduce(
											(a, b) => a + Number(b.restante),
											0
										)}
										restante={
											laboratoriosSelecionados.length > 0
												? laboratoriosSelecionados.reduce(
												(a, b) => a + Number(b.restante),
												0
											) - data.lab
												: 0
										}
										onChange={value => {
											this.setState({
												labValue: value
											})
										}}
									/>
								)}
							</EspecialidadeContainer>
						</EspecialidadeContainerAll>

						<div className="pagamento-pago-hidden">
							{this.distribuirAtualizado() === 0 || metodoPagamento === "boleto" ? (
								<>
									<div className="header-pagamento">
										<span>Selecione a forma de pagamento</span>
									</div>
									<Select
										style={{width: "100%", marginBottom: 10}}
										value={formaPagamento}
										options={[
											{
												label: "Dinheiro",
												value: "dinheiro"
											},
											{
												label: "Débito",
												value: "debito"
											},
											{
												label: "Crédito",
												value: "credito"
											},
											{
												label: "Pix",
												value: "pix"
											}
										]}
										onChange={e => {
											this._changeFormaPagamento(e)
										}}
									/>
									{loadingButton ? ( //TODO
										<div
											style={{
												width         : "100%",
												display       : "flex",
												justifyContent: "center"
											}}
										>
											<Spin />
										</div>
									) : (
										<Button
											onClick={this._handleShowResumo}
											type="primary"
											block
										>
											Receber
										</Button>
									)}
									<Button
										style={{marginTop: 5}}
										onClick={() => {
											// setpaymentOptions(undefined);
										}}
										type="default"
										block
									>
										Editar
									</Button>
								</>
							) : (
								<></>
							)}
						</div>
					</ContainerSide>
				)}

				{(showNegociacao && !paymentOptions) && (
					<Negociacao
						data={data.negociacoes}
						paciente={paciente}
						close={() => {
						}}
						sendBoleto={this.send}
					/>
				)
				}

				{showResumo && this._renderResumo()}
			</Fragment>
		)
	}
}

export default RigthSide