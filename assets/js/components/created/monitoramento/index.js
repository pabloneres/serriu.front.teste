import React, { useEffect, useState } from "react";

// import { Container } from './styles';
import { Card, DatePicker, Modal, Select, Table, Tag, Tooltip } from "antd";
import { index, store, update } from "~/services/controller";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/pt-br";
import DrawerSearch from "../agenda/components/Agenda/components/Drawers/DrawerSearch";
import { convertDate } from "~/modules/Util";
import DrawerPosVenda from "./DrawerPosVenda";
import { WhatsAppOutlined } from "@ant-design/icons";
import colorAgendamento from "~/utils/colorAgendamento";
import locale from "antd/es/date-picker/locale/pt_BR";
import "./styles.css";
import replaceNumber from "~/helpers/replaceNumber";

moment.locale("pt-br");

const { RangePicker } = DatePicker;

function Monitoramento() {
	const { selectedClinic } = useSelector(state => state.clinic);
	const [monitoramento, setMonitoramento] = useState([]);
	const [searchPaciente, setSearchPaciente] = useState();
	const [showProcedimentos, setShowProcedimentos] = useState();
	const [reload, setReload] = useState(false);
	const [searchNota, setSearchNota] = useState();
	const [filters, setFilters] = useState({});

	useEffect(() => {
		index("monitoramento", { clinica_id: selectedClinic.id, ...filters }).then(
			({ data }) => {
				setMonitoramento(data);
			}
		);
	}, [selectedClinic.id, reload, filters, searchNota]);

	const openWhatsWeb = (data) => {
		handleSaveNote(data.id);
		const link = `https://api.whatsapp.com/send?phone=55${encodeURI(
			replaceNumber(data.paciente.tel)
		)}&text=`;
		window.open(link, "_blank");
	}

	const columns = [
		{
			title: "Data agend.",
			render: data => (
				<div>
					<span style={{ fontSize: "0.9rem" }}>
						{convertDate(data.startDate)}
					</span>
					<Tag
						style={{ color: "#000", marginLeft: 5 }}
						color={colorAgendamento(data.status).color}
					>
						{colorAgendamento(data.status).label}
					</Tag>
					({data.tipo})
				</div>
			)
		},
		{
			title: "Profissional",
			dataIndex: 'dentista',
			render: data => <span>{data ? `${data.firstName} ${data.lastName}` : '-'}</span>
		},
		{
			title: "Paciente",
			render: data => (
				<div style={{ display: "flex", alignItems: "center" }}>
					<span>
						{data.paciente.firstName} {data.paciente.lastName}
					</span>
					<WhatsAppOutlined
						onClick={() => openWhatsWeb(data)}
						style={{
							fontSize: 16,
							color: "green",
							cursor: "pointer",
							marginLeft: 10
						}}
					/>
				</div>
			)
		},
		// {
		//   title: "Status agendamento",
		//   dataIndex: "status",
		//   render: data => (
		//     <Tag style={{ color: "#000" }} color={colorAgendamento(data).color}>
		//       {colorAgendamento(data).label}
		//     </Tag>
		//   )
		// },
		{
			title: "P. executados",
			dataIndex: "procedimentosExecutados",
			render: data => (
				<span>
					{data.length > 0 ? (
						<a
							style={{ marginLeft: 5, color: "blueviolet" }}
							onClick={e => setShowProcedimentos(data)}
						>
							Visualizar
						</a>
					) : (
						"-"
					)}
				</span>
			)
		},
		{
			title: "Agend. futuro",
			render: dados => {
				let data = dados.agendamentoFuturo;
				return (
					<span>
						{data.length > 0 ? (
							<div>
								{" "}
								{moment(data[0].startDate).format("DD/MM/YYYY HH:mm")} -{" "}
								{moment(data[0].endDate).format("LT")}
								<a
									style={{ marginLeft: 5, color: "blueviolet" }}
									onClick={() => setSearchPaciente(dados.paciente_id)}
								>
									Ver Todos
								</a>
							</div>
						) : (
							"-"
						)}
					</span>
				);
			}
		},
		{
			title: "Pós Venda",
			render: data => (
				<>
					<span>{data.__meta__.notas_count}</span>
					<a
						style={{ marginLeft: 5, color: "blueviolet" }}
						onClick={() => {
							setSearchNota(data.id);
						}}
					>
						Ver Notas
					</a>
				</>
			)
		},
		{
			title: "Ações",
			width: 120,
			render: data => (
				<div
					style={{ display: "flex", justifyContent: "space-between" }}
					className={
						data.status_monitoramento === "resolvido"
							? "disable_actions"
							: "enable_actions"
					}
				>
					{data.agendamentoFuturo.length > 0 ? (
						<Tooltip title="Resolvido">
							<span
								style={{ cursor: "pointer" }}
								onClick={() => {
									handleUpdate(data.id, "resolvido");
								}}
							>
								<i
									className={`fas fa-check-circle ${data.status_monitoramento !== "resolvido" ? "enable" : ""
										}`}
								></i>
							</span>
						</Tooltip>
					) : (
						<></>
					)}
					<Tooltip title="Analise">
						<span
							style={{ cursor: "pointer" }}
							onClick={() => {
								handleUpdate(data.id, "analise");
							}}
						>
							<i
								className={`fas fa-desktop ${data.status_monitoramento !== "resolvido" ? "enable" : ""
									}`}
							></i>
						</span>
					</Tooltip>
					<Tooltip title="Perdido">
						<span
							style={{ cursor: "pointer" }}
							onClick={() => {
								handleUpdate(data.id, "perdido");
							}}
						>
							<i
								className={`fas fa-times-circle ${data.status_monitoramento !== "resolvido" ? "enable" : ""
									}`}
							></i>
						</span>
					</Tooltip>
					<Tooltip title="Funil">
						<span
							style={{ cursor: "pointer" }}
							onClick={() => {
								handleFunil(data.id);
							}}
						>
							<i
								className={`fas fa-filter ${data.status_monitoramento !== "resolvido" ? "enable" : ""
									}`}
							></i>
						</span>
					</Tooltip>
				</div>
			)
		},
		{
			title: "Status",
			dataIndex: "status_monitoramento"
		}
	];

	const returnFaces = data => {
		if (data.length === 0) {
			return "";
		}

		return (
			<>
				{data.map(item => (
					<span style={{ color: "red", marginRight: 5 }}>{item.label}</span>
				))}
			</>
		);
	};

	const handleUpdate = (id, status) => {
		update("monitoramento", id, {
			status_monitoramento: status
		}).then(_ => {
			handleSaveNoteAction(status, id);
			setReload(!reload);
		});
	};

	const handleFunil = (id) => {
		update(`monitoramento/funil`, id).then(_ => {
			handleSaveNoteAction("funil", id);
			setReload(!reload);
		});
	}

	const handleChangeDate = e => {
		if (!e) {
			let filter = filters;
			delete filter.date;
			setFilters({ ...filter });
			return;
		}

		let start = e[0].format("YYYY-MM-DD");
		let end = e[1].format("YYYY-MM-DD");

		setFilters({ ...filters, date: [start, end] });
	};

	const handleSaveNote = agendamento_id => {
		store("notasPosVenda", {
			nota: `Entrou em contato com o cliente via WhatsApp`,
			agendamento_id: agendamento_id
		}).then(_ => {
			setReload(!reload);
		});
	};

	const handleSaveNoteAction = (status, agendamento_id) => {
		let statusList = {
			resolvido: "Agendamento marcado como RESOLVIDO",
			analise: "Agendamento marcado como ANALISE",
			perdido: "Agendamento marcado como PERDIDO",
			funil: "Agendamento marcado como FUNIL"
		};

		store("notasPosVenda", {
			nota: statusList[status],
			agendamento_id: agendamento_id
		}).then(_ => {
			setReload(!reload);
		});
	};

	return (
		<Card
			title="Monitoramento"
			extra={
				<div style={{ width: "700px", flex: 1 }}>
					<Select
						allowClear
						placeholder="Filtrar status"
						style={{ width: "30%", margin: "0 5px" }}
						value={filters.status_monitoramento}
						onChange={e => {
							setFilters({ ...filters, status_monitoramento: e });
						}}
						options={[
							{
								label: "Todos",
								value: "todos"
							},
							{
								label: "Aberto",
								value: "aberto"
							},
							{
								label: "Resolvido",
								value: "resolvido"
							},
							{
								label: "Análise",
								value: "analise"
							},
							{
								label: "Funil",
								value: "funil"
							},
							{
								label: "Perdido",
								value: "perdido"
							}
						]}
					/>
					<RangePicker locale={locale} onChange={handleChangeDate} />
				</div>
			}
		>
			<Modal
				title="Procedimentos executados"
				visible={showProcedimentos ? true : false}
				destroyOnClose
				footer={null}
				onCancel={() => setShowProcedimentos(undefined)}
			>
				<Table
					size="small"
					rowKey="id"
					pagination={false}
					columns={[
						{
							title: "Procedimento",
							dataIndex: "procedimento",
							render: data => <span>{data.name}</span>
						},
						{
							title: "Dente",
							render: data => (
								<span>
									{data.dente ? data.dente : "Geral"}{" "}
									{data.faces ? returnFaces(data.faces) : <></>}
								</span>
							)
						}
					]}
					dataSource={showProcedimentos}
				/>
			</Modal>
			<DrawerPosVenda searchNota={searchNota} setSearchNota={setSearchNota} />
			<DrawerSearch
				searchPaciente={searchPaciente}
				setSearchPaciente={setSearchPaciente}
			/>
			<Table
				size="small"
				rowKey="id"
				dataSource={monitoramento}
				columns={columns}
				rowClassName={record =>
					record.status_monitoramento === "resolvido" ? "disable_row" : ""
				}
				pagination={{ pageSize: 100 }}
			/>
		</Card>
	);
}

export default Monitoramento;
