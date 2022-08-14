import React, { Component, Fragment } from 'react'

import { Button, Drawer, Select, Spin, Input } from 'antd'
import { show, store, update } from "~/services/controller";
import ShowProcedimentos from "./showProcedimentos";
import InfoValues from "./infoValues";
import PaymentOptions from "./paymentOptions";
import RigthSide from "./rigthSide";
import Negociacao from './components/negociacao'
import Negociacoes from './negociacoes'
import Resumo from './components/resumoBoleto'
import { convertMoney } from "~/modules/Util";
import { EspecialidadeContainer, EspecialidadeContainerAll, Especialidades } from "~/components/created/pacientes/components/financeiro/components/modalPayment/components/total/styles";
import Especialidade from "./components/especialidades";
import Laboratorio from "./components/laboratorio";
import { connect } from "react-redux";
import { DollarCircleOutlined } from "@ant-design/icons";
import { BackComponent } from "~/modules/global";
import { ContainerWrapper, InfoRow, ResumoContainer } from "~/components/created/pacientes/components/orcamento2/components/resumoBoleto/styles";
import moment from "moment";

class DrawerShow extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading                : true,
			isSending                : false,
			visible                  : false,
			data                     : {},
			valorSelecionado         : null,
			procedimentosSelecionados: [],
			laboratoriosSelecionados : [],
			especialidadesSelecionado: [],
			metodoPagamento          : "total",
			paymentOptions           : null,
			boletoParams             : {},
			resumoCobranca           : {},

			paciente: {},
			dentista: {},

			valorDigitado : 0,
			formaPagamento: null,

			valorPagamento  : 0,
			totalDistribuido: 0,
			labValue        : 0,

			negociacaoProps: null,

			showDistribuicao: false,
			showNegociacao  : false,
			showNegociacoes : true,
			showResumo      : false,

			showButtonNegociacao: true
		}
	}

	onOpen = (id) => {
		this.setState({
			visible: true
		})

		this.setState({
			isLoading: true,
		})

		let orcamento
		let paciente

		show("orcamentos", id)
		.then((response) => {
			orcamento = response.data

			return show("patient", orcamento.paciente_id)
		})
		.then((response) => {
			paciente = response.data

			return show("users", orcamento.avaliador)
		}).then((response) => {
			this.setState({
				data     : orcamento,
				paciente : paciente,
				dentista : response.data,
				isLoading: false
			})
		})
	}

	onClose = () => {
		this.setState({
			isLoading                : true,
			isSending                : false,
			data                     : {},
			valorSelecionado         : null,
			procedimentosSelecionados: [],
			laboratoriosSelecionados : [],
			especialidadesSelecionado: [],
			metodoPagamento          : "total",
			paymentOptions           : null,
			boletoParams             : {},
			resumoCobranca           : {},

			paciente: {},
			dentista: {},

			valorDigitado : 0,
			formaPagamento: null,

			valorPagamento  : 0,
			totalDistribuido: 0,
			labValue        : 0,

			showDistribuicao: false,
			showNegociacao  : false,
			showNegociacoes : true,
			showResumo      : false,

			showButtonNegociacao: false
		})
	}

	onCloseDrawer = () => {
		this.setState({
			visible: false,
		}, () => {
			this.setState({
				isLoading: false,
				isSending: false,

				data                     : {},
				valorSelecionado         : null,
				procedimentosSelecionados: [],
				laboratoriosSelecionados : [],
				especialidadesSelecionado: [],
				metodoPagamento          : "total",
				paymentOptions           : null,
				boletoParams             : {},
				resumoCobranca           : {},

				paciente: {},
				dentista: {},

				valorDigitado : 0,
				formaPagamento: null,

				valorPagamento  : 0,
				totalDistribuido: 0,
				labValue        : 0,

				showDistribuicao: false,
				showNegociacao  : false,
				showNegociacoes : true,
				showResumo      : false
			})
		})
	}

	_changeSelected = (procedimentosSelecionados) => {
		this.setState({
			procedimentosSelecionados,
			showNegociacao: true
		}, () => {
			this._handleChangeLabs()
			this._handleChangeEspecialidades()
			this.setState({
				valorDigitado: this._returnSelectedValue()
			})
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

	_handleChangeEspecialidades = () => {
		const {procedimentosSelecionados} = this.state
		let arrEspecialidades             = procedimentosSelecionados.map(item => {
			if( item.procedimento.lab )
			{
				return {
					id           : item.procedimento.especialidade.id,
					name         : item.procedimento.especialidade.name,
					valor        : Number(item.desconto - item.procedimento.lab.valor),
					restante     : Number(item.desconto - item.procedimento.lab.valor),
					valorAplicado: 0
				};
			}
			return {
				id           : item.procedimento.especialidade.id,
				name         : item.procedimento.especialidade.name,
				valor        : Number(item.desconto),
				restante     : Number(item.desconto),
				valorAplicado: 0
			};
		});

		let valores = [];

		arrEspecialidades.forEach(item => {
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

		const especi = valores.map(item => ({
			...item,
			restante: Number(item.valor)
		}));

		this.setState({
			especialidadesSelecionado: especi,
		})

		// if( metodoPagamento !== "boleto" ) //TODO
		// {
		// 	setValorDigitado(selecionado.reduce((a, b) => a + Number(b.desconto), 0));
		// }
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

	_changeMetodoPagamento = (e) => {
		this.setState({
			metodoPagamento: e
		})
	}

	_changeValorDigitado = (e) => {
		this.setState({
			valorDigitado: e
		})
	}

	_returnClienteVerificado = () => {
		const {paciente} = this.state

		return (paciente.cpf_verified === 0 ||
			paciente.rg_verified === 0 ||
			paciente.address_verified === 0);

	};

	_handleResetar = () => {
		this._changeSelected([])

		this.setState({
			showDistribuicao: false,
			showNegociacao  : false,
			showNegociacoes : true,
			showResumo      : false,
			boletoParams    : {},
			resumoCobranca  : {},
		})
	}

	returnDescricao = () => {
		const {boletoParams, valorDigitado, paciente, dentista} = this.state
		const {clinic}                                          = this.props

		console.log(boletoParams)

		return `Total: ${convertMoney(boletoParams.valorCobranca)}, sendo entrada de ${convertMoney(boletoParams.entrada)} + ${
			boletoParams.parcelas
		} parcelas de ${convertMoney(
			(boletoParams.valorCobranca - boletoParams.entrada) / boletoParams.parcelas
		)} Paciente: ${paciente.firstName + " " + paciente.lastName}, Dr(a). ${dentista.firstName
		+ " " +
		dentista.lastName}, Clinica: ${clinic.name}	`;

	};

	_handleNegociar = () => {
		const {metodoPagamento} = this.state

		if( metodoPagamento === "boleto" )
		{
			this.setState({
				showResumo    : true,
				showNegociacao: false
			})

			this._setResumoCobranca({
				tipoCobranca: "Total",
				valor       : this._returnSelectedValue(),
				descricao   : this.returnDescricao(),
			})
		}
		else
		{
			this.setState({
				showDistribuicao: true
			})
		}

	}

	_renderFooter = () => {
		const {procedimentosSelecionados, laboratoriosSelecionados, metodoPagamento, paciente, dentista, resumoCobranca, boletoParams, valorDigitado} = this.state
		return (
			<PaymentOptions
				valorDigitado={valorDigitado}
				changeValorDigitado={this._changeValorDigitado}

				valorLaboratorio={this._returnValorLaboratorio()}
				procedimentosSelecionados={procedimentosSelecionados}
				laboratoriosSelecionados={laboratoriosSelecionados}
				onPressAdd={this._onPressAdd}

				handleResetar={this._handleResetar}

				changeMetodoPagamento={this._changeMetodoPagamento}
				metodoPagamento={metodoPagamento}
				setResumoCobranca={this._setResumoCobranca}
				setBoletoParams={this._setBoletoParams}
				resumoCobranca={resumoCobranca}
				boletoParams={boletoParams}
				dentista={dentista}

				paciente={paciente}

				handleNegociar={this._handleNegociar}

			/>
		)
	}

	returnLabValue = () => {
		const {laboratoriosSelecionados, metodoPagamento, data} = this.state

		if( metodoPagamento === "boleto" )
		{
			return laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0);
		}

		return data.lab; //TODO
	};

	_setResumoCobranca = (data) => {
		this.setState(state => ({
			resumoCobranca: {
				...state.resumoCobranca,
				...data,
				valorCobranca: this._returnSelectedValue()
			}
		}))
	}

	_setBoletoParams = (data) => {
		this.setState(state => ({
			boletoParams: {
				...state.boletoParams,
				...data
			}
		}))
	}

	_changeFormaPagamento = (e) => {
		this.setState({
			formaPagamento: e
		})
	}

	handleSubmit = () => {
		const {
				  valorDigitado,
				  procedimentosSelecionados,
				  formaPagamento,
				  especialidadesSelecionado,
				  laboratoriosSelecionados,
				  boletoParams,
				  metodoPagamento,
				  data,
				  labValue,
				  negociacaoProps
			  } = this.state

		this.setState({
			isSending: true
		})

		if( negociacaoProps )
		{

			const {item, addEntrada} = negociacaoProps

			const dataSend = {
				negociacao_id : item.id,
				valorDigitado,
				especialidades: especialidadesSelecionado,
				metodoPagamento,
				lab           : labValue,
				addEntrada
			};

			update("faturamento", item.id, dataSend).then(() => {
				const id = data.id

				this.onClose()

				this.onOpen(id)
			})

			return
		}

		const dataSend = {
			valorDigitado,
			orcamento_id    : data.id,
			valorSelecionado: this._returnSelectedValue(),
			metodoPagamento : formaPagamento,
			procedimentos   : procedimentosSelecionados.map(item => item.id),
			especialidades  : especialidadesSelecionado,
			lab             : {valorAplicado: labValue, total: laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0)},
		};

		if( metodoPagamento === "boleto" )
		{
			dataSend.valorDigitado = boletoParams.entrada
			dataSend.boleto        = {...boletoParams, gerar: this._returnClienteVerificado()}
			dataSend.lab           = {
				valorAplicado: laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0),
				total        : laboratoriosSelecionados.reduce((a, b) => a + Number(b.restante), 0)
			}
		}

		store("/negociacao", dataSend)
		.then(_ => {
			const id = data.id

			this.onClose()

			this.onOpen(id)
		})
		.catch(e => {
			// setLoadingButton(false);
		});
	}

	_renderNegociacoes = () => {
		const {data, paciente} = this.state

		return (
			<Negociacoes
				data={data}
				handleAddSaldo={this._handleAddSaldo}
				showResumo={this._showResumo}
			/>
		)
	}

	_handleAddSaldo = ({item, saldo, addEntrada}) => {
		console.log("ITEM", item)

		let especialidades = item.especialidades.map((innerItem) => ({
			...innerItem,
			name: innerItem.especialidadeExecucao?.especialidade?.name
		}))

		this.setState({
			negociacaoProps          : {
				addEntrada,
				item: item
			},
			valorDigitado            : saldo,
			showDistribuicao         : true,
			especialidadesSelecionado: especialidades
		})
	}

	_renderResumo = () => {
		const {
				  formaPagamento,
				  data,
				  paciente,
				  resumoCobranca,
				  boletoParams,
				  procedimentosSelecionados
			  } = this.state

		return (
			<ContainerWrapper style={{width: "100%"}}>
				<ResumoContainer>
					{resumoCobranca && (
						<Fragment>
							<div className="header-panel-resumo">
								<span>Resumo</span>
							</div>

							<InfoRow>
								<span>Tipo da cobrança</span>
								<span>{resumoCobranca.tipoCobranca}</span>
							</InfoRow>

							<InfoRow>
								<span>Valor da cobrança</span>
								<span>{convertMoney(boletoParams.valorCobranca)}</span>
							</InfoRow>

							<InfoRow>
								<span>Entrada</span>
								<span>{convertMoney(boletoParams.entrada)}</span>
							</InfoRow>

							{boletoParams.parcelas && (
								<InfoRow>
									<span>Parcelas</span>
									<span>{boletoParams.parcelas} parcelas de{" "}{convertMoney((boletoParams.valorCobranca - boletoParams.entrada) / boletoParams.parcelas)}{" "}({convertMoney(boletoParams.valorCobranca - boletoParams.entrada)}) </span>
								</InfoRow>
							)}

							<InfoRow>
								<span>Nome do cliente</span>
								<span>{paciente.firstName} {paciente.lastName}</span>
							</InfoRow>

							<InfoRow>
								<span>E-mail do cliente</span>
								<span>{paciente.email}</span>
							</InfoRow>

							{resumoCobranca.vencimento && (
								<InfoRow>
									<span>Data vencimento</span>
									<span>{moment(boletoParams.vencimento).format("L")}</span>
								</InfoRow>
							)}

							<div className="info-boleto label-descricao">
								<span>Descrição</span>
								<Input.TextArea
									showCount
									maxLength={200}
									value={resumoCobranca.descricao}
									disabled
								/>
							</div>
						</Fragment>
					)}
				</ResumoContainer>

				<Fragment>
					{/*{(this._returnClienteVerificado()) && (*/}
					{/*	<div>*/}
					{/*		<Button*/}
					{/*			onClick={() => handleSubmit({gerar: false})}*/}
					{/*			type="primary"*/}
					{/*			block*/}
					{/*		>*/}
					{/*			Gerar boletos*/}
					{/*		</Button>*/}
					{/*	</div>*/}
					{/*)}*/}

					{this.state.showButtonNegociacao && (
						<Button
							type="primary"
							onClick={this.handleSubmit}
						>
							{this._returnClienteVerificado() ? "Receber entrada e gerar boletos" : "Receber entrada e salvar negocaição"}
						</Button>
					)}
					<Button
						block
						className="mt-2"
						onClick={() => {
							this.setState({
								showResumo     : false,
								showNegociacoes: true
							})
						}}
					>
						Voltar
					</Button>
				</Fragment>
			</ContainerWrapper>
		)
	}

	distribuirAtualizado = () => {
		const {totalDistribuido, labValue, valorDigitado} = this.state
		return valorDigitado - totalDistribuido - labValue;
	};

	changeEspecialidadeValue = (value, index) => {
		const {
				  especialidadesSelecionado,
			  } = this.state

		let arr = especialidadesSelecionado;
		arr.splice(index, 1, {...arr[index], valorAplicado: value});

		console.log(arr)

		this.setState({
			totalDistribuido: arr.reduce((a, b) => a + Number(b.valorAplicado), 0)
		})
	};

	_renderDistribuicao = () => {
		const {
				  data,
				  metodoPagamento,
				  especialidadesSelecionado,
				  laboratoriosSelecionados,
				  valorDigitado,
				  formaPagamento,
				  totalDistribuido,
				  labValue,
				  negociacaoProps

			  } = this.state

		return (
			<div className="footer_drawer">
				<div className="orcamento-collapse" style={{height: "100%"}}>
					<div className="container-side">
						<div className="pagamento-receber">

							<div
								className="infos-pagamento"
								style={{
									// marginTop     : 10,
									display       : "flex",
									justifyContent: "space-between"
								}}
							>
								<div className="info">
									<h2>Total á pagar</h2>
									<span style={{fontSize: 15}}>{convertMoney(valorDigitado)}</span>
								</div>
								<div className="info">
									<h2>Á Distribuir</h2>
									<span style={{color: this.distribuirAtualizado() < 0 ? "red" : "green", fontSize: 15}}>
										  {convertMoney(valorDigitado - totalDistribuido - labValue)}
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

								{(!!negociacaoProps && negociacaoProps.item?.lab.restante !== 0) && (
									<Laboratorio
										retido={negociacaoProps.item?.lab.pago}
										labValue={negociacaoProps.item?.lab.restante + negociacaoProps.item?.lab.pago}
										restante={negociacaoProps.item?.lab.restante}
										onChange={value => {
											this.setState({
												labValue: value
											})
										}}
									/>
								)}

								{!!laboratoriosSelecionados.length && (
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
					</div>

					<div className="container-side">
						<div className="pagamento-pago-hidden">
							{(this.distribuirAtualizado() === 0 || metodoPagamento === "boleto") && (
								<Fragment>
									<div className="header-pagamento">
										<h2>Selecione a forma de pagamento</h2>
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
									<Button
										onClick={this.handleSubmit}
										type="primary"
										style={{backgroundColor: "#1ab394"}}
										block
									>
										Receber
									</Button>
								</Fragment>
							)}
						</div>
					</div>
				</div>
			</div>
		)
	}

	_renderTitle = () => {
		const {data, paciente} = this.state

		return `   Paciente: ${paciente.firstName} ${paciente.lastName}    |    Orçamento nº: ${data.id}`
	}

	_showResumo = (item) => {
		this.setState({
			showNegociacoes     : false,
			boletoParams        : {
				...item.negociacao_boleto,
				valorCobranca: item.total,
			},
			showButtonNegociacao: false
		}, () => {
			this.setState({
				showResumo    : true,
				resumoCobranca: {
					tipoCobranca: "Total",
					descricao   : this.returnDescricao(),
					vencimento  : item.negociacao_boleto.vencimento
				}
			})
		})
	}

	render() {
		const {
				  data,
				  isLoading,
				  procedimentosSelecionados,
				  visible,

				  showDistribuicao,
				  showNegociacao,
				  showNegociacoes,
				  showResumo

			  } = this.state

		return (
			<Drawer
				width="calc(100% - 70px)"
				visible={visible}
				title={this._renderTitle()}
				onClose={this.onCloseDrawer}
				footer={!!showDistribuicao && this._renderDistribuicao()}
				className="financeiro-drawer"
			>
				<div className="orcamento-collapse">
					{
						isLoading ? (
							<Spin indicator={<DollarCircleOutlined />} />
						) : (
							<Fragment>
								<div className="container-side">
									<ShowProcedimentos
										data={data.procedimentos}
										onChangeSelected={this._changeSelected}
										procedimentosSelecionados={procedimentosSelecionados}
									/>

								</div>
								<div className="container-side">
									{(!!procedimentosSelecionados.length && showNegociacao) && this._renderFooter()}
									{(!!data.negociacoes?.length && !procedimentosSelecionados.length && showNegociacoes) && this._renderNegociacoes()}
									{!!showResumo && this._renderResumo()}
								</div>

							</Fragment>
						)
					}
				</div>
			</Drawer>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		clinic: state.clinic.selectedClinic,
	};
};

export default connect(mapStateToProps, null, null, {forwardRef: true})(DrawerShow)