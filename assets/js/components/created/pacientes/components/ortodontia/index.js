import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrtodontiaContainer, ATable, MonthRender, DayRender, MonthPadding, ContainerTable, TitleTableContainer, FinanceiroRow } from './styles.js'
import { UITable, UIModal, UIDrawer } from "~/components/created/UISerriu";
import ModalExecutar from './modalExecutar'
import { Button, Form, Modal, Select, Tooltip } from 'antd'
import { convertDate, convertMoney } from '~/modules/Util';
import { index } from "~/services/controller"
import Notify from "~/services/notify";
import { connect } from "react-redux";
import findById from "~/helpers/findById";
import months from "~/helpers/months";
import CreateOrcamento from "./createOrcamento"
import { PlusCircleOutlined, ToolOutlined } from "@ant-design/icons";

const currentDate = new Date()

class Ortodontia extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tabelaPrecos        : [],
			tabelaPreco         : null,
			procedimentos       : [],
			procedimento        : null,
			orcamentoList       : [],
			month               : null,
			selectedYear        : currentDate.getFullYear(),
			columnsFinanceiro   : [
				{
					title    : "Dia",
					dataIndex: "day",
					width    : "25%",
					render   : (data) => (
						<DayRender>
							<span>Dia</span> {data}
						</DayRender>
					)
				},
				{
					title    : "Mês",
					dataIndex: "month",
					align    : "center",
					width    : "50%",
					render   : (data) => (
						<MonthRender onClick={() => this.onPressMonth(data)}>
							{months[data].label}
						</MonthRender>
					)
				},
				{
					title    : "Valor",
					width    : "25%",
					dataIndex: "value",
					align    : "center",
					render   : (data) => (
						<DayRender>
							{convertMoney(data)}
						</DayRender>
					)
				},
			],
			columnsOrtodontia   : [
				{
					title    : "Data",
					dataIndex: "created_at",
					render   : (data) => (
						<MonthPadding>
							{data}
						</MonthPadding>
					)
				},
				{
					title    : "Arco superior",
					dataIndex: "arcoSuperior"
				},
				{
					title    : "Tipo arco superior",
					dataIndex: "tipoArcoSup"
				},
				{
					title    : "Arco inferior",
					dataIndex: "arcoInferior"
				},
				{
					title    : "Tipo arco inferior",
					dataIndex: "tipoArcoInf"
				},
				{
					title    : "Braquetes",
					dataIndex: "braquetes"
				},
				{
					title    : "Profissional",
					dataIndex: "dentist"
				},
				{
					title    : "Ações",
					render: (data) => <Tooltip title="Executar" ><Button onClick={() => this.modalExecutar.onOpen(data)} type="primary" icon={<ToolOutlined/>} /></Tooltip>
				},
			],
			columnsOrcamentoList: [
				{
					title    : "Nome",
					dataIndex: "name",
					align    : "left",
				},
				{
					title    : "Valor",
					dataIndex: "valor",
					align    : "right",
					render   : data => (
						<span>{convertMoney(data)}</span>
					)
				}
			],
			financeiroList      : [],
		}
	}

	componentDidMount() {
		// this.loadProcedimentos()
		this.loadTabelaPreco()
		this.loadOrtos()
	}

	onPressMonth = (data) => {
		this.setState({
			month: data
		})
		this.modal.onShow()
	}

	onPressAdd = (data) => {
		// this.setState({
		// 	month: data
		// })
		this.modal.onShow()
	}

	loadOrtos = () => {
		index("ortodontia", {paciente_id: this.props.params.id}).then(({data}) => {
			this.setState({
				financeiroList: data
			})
		})
	}

	loadProcedimentos = () => {
		index("procedimento", {
			id                  : this.state.tabelaPreco,
			especialidade_nameId: "ortodontia"
		}).then((response) => {
			this.setState({
				procedimentos: response.data
			})
		}).catch((data) => {
			Notify("error", "Falha", String(data))
		})
	}

	loadTabelaPreco = () => {
		index("preco", {
			id: this.props.clinic.id,
		}).then((response) => {
			this.setState({
				tabelaPrecos: response.data
			})
		}).catch((data) => {
			Notify("error", "Falha", String(data))
		})
	}

	changeTabelaPreco = (value) => {
		this.setState({tabelaPreco: value}, () => {
			this.loadProcedimentos()
		})
	}

	changeProcedimento = (value) => {
		this.setState({procedimento: value})
	}

	addProcedimento = () => {
		const {procedimentos, procedimento, orcamentoList} = this.state

		if( !this.state.procedimento )
		{
			return
		}
		// const orcamento = orcamentoList

		const searchIndex = findById(procedimentos, "id", procedimento)

		if( searchIndex !== -1 )
		{
			this.setState(state => ({
				procedimento : null,
				orcamentoList: [
					...state.orcamentoList,
					procedimentos[searchIndex]
				]
			}))
		}

	}

	render() {

		const {financeiroSeed, ortodontiaSeed, orcamentoList, columnsOrcamentoList, selectedYear} = this.state

		return (
			<OrtodontiaContainer>
				<div style={{display: "flex"}}>
					<ContainerTable width="50%">
						<TitleTableContainer>
							Financeiro
						</TitleTableContainer>
						<div
							style={{width: '100%', borderRadius: 15, border: '1px solid #62C1D0', overflow: "hidden", padding: 10, display: "flex", flexDirection: "column"}}
						>
							<div style={{padding: 5, display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center"}}>
								<span style={{fontSize: 16, width: "25%"}}>Ano</span>
								<Select
									disabled
									style={{width: "50%", textAlign: "center", borderRadius: 15}}
									value={selectedYear}
									defaultValue={new Date().getFullYear()}
									onChange={(e) => this.setState({selectedYear: e})}
									options={[selectedYear, selectedYear + 1].map((item) => (
										{
											label: item,
											value: item
										}
									))}
								/>
							</div>
							{
								this.state.financeiroList.map((item, index) => (
									<FinanceiroRow key={index}>
										<div className="date-container"><DayRender>{convertDate(item.created_at)}</DayRender></div>
										<div className="date-container"><MonthRender>{months[Number(item.mes)]?.label}</MonthRender></div>
										<div className="date-container"><DayRender>{convertMoney(item.valor)}</DayRender></div>
									</FinanceiroRow>
								))
							}
							<div style={{width: "100%", display: "flex", justifyContent: "center", marginTop: 20}}>
								<PlusCircleOutlined
									className="icon-plus"
									style={{fontSize: 18}}
									onClick={() => this.onPressAdd()}
								/>
							</div>
						</div>

					</ContainerTable>

					<ContainerTable>
						<TitleTableContainer>
							Manutenções
						</TitleTableContainer>
						<ATable
							pagination={false}
							styleWrapper={{paddingTop: 15, width: '100%', borderRadius: 15, border: '1px solid #62C1D0', overflow: "hidden"}}
							size="small" columns={this.state.columnsOrtodontia}
							dataSource={this.state.financeiroList} />
					</ContainerTable>
				</div>
				<UIModal
					closable={false}
					showFooter={false}
					width="80%"
					ref={el => this.modal = el}
				>
					<CreateOrcamento month={this.state.month} onFinish={() => {
						this.loadOrtos()
						this.modal.onClose()
					}} />
				</UIModal>
				<ModalExecutar
					ref={el => this.modalExecutar = el }
				>
				</ModalExecutar>
			</OrtodontiaContainer>
		)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {}
};

const mapStateToProps = (state, ownProps) => {
	return {
		isAdmin      : state.auth.userData.department_id === "administrador",
		user         : state.auth.userData,
		clinic       : state.clinic.selectedClinic,
		settings     : state.settings,
		agenda       : state.agenda,
		notifications: state.notifications,
	};
};

export default connect(mapStateToProps, null)(Ortodontia)