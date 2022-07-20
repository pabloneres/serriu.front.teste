import React, { Component } from "react";
import { EditingState, ViewState } from "@devexpress/dx-react-scheduler";
import { AppointmentForm, Appointments, AppointmentTooltip, CurrentTimeIndicator, DateNavigator, DragDropProvider, EditRecurrenceMenu, Scheduler, TodayButton, Toolbar, WeekView } from "@devexpress/dx-react-scheduler-material-ui";

import { Modal, } from "antd";
import { Notify } from "~/modules/global";
import { connect } from "react-redux";
import Utils from "./components/utils.js";
import daysJson from "./components/days.json";
import ToolTipComponent from "./components/Tooltip/index";
import { destroy, index, update } from "~/services/controller";
import Filtros from './components/Filtros'
import colorAgendamento from "~/utils/colorAgendamento.js";

import { AgendaColor, ContainerAgendamento } from "./styles";

import "./styles.css";
import moment from "moment";
import "moment/locale/pt-br";

moment.locale("pt-br");

const { confirm } = Modal;

const views = ["week", "workWeek", "day"];

class Agenda extends Component {
	constructor(props) {
		super(props)

		this.state = {
			agendamentos: [],
			week: moment().format("YYYY-MM-DD"),
			scheduleSettings: {
				start: 8,
				end: 18,
				options: this.selectionEnd(),
				scale: 30
			},
			showTooltip: false,
			tooltip: null
		}
	}

	componentDidMount() {
		this.load()
	}

	load = (filters) => {
		index("agendamento", { isAgenda: true, clinica_id: this.props.clinic.id, week: this.state.week, ...filters }).then(response => {
			this.setState({
				agendamentos: response.data
			})
		})
	};

	returnFirstDayOfWeek = () => {
		let today = new Date().getDay();

		switch (today) {
			case 0:
				return 5;
			case 1:
				return 6;
			case 2:
				return 0;
			case 3:
				return 1;
			case 4:
				return 2;
			case 5:
				return 3;
			case 6:
				return 4;

			default:
				return today;
		}
	}

	invalidDate = () => {
		return Notify("error", "Data não permitida", "");
	}

	successNotify = () => {
		return Notify("success", "Agendamento alterado", "");
	}

	onSchedule = async props => {
		const isValidAppointment = Utils.isValidAppointmentRender(
			props.startDate,
			daysJson
		);

		if (props.id) {
			this.props.selectDate(props, isValidAppointment)
			return;
		}

		if (!isValidAppointment) {
			this.invalidDate();
			return;
		}

		this.props.selectDate(props)
	};

	onChangeWeek = (week) => {
		this.setState({
			week: moment(week).format("YYYY-MM-DD")
		}, () => {
			this.load()
		})
	}

	selectionEnd(start = "08:00", end = "18:00", interval = 30) {
		let startTime = start;
		let endTime = end;

		let selects = [startTime];
		let multiplicador = interval;

		while (startTime != endTime) {
			startTime = moment(startTime, "HH:mm")
				.add(multiplicador, "minutes")
				.format("HH:mm");
			selects.push(startTime);
		}

		return selects;
	}

	changeAppointment = (e) => {
		this._submitChanges(e)
		// confirm({
		//     title: "Deseja alterar esse agendamento ?",
		//     cancelText: "Não",
		//     okText: "Sim",
		//     onCancel() {
		//         return;
		//     },
		//     onOk() {
		//
		//     }
		// });
	}

	handleDelete = (id) => {
		this.setState({
			tooltip: null
		})
		destroy("agendamento", id).then(() => {
			this.load()
			return Notify("success", "Agendamento excluido com sucesso")
		}).catch(({ response }) => {
			return Notify("error", response.data.message)
		})
	};

	handleEdit = props => {
		const isValidAppointment = Utils.isValidAppointmentRender(
			props.startDate,
			daysJson
		);
		this.setState({
			tooltip: null
		})
		this.props.changeAppointment({ ...props, isValidAppointment })
	};

	_submitChanges = ({ added, changed, deleted }) => {
		if (deleted) {
			destroy("agendamento", deleted).then(() => {
				this.load()
			});
		}
		if (changed) {
			let obj;
			let agendamento;
			for (var prop in changed) {
				obj = prop;
			}
			agendamento = changed[obj];
			update("agendamento", obj, agendamento).then(({ data }) => {
				this.load()
			});
		}
	}

	_renderToolbar = (props) => {
		return (
			<Toolbar.FlexibleSpace style={{ flex: 1 }}>
				<Filtros
					agendar={this.onSchedule}
					onChangeFilters={(filters) => this.load(filters)} {...props}
					dentists={this.props.dentists}
					recepcionists={this.props.recepcionists}
				/>
			</Toolbar.FlexibleSpace>)
	};

	_renderAppointment = ({
		children,
		data,
		onClick,
		doubleClick,
		...restProps
	}) => {
		return (
			<Appointments.Appointment {...restProps}>
				<ContainerAgendamento
					id="wrapper"
					color={colorAgendamento(data.status).color}
					onClick={e => {
						this.onAppointmentMetaChange({
							data
						});
						// const returnTag = () => {
						// 	switch( e.target.id )
						// 	{
						// 		case "wrapper":
						// 			return e.target.parentElement.parentElement;
						// 		case "color":
						// 			return e.target.parentElement.parentElement.parentElement;
						// 		case "text":
						// 			return e.target.parentElement.parentElement.parentElement
						// 				.parentElement;
						// 		case "container":
						// 			return e.target.parentElement.parentElement.parentElement;
						// 		default:
						// 			break;
						// 	}
						// };
						//
						// this.toggleVisibility();
						// this.onAppointmentMetaChange({
						// 	target: returnTag(),
						// 	data
						// });
					}
					}
				>
					<AgendaColor
						id="color"
						color={data.scheduleColor || "#c4c4c4"}
						border={data.scheduleColor || "#b5b5b5"}
					/>
					<div
						id="container"
						style={{
							padding: 11,
							display: "flex",
							flexDirection: "column"
						}}
					>
						<span id="text" style={{ color: "black", fontWeight: "bold" }}>
							{data.nomePaciente}
						</span>
						<span id="text" style={{ color: "black" }}>
							{moment(data.startDate).format("LT")} -{" "}
							{moment(data.endDate).format("LT")}
						</span>
						{data.recepcao?.status_recepcao === 'presente' || data.recepcao?.status_recepcao === 'atendimento' ? <div className="paciente_presente"></div> : <></>}
					</div>
				</ContainerAgendamento>
			</Appointments.Appointment>
		);
	};

	toggleVisibility = () => {
		this.setState({
			showTooltip: !this.state.showTooltip
		})
	}

	onAppointmentMetaChange = (data) => {
		this.setState({
			tooltip: data
		})
	}

	_prepareAppointment = props => this._renderAppointment(props)

	onChangeTooltioVisibility = (data) => {
		this.setState({
			showTooltip: data
		})
	}

	onChangeTooltip = (data) => {
		this.setState({
			tooltip: data
		})
	}

	onAppointmentCreate = async props => {
		const isValidAppointment = Utils.isValidAppointmentRender(
			props.startDate,
			daysJson
		);

		if (props.id) {
			this.props.selectDate(...props, isValidAppointment)
			return;
		}

		if (!isValidAppointment) {
			return this.invalidDate()
		}

		this.props.selectDate(props)
	};

	handleChat = (data) => {
		return this.props.handleChat(data)
	}

	_renderTooltip = (data) => (
		<ToolTipComponent
			notify={this.successNotify}
			data={data}
			handleEdit={this.handleEdit}
			handleDelete={this.handleDelete}
			handleChat={this.handleChat}
		/>
	)

	modalClose = () => {
		this.setState({
			tooltip: null
		})
	}

	render() {
		const { agendamentos, scheduleSettings, showTooltip, tooltip } = this.state
		const { clinic, user } = this.props

		return (
			<div className="schedule_container" style={{ height: "93vh" }}>
				<Scheduler
					firstDayOfWeek={this.returnFirstDayOfWeek()}
					locale="pt-br"
					data={agendamentos}
				>
					<ViewState
						defaultCurrentDate={this.state.week}
						onCurrentDateChange={this.onChangeWeek}
					/>
					<Toolbar flexibleSpaceComponent={this._renderToolbar} />
					<WeekView
						intervalCount={1}
						startDayHour={scheduleSettings.start}
						endDayHour={scheduleSettings.end}
						cellDuration={scheduleSettings.scale}
						dayScaleCellComponent={e => {
							const isToday =
								moment(e.startDate).format("YYYY-MM-DD") ===
								moment().format("YYYY-MM-DD");
							return (
								<WeekView.DayScaleCell
									className={isToday ? "today-column" : ""}
									{...e}
								/>
							);
						}}
						timeTableCellComponent={e => {
							const isToday =
								moment(e.startDate).format("YYYY-MM-DD") ===
								moment().format("YYYY-MM-DD");

							const old =
								moment(e.startDate).format("YYYY-MM-DD") <
								moment().format("YYYY-MM-DD");

							const returnBackground = () => {
								if (isToday) {
									return "rgba(251, 247, 227, 0.7)";
								}
								if (old) {
									return "#f1f1f1";
								}
								return "#fff";
							};
							return (
								<WeekView.TimeTableCell
									{...e}
									className="cell_agenda"
									style={{ backgroundColor: returnBackground() }}
								/>
							);
						}}
					/>
					<DateNavigator />
					<TodayButton messages={{ today: "Hoje" }} />
					<Appointments appointmentComponent={this._prepareAppointment} />
					<EditingState onCommitChanges={this.changeAppointment} />
					<EditRecurrenceMenu />
					<DragDropProvider />
					<CurrentTimeIndicator
						shadePreviousCells={true}
						shadePreviousAppointments={true}
						updateInterval={10000}
					/>
					<AppointmentTooltip />
					{/*<AppointmentTooltip*/}
					{/*	onAppointmentMetaChange={this.onChangeTooltip}*/}
					{/*	headerComponent={e => {*/}
					{/*		return (*/}
					{/*			<AppointmentTooltip.Header*/}
					{/*				className="header-tooltip"*/}
					{/*				{...e}*/}
					{/*				onDeleteButtonClick={() =>*/}
					{/*					this.handleDelete({id: e.appointmentData.id, hide: e.onHide})*/}
					{/*				}*/}
					{/*				onOpenButtonClick={() => this.handleEdit(e.appointmentData)}*/}
					{/*			>*/}
					{/*				{e.appointmentData.__meta__?.interacoes_count !== "0" && (*/}
					{/*					<div className="extra-tooltip">*/}
					{/*						<WechatOutlined onClick={() => this.handleChat({data: e.appointmentData, hide: e.onHide})} style={{marginTop: 14, fontSize: 19, marginLeft: 15, color: "#555"}} />*/}
					{/*					</div>*/}
					{/*				)}*/}

					{/*			</AppointmentTooltip.Header>*/}
					{/*		);*/}
					{/*	}}*/}
					{/*	showCloseButton*/}
					{/*	showOpenButton*/}
					{/*	showDeleteButton={user.department_id === "administrador"}*/}
					{/*	visible={showTooltip}*/}
					{/*	onVisibilityChange={this.onChangeTooltioVisibility}*/}
					{/*	appointmentMeta={tooltip}*/}
					{/*	contentComponent={this._renderTooltip}*/}
					{/*/>*/}
					<AppointmentForm
						visible={false}
						onAppointmentDataChange={this.onAppointmentCreate}
					/>
				</Scheduler>
				<Modal destroyOnClose onCancel={this.modalClose} width={400} footer={null} closable={false} wrapClassName="modal_appointment" centered visible={tooltip ? true : false} style={{ borderRadius: 10 }} bodyStyle={{ borderRadius: 10 }}>
					{this._renderTooltip(tooltip?.data)}
				</Modal>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		// selectDate       : (props) => {
		// 	dispatch({
		// 		type   : "SELECTED_DATE",
		// 		payload: props
		// 	})
		// },
		handleChat: (props) => {
			dispatch({
				type: "OPEN_CHAT",
				payload: props
			})
		},
		changeAppointment: (props) => {
			dispatch({
				type: "CHANGE_APPOINTMENT",
				payload: props
			})
		}
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

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Agenda)