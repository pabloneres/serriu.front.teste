import React, { useState, useEffect } from "react";
import { CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { notification, Divider, Space } from "antd";
import { Statistic } from "antd";
import { Card, Accordion, Container, Row, Col, Table } from "react-bootstrap";

import {
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	Button,
	Table as TableNew
} from "antd";
import { FormRow } from "~/modules/global";

// import Select from "react-select";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { convertMoney, convertDate } from "~/modules/Util";
import { Notify } from "~/modules/global";
import { atualData } from "~/utils/data";
import moment from "moment";
import { index, update, show, store } from "~/services/controller";

import ReturnTable from "./components/Table";

import local from "antd/es/date-picker/locale/pt_BR";
import "moment/locale/pt-br";

moment.locale("pt-br");

const {TextArea} = Input;

function FichaClinica() {
	// const classes = useStyles();
	const {userData}                      = useSelector(state => state.auth);
	const {selectedClinic}            = useSelector(state => state.clinic);
	const {params, url}               = useRouteMatch();
	const [orcamentos, setOrcamentos] = useState([]);
	const [executados, setExecutados] = useState([]);
	const [reload, setReload]         = useState(false);
	const [modalData, setModalData]   = useState();

	const [data, setData] = useState(moment(new Date()));
	const [hora, setHora] = useState();

	const [pacienteInfo, setPacienteInfo] = useState(undefined);

	const [dentistas, setDentistas] = useState([]);
	const [dentista, setDentista]   = useState();
	const [detalhe, setDetalhe]     = useState("");

	const [modalExecutar, setModalExecutar]       = useState(undefined);
	const [modalAgendamento, setModalAgendamento] = useState(false);
	const [selectedDate, setSelectedDate]         = React.useState(
		new Date("2014-08-18T21:11:54")
	);

	const [fichaClinica, setFichaClinica] = useState([]);

	let erro = [];

	notification.config({
		placement: "bottomRight",
		duration : 3
	});

	useEffect(() => {
		index("fichaClinica", {
			paciente_id: params.id
		}).then(({data}) => {
			setFichaClinica(data);
		});

		// index(token, `procedimentoExecucao?status=pago&paciente_id=${params.id}`).then(({ data }) => {
		//   // const naoExecutados = data.map(item => ({
		//   //   ...item,
		//   //   procedimentos: item.procedimentos.filter(item => item.status_execucao !== 'executado')
		//   // }))
		//   setOrcamentos(data);
		// });
		// index(token, `procedimentoExecucao?status=executado&paciente_id=${params.id}`).then(({ data }) => {
		//   const executados = data.map(item => ({
		//     ...item,
		//     procedimentos: item.procedimentos.filter(item => item.status_execucao === 'executado')
		//   }))
		//   setExecutados(executados);
		// });

		// VER DEPOIS

		index("users", {cargo: "dentista", clinica: selectedClinic.id})
		.then(({data}) => {
			setDentistas(
				data.map(item => ({
					...item,
					label: item.firstName + " " + item.lastName,
					value: item.id
				}))
			);
		})
		.catch(err => {
		})
	}, [params.id, reload, selectedClinic.id]);

	const getFacesProcedimentoFormatado = procedimento => {
		let strFaces = "";
		procedimento.procedimento.map(dente => {
			strFaces = strFaces.concat(dente.label);

			if( dente.faces !== undefined )
			{
				dente.faces.map(face => {
					strFaces = strFaces.concat(face);
				});
			}

			strFaces = strFaces.concat(", ");
		});

		strFaces = strFaces.slice(0, -2);

		return strFaces;
	};

	function executarProcedimento(e, orcamento, procedimento) {
		setModalExecutar({
			procedimentos: orcamento.procedimentos,
			orcamento,
			procedimento
		});
	}

	function handleAgendamento(e, orcamento, procedimento) {
		setModalData([orcamento, procedimento]);
		setModalAgendamento(true);
	}

	function handlerFormExecutarProcedimento() {
		update("procedimentoExecucao", modalExecutar.procedimento.id, {
			orcamento_id   : modalExecutar.orcamento.id,
			procedimento_id: modalExecutar.procedimento.id,
			detalhes       : detalhe,
			dentista_id    : dentista
		})
		.then(() => {
			setReload(!reload);
			if(
				modalExecutar.orcamento.cobranca === "parcial" &&
				modalExecutar.orcamento.saldo < modalExecutar.procedimento.desconto
			)
			{
				notification.warn({
					message    : `Saldo insuficiente!`,
					description:
						"Procedimento liberado para execução, mas o saldo do cliente ficará negativo."
				});
				return;
			}

			modalClose();
			return notification.success({
				message    : `Execução autoriazada!`,
				description: ""
			});
		})
		.catch(({response}) => {
			modalClose();
			switch( response.data.code )
			{
				case 31:
					return Notify("error", "Saldo insuficiente!");
				case 32:
					return Notify("error", "Especialidade não permitida!");
				default:
					return Notify("error", "Ocorreu algum erro", "Contate o suporte!");
			}
		});

		return;
	}

	function modalClose() {
		setModalExecutar(undefined);
		setDetalhe("");
	}

	function ReturnStatus(status) {
		switch( status )
		{
			case 0:
				return <strong style={{color: "red"}}>Salvo</strong>;
			case 1:
				return <strong style={{color: "green"}}>Aprovado</strong>;
			case 2:
				return <strong style={{color: "orange"}}>Em andamento</strong>;
			case 3:
				return <strong style={{color: "blue"}}>Executado</strong>;
			default:
				return status;
		}
	}

	function ReturnStatusProcedimento(status) {
		switch( status )
		{
			case 0:
				return <strong style={{color: "red"}}>Salvo</strong>;
			case 1:
				return <strong style={{color: "green"}}>Executado</strong>;
			default:
				return status;
		}
	}

	const handleDateChange = date => {
		setSelectedDate(date);
	};

	const returnValue = (e, currency = "brl") => {
		const value = Number(e);
		return value.toLocaleString("pt-br", {style: "currency", currency});
	};

	const returnSaldo = value => {
		if( value < 0 )
		{
			return (
				<span style={{color: "red"}}>
          {" "}
					{Number(value).toLocaleString("pt-br", {
						style   : "currency",
						currency: "BRL"
					})}{" "}
        </span>
			);
		}
		return (
			<span style={{color: "green"}}>
        {" "}
				{Number(value).toLocaleString("pt-br", {
					style   : "currency",
					currency: "BRL"
				})}{" "}
      </span>
		);
	};

	return (
		<div className="fichaClinica">
			<Modal
				centered
				title="Executar procedimento"
				visible={modalExecutar ? true : false}
				onCancel={() => setModalExecutar(undefined)}
				onOk={() => handlerFormExecutarProcedimento()}
			>
				{modalExecutar ? (
					<Form layout="vertical">
						{/* <FormRow columns={1}>
              <Form.Item label="Procedimento">
                <Select
                  disabled={true}
                  options={modalExecutar.procedimentos.map(item => ({
                    ...item,
                    label: item.procedimento.name,
                    value: item.id
                  }))}
                  value={modalExecutar.procedimento.id}
                />
              </Form.Item>
            </FormRow> */}
						<FormRow columns={1}>
							<Form.Item label="Dente">
								<Input
									value={
										modalExecutar.procedimento.dente
											? modalExecutar.procedimento.dente
											: "Geral"
									}
									disabled
								/>
							</Form.Item>
						</FormRow>
						<FormRow columns={1}>
							<Form.Item label="Profissional">
								<Select
									disabled={userData.department_id === "dentista"}
									options={dentistas}
									value={dentista}
									onChange={e => setDentista(e)}
								/>
							</Form.Item>
						</FormRow>
						<FormRow columns={1}>
							<Form.Item label="Detahles próxima consulta">
								<TextArea
									value={detalhe}
									onChange={e => setDetalhe(e.target.value)}
								></TextArea>
							</Form.Item>
						</FormRow>
					</Form>
				) : (
					<></>
				)}
			</Modal>

			<Accordion>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="0">
						<div
							style={{
								display       : "flex",
								justifyContent: "space-between",
								alignItems    : "center"
							}}
						>
							Planos de Tratamento Aprovados
						</div>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0" className="listaProcedimentos">
						<Accordion>
							{fichaClinica
								? fichaClinica.map(orcamento => (
									<Card className="procedimento" key={orcamento.id}>
										<Accordion.Toggle
											as={Card.Header}
											eventKey={orcamento.id}
										>
											<Container>
												<Row>
													<Col xs={2}>Orçamento: {orcamento.id}</Col>
													<Col xs={2}>
														{convertDate(orcamento.created_at)}
													</Col>
													<Col>
														Total orçamento:{" "}
														{convertMoney(orcamento.valorDesconto)}
													</Col>
													<Col>Status: {ReturnStatus(orcamento.status)}</Col>
													<Col>Avaliador: {orcamento.avaliador}</Col>
													{/* {orcamento.pagamento.condicao === 'total' ? '' : <Col>Disponível: {returnSaldo(orcamento.saldo)}</Col>} */}
												</Row>
											</Container>
										</Accordion.Toggle>
										<Accordion.Collapse eventKey={orcamento.id}>
											<Card.Body className="statusProcedimento aberto">
												<ReturnTable
													orcamento={orcamento}
													// fichaClinica={fichaClinica}
													executarProcedimento={executarProcedimento}
													update={() => setReload(!reload)}
												/>
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								))
								: ""}
						</Accordion>
					</Accordion.Collapse>
				</Card>
			</Accordion>
			<Accordion>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="1">
						Ficha Clinica
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Data</th>
										<th>Dente</th>
										<th>Procedimentos Executados</th>
										<th>Profissional</th>
										{/* <th>Status</th> */}
										<th>Descrição</th>
									</tr>
								</thead>
								<tbody>
									{executados.map((item, index) =>
											item.procedimentos.map((procedimento, index) => (
												<tr key={index}>
													<td>{convertDate(item.criado_em)}</td>
													<td>
														{procedimento.dente}{" "}
														{procedimento.faces
															? procedimento.faces.map(face => (
																<span style={{color: "red"}}>
                                {face.label}{" "}
                              </span>
															))
															: "Geral"}
													</td>
													<td>{procedimento.procedimento.name}</td>
													<td>
														{procedimento.dentista.firstName}{" "}
														{procedimento.dentista.lastName}
													</td>
													{/* <td>{ReturnStatusProcedimento(procedimento.status)}</td> */}
													<td>{procedimento.detalhes}</td>
												</tr>
											))
									)}
								</tbody>
							</Table>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>
		</div>
	);
}

export default FichaClinica;
