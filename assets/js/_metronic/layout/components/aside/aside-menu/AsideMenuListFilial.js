/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, { Component, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch, connect } from "react-redux";
import { checkIsActive, toAbsoluteUrl } from "../../../../_helpers";
import { Badge, Tooltip } from 'antd'
import { CalendarOutlined, ClockCircleOutlined, ContainerOutlined, DesktopOutlined, DollarOutlined, InfoCircleOutlined, MenuOutlined, RobotOutlined, ScheduleOutlined, SmileOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons";
import permissions from "~/services/permissions";
import connection from '~/services/socket';

let subscription;

var alert_ico = toAbsoluteUrl("/media/logos/favicon_alert.ico");
var ico = toAbsoluteUrl("/media/logos/favicon.ico");

class AsideMenuListFilial extends Component {
	constructor(props) {
		super(props);

		this.state = {
			menuOptions: [
				// {
				// 	title: "Dashboard",
				// 	icon : <MenuOutlined />,
				// 	role : "dashboard",
				// 	to   : "/dashboard"
				// },
				{
					title: "Meus dados",
					icon: <UserOutlined />,
					role: "profile",
					to: "/profile"
				},
				// {
				// 	title: "Administrador",
				// 	icon: <RobotOutlined />,
				// 	role: "administrador",
				// 	to: null,
				// 	children: [
				// 		{
				// 			title: "Clinicas",
				// 			role: "clinics",
				// 			to: "/clinicas"
				// 		},
				// 		{
				// 			title: "Cargos",
				// 			role: "cargos",
				// 			to: "/cargos"
				// 		},
				// 		{
				// 			title: "Equipamentos",
				// 			role: "esps",
				// 			to: "/esps"
				// 		}
				// 	]
				// },
				{
					title: "Agenda",
					icon: <CalendarOutlined />,
					if: ["selectedClinic"],
					role: "schedule",
					to: "/agenda"
				},
				{
					title: "Recepção Virtual",
					icon: <ClockCircleOutlined />,
					if: ["recepcao"],
					role: "recepcao",
					to: "/recepcao"
				},
				{
					title: "Pacientes",
					icon: <SmileOutlined />,
					if: ["selectedClinic"],
					role: "patients",
					to: "/pacientes"
				},
				{
					title: "Monitoramento",
					icon: <DesktopOutlined />,
					if: ["selectedClinic"],
					role: "monitoramento",
					to: "/monitoramento"
				},
				{
					title: "Leads",
					icon: <ContainerOutlined />,
					if: ["selectedClinic"],
					role: "leads",
					to: "/leads"
				},
				{
					title: "Atividade",
					icon: <ScheduleOutlined />,
					if: ["selectedClinic"],
					role: "atividades",
					to: "/atividades",
					notification: "atividades"
				},
				{
					title: "Financeiro",
					icon: <DollarOutlined />,
					if: ["selectedClinic"],
					role: "financial",
					to: "/financeiro",
					children: [
						{
							title: "Caixa Principal",
							role: "caixaprincipal",
							to: "/caixa/principal"
						},
						{
							title: "Comissionamento",
							role: "comission",
							to: "/financeiro"
						},
						{
							title: "Fluxo de Caixa",
							role: "fluxo",
							to: "/fluxo"
						},
						{
							title: "Caixas",
							role: "caixa",
							to: "/caixas"
						},
						{
							title: "Laboratório",
							role: "lab",
							to: "/laboratorio"
						}
					]
				},
				{
					title: "Usúarios",
					icon: <UserOutlined />,
					role: "users",
					to: null,
					children: [
						{
							title: "Adicionar usuário",
							role: "addUser",
							to: "/usuario/adicionar"
						},
						{
							title: "Dentistas",
							role: "dentists",
							to: "/dentista"
						},
						{
							title: "Recepcionistas",
							role: "recepcionist",
							to: "/recepcionista"
						}
					]
				},
				// {
				// 	title: "Informações",
				// 	icon : <InfoCircleOutlined />,
				// 	if   : ["selectedClinic"],
				// 	role : "infos",
				// 	to   : "/informacoes"
				// },
				{
					title: "Configurações",
					icon: <ToolOutlined />,
					role: "settings",
					if: ["selectedClinic"],
					to: null,
					children: [
						{
							title: "Geral",
							to: "/configuracao_geral",
							role: ""
						},
						{
							title: "Tabela de Preços",
							to: "/tabela-precos",
							role: ""
						},
						{
							title: "Tabela de Especialidades",
							to: "/tabela-especialidades",
							role: ""
						},
						{
							title: "Laboratórios",
							to: "/laboratorios",
							role: ""
						},
						{
							title: "Equipamentos",
							to: "/equipamentos",
							role: ""
						},
						{
							title: "Relatorios",
							to: "/relatorios",
							role: ""
						}
						// {
						//   title: "Lixeira",
						//   to: "/lixeira",
						//   role: "trash"
						// }
					]
				}
			],
			atividades: {
				novas: 0,
				vencidas: 0
			}
		}
	}

	componentDidMount() {
		connection.connect();
		subscription = connection.subscribe(`atividades:${this.props.user.id}`, this.handleMessage);
	}

	handleMessage = message => {

		const { type, data } = message;

		this.setState(state => ({
			atividades: data
		}))

		this.props.updateAtividades({
			...data,
			total: data.novas + data.vencidasPassadas
		})

		document.title = data.vencidas > 0 ? `(${data.vencidas}) Serriu` : `Serriu`

		// if (data.vencidas > 0) {
		// 	document.getElementById('favicon').href = alert_ico;
		// }
		// else {
		// 	document.getElementById('favicon').href = ico;
		// }

	}

	_renderMenu = (menu, index) => {
		return (
			<li
				key={index}
				className={`menu-item menu-item-submenu ${this.getMenuItemActive(
					menu.to,
					false
				)}`}
				aria-haspopup="true"
				data-menu-toggle="hover"
			>
				<Tooltip zIndex={9} title={menu.title} placement="right">
					{
						menu.to ? (
							<NavLink className="menu-link menu-toggle" to={menu.to} onClick={() => this.props.onSelectMenu(menu)}>
								<span className="svg-icon menu-icon">
									{menu.icon}
									{/* <SVG style={{ "fill": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Design/users.svg")} /> */}
								</span>
								<span className="menu-text">{menu.title}</span>
								{menu.children ? <i className="menu-arrow"></i> : ""}
							</NavLink>
						) : (
							<div className="menu-link menu-toggle" onClick={() => this.props.onSelectMenu(menu)}>
								<span className="svg-icon menu-icon">
									{menu.icon}
									{/* <SVG style={{ "fill": "#3699FF" }} src={toAbsoluteUrl("/media/svg/icons/Design/users.svg")} /> */}
								</span>
								<span className="menu-text">{menu.title}</span>
								{menu.children ? <i className="menu-arrow"></i> : ""}
							</div>
						)
					}
				</Tooltip>
				{
					this._returnAlert(menu) && (
						<div className={`${this.props.notifications?.atividades?.total > 0 ? 'fa-beat-fade' : ''}`} style={{ width: 22, height: 22, borderRadius: "50%", background: this.props.notifications?.atividades?.vencidas > 0 ? "#ff4d4f" : "green", position: "absolute", right: 6, top: 5, display: "flex", justifyContent: "center", alignItems: "center" }}>
							<span style={{ color: "#fff", fontSize: 13, lineHeight: 1 }}>{this.props.notifications?.atividades?.total}</span>
						</div>
					)

				}
			</li>
		);
	};

	_returnAlert = (menu) => {
		if (!menu.notification) {
			return false
		}

		if (this.props.notifications?.atividades?.novas > 0) {
			return true
		}
		else {
			if (this.props.notifications?.atividades?.vencidas > 0) {
				return true
			}
		}
		return false
	}

	getMenuItemActive = (url, hasSubmenu = false) => {
		// return checkIsActive(this.location, url)
		// 	? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
		// 	: "";
	};

	ifs = {
		selectedClinic: Object.keys(this.props.clinic).length === 0 ? true : false
	};

	permitied = role => {
		return role.map(cond => this.ifs[cond]);
	};

	_returnMenu = (menu, index) => {
		if (menu.if) {
			return this.permitied(menu.if)[0] === true ? <></> : this._renderMenu(menu, index);
		}
		return this._renderMenu(menu, index);
	};

	returnMenu = () => {
		const { user } = this.props
		if (user.department_id && permissions[user.department_id]) {
			return this.state.menuOptions.filter(
				item => permissions[user.department_id].indexOf(item.role) !== -1
			);
		}
	};

	render() {
		return (
			<ul
				// style={{height: '100%', display: 'flex', flexDirection: 'column'}}
				className={`menu-nav`}
			>
				{/*begin::1 Level*/}

				{this.returnMenu().map((menu, index) => this._returnMenu(menu, index))}
			</ul>
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
			type: 'UPDATE_NEWS_ATIVIDADES',
			payload: data
		})

	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		isAdmin: state.auth.user?.department_id === "administrador",
		user: state.auth.userData,
		clinic: state.clinic.selectedClinic,
		settings: state.settings,
		agenda: state.agenda,
		notifications: state.notifications,
	};
};

export default connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(AsideMenuListFilial)