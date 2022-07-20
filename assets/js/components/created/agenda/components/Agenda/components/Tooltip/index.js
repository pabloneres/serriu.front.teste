import React, { Component } from 'react'
import { ActionsContainer, Container, DataText, NameDentista, Row } from "./styles";

import { Select, Spin, Tag } from "antd";
import moment from "moment";
import { CommentIcon, DentistaIcon, PacienteIcon } from "~/icons";
import { DeleteOutlined, EditOutlined, PhoneOutlined, WechatOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { show, update } from "~/services/controller";
import replaceNumber from "~/helpers/replaceNumber";
import { colorStatus, returnTag } from './utils'

class Tooltip extends Component {
	constructor(props) {
		super(props)

		this.state = {
			loading: true,
			status: undefined,
			appointment: null
		}
	}

	componentDidMount() {
		console.log(this.props.data)
		if (this.props.data.status) {
			this.setState({
				status: this.props.data.status
			})
		}
		this.loadAppointment()
		document.querySelector(".schedule_container").style.height = "92vh"
	}

	loadAppointment = () => {
		show("agendamento", this.props.data?.id).then(({ data }) => {
			this.setState({
				appointment: data,
				loading: false
			})
		})
	}

	openWhatsWeb = () => {
		const { appointment } = this.state

		const link = `https://api.whatsapp.com/send?phone=55${encodeURI(
			replaceNumber(appointment.paciente.tel)
		)}&text=`;
		window.open(link, "_blank");
	}

	onChangeStatus = e => {
		this.setState({
			status: e
		}, () => {
			update("agendamento", this.props.data?.id, {
				status: e
			}).then(() => {
				this.props.notify()
			})
		})

	};

	render() {
		const { data, notify, ...restProps } = this.props
		const { status, appointment, loading } = this.state

		return (
			<Container {...restProps}>

				{
					loading ? (
						<div className="spin_container">
							<Spin />
						</div>
					) : (
						<>
							<ActionsContainer>
								<EditOutlined className="icons-tooltip" onClick={() => this.props.handleEdit(data)} />
								<DeleteOutlined className="icons-tooltip" onClick={() => this.props.handleDelete(data.id)} />
								{
									data.__meta__?.interacoes_count !== "0" && (
										<WechatOutlined className="icons-tooltip" onClick={() => this.props.handleChat(data)} />
									)
								}
							</ActionsContainer>
							<Row>
								<PacienteIcon size={20} />
								<div>
									<div>
										<NameDentista>{data.nomePaciente}</NameDentista>
										<Tag style={{ color: "#000" }} color={colorStatus(data.status)}>
											{returnTag(data.tipo).text}
										</Tag>
									</div>
									<DataText>
										{moment(data.startDate).format("llll")} -{" "}
										{moment(data.endDate).format("LT")}
									</DataText>
									{appointment.agendador && (
										<div>
											<DataText>
												Agendado por <strong>{appointment.agendador.firstName}</strong>
											</DataText>
										</div>
									)}
								</div>
							</Row>
							{appointment.dentista && (
								<Row>
									<DentistaIcon size={20} />
									{appointment.dentista && (
										<DataText>
											{appointment.dentista.firstName} {appointment.dentista.lastName}
										</DataText>
									)}
								</Row>
							)}
							{appointment.paciente?.tel && (
								<Row>
									<PhoneOutlined style={{ fontSize: 20, color: "#707070" }} />
									<DataText>{appointment.paciente.tel}</DataText>
									<WhatsAppOutlined
										onClick={this.openWhatsWeb}
										style={{ fontSize: 20, color: "green", cursor: "pointer" }}
									/>
								</Row>
							)}
							{data.obs && (
								<Row>
									<CommentIcon size={20} />
									<DataText>{data.obs}</DataText>
								</Row>
							)}
							<Select
								style={{ width: "100%" }}
								dropdownStyle={{ zIndex: 5000, position: "absolute" }}
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
								onChange={this.onChangeStatus}
							/>
						</>
					)
				}
			</Container>
		)
	}
}

export default Tooltip