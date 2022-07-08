import React, { useEffect, useState } from "react";

// import { Container } from './styles';
import { Card, DatePicker, Table } from "antd";
import { index, store, update } from "~/services/controller";
import { useSelector } from "react-redux";
import moment from "moment";
import "moment/locale/pt-br";
import "./styles.css";
import { WhatsAppOutlined } from "@ant-design/icons";
import EditDataPerson from "~/components/created/leads/editDataPerson";
import EditData from "~/components/created/leads/editData";

moment.locale("pt-br");

const { RangePicker } = DatePicker;

function Leads() {
	const { selectedClinic } = useSelector(state => state.clinic);
	const [monitoramento, setMonitoramento] = useState([]);
	const [searchPaciente, setSearchPaciente] = useState();
	const [showProcedimentos, setShowProcedimentos] = useState();
	const [reload, setReload] = useState(false);
	const [searchNota, setSearchNota] = useState();
	const [filters, setFilters] = useState({});

	useEffect(() => {
		index("leads", { clinica_id: selectedClinic.id, ...filters }).then(
			({ data }) => {
				setMonitoramento(data);
			}
		);
	}, [selectedClinic.id, reload, filters, searchNota]);

	const openWhatsWeb = (data) => {
		const link = `https://wa.me/${data}`;
		window.open(link, "_blank");
	}

	const columns = [
		{
			title: "Data",
			dataIndex: 'created_at',
			render: data => <span>{data}</span>
		},
		{
			title: "Nome",
			render: data => (
				<EditDataPerson data={data} reload={() => setReload(!reload)} />
			)
		},
		{
			title: "Telefone",
			render: data => (
				<EditData data={data} reload={() => setReload(!reload)} />
			)
		},
	];

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
			title="Leads"
			extra={
				<div style={{ width: "700px", flex: 1 }}>
					{/*<Select*/}
					{/*	allowClear*/}
					{/*	placeholder="Filtrar status"*/}
					{/*	style={{width: "30%", margin: "0 5px"}}*/}
					{/*	value={filters.status_monitoramento}*/}
					{/*	onChange={e => {*/}
					{/*		setFilters({...filters, status_monitoramento: e});*/}
					{/*	}}*/}
					{/*	options={[*/}
					{/*		{*/}
					{/*			label: "Todos",*/}
					{/*			value: "todos"*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: "Aberto",*/}
					{/*			value: "aberto"*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: "Resolvido",*/}
					{/*			value: "resolvido"*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: "Análise",*/}
					{/*			value: "analise"*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: "Funil",*/}
					{/*			value: "funil"*/}
					{/*		},*/}
					{/*		{*/}
					{/*			label: "Perdido",*/}
					{/*			value: "perdido"*/}
					{/*		}*/}
					{/*	]}*/}
					{/*/>*/}
					{/*<RangePicker locale={locale} onChange={handleChangeDate} />*/}
				</div>
			}
		>
			<Table
				size="small"
				rowKey="id"
				dataSource={monitoramento}
				columns={columns}
				pagination={{ pageSize: 100 }}
			/>
		</Card>
	);
}

export default Leads;
