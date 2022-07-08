import React, { useState } from "react";

import { Container, DataText, NameDentista, Row } from "./styles";

import { Select, Tag } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { CommentIcon, DentistaIcon, PacienteIcon } from "~/icons";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";

function Tooltip({data}) {
	const {selectedClinic} = useSelector(state => state.clinic);
	const {token}          = useSelector(state => state.auth);

	const [status, setStatus] = useState();

	const returnTag = tipo => {
		switch( tipo )
		{
			case "retorno":
				return {color: "orange", text: "Retorno"};
			case "avaliacao":
				return {color: "green", text: "Avaliação"};
			default:
				return {color: "#fff", text: ""};
		}
	};

	const colorStatus = status => {
		switch( status )
		{
			case "agendado":
				return "#fdffcc";
			case "confirmado":
				return "#ccffd3";
			case "cancelado_paciente":
				return "#fed1d1";
			case "cancelado_dentista":
				return "#d3abfb";
			case "atendido":
				return "#81f991";
			case "nao_compareceu":
				return "#ff9e6e";
			default:
				return "#fff";
		}
	};

	const returnDay = startDate => {
		let hoje        = moment().format("l");
		let agendamento = moment(startDate).format("l");

		if( hoje === agendamento )
		{
			return `*HOJE* (_${moment(startDate).format("LLLL")}_`;
		}

		if(
			agendamento ===
			moment()
			.add(1, "d")
			.format("l")
		)
		{
			return `*AMANHÃ* (_${moment(startDate).format("LLLL")}_)`;
		}

		return `_${moment(startDate).format("LLLL")}_`;
	};

	const returnWhatsApi = () => {
		const text = `Olá, aqui é da ${
			selectedClinic.name_fantasy
		}, não esqueça do seu horário agendado para ${returnDay(
			data.startDate
		)}. Se acontecer algum imprevisto nos avise, ligue no ${
			selectedClinic.tel
		} ou responda essa mensagem, até mais.`;
		const link = `https://api.whatsapp.com/send?phone=55${encodeURI(
			data.paciente.tel
		)}&text=${encodeURI(text)}`;
		window.open(link, "_blank");
	};

	React.useEffect(() => {
		setStatus(data.status);
	}, [data]);

	if( !data )
	{
		return <></>;
	}

	const returnDisabled = e => {
		const hoje        = new Date();
		const agendamento = new Date(data.startDate);

		if( hoje > agendamento )
		{
			return true;
		}

		return false;
	};

	return (
		<Container disabled={returnDisabled()}>
			<Row>
				<PacienteIcon size={20} />
				<div>
					<div>
						<NameDentista>{data.nomePaciente}</NameDentista>
						<Tag style={{color: "#000"}} color={colorStatus(data.status)}>
							{returnTag(data.tipo).text}
						</Tag>
					</div>
					<DataText>
						{moment(data.startDate).format("llll")} -{" "}
						{moment(data.endDate).format("LT")}
					</DataText>
					{data.agendador ? (
						<div>
							<DataText>
								Agendado por <strong>{data.agendador.firstName}</strong>
							</DataText>
						</div>
					) : (
						<></>
					)}
				</div>
			</Row>
			{data.dentista ? (
				<Row>
					<DentistaIcon size={20} />
					{data.dentista ? (
						<DataText>
							{data.dentista.firstName} {data.dentista.lastName}
						</DataText>
					) : (
						<></>
					)}
				</Row>
			) : (
				<></>
			)}
			{data.paciente && data.paciente.tel ? (
				<Row>
					<PhoneOutlined style={{fontSize: 20, color: "#707070"}} />
					<DataText>{data.paciente.tel}</DataText>
					<WhatsAppOutlined
						onClick={() => returnWhatsApi()}
						style={{fontSize: 20, color: "green", cursor: "pointer"}}
					/>
				</Row>
			) : (
				<></>
			)}
			{data.obs ? (
				<Row>
					<CommentIcon size={20} />
					<DataText>{data.obs}</DataText>
				</Row>
			) : (
				<></>
			)}
			<Select
				style={{width: "100%"}}
				dropdownStyle={{zIndex: 5000, position: "absolute"}}
				value={status}
				options={[
					{
						label: "Agendado",
						value: "agendado"
					},
					{
						label: "Confirmado",
						value: "confirmado"
					},
					{
						label: "Cancelado pelo paciente",
						value: "cancelado_paciente"
					},
					{
						label: "Cancelado pelo dentista",
						value: "cancelado_dentista"
					},
					{
						label: "Atendido",
						value: "atendido"
					},
					{
						label: "Não compareceu",
						value: "nao_compareceu"
					}
				]}
				onChange={e => {
					setStatus(e);
				}}
			/>
		</Container>
	);
}

export default Tooltip;
