import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import {
	Form,
	Table,
	Col,
	Button,
	CardGroup,
	Modal,
	ButtonToolbar,
	ButtonGroup,
	Alert
} from "react-bootstrap";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import "./styles.css";

import { Button as ButtonNew } from "antd";

import SVG from "react-inlinesvg";

import moment from "moment";

import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import { store, index, update, show } from "~/services/controller";
import { index as indexNew } from "~/controllers/controller";
import { convertMoney, convertDate } from "~/modules/Util";

//COMPONENTES
import ProcedimentoGeral from "./components/formularios/procedimentoGeral";
import ProcedimentoSelecaoDente from "./components/formularios/procedimentoSelecaoDente";

import Select from "react-select";
import Notify from "~/services/notify";

function AdicionarOrcamentoPage({orcamento, alterar, onFinish}) {
	const {selectedClinic, clinics}       = useSelector(state => state.clinic);
	const history                         = useHistory();
	const {params, url}                   = useRouteMatch();
	const [procedimento, setProcedimento] = useState(undefined);

	const options = () => {
		if( selectedClinic.config.workBoletos )
		{
			return [
				{value: "total", label: "Total"},
				{value: "boleto", label: "Boleto"},
				{value: "procedimento", label: "Procedimento executado"}
			];
		}

		return [
			{value: "total", label: "Total"},
			{value: "procedimento", label: "Procedimento executado"}
		];
	};

	const date_now = new Date();

	const [tabelas, setTabelas] = useState([]);
	const [tabela, setTabela]   = useState(undefined);

	const [procedimentos, setProcedimentos] = useState([]);

	const [dentists, setDentists]                                 = useState([]);
	const [dentista, setDentista]                                 = useState();
	const [clinicas, setClinicas]                                 = useState([]);
	const [procedimentosFinalizados, setProcedimentosFinalizados] = useState([]);
	const [dadosAPI, setDadosAPI]                                 = useState([]);

	const [modalFormaPagamento, setModalFormaPagamento] = useState(false);

	const [cobranca, setCobranca]   = useState({});
	const [pagamento, setPagamento] = useState({});
	const [condicao, setCondicao]   = useState({});
	const [entrada, setEntrada]     = useState(undefined);
	const [parcelas, setParcelas]   = useState(undefined);
	const [showAlert, setShowAlert] = useState(false);

	const [loading, setLoading] = useState(false);

	const [opcoesPagamento, setOpcoesPagamento] = useState(undefined);

	const [defaultOrcamento, setDefaultOrcamento] = useState();

	useEffect(() => {
		index("preco", {id: selectedClinic.id}).then(({data}) => {
			setTabelas(data);
		});

		index("users", {cargo: "dentista", clinica: selectedClinic.id}).then(
			({data}) => {
				setDentists(data);
			}
		);
	}, [selectedClinic.id]);

	useEffect(() => {
		if( tabela )
		{
			index("procedimento", {id: tabela}).then(({data}) => {
				setProcedimentos(data);
			});
		}
	}, [tabela]);

	const handleSubmitFormaPagamento = e => {
		e.preventDefault();

		let opcoesPagamento = {
			condicao: returnCondicao("value"),
			entrada,
			parcelas: !parcelas ? undefined : parcelas
		};
		setOpcoesPagamento(opcoesPagamento);
		setModalFormaPagamento(false);
	};

	const handlerMudancaTabela = e => {
		setTabela(e.target.value);
		setProcedimento(undefined);
	};

	const handlerMudancaDentista = async data => {
		if( !data )
		{
			return;
		}
		setProcedimentosFinalizados(
			procedimentosFinalizados.map(item => ({
				...item,
				dentista_id: data.value
			}))
		);
		setDentista(data);
	};

	const handlerMudancaProcedimentos = (procedimento, action) => {
		if( procedimento && procedimento.value )
			setProcedimento({...procedimento});
		else setProcedimento(undefined);
	};

	const addProcedimentoFinalizado = (e, proced) => {
		if( proced.acao === undefined )
		{
			proced.habilitado = true;
			setProcedimentosFinalizados([...procedimentosFinalizados, proced]);
		}
		setProcedimento(undefined);
	};

	const removerProcedimento = key => {
		procedimentosFinalizados.splice(key, 1);
		setProcedimentosFinalizados([...procedimentosFinalizados]);
	};

	const alternarProcedimento = proced => {
		proced.habilitado = !proced.habilitado;

		setProcedimentosFinalizados([...procedimentosFinalizados]);
	};

	const alterarProcedimento = procedimento => {
		procedimento.acao = "alterar";
		setProcedimento(procedimento);
	};

	const getTotalProcedimentos = () => {
		let total = 0;
		procedimentosFinalizados.map(row => {
			total += row.valorTotal;
		});

		return total;
	};

	const exibeFormularioProcedimento = () => {
		let html = "";

		if( procedimento )
		{
			if( procedimento.geral )
			{
				html = (
					<ProcedimentoGeral
						onFinish={addProcedimentoFinalizado}
						procedimento={procedimento}
						dentista={dentista}
					/>
				);
			}
			else
			{
				html = (
					<ProcedimentoSelecaoDente
						onFinish={addProcedimentoFinalizado}
						procedimento={procedimento}
						dentista={dentista}
					/>
				);
			}
		}

		return html;
	};

	const getFacesProcedimentoFormatado = procedimento => {
		let strFaces = "";
		procedimento.dentes.map(dente => {
			strFaces = strFaces.concat(dente.label);

			if( dente.faces !== undefined )
			{
				dente.faces.map(face => {
					strFaces = strFaces.concat(face.label);
				});
			}

			strFaces = strFaces.concat(", ");
		});

		strFaces = strFaces.slice(0, -2);

		return strFaces;
	};

	function handleSubmit() {
		setLoading(true);
		store("orcamentos", {
			procedimentos : procedimentosFinalizados,
			paciente_id   : params.id,
			pagamento     : opcoesPagamento,
			avaliador     : dentista.value,
			clinic_id     : selectedClinic.id,
			status        : "salvo",
			data_aprovacao: null
		})
		.then(() => {
			setLoading(false);
			Notify("success", "Orçamento criado");
			onFinish();
		})
		.catch(err => {
			setLoading(false);
			Notify("error", "Erro ao criar orçamento");
			onFinish();
			return;
			// retirar a linha debaixo e retornar o erro
			// setSubmitting(false);
		});
	}

	const returnFormaPagamento = () => {
		if( cobranca.value === "procedimento" || cobranca.value === "parcial" )
		{
			return options()["pagamento"][0];
		}
		return pagamento;
	};

	const returnCondicao = props => {
		if( props === "value" )
		{
			if( pagamento.value === "dinheiro" )
			{
				return options()["condicao"][0];
			}

			if( cobranca.value === "procedimento" || cobranca.value === "parcial" )
			{
				return options()["condicao"][0];
			}

			return condicao;
		}

		if( props === "disabled" )
		{
			if(
				cobranca.value === "procedimento" ||
				cobranca.value === "parcial" ||
				pagamento.value === "dinheiro"
			)
			{
				return true;
			}
		}
	};

	useEffect(() => {
		show("defaultOrcamentos", selectedClinic.id).then(({data}) => {
			if( data )
			{
				// setDefaultOrcamento(true);
				setProcedimentosFinalizados(data.orcamento);
			}
		});
	}, [selectedClinic.id]);

	const returnDisabled = () => {
		if( !dentista )
		{
			return true;
		}
		return false;
	};

	return (
		<Card>
			<CardHeader title="Adicionar Orcamento"></CardHeader>
			<CardBody>
				<Form>
					<Form.Row>
						{/* LISTAR CLINICAS */}
						<Form.Group as={Col} controlId="formGridAddress1">
							<Form.Label>Clinica *</Form.Label>
							<Form.Control
								disabled
								as="select"
								name="clinica"
								value={selectedClinic.id}
							>
								{clinics.map(row => {
									return <option key={row.name}>{row.name}</option>;
								})}
							</Form.Control>
						</Form.Group>

						{/* LISTAR DENTISTAS */}

						<Form.Group as={Col} controlId="formGridAddress1">
							<Form.Label>Dentista *</Form.Label>
							<Select
								isClearable={true}
								value={dentista}
								placeholder="Selecione o dentista..."
								options={dentists.map(item => ({
									value: item.id,
									label: `${item.firstName} ${item.lastName}`
								}))}
								onChange={value => {
									handlerMudancaDentista(value);
								}}
							/>
						</Form.Group>

						{/* INSERE A DATA */}
						<Form.Group as={Col} controlId="formGridPassword">
							<Form.Label>Data *</Form.Label>
							<Form.Control disabled type="text" name="data" value={moment().format("LLL")} />
						</Form.Group>
					</Form.Row>

					{/* LISTA AS TABELAS DE PREÇO */}
					<Form.Row>
						<Form.Group as={Col} controlId="formGridAddress1">
							<Form.Label>Tabela *</Form.Label>
							<Form.Control
								disabled={returnDisabled()}
								as="select"
								name="tabela"
								onChange={e => handlerMudancaTabela(e)}
							>
								<option value=""></option>
								{tabelas.map(tabela => (
									<option key={tabela.id} value={tabela.id}>
										{tabela.name}
									</option>
								))}
							</Form.Control>
						</Form.Group>
					</Form.Row>

					{/* LISTA OS PROCEDIMENTOS */}
					<Form.Row>
						<Form.Group as={Col} controlId="formGridAddress1">
							<Form.Label>Procedimentos *</Form.Label>

							<Select
								isClearable={true}
								value={procedimento}
								placeholder="Busque procedimento..."
								options={procedimentos.map(item => ({
									label: item.name,
									value: item.id,
									...item
								}))}
								onChange={(value, action) => {
									handlerMudancaProcedimentos(value, action);
								}}
								// isOptionDisabled={procedimentos || returnDisabled()}
								isDisabled={returnDisabled()}
							/>
						</Form.Group>
					</Form.Row>

					<CardGroup>
						<Card>
							<CardHeader title="Procedimento"></CardHeader>
							<CardBody>{exibeFormularioProcedimento()}</CardBody>
						</Card>

						<Card className="card-orcamento">
							<CardHeader title="Orçamentos"></CardHeader>
							<CardBody>
								<div className="todosOrcamentos">
									{procedimentosFinalizados.map((row, key) => {
										return (
											<div
												className={
													"orcamento " + (!row.habilitado ? "desabilitado" : "")
												}
												key={key}
											>
												<div className="conteudo">
													<div className="linha">{row.label}</div>
													<div className="linha">
														{dentista ? dentista.label : ""}
													</div>
													<div className="linha">
														{getFacesProcedimentoFormatado(row)}
													</div>
												</div>
												<div
													className="total"
													style={{
														backgroundColor: "#00cf45"
													}}
												>
													<p className="texto">
														{convertMoney(row.valorTotal)}
													</p>

													<div className="acoes">
                            <span
								onClick={() => alterarProcedimento(row)}
								className="svg-icon menu-icon"
							>
                              <EditOutlined />
                            </span>
														<span
															onClick={() => removerProcedimento(key)}
															className="svg-icon menu-icon"
														>
                              <DeleteOutlined />
                            </span>
													</div>
												</div>
											</div>
										);
									})}
								</div>

								<div className="text-right">
									<h2>Total : {convertMoney(getTotalProcedimentos())}</h2>
								</div>
								<div className="text-right">
									{(() => {
										if( procedimentosFinalizados.length > 0 && dentista )
										{
											return (
												<div>
													<div
														style={{
															marginLeft   : "auto",
															display      : "flex",
															flexDirection: "column"
														}}
													>
														<ButtonNew
															disabled={returnDisabled()}
															loading={loading}
															type="primary"
															style={{
																backgroundColor: "#00cf45",
																border         : "#00cf45"
															}}
															block
															onClick={() => {
																handleSubmit();
															}}
														>
															Salvar
														</ButtonNew>
														<ButtonNew
															style={{
																backgroundColor: "#f73b54",
																border         : "#f73b54",
																marginTop      : 5
															}}
															block
															type="primary"
															danger
														>
															Cancelar
														</ButtonNew>
													</div>
												</div>
											);
										}
									})()}
								</div>
							</CardBody>
						</Card>
					</CardGroup>
				</Form>
			</CardBody>
		</Card>
	);
}

export default AdicionarOrcamentoPage;
