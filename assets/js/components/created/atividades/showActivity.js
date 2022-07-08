import React, { Component, Fragment } from "react"
import { Button, Checkbox, DatePicker, Drawer, Form, Input, Select, Tabs, Timeline, TimePicker, Tooltip } from "antd";
import Item from "~/components/created/atividades/item";
import { BarsOutlined, ClockCircleOutlined, FileTextOutlined, LinkOutlined, MinusCircleOutlined, PlusCircleOutlined, UserOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { ATextArea, ContainerFooterDrawer, ModifyHoursContainer, NotasContainer, NoteItem, RowContainer } from "./styles";
import { convertDate } from "~/modules/Util";
import moment from "moment";
import { show, store, update } from "~/services/controller";
import { UILoading, UITable } from "~/components/created/UISerriu";
import InputMask from "~/utils/mask";
import { connect } from "react-redux";

const { TabPane } = Tabs

class ShowActivity extends Component {
	constructor(props) {
		super(props)

		this.formNote = React.createRef();

		this.state = {
			isLoading: true,
			data: {},
			visible: false,
			tab: "1",
			id: null,
			conclued: false,
			agendamentos: {
				passados: [],
				futuros: []
			},
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
		}
	}

	componentWillUnmount() {
		this.cleanState()
	}

	cleanState = () => {
		this.setState({
			isLoading: true,
			data: {},
			visible: false,
			tab: "1",
			id: null,
			conclued: false,
			agendamentos: {
				passados: [],
				futuros: []
			},
		})
	}

	loadAll = (id) => {
		this.setState({ visible: true, id, })

		show("atividades", id).then(({ data }) => {
			this.setState({
				data: {
					...data,
					has_assigned: data.has_assigned?.map(item => item.id),
				},
				conclued: data.conclued,
				isLoading: false
			})

			if (data.has_agendamentos) {
				let passados = data.has_agendamentos.filter((item) => moment(item.startDate) < moment())
				let futuros = data.has_agendamentos.filter((item) => moment(item.startDate) > moment())

				this.setState({
					agendamentos: {
						passados,
						futuros
					}
				})
			}

		})

	}

	returnDisabledDateEdit = (data, verifyAdmin) => {
		if (!data) {
			return false
		}

		if (verifyAdmin) {
			if (this.props.isAdmin) {
				return false
			}
		}

		if (data.conclued) {
			return true
		}

		if (data?.has_notes?.length === 0) {
			return true
		}

		const createdLastNote = data?.has_notes[0]?.created_at

		return moment(createdLastNote) < moment().subtract(5, "minutes");
	}

	onShow = () => {
		this.setState({
			visible: true
		})
	}

	onClose = () => {
		this.cleanState()
	}

	changeDate = (date) => {
		this.setState(state => ({
			data: { ...state.data, dueDate: date }
		}))
	}

	changeRecurrence = (value) => {
		this.setState(state => ({
			data: { ...state.data, recurrence: value }
		}))
	}

	modifyDate = (action) => {
		let currentDate = moment(this.state.data.dueDate)

		if (action == "add") {
			currentDate.add(1, "hour")
		}
		else {
			currentDate.subtract(1, "hour")
		}

		this.setState(state => ({
			data: { ...state.data, dueDate: currentDate }
		}))
	}

	changeAssigned = (data) => {
		this.setState(state => ({
			data: { ...state.data, has_assigned: data }
		}))
	}

	changeConclued = (e) => {
		this.setState(state => ({
			conclued: e.target.checked
		}))
	}

	changeSubject = (e) => {
		this.setState(state => ({
			data: { ...state.data, subject: e.target.value }
		}))
	}

	changeDescription = (e) => {
		this.setState(state => ({
			data: { ...state.data, description: e.target.value }
		}))
	}

	onUpdateActivity = (id) => {
		update("/atividades", id, {
			dueDate: this.state.data.dueDate,
			conclued: this.state.conclued,
			assigneds: this.state.data.has_assigned,
			subject: this.state.data.subject,
			description: this.state.data.description,

		}).then((data) => {
			this.setState({
				visible: false,
				id: null,
			})
			// this.setState({
			// 	data: {},
			// })
			this.props.reloadAll()
		})
	}

	saveNote = (values) => {
		console.log(values)
		store("notasAtividade", values).then((data) => {
			this.formNote.current.resetFields()
			this.loadAll(this.state.id)
		})
	}

	render() {
		const { data, agendamentos, conclued, users, isLoading, visible, optionsRecurrence } = this.state

		return (
			<Drawer
				visible={visible}
				destroyOnClose
				closable={false}
				onClose={this.onClose}
				width={(window.screen.width / 100) * 60}
				title={
					<Tabs onChange={(e) => {
						this.setState({ tab: e })
					}}>
						<TabPane tab={
							<span style={{ display: "flex", "justify-content": "center", "align-items": "center" }}>
								<BarsOutlined />
								Atividade
							</span>
						} key="1" />
						{data?.has_paciente &&
							<TabPane tab={
								<span style={{ display: "flex", "justify-content": "center", "align-items": "center" }}>
									<UserOutlined />
									{data?.person}
								</span>
							} key="2" />
						}
					</Tabs>
				}
				footer={
					<Fragment>
						{
							!this.state.isLoading && (
								<ContainerFooterDrawer>
									<span>Criado {convertDate(data?.created_at)} - {data?.has_creator ? data?.has_creator.firstName : "API"}</span>

									<div className="container-buttons">
										<div className="check-container"><Checkbox disabled={this.returnDisabledDateEdit(data, true)} checked={conclued} defaultChecked={false} onChange={this.changeConclued} /> Marcar como feito</div>

										<Button onClick={this.onClose}>Cancelar</Button>
										<Button disabled={conclued && this.props.isAdmin === false} onClick={() => this.onUpdateActivity(data?.id)} type="primary">Salvar</Button>
									</div>

								</ContainerFooterDrawer>
							)
						}
					</Fragment>
				}>
				{
					this.state.isLoading ? (
						<UILoading />
					) : (
						<Fragment>
							{
								this.state.tab === "1" ? (
									<div style={{ display: "flex", flexDirection: "column" }}>
										<Item
											icon={<Tooltip title="Assunto"><BarsOutlined /></Tooltip>}
										>
											<Input
												style={{ width: '100%' }}
												disabled={this.state.isSending || data?.conclued}
												placeholder="Assunto"
												value={this.state.data?.subject}
												onChange={this.changeSubject}

											/>
										</Item>
										<Item
											icon={<Tooltip title="Descrição"><FileTextOutlined /></Tooltip>}
										>
											<ATextArea rows='4' disabled={this.state.isSending || data?.conclued} onChange={this.changeDescription} className="text-area-background" value={data.description} />
										</Item>

										<Item
											icon={<Tooltip title="Quem vai executar?"><LinkOutlined /></Tooltip>}
										>
											<Select
												mode="multiple"
												style={{ width: '100%' }}
												disabled={this.state.isSending || data?.conclued}
												placeholder="Atribuído a quem"
												// style={this.props.style}
												value={this.state.data?.has_assigned}
												showArrow={false}
												onChange={this.changeAssigned}
												allowClear
												notFoundContent={null}
												options={
													this.props.users.map(item => {
														return {
															label: `${item.firstName} ${item.lastName}`,
															value: item.id
														}
													})
												}
											/>
										</Item>
										<Item
											icon={<Tooltip title="Vencimento da tarefa"><ClockCircleOutlined /></Tooltip>}
										>
											<DatePicker format="DD-MM-YYYY" onChange={this.changeDate} disabled={this.returnDisabledDateEdit(data)} defaultValue={moment()} value={moment(this.state.data?.dueDate)} />
											<TimePicker minuteStep={15} onChange={this.changeDate} disabled={this.returnDisabledDateEdit(data)} style={{ marginLeft: 10 }} defaultValue={moment()} value={moment(this.state.data?.dueDate)} format="HH:mm" />
											{!this.returnDisabledDateEdit(data) && <ModifyHoursContainer>
												<PlusCircleOutlined onClick={() => this.modifyDate("add")} />
												<MinusCircleOutlined onClick={() => this.modifyDate()} />
											</ModifyHoursContainer>}
										</Item>

										<Item
											icon={<Tooltip title="Recorrência"><UserSwitchOutlined /></Tooltip>}
										>
											<Select
												allowClear
												disabled
												placeholder="Recorrência"
												onChange={this.changeRecurrence}
												value={this.state.data?.recurrence}
												options={this.state.optionsRecurrence}
											/>
										</Item>

										<NotasContainer>
											<Item
												icon={<Tooltip title="Notas"><FileTextOutlined /></Tooltip>}
											>
												<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
													<Form ref={this.formNote} onFinish={(values) => this.saveNote({ ...values, atividade_id: data.id })}>
														<Form.Item name="description">
															<ATextArea rows='3' disabled={data.conclued} placeholder="Adicionar nova nota" />
														</Form.Item>
														<div style={{ display: "flex", justifyContent: "flex-end", marginTop: -10 }}>
															<Button disabled={data.conclued} htmlType="submit" type="primary">Adicionar</Button>
														</div>
													</Form>
												</div>
											</Item>

											<Timeline>
												{data.has_notes.map((item, index) => {
													return (
														<Timeline.Item key={index} color="#c8c8c8">
															<NoteItem>
																<span className="name-notes">
																	{convertDate(item.created_at)} - {item.has_creator?.firstName}
																</span>
																<span className="description-notes">
																	{item.description}
																</span>
															</NoteItem>
														</Timeline.Item>
													)
												})}
											</Timeline>

										</NotasContainer>
									</div>
								) : (
									<div style={{ display: "flex", flexDirection: "column" }}>
										{
											data.has_paciente && (
												<Fragment>
													<Form layout="vertical">
														<RowContainer>
															<Form.Item style={{ width: "100%" }} label="Nome">
																<Input value={data.has_paciente?.firstName} />
															</Form.Item>
															<Form.Item style={{ width: "100%", marginLeft: 10 }} label="Sobrenome">
																<Input value={data.has_paciente?.lastName} />
															</Form.Item>
															<Form.Item style={{ width: "100%", marginLeft: 10 }} label="Telefone">
																<InputMask
																	mask="(99) 99999-9999"
																	maskPlaceholder={null}
																	// onChange={e => setData({ ...data, tel: e.target.value })}
																	value={data.has_paciente?.tel}
																/>
															</Form.Item>
														</RowContainer>
													</Form>
													<span style={{ textAlign: "center", fontWeight: "bold" }}>Planejado</span>
													<UITable
														showHeader={false}
														titleTable="Planejado"
														columns={[
															{
																// title : "Data agend.",
																render: data => (
																	<div>{moment(data.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
																		{moment(data.endDate).format("LT")}</div>
																)
															},
															{
																// title : "Profissional",
																render: data => (
																	<div>{data.dentista ? data.dentista.firstName : '-'}</div>
																)
															},
															{
																// title    : "Status",
																dataIndex: 'status'
															},
														]}
														dataSource={agendamentos.futuros}
														rowKey="id"
														pagination={false}
														loading={this.state.isLoading}
														size="small"
														rowClassName={this.rowClass}
													/>

													<span style={{ marginTop: 20, textAlign: "center", fontWeight: "bold" }}>Concluído</span>
													<UITable
														showHeader={false}
														titleTable="Concluído"
														columns={[
															{
																// title : "Data agend.",
																render: data => (
																	<div>{moment(data.startDate).format("DD/MM/YYYY HH:mm")} -{" "}
																		{moment(data.endDate).format("LT")}</div>
																)
															},
															{
																// title : "Profissional",
																render: data => (
																	<div>{data.dentista ? data.dentista.firstName : '-'}</div>
																)
															},
															{
																// title    : "Status",
																dataIndex: 'status'
															},
														]}
														dataSource={agendamentos.passados}
														rowKey="id"
														pagination={false}
														loading={this.state.isLoading}
														size="small"
														rowClassName={this.rowClass}
													/>
												</Fragment>
											)
										}
									</div>
								)
							}
						</Fragment>
					)
				}
			</Drawer>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		isAdmin: state.auth.userData.department_id === "administrador",
	};
};

export default connect(mapStateToProps, null, null, { forwardRef: true })(ShowActivity)