import React, { Component, createRef } from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Button, Checkbox, DatePicker, Form, Input, Modal, Select, TimePicker } from "antd";
// import Select from "react-select";
import { Container, ContainerEdit, EditButton } from "~/components/created/agenda/components/Agenda/components/Drawers/styles";
import { FormRow, Notify } from "~/modules/global";
import { connect } from "react-redux";
import { index, store } from "~/services/controller"

const { Option } = Select;
const { TextArea } = Input;
const localizer = momentLocalizer(moment);
const { RangePicker } = DatePicker;

class CreateAppointment extends Component {
	formRef = createRef();

	constructor(props) {
		super(props);

		this.state = {
			isEvaluate: false,
			show: false,
			isSending: false,
			patients: [],
			patient: [],
			appointment: null,
			searchText: null,
			notifyPatient: true,
			optionsPatient: [],
			typingTimer: null,
			doneTypingInterval: 1200
		}
	}

	search = (e) => {
		clearTimeout(this.typingTimer)
		this.setState({
			typingTimer: setTimeout(() => this.doneTyping(e), this.state.doneTypingInterval)
		})
	}

	doneTyping = (e) => {
		this.setState({
			searchText: e
		})
		index("patient", { id: this.props.clinic.id, name: e })
			.then(({ data }) => {
				this.setState({
					patients: data
				})
			})
	}

	handleChange = (e) => {
		if (e === 0) {
			this.props.addClient(this.state.searchText)
			this.formRef.current.resetFields()
			this.setState({
				patient: null,
				searchText: null
			})
		}

		const index = this.state.patients.findIndex(item => item.id === e)

		this.setState({
			patient: e,
			patientData: this.state.patients[index],
			appointment: {
				...this.state.appointment,
				paciente_id: e
			}
		})
	}

	onClose = () => {
		this.setState({
			show: false
		}, () => {
			this.formRef.current.resetFields()
		})
	}

	onFinish = (values) => {
		const data = {
			...values,
			notify: this.state.notifyPatient,
			startDate: this.state.appointment.startDate,
			endDate: this.state.appointment.endDate,
			clinica_id: this.props.clinic.id
		}

		this.setState({
			isSending: true
		})

		store("agendamento", data).then(_ => {
			this.setState({
				isSending: false
			})
			this.formRef.current.resetFields()
			this.props.updateAgenda()
			this.setState({
				isSending: false,
				show: false
			})
			Notify("success", "Agendamento criado")
		}).catch(_ => {
			this.setState({
				isSending: false
			})
			Notify("error", "Erro ao criar agendamento")
		})
	}

	onAppointmentCreate = (appointment) => {
		this.setState({
			appointment,
			show: true
		})
	}

	patientList = () => {
		if (this.state.patients.length === 0 && this.state.searchText) {
			return [{
				label: <span style={{ fontWeight: "bold" }}>
					<i
						role="img"
						className="fas fa-user-plus"
						style={{ color: "green", marginRight: 5 }}
					/>
					{this.state.searchText}</span>,
				value: 0
			}]
		}

		return this.state.patients.map(item => {
			return {
				label: `${item.firstName} ${item.lastName}`,
				value: item.id
			}
		})
	}

	handleEditClient = e => {
		this.props.selectDate(undefined)
		this.props.editClient(e)
		// dispatch({type: 'SELECTED_DATE', payload: undefined})
		// dispatch({
		// 	type   : "EDIT_CLIENT",
		// 	payload: e
		// })
	}

	render() {
		const { show, isSending, patients, patient, searchText, appointment, notifyPatient, isSearching, isEvaluate } = this.state
		const { dentists } = this.props
		return (
			<Modal
				destroyOnClose
				title="Novo Agendamento"
				width={500}
				visible={show}
				onCancel={this.onClose}
				closable={false}
				footer={null}
			>
				<Container>
					<Form layout="vertical" ref={this.formRef} onFinish={this.onFinish}>
						<ContainerEdit>
							<Form.Item style={{ width: "100%" }} label="Paciente" name="paciente_id" required>
								<Select
									disabled={isSending}
									showSearch
									placeholder="Buscar paciente"
									// style={this.props.style}
									showArrow={false}
									onChange={this.handleChange}
									filterOption={false}
									onSearch={this.search}
									allowClear
									notFoundContent={null}
									options={this.patientList()}
								/>
							</Form.Item>
							<EditButton
								type="primary"
								disabled={!appointment?.paciente_id}
								onClick={e => this.handleEditClient(appointment.paciente_id)}
							>
								Editar
							</EditButton>
						</ContainerEdit>
						<div style={{ marginBottom: 10, display: "flex" }}>
							<Checkbox disabled={isSending} checked={isEvaluate} onClick={(e) => this.setState({ isEvaluate: e.target.checked })} />
							<span style={{ marginLeft: 10 }}>Primeiro atendimento? </span>
						</div>
						<Form.Item label="Dentista" name="dentista_id">
							<Select
								allowClear
								disabled={isSending || isEvaluate}
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) => {
									return (
										option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
									);
								}}
								options={dentists.map(item => ({
									label: `${item.firstName} ${item.lastName}`,
									value: item.id
								}))}
							/>
						</Form.Item>
						<Form.Item label="Tipo" name="tipo" rules={[{ required: true, message: "Campo obrigatório!" }]}>
							<Select
								disabled={isSending}
								placeholder="Selecione o tipo de agendamento..."
								options={[
									{
										label: "Avaliação",
										value: "avaliacao"
									},
									{
										label: "Retorno",
										value: "retorno"
									}
								]}
							/>
						</Form.Item>
						<Form.Item label="Status" name="status" rules={[{ required: true, message: "Campo obrigatório!" }]}>
							<Select
								disabled={isSending}
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
							/>
						</Form.Item>

						<div style={{ marginBottom: 10, display: "flex" }}>
							<Checkbox disabled={isSending} checked={notifyPatient} onClick={(e) => this.setState({ notifyPatient: e.target.checked })} />
							<span style={{ marginLeft: 10 }}>Notificar cliente sobre o agendamento? </span>
						</div>

						<Form.Item label="Início">
							<FormRow columns={3}>
								<DatePicker
									value={moment(appointment?.startDate)}
									disabled
								/>
								<TimePicker
									value={moment(appointment?.startDate)}
									onChange={e =>
										this.setState.appointment({ ...appointment, startDate: e })
									}
									disabled={isSending}
								/>
								<TimePicker
									value={moment(appointment?.endDate)}
									onChange={e =>
										this.setState.appointment({ ...appointment, endDate: e })
									}
									disabled={isSending}
								/>
							</FormRow>
						</Form.Item>
						<Form.Item label="Obs" name="obs">
							<FormRow columns={1}>
								<TextArea
									disabled={isSending}
								/>
							</FormRow>
						</Form.Item>
						<div style={{ display: "flex", justifyContent: "flex-end" }}>
							<Button onClick={this.onClose}>
								Cancelar
							</Button>
							<Button
								style={{ marginLeft: 10 }}
								type="primary"
								htmlType="submit"
								loading={isSending}
								disabled={isSending}
							>
								Salvar
							</Button>
						</div>
					</Form>
				</Container>
			</Modal>
		)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		addClient: (data) => dispatch({
			type: "ADD_CLIENT",
			payload: data
		}),
		editClient: (data) => dispatch({
			type: "EDIT_CLIENT",
			payload: data
		}),
		selectDate: (data) => dispatch({
			type: 'SELECTED_DATE',
			payload: data
		})

	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.auth.user,
		clinic: state.clinic.selectedClinic,
		settings: state.settings,
		agenda: state.agenda,
	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(CreateAppointment)