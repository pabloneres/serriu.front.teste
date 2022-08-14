import React, { useState, useEffect, useRef, useContext } from "react";

import {
	Table,
	Button,
	Tooltip,
	Input,
	InputNumber,
	DatePicker,
	Form,
	Modal as ModalAnt,
	Select,
	Tabs,
	Skeleton,
	Spin
} from "antd";

import { MoneyCollectOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { Notify } from "~/modules/global";

// import Select from 'react-select'

import Modal from "~/components/created/modal";

import moment from "moment";
import {
	Container,
	ContainerSide,
	ContainerSideBody,
	ContainerFormRow,
	EspecialidadeContainer,
	EspecialidadeContainerAll,
	EspecialidadeRow,
	Especialidades,
	ContainerDashed,
	ContainerFooter,
	FormFixed,
	FormFixedLabel,
	FormFixedValue,
	ContainerScroll
} from "./styles";

import Especialidade from "./components/especialidades";
import Laboratorio from "./components/laboratorio";
import Resumo from "./components/resumoBoleto";
import Negociacao from "./components/negociacao";

import { useSelector } from "react-redux";

import { store, index, show } from "~/services/controller";

import { CheckCircleOutlined } from "@ant-design/icons";

import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { FormRow, FormJustify } from "~/modules/global";
import ContainerHeader from "../container";

import Extra from "../Extra";
import EditableTable from "../editableTable";

import InputCurrency from "~/utils/Currency";

import local from "antd/es/date-picker/locale/pt_BR";

const {TextArea} = Input;
const {Option}   = Select;
const {TabPane}  = Tabs;

const EditableContext = React.createContext(null);

function Total({data, setDesconto, desconto, close, update}) {
	const {selectedClinic} = useSelector(state => state.clinic);

	const [resumoCobranca, setResumoCobranca] = useState({});
	const [dentista, setDentista]             = useState({});
	const [paciente, setPaciente]             = useState({});
	const [boletoParams, setBoletoParams]     = useState({});

	const [especialidades, setEspecialidades]                       = useState([]);
	const [saldoDistribuir, setSaldoDistribuir]                     = useState([]);
	const [selecionado, setSelecionado]                             = useState([]);
	const [labsSelecionado, setLabsSelecionado]                     = useState([]);
	const [especialidadesSelecionado, setEspecialidadesSelecionado] = useState([]);

	const [formaPagamento, setFormaPagamento]     = useState();
	const [labTotal, setLabTotal]                 = useState();
	const [valorSelecionado, setValorSelecionado] = useState();
	const [valorDigitado, setValorDigitado]       = useState();
	const [valorDistribuir, setValorDistribuir]   = useState();
	const [metodoPagamento, setMetodoPagamento]   = useState();
	const [orcamento, setOrcamento]               = useState();

	const [labValues, setLabValues]               = useState(0);
	const [pagamentoValue, setPagamentoValue]     = useState(0);
	const [totalDistribuido, setTotalDistribuido] = useState(0);

	const [faturamento, setFaturamento]           = useState();
	const [pagamentoDetails, setPagamentoDetails] = useState();

	const [loadingButton, setLoadingButton] = useState(false);
	const [loadingGerar, setLoadingGerar]   = useState(false);
	const [disabledLab, setDisabledLab]     = useState(false);
	const [mostrarResumo, setMostrarResumo] = useState(false);

	const [selectionType, setSelectionType]     = useState("checkbox");
	const [pagamentoValue2, setPagamentoValue2] = useState(data.restante);

	// const [desconto, setDesconto] = useState(undefined)

	const closeAll = () => {
		setResumoCobranca({});
		setDentista({});
		setPaciente({});
		setBoletoParams({});
		setEspecialidades([]);
		setSaldoDistribuir([]);
		setSelecionado([]);
		setLabsSelecionado([]);
		setEspecialidadesSelecionado([]);
		setFormaPagamento();
		setLabTotal();
		setValorSelecionado();
		setValorDigitado();
		setValorDistribuir();
		setMetodoPagamento();
		setOrcamento();
		setFaturamento();
		setPagamentoDetails();
		setLabValues(0);
		setPagamentoValue(0);
		setTotalDistribuido(0);
		setLoadingButton(false);
		setLoadingGerar(false);
		setDisabledLab(false);
		setMostrarResumo(false);

		close();
	};

	useEffect(() => {
		let arrEspecialidades = selecionado.map(item => {
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

		setEspecialidadesSelecionado(especi);
		// setSaldoDistribuir(especi);

		setValorSelecionado(
			selecionado.reduce((a, b) => a + Number(b.desconto), 0)
		);

		if( metodoPagamento !== "boleto" )
		{
			setValorDigitado(selecionado.reduce((a, b) => a + Number(b.desconto), 0));
		}

		return;
	}, [data, metodoPagamento, selecionado]);

	useEffect(() => {
		if( selecionado.length === 0 )
		{
			return;
		}

		let labs = selecionado.filter(item => item.procedimento.lab);

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

		setLabsSelecionado(labs);
	}, [data, selecionado]);

	useEffect(() => {
		setValorDistribuir(valorDigitado);
	}, [valorDigitado]);

	useEffect(() => {
		show("patient", data.paciente_id).then(({data}) => {
			setPaciente(data);
		});
		show("users", data.avaliador).then(({data}) => {
			setDentista(data);
		});
	}, [data]);

	const columnsModalTotalData = [
		{
			descricao: "Pagamento total do orçamento",
			valor    : data ? data.valor : ""
		},
		{
			descricao: "Pagamento parcial do orçamento",
			valor    : pagamentoValue
		}
	];

	const columnsModalTotal = [
		{
			title    : "Descrição",
			dataIndex: "descricao"
		},
		{
			title    : "Valor",
			dataIndex: "valor",
			render   : data => <span>{data ? convertMoney(data) : ""}</span>
		}
	];

	const handlePagamento = () => {
		store("/pagamento", {
			condicao    : "total",
			orcamento_id: data.id,
			// procedimento_ids: selecionado,
			formaPagamento,
			valor         : Number(pagamentoValue),
			especialidades: especialidades
		}).then(data => {
			setPagamentoValue(0);
			setSaldoDistribuir([]);
			setPagamentoValue2(0);
			close();
			// data.changeFormaPagamento()
		});
	};

	const sendBoleto = gerarBoletos => {
		setLoadingGerar(true);
		const sendObject = {
			orcamento_id   : data.id,
			valorSelecionado,
			valorDigitado,
			metodoPagamento: formaPagamento,
			procedimentos  : selecionado.map(item => item.id),
			especialidades : especialidadesSelecionado,
			lab            : {
				valorAplicado: labValues,
				total        : labsSelecionado.reduce((a, b) => a + Number(b.restante), 0)
			},
			boleto         : {...boletoParams, gerar: true}
		};

		console.log(sendObject);

		store("negociacao", sendObject)
		.then(_ => {
			setLoadingGerar(false);
			closeNotify();
		})
		.catch(console.log);
	};

	const closeNotify = () => {
		close();
		return Notify("success", "Pagamento recebido");
	};

	if( !data )
	{
		return <></>;
	}

	const rowSelection = {
		onChange        : (rowKey, selectedRows) => {
			setSelecionado(selectedRows);
		},
		getCheckboxProps: record => ({
			disabled: record.status === "pago"
		})
	};

	const handleSetValue = e => {
		if( e > data.valor )
		{
			return data.valor;
		}

		return e;
	};

	const zerarValor = item => {
		let saldos = saldoDistribuir;

		let index = saldos.findIndex(current => current.id === item.id);

		saldos[index] = {...item, valorAplicado: 0};

		setSaldoDistribuir(saldos);
	}; // essa função zera o valor aplicado na especialidade

	const mudarValorDistribuido = item => {
		let saldos      = [...saldoDistribuir, item];
		let saldosFinal = [];

		saldos.forEach(item => {
			if( !saldosFinal.some((el, i) => el.id === item.id) )
			{
				saldosFinal.push(item);
			}
			else
			{
				var index = saldosFinal.findIndex(current => item.id === current.id);

				saldosFinal[index].valorAplicado = item.valorAplicado;
			}
		});

		setSaldoDistribuir(saldosFinal);
	};

	const saveValorAplicado = index => {
		setSaldoDistribuir(
			especialidades.map((current, i) => {
				if( i === index )
				{
					return {
						...current,
						// valorAplicado: valor,
						restante: Number(current.restante) - Number(current.valorAplicado)
					};
				}
				else
				{
					return {...current};
				}
			})
		);
	};

	const handleChangeValueEspecialidade = (e, index, item) => {
		let valor = Number(e.target.value); // valor digitado

		let totalEspecialidade = Number(
			saldoDistribuir.reduce((a, b) => Number(a) + Number(b.valorAplicado), 0)
		);

		const returnValor = () => {
			if( totalEspecialidade + valor > pagamentoValue )
			{
				return pagamentoValue - totalEspecialidade;
			}

			if( valor > pagamentoValue )
			{
				return pagamentoValue;
			}
			else if( valor > item.restante )
			{
				return item.restante;
			}

			if( totalEspecialidade > pagamentoValue )
			{
				return totalEspecialidade - pagamentoValue;
			}

			return valor;
		};

		setEspecialidades(
			especialidades.map((current, i) => {
				if( i === index )
				{
					return {
						...current,
						valorAplicado: returnValor()
						// restante: Number(current.restante) - Number(current.valorAplicado),
					};
				}
				else
				{
					return {...current};
				}
			})
		);
	};

	const total         = Number(
		data.procedimentos.reduce((a, b) => a + Number(b.valor), 0)
	);
	const totalDesconto = Number(
		data.procedimentos.reduce((a, b) => a + Number(b.desconto), 0)
	);
	const totalPago     = Number(data.valorDesconto) - Number(data.restante);

	const changeEspecialidadeValue = (value, index) => {
		let arr = especialidadesSelecionado;
		arr.splice(index, 1, {...arr[index], valorAplicado: value});

		setTotalDistribuido(arr.reduce((a, b) => a + Number(b.valorAplicado), 0));
		setEspecialidadesSelecionado(arr);
	};

	const send = params => {
		setLoadingButton(true);
		const sendObject = {
			orcamento_id   : data.id,
			valorSelecionado,
			valorDigitado,
			procedimentos  : selecionado.map(item => item.id),
			metodoPagamento: formaPagamento,
			especialidades : especialidadesSelecionado,
			lab            : {
				valorAplicado: labValues,
				total        : labsSelecionado.reduce((a, b) => a + Number(b.restante), 0)
			},
			boleto         :
				metodoPagamento === "boleto"
					? {
						...boletoParams,
						gerar: params === "gerar" ? true : false
					}
					: null
		};

		store("/negociacao", sendObject)
		.then(_ => {
			setLoadingButton(false);
			closeNotify();
		})
		.catch(e => {
			setLoadingButton(false);
		});
	};

	const resetFields = () => {
		let arr = especialidadesSelecionado.map(item => ({
			...item,
			valorAplicado: Number(0)
		}));

		setEspecialidadesSelecionado(arr);

		setValorDistribuir(valorDigitado);
		setLabValues(0);
		setDisabledLab(false);
	};

	const returnDescricao = () => {
		return `Total: ${convertMoney(
			returnValorSelecionado()
		)}, sendo entrada de ${convertMoney(valorDigitado)} + ${
			boletoParams.parcelas
		} parcelas de ${convertMoney(
			(returnValorSelecionado() - valorDigitado) / boletoParams.parcelas
		)} Paciente: ${paciente.firstName +
		" " +
		paciente.lastName}, Dr(a). ${dentista.firstName +
		" " +
		dentista.lastName}, Clinica: ${selectedClinic.name}
    `;
	};

	const returnValorSelecionado = () => {
		return selecionado.reduce((a, b) => a + Number(b.desconto), 0);
	};

	const getNegociacao = id => {
		show("/faturamento", id).then(({data}) => {
			setFaturamento(data);
		});
	};

	const distribuirAtualizado = () => {
		return valorDistribuir - totalDistribuido - labValues;
	};

	const returnPorcentagem = () => {
		return (returnValorSelecionado() * selectedClinic.config.entMinima) / 100;
	};

	const isDisable = () => {
		if( !valorDigitado || valorDigitado === 0 )
		{
			return true;
		}
		if(
			valorDigitado <
			Number(
				returnPorcentagem() +
				labsSelecionado.reduce((a, b) => a + Number(b.restante), 0)
			)
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

	const returnEntradaMinima = () => {
		return (
			returnPorcentagem() +
			labsSelecionado.reduce((a, b) => a + Number(b.restante), 0)
		);
	};

	const returnDisabledVerified = () => {
		if(
			paciente.cpf_verified === 0 ||
			paciente.rg_verified === 0 ||
			paciente.address_verified === 0
		)
		{
			return true; // true = desabilitado
		}

		return false;
	}; // náo verificado = true

	const returnLabValue = () => {
		if( metodoPagamento === "boleto" )
		{
			return labsSelecionado.reduce((a, b) => a + Number(b.restante), 0);
		}

		return data.lab;
	};

	return (
		<Container>
			<ContainerSide disabled={pagamentoDetails}>
				<ContainerScroll border={1} dashed>
					<EditableTable
						data={data.procedimentos}
						setDesconto={setDesconto}
						desconto={desconto}
						selecionado={selecionado}
						setSelecionado={setSelecionado}
						update={update}
					/>
				</ContainerScroll>

				<ContainerFooter>
					<ContainerDashed style={{flexDirection: "column"}} width="49">
						<FormFixed border={1}>
							<FormFixedLabel>Total</FormFixedLabel>
							<FormFixedValue>{convertMoney(total)}</FormFixedValue>
						</FormFixed>

						<FormFixed border={1}>
							<FormFixedLabel>Total com desconto</FormFixedLabel>
							<FormFixedValue>{convertMoney(totalDesconto)}</FormFixedValue>
						</FormFixed>

						<FormFixed border={1}>
							<FormFixedLabel>Total pago</FormFixedLabel>
							<FormFixedValue>{convertMoney(totalPago)}</FormFixedValue>
						</FormFixed>

						<FormFixed border={1}>
							<FormFixedLabel>Saldo a pagar</FormFixedLabel>
							<FormFixedValue>
								{convertMoney(totalDesconto - totalPago)}
							</FormFixedValue>
						</FormFixed>
					</ContainerDashed>

					<ContainerDashed width="49" style={{flexDirection: "column"}}>
						<Extra
							callback={e => setMetodoPagamento(e)}
							disabled={!selecionado.length > 0}
							value={metodoPagamento}
						/>
						{metodoPagamento === "total" ? (
							<ContainerDashed centered width="100">
								<FormFixed border={0} block>
									<FormFixedLabel>Total a pagar</FormFixedLabel>
									<InputCurrency
										defaultValue={valorDigitado}
										onChange={e => {
											setValorDigitado(e);
										}}
									/>
								</FormFixed>

								<FormFixed border={0} block>
									<FormFixedLabel>Contém laboratório</FormFixedLabel>
									<Input
										style={{width: "100%", marginBottom: 10}}
										disabled
										value={convertMoney(
											labsSelecionado.reduce(
												(a, b) => a + Number(b.restante),
												0
											)
										)}
									/>
								</FormFixed>

								<Button
									onClick={() => {
										setPagamentoDetails({});
									}}
									disabled={selecionado.length === 0}
									type="primary"
									block
								>
									Adicionar
								</Button>
							</ContainerDashed>
						) : (
							<></>
						)}

						{metodoPagamento === "boleto" ? (
							<ContainerDashed centered width="100">
								<FormFixed border={0} block>
									<FormFixedLabel>Total a pagar</FormFixedLabel>
									<InputCurrency disabled value={returnValorSelecionado()} />
								</FormFixed>
								<FormFixed border={0} block>
									<FormFixedLabel>Entrada</FormFixedLabel>
									<InputCurrency
										max={returnValorSelecionado()}
										onChange={setValorDigitado}
									/>
									<span>
                    Entrada mínima de {selectedClinic.config.entMinima}% ={" "}
										{convertMoney(returnPorcentagem())} + Lab ={" "}
										{convertMoney(
											labsSelecionado.reduce(
												(a, b) => a + Number(b.restante),
												0
											)
										)}{" "}
										{" | "}
										{convertMoney(returnEntradaMinima())}
                  </span>
								</FormFixed>

								<FormFixed border={0} block>
									<FormFixedLabel>Parcelas</FormFixedLabel>
									<Select
										disabled={!valorDigitado}
										style={{width: "100%"}}
										options={[
											...Array(selectedClinic.config.maxParcelas).keys()
										].map(item => ({
											label:
												item +
												1 +
												"X" +
												convertMoney(
													(returnValorSelecionado() - valorDigitado) /
													(item + 1)
												),
											value: item + 1
										}))}
										onChange={e =>
											setBoletoParams({
												...boletoParams,
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
											setBoletoParams({
												...boletoParams,
												vencimento: e
											});
										}}
									/>
								</FormFixed>

								<Button
									onClick={() => {
										setPagamentoDetails({});
										if( !returnDisabledVerified() )
										{
											setMostrarResumo(true);
										}
										setResumoCobranca({
											tipoCobranca: "Total",
											valor       : data.totalDesconto,
											// metodoPagamento: data.pagamento.condicao,
											descricao: returnDescricao()
										});
										setBoletoParams({
											...boletoParams,
											entrada: valorDigitado
										});
										setValorDistribuir(0);
									}}
									disabled={isDisable()}
									type="primary"
									block
								>
									Adicionar
								</Button>
							</ContainerDashed>
						) : (
							<></>
						)}
					</ContainerDashed>
				</ContainerFooter>
			</ContainerSide>

			{pagamentoDetails && !mostrarResumo ? (
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
										color: distribuirAtualizado() < 0 ? "red" : "green"
									}}
								>
                  {convertMoney(distribuirAtualizado())}
                </span>
							</div>
						</div>
					</div>

					{pagamentoValue <= data.valor ? (
						<EspecialidadeContainerAll>
							<EspecialidadeContainer>
								{metodoPagamento === "boleto" ? (
									<Especialidade
										restante={valorDigitado - returnLabValue()}
										value={valorDigitado - returnLabValue()}
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
														changeEspecialidadeValue(value, index)
													}
													title={item.name}
													restante={item.restante}
													max={distribuirAtualizado()}
												/>
											);
										})}
									</Especialidades>
								)}

								{labsSelecionado.length ? (
									<Laboratorio
										disabled={metodoPagamento === "boleto"}
										value={returnLabValue()}
										retido={returnLabValue()}
										labValue={labsSelecionado.reduce(
											(a, b) => a + Number(b.restante),
											0
										)}
										restante={
											labsSelecionado.length > 0
												? labsSelecionado.reduce(
												(a, b) => a + Number(b.restante),
												0
											) - data.lab
												: 0
										}
										onChange={value => {
											setLabValues(value);
										}}
									/>
								) : (
									<></>
								)}
							</EspecialidadeContainer>
							{/* <Button
                  style={{ marginTop: 10 }}
                  onClick={() => resetFields()}
                >Resetar</Button> */}
						</EspecialidadeContainerAll>
					) : (
						""
					)}

					<div className="pagamento-pago-hidden">
						{distribuirAtualizado() === 0 || metodoPagamento === "boleto" ? (
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
										setFormaPagamento(e);
									}}
								/>
								{loadingButton ? (
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
										onClick={() => {
											if( metodoPagamento === "boleto" )
											{
												setMostrarResumo(true);
											}
											else
											{
												send();
											}
										}}
										type="primary"
										block
										disabled={distribuirAtualizado() !== 0 || !formaPagamento}
									>
										Receber
									</Button>
								)}
								<Button
									style={{marginTop: 5}}
									onClick={() => {
										setPagamentoDetails(undefined);
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
			) : !mostrarResumo ? (
				// negociacoes
				<Negociacao
					data={data.negociacoes}
					paciente={paciente}
					close={() => close()}
					sendBoleto={send}
				/>
			) : (
				<></>
			)}

			{mostrarResumo ? (
				<Resumo
					send={send}
					paciente={paciente}
					resumoCobranca={resumoCobranca}
					data={data}
					boletoParams={boletoParams}
					valor={returnValorSelecionado()}
					back={() => setMostrarResumo(false)}
					sendBoleto={sendBoleto}
					loadingGerar={loadingGerar}
					formaPagamento={formaPagamento}
					setFormaPagamento={setFormaPagamento}
				/>
			) : (
				<></>
			)}
		</Container>
	);
}

export default Total;
