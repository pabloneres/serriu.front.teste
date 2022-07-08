import React, { useEffect, useState } from "react";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useDispatch, useSelector } from "react-redux";
import { Container, ContainerEdit, EditButton } from "./styles";

import { Button, DatePicker, Form, Input, Modal, Select, TimePicker } from "antd";
// import Select from "react-select";
import { FormRow, Notify } from "~/modules/global";
import { show, update } from "~/services/controller";

const { TextArea } = Input;
const localizer = momentLocalizer(moment);
const { RangePicker } = DatePicker;

function Drawers({ dentists, updateAgenda }) {
	const dispatch = useDispatch()
	const { appointment } = useSelector(state => state.agenda);
	const { selectedClinic } = useSelector(state => state.clinic);
	const { token } = useSelector(state => state.auth);

	const [novoAgendamento, setNovoAgendamento] = useState(undefined);
	const [pacientes, setPacientes] = useState([]);

	useEffect(() => {
		setNovoAgendamento(appointment);
	}, [appointment]);

	useEffect(() => {
		if (appointment) {
			show('patient', appointment.paciente_id).then(({ data }) => {
				setPacientes([data])
			})
		}
	}, [appointment])

	const handleSave = () => {
		if (!novoAgendamento.paciente_id) {
			return;
		}
		update("agendamento", novoAgendamento.id, {
			dentista_id: novoAgendamento.dentista_id,
			startDate: novoAgendamento.startDate,
			endDate: novoAgendamento.endDate,
			obs: novoAgendamento.obs,
			tipo: novoAgendamento.tipo,
			status: novoAgendamento.status
		}).then(_ => {
			dispatch({
				type: 'RELOAD'
			})
			Notify("success", "Agendamento alterado.")
			updateAgenda()
			handleClose();
		});
	};

	const changeStatus = e => {
		update("agendamento", novoAgendamento.id, {
			status: e
		}).then(_ => {
			dispatch({
				type: 'RELOAD'
			})
			handleClose();
		});
	};

	const handleClose = () => {
		dispatch({
			type: "CHANGE_APPOINTMENT",
			payload: undefined
		})
	}

	const handleEditClient = e => {
		dispatch({ type: 'CHANGE_APPOINTMENT', payload: undefined })
		dispatch({
			type: "EDIT_CLIENT",
			payload: e
		})
	}

	return (
		<Modal
			destroyOnClose={true}
			title="Editar Agendamento"
			width={500}
			visible={novoAgendamento ? true : false}
			closable={false}
			onOk={() => handleSave()}
			footer={
				<div style={{ display: "flex", justifyContent: "flex-end" }}>
					<Button
						onClick={handleClose}
					>
						Cancelar
					</Button>
					<Button type="primary" onClick={handleSave}>
						Salvar
					</Button>
				</div>
			}
		>
			{novoAgendamento ? (
				<Container>
					<Form layout="vertical">
						<Form.Item label="Paciente">
							<ContainerEdit>
								<Select
									disabled
									value={novoAgendamento.paciente_id}
									placeholder="Selecione o paciente..."
									options={pacientes.map(item => ({
										label: `${item.firstName} ${item.lastName}`,
										value: item.id
									}))}
									onChange={e => {
										setNovoAgendamento({
											...novoAgendamento,
											paciente_id: e.value
										});
									}}
								/>
								<EditButton
									type="primary"
									disabled={!novoAgendamento.paciente_id}
									onClick={e => handleEditClient(novoAgendamento.paciente_id)}
								>
									Editar
								</EditButton>
							</ContainerEdit>
						</Form.Item>
						<Form.Item label="Tipo">
							<Select
								disabled={!novoAgendamento.isValidAppointment}
								value={novoAgendamento.tipo}
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
								onChange={e => {
									setNovoAgendamento({ ...novoAgendamento, tipo: e });
								}}
							/>
						</Form.Item>
						<Form.Item label="Dentista">
							<Select
								showSearch
								optionFilterProp="children"
								filterOption={(input, option) =>
									option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
								}
								value={novoAgendamento.dentista_id}
								options={dentists.map(item => ({
									label: `${item.firstName} ${item.lastName}`,
									value: item.id
								}))}
								onChange={e => {
									setNovoAgendamento({ ...novoAgendamento, dentista_id: e });
								}}
							/>
						</Form.Item>
						<Form.Item label="Início">
							<FormRow columns={3}>
								<DatePicker
									value={moment(novoAgendamento.startDate)}
									disabled
								/>
								<TimePicker
									disabled={!novoAgendamento.isValidAppointment}
									value={moment(novoAgendamento.startDate)}
									onChange={e =>
										setNovoAgendamento({ ...novoAgendamento, startDate: e })
									}
								/>
								<TimePicker
									disabled={!novoAgendamento.isValidAppointment}
									value={moment(novoAgendamento.endDate)}
									onChange={e =>
										setNovoAgendamento({ ...novoAgendamento, endDate: e })
									}
								/>
							</FormRow>
						</Form.Item>
						<Form.Item label="Obs">
							<FormRow columns={1}>
								<TextArea
									disabled={!novoAgendamento.isValidAppointment}
									value={novoAgendamento.obs}
									onChange={e => {
										setNovoAgendamento({
											...novoAgendamento,
											obs: e.target.value
										});
									}}
								/>
							</FormRow>
						</Form.Item>
						<Form.Item label="Status">
							<Select
								value={novoAgendamento.status}
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
									changeStatus(e);
									setNovoAgendamento({ ...novoAgendamento, status: e });
								}}
							/>
						</Form.Item>
					</Form>
				</Container>
			) : (
				<></>
			)}
		</Modal>
	);
}

export default Drawers;
