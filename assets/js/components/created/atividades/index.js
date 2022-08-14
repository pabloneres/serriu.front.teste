import React, { Component, Fragment, useState, useRef, useContext, useEffect } from "react"
import { Button, Checkbox, DatePicker, Form, Input, List, Select, Table, Tabs, TimePicker, Tooltip, Popover, Popconfirm, Timeline, Dropdown } from 'antd'
import moment from 'moment'
import Drawer from "./drawer"
import Item from "./item"
import ShowActivity from "./showActivity"
import { BarsOutlined, CheckOutlined, ClockCircleOutlined, EditOutlined, FileTextOutlined, LinkOutlined, UserOutlined, UserSwitchOutlined, MinusCircleOutlined, WhatsAppOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Container, ContainerFooterDrawer, CreatorText, EditFieldContainer, NotasContainer, NoteList, ATextArea, NoteItem, ModifyHoursContainer, Filter, ContainerFilters } from './styles'
import { UIButton, UICard, UITable, UIModal, UIPopover } from "~/components/created/UISerriu";
import { index, store, show, update, destroy } from "~/services/controller";
import { connect } from "react-redux";
import Notify from "~/services/notify";
import { convertDate } from "~/modules/Util";
import replaceNumber from "~/helpers/replaceNumber";
import EditData from "~/components/created/atividades/editData";
import EditDataPerson from "~/components/created/atividades/editDataPerson";
import UIDropdown from "~/components/created/UISerriu/Dropdown";
import locale from "antd/es/date-picker/locale/pt_BR";
import notifications from "~/store/modules/notifications/reducer";

const EditableContext = React.createContext(null);

const { TextArea } = Input
const { TabPane } = Tabs
const { RangePicker } = DatePicker;

class Atividades extends Component {
	constructor(props) {
		super(props)

		this.form = React.createRef();
		this.formNote = React.createRef();

		this.state = {
			filter: "hoje",
			isLoading: true,
			isSending: false,
			drawerTitle: null,
			drawerContent: null,
			drawerFooter: null,
			fields: {
				personType: "Paciente"
			},
			data: [],
			dataActivity: {
				dueDate: moment(),
			},
			columns: [
				{
					title: "Assunto",
					render: data => (
						<div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
							{this.props.user.id === data.creator && (
								<Tooltip title="Proprietário">
									<UserOutlined style={{ marginRight: 5 }} />
								</Tooltip>
							)}
							<span onClick={() => this.onSelectItem(data)} style={{ cursor: "pointer" }}>{data.subject}</span>
						</div>
					)
				},
				{
					title: "Pessoa de contato",
					width: 240,
					render: data => (
						<EditDataPerson data={data} reload={this.loadAll} />
					)
				},

				{
					title: "Teleofne",
					width: 200,
					render: data => (
						<EditData data={data} reload={this.loadAll} />
					)
				},
				{
					title: "Vencimento",
					dataIndex: "dueDate",
					render: data => (
						<div style={{ display: "flex", alignItems: "center" }}>
							<span>
								{convertDate(data)}
							</span>
							<ClockCircleOutlined
								style={{
									fontSize: 16,
									marginLeft: 10
								}}
							/>
						</div>
					)
				},
				{
					title: "Ações",
					render: data => (
						<div>
							{this.props.isAdmin ? <Popconfirm title="Deseja excluir atividade ?" onConfirm={() => this.onDelete(data.id)}>
								<DeleteOutlined style={{ fontSize: 20 }} />
							</Popconfirm> :
								<DeleteOutlined style={{ fontSize: 20, color: "#a2a2a2" }} />
							}
						</div>
					)
				}
			],
			optionsPatient: [],
			typingTimer: null,
			doneTypingInterval: 1200,
			patients: [],
			users: [],
			patient: [],
			searchText: null,
			optionsRecurrence: [
				{
					label: "Diário",
					value: 'diario',
				},
				{
					label: "Semanal",
					value: 'semanal',
				},
				{
					label: "Mensal",
					value: 'mensal',
				},
				{
					label: "Trimestral",
					value: 'trimestral',
				},
				{
					label: "Semestral",
					value: 'semestral',
				},
				{
					label: "Anual",
					value: 'anual',
				},
			],
			filters: {
				type: "hoje"
			},
			tab: "1",
			loadId: null
		}
	}

	componentDidMount() {
		this.loadAll()

		this.props.updateAtividades(0)
	}

	loadAll = () => {
		this.setState({
			isLoading: true
		})

		index("atividades", { clinica_id: this.props.clinic.id, ...this.state.filters }).then((response) => {
			this.setState({
				data: response.data,
				isLoading: false
			})
		}).catch(() => {
			Notify("error", "Erro ao carregar as atividades")
		})

		index("users").then((response) => {
			this.setState({
				users: response.data
			})
		})
	}

	onDelete = (id) => {
		if (!this.props.isAdmin) {
			return false
		}

		destroy("atividades", id).then((data) => {
			Notify("success", "Atividade excluida!")
			this.loadAll()
		}).catch((data) => {
			Notify("error", "Erro ao excluir a atividade!", "Contate o suporte")
		})
	}

	saveNote = (values) => {
		store("notasAtividade", {
			...values,
		}).then((data) => {
			this.formNote.current.resetFields()
			this.loadActivity(values.atividade_id)
		})
	}

	onUpdateActivity = (id) => {
		update("/atividades", id, {
			dueDate: this.state.dataActivity.dueDate,
			conclued: this.state.dataActivity.conclued,
			assigneds: this.state.dataActivity.has_assigned,
			subject: this.state.dataActivity.subject,
			description: this.state.dataActivity.description,

		}).then((data) => {
			this.drawer.onClose()
			this.setState({
				dataActivity: null,
				drawerTitle: null,
				drawerContent: null,
				drawerFooter: null,
			})
			this.loadAll()
		})
	}

	loadActivity = (id) => {
		this.showActivity.loadAll(id)
	}

	onClose = () => {
		this.drawer.onClose()
		this.setState({
			dataActivity: null,
			drawerTitle: null,
			drawerContent: null,
			drawerFooter: null,
		})
	}

	onSelectItem = (data) => {
		this.loadActivity(data.id)
	}

	search = (e, type = "patient") => {
		clearTimeout(this.typingTimer)
		this.setState({
			typingTimer: setTimeout(() => this.doneTyping(e, type), this.state.doneTypingInterval)
		})
	}

	doneTyping = (e, type) => {
		this.setState({
			searchText: e
		})

		let save = type === "patient" ? "patients" : type

		index(type, { id: this.props.clinic.id, name: e })
			.then((data) => {
				this.setState({
					[save]: data
				})
			})
	}

	// changeAssigned = (values) => {
	// 	update("/atividades", id, {
	// 		assigneds: values,
	// 	}).then((data) => {
	// 		this.drawer.onClose()
	// 		this.setState({
	// 			dataActivity : null,
	// 			drawerTitle  : null,
	// 			drawerContent: null,
	// 			drawerFooter : null,
	// 		})
	// 		this.loadAll()
	// 	})
	// }

	changeDate = (date) => {
		this.setState(state => ({
			dataActivity: { ...state.data, dueDate: moment(date) }
		}))
	}

	modifyDate = (action) => {
		let currentDate = moment(this.state.dataActivity.dueDate)

		if (action == "add") {
			currentDate.add(1, "hour")
		}
		else {
			currentDate.subtract(1, "hour")
		}

		this.setState(state => ({
			dataActivity: { ...state.dataActivity, dueDate: currentDate }
		}))
	}

	onCreateActivity = () => {
		this.setState({
			drawerTitle: "Adicionar atividade",
			drawerContent: () => (
				<div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
					<div style={{ display: "flex", flex: 1 }}>
						<Form style={{ width: '100%' }} ref={this.form} onFinish={this.onSubmit}>

							<Item
								icon={<Tooltip title="Assunto da tarefa"><FileTextOutlined /></Tooltip>}
							>
								<Form.Item name="subject" rules={[{ required: true, message: "Campo Obrigatorio!" }]}>
									<Input
										disabled={this.state.isSending} placeholder="Assunto da tarefa" />
								</Form.Item>
							</Item>

							<Item
								icon={<Tooltip title="Vencimento da tarefa"><ClockCircleOutlined /></Tooltip>}
							>

								{/*<DatePicker defaultValue={moment()} disabled={this.state.isSending} style={{marginRight: 10}} format="DD/MM/YYYY HH:mm" showTime={{defaultValue: moment('00:00:00', 'HH:mm:ss')}} />*/}
								<DatePicker format="DD-MM-YYYY" onChange={this.changeDate} disabled={this.state.isSending} defaultValue={moment()} value={moment(this.state.dataActivity?.dueDate)} />
								<TimePicker minuteStep={15} onChange={this.changeDate} disabled={this.state.isSending} style={{ marginLeft: 10 }} defaultValue={moment()} value={moment(this.state.dataActivity?.dueDate)} format="HH:mm" />
								<ModifyHoursContainer>
									<PlusCircleOutlined onClick={() => this.modifyDate("add")} />
									<MinusCircleOutlined onClick={() => this.modifyDate()} />
								</ModifyHoursContainer>

							</Item>

							<Item
								icon={<Tooltip title="Tipo de pessoa"><UserSwitchOutlined /></Tooltip>}
							>
								<Form.Item name="typePerson" required>
									<Select
										disabled={this.state.isSending}
										placeholder="Paciente ou lead"
										onChange={e => this.setState(state => ({ fields: { ...state.fields, personType: e } }))}
										value={this.state.fields?.personType}
										options={[
											{
												label: "Paciente",
												value: "Paciente"
											},
											{
												label: "Lead",
												value: "Lead"
											}
										]}
									/>
								</Form.Item>
							</Item>

							<Item
								icon={<Tooltip title="Recorrência"><UserSwitchOutlined /></Tooltip>}
							>
								<Form.Item name="recurrence">
									<Select
										allowClear
										disabled={this.state.isSending}
										placeholder="Recorrência"
										onChange={e => this.setState(state => ({ fields: { ...state.fields, recurrence: e } }))}
										value={this.state.fields?.recurrence}
										options={this.state.optionsRecurrence}
									/>
								</Form.Item>
							</Item>

							<Item
								icon={<Tooltip title="Nome do paciente"><UserOutlined /></Tooltip>}
							>
								<Form.Item name="paciente_id">
									<Select
										disabled={this.state.isSending}
										showSearch
										placeholder="Buscar paciente"
										// style={this.props.style}
										showArrow={false}
										onChange={this.handleChange}
										filterOption={false}
										onSearch={(e) => this.search(e)}
										allowClear
										notFoundContent={null}
										options={
											this.state.patients.map(item => {
												return {
													label: `${item.firstName} ${item.lastName}`,
													value: item.id
												}
											})
										}
									/>
								</Form.Item>
							</Item>

							<Item
								icon={<Tooltip title="Quem vai executar?"><LinkOutlined /></Tooltip>}
							>
								<Form.Item name="assigneds" required={true}>
									<Select
										required
										mode="multiple"
										style={{ width: '100%' }}
										disabled={this.state.isSending}
										placeholder="Atribuído a quem"
										// style={this.props.style}
										value={this.state.dataActivity?.assigned}
										showArrow={false}
										onChange={this.changeAssigned}
										notFoundContent={null}
										options={[
											{
												label: "Todos",
												value: 0
											},
											...this.state.users.map(item => {
												return {
													label: `${item.firstName} ${item.lastName}`,
													value: item.id
												}
											}),

										]}
									/>
								</Form.Item>
							</Item>

							<Item
								icon={<Tooltip title="Descrição"><FileTextOutlined /></Tooltip>}
							>
								<Form.Item name="description" rules={[{ required: true, message: "Campo Obrigatorio!" }]}>
									<ATextArea rows="3" disabled={this.state.isSending} placeholder="Descrição" />
								</Form.Item>
							</Item>

							<ContainerFooterDrawer>

								<Button onClick={this.onClose}>Cancelar</Button>
								<Button type="primary" htmlType="submit">Salvar</Button>

							</ContainerFooterDrawer>

						</Form>
					</div>

				</div>
			)
		})
		this.drawer.onShow()
	}

	onSubmit = (values) => {

		this.setState({
			isSending: true
		})

		store("atividades", {
			...values,
			clinica_id: this.props.clinic.id,
			...this.state.dataActivity
		}).then((data) => {
			this.form.current?.resetFields()
			this.drawer.onClose()
			this.setState({
				isSending: false,
				drawerTitle: null,
				drawerContent: null,
				drawerFooter: null,
			})

			this.loadAll()
		}).catch(() => {
			Notify("error", "Erro ao salvar a atividade")
		})
	}

	rowClass = e => {
		if (e.conclued) {
			return "activity_conclued"
		}

		if (moment(e.dueDate) < moment()) {
			return "activity_vencida"
		}
	}

	handleFilter = (type) => {
		let filters = this.state.filters
		delete filters.date;

		filters.type = type

		this.setState(state => ({
			filters: { ...filters }
		}), () => {
			this.loadAll()
		})
	}

	handleChangeDate = e => {
		if (!e) {
			let filters = this.state.filters
			delete filters.date;

			this.setState({
				filters: { ...filters, type: "hoje" }
			}, () => {
				this.loadAll()
			})

			return;
		}

		let filters = this.state.filters

		delete filters.type

		let start = e[0].format("YYYY-MM-DD");
		let end = e[1].format("YYYY-MM-DD");

		this.setState(state => ({
			filters: { ...filters, date: [start, end] }
		}), () => {
			this.loadAll()
		})
		return this.dropdown.onHide()
	}

	render() {
		const { isAdmin } = this.props

		return (
			<Container>
				<UICard
					title="Atividades"
					extra={
						<div style={{ display: "flex", justifyContent: "space-between", width: "100%", flex: 1 }}>
							<ContainerFilters>
								<Filter
									active={this.state.filters.type === "withRecurrence"}
									onClick={() => {
										this.handleFilter("withRecurrence")
									}}
								>
									Atividades recorrentes
								</Filter>

								<Filter
									style={{ paddingRight: this.props.notifications?.atividades?.vencidas > 0 ? 30 : 10 }}
									active={this.state.filters.type === "vencido"}
									onClick={() => {
										this.handleFilter("vencido")
									}}
								>
									Vencidos
									{this.props.notifications?.atividades?.vencidas > 0 &&
										<div className={`${this.props.notifications?.atividades?.vencidas > 0 ? 'fa-beat-fade' : ''}`} style={{ width: 18, height: 18, borderRadius: "50%", background: this.props.notifications?.atividades?.vencidas > 0 ? "#ff4d4f" : "green", position: "absolute", right: 5, top: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
											<span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>{this.props.notifications?.atividades?.vencidas}</span>
										</div>
									}
								</Filter>

								<Filter
									style={{ paddingRight: this.props.notifications?.atividades?.novas > 0 ? 30 : 10 }}
									active={this.state.filters.type === "hoje"}
									onClick={() => {
										this.handleFilter("hoje")
									}}
								>
									Hoje
									{this.props.notifications?.atividades?.novas > 0 &&
										<div className={`${this.props.notifications?.atividades?.vencidas > 0 ? 'fa-beat-fade' : ''}`} style={{ width: 18, height: 18, borderRadius: "50%", background: this.props.notifications?.atividades?.vencidas > 0 ? "#ff4d4f" : "green", position: "absolute", right: 5, top: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
											<span style={{ color: "#fff", fontSize: 10, lineHeight: 1 }}>{this.props.notifications?.atividades?.novas}</span>
										</div>
									}
								</Filter>

								<Filter
									active={this.state.filters.type === "amanha"}
									onClick={() => {
										this.handleFilter("amanha")
									}}
								>
									Amanhã
								</Filter>

								<UIDropdown
									ref={el => this.dropdown = el}
									overlay={<RangePicker onClick={e => e.preventDefault()} locale={locale} onChange={this.handleChangeDate} />
									}>
									<Filter>
										Selecione o período
									</Filter>
								</UIDropdown>

							</ContainerFilters>
						</div>
					}
					button={<Button onClick={(this.onCreateActivity)} type="primary">Adicionar</Button>}
				>
					<UITable
						columns={this.state.columns}
						dataSource={this.state.data}
						rowKey="id"
						pagination={false}
						loading={this.state.isLoading}
						size="small"
						rowClassName={this.rowClass}
					/>
				</UICard>
				<ShowActivity ref={el => this.showActivity = el} users={this.state.users} reloadAll={this.loadAll} />
				<Drawer
					ref={el => this.drawer = el}
					width={(window.screen.width / 100) * 60}
					title={this.state.drawerTitle}
					footer={this.state.drawerFooter && this.state.drawerFooter()}
				>
					{this.state.drawerContent && this.state.drawerContent()}
				</Drawer>
				<UIModal
					ref={el => this.modal = el}
				></UIModal>
			</Container>
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
		}),
		updateAtividades: (data) => dispatch({
			type: 'UPDATE_ATIVIDADE',
			payload: data
		})

	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		isAdmin: state.auth.userData.department_id === "administrador",
		user: state.auth.userData,
		clinic: state.clinic.selectedClinic,
		settings: state.settings,
		agenda: state.agenda,
		notifications: state.notifications,

	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(Atividades)