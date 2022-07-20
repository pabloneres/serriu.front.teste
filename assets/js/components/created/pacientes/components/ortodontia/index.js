import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrtodontiaContainer, ATable, MonthRender, DayRender, MonthPadding, ContainerTable, TitleTableContainer } from './styles.js'
import { UITable, UIModal, UIDrawer } from "~/components/created/UISerriu";
import { Button, Form, Modal, Select } from 'antd'
import { convertDate, convertMoney } from '~/modules/Util';
import { index } from "~/services/controller"
import Notify from "~/services/notify";
import { connect } from "react-redux";
import findById from "~/helpers/findById";
import months from "~/helpers/months";

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
							{data}
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
					dataIndex: "date",
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
					title    : "Arco inferior",
					dataIndex: "arcoInferior"
				},
				{
					title    : "Braquetes",
					dataIndex: "braquetes"
				},
				{
					title    : "Profissional",
					dataIndex: "dentist"
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
			financeiroSeed      : [
				{
					day  : "20",
					month: "Janeiro",
					value: 80
				},
				{
					day  : "20",
					month: "Fereveiro",
					value: 80
				},
				{
					day  : "20",
					month: "Março",
					value: 80
				},
				{
					day  : "20",
					month: "Abril",
					value: 80
				},
				{
					day  : "20",
					month: "Maio",
					value: 80
				},
				{
					day  : "20",
					month: "Junho",
					value: 80
				},
				{
					day  : "20",
					month: "Julho",
					value: 80
				},
				{
					day  : "20",
					month: "Agosto",
					value: 80
				},
				{
					day  : "20",
					month: "Setembro",
					value: 80
				},
				{
					day  : "20",
					month: "Outubro",
					value: 80
				},
				{
					day  : "20",
					month: "Novembro",
					value: 80
				},
				{
					day  : "20",
					month: "Dezembro",
					value: 80
				},
			],
			ortodontiaSeed      : [
				{
					date        : "28/06/2022",
					arcoSuperior: "0.12",
					arcoInferior: "0.12",
					braquetes   : 5,
					dentist     : "Pablo Neres"
				},
				{
					date        : "28/06/2022",
					arcoSuperior: "0.14",
					arcoInferior: "0.14",
					braquetes   : 2,
					dentist     : "Pablo Neres"
				},
				{
					date        : "28/06/2022",
					arcoSuperior: "0.14",
					arcoInferior: "0.14",
					braquetes   : 2,
					dentist     : "Pablo Neres"
				},
				{
					date        : "28/06/2022",
					arcoSuperior: "0.14",
					arcoInferior: "0.14",
					braquetes   : 2,
					dentist     : "Pablo Neres"
				},
				{
					date        : "28/06/2022",
					arcoSuperior: "0.14",
					arcoInferior: "0.14",
					braquetes   : 2,
					dentist     : "Pablo Neres"

				},
			]
		}
	}

	componentDidMount() {
		// this.loadProcedimentos()
		this.loadTabelaPreco()
		// this.modal.onShow()
	}

	onPressMonth = (data) => {
		this.setState({
			month: data
		})
		this.drawer.onShow()
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

		const {financeiroSeed, ortodontiaSeed, orcamentoList, columnsOrcamentoList} = this.state

		console.log(orcamentoList)

		return (
			<OrtodontiaContainer>
				<div style={{display: "flex"}}>
					<ContainerTable width="50%">
						<TitleTableContainer>
							Financeiro
						</TitleTableContainer>
						<ATable
							rowKey="month"
							titleTable={
								<div style={{padding: 5, display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center"}}>
									<span style={{fontSize: 16, width: "25%"}}>Selecione o ano</span>
									<Select
										style={{width: "50%", textAlign: "center", borderRadius: 15}}
									>
										<option style={{textAlign: "center"}} value={2022}>2022</option>
										<option style={{textAlign: "center"}} value={2023}>2023</option>
									</Select>
								</div>
							}
							showHeader={false}
							styleWrapper={{width: '100%', borderRadius: 15, border: '1px solid #62C1D0', overflow: "hidden"}}
							size="small"
							columns={this.state.columnsFinanceiro} dataSource={financeiroSeed}
							pagination={false}
						/>
					</ContainerTable>

					<ContainerTable>
						<TitleTableContainer>
							Manutenções
						</TitleTableContainer>
						<ATable
							pagination={false}
							styleWrapper={{paddingTop: 15, width: '100%', borderRadius: 15, border: '1px solid #62C1D0', overflow: "hidden"}}
							size="small" columns={this.state.columnsOrtodontia}
							dataSource={ortodontiaSeed} />
					</ContainerTable>
				</div>
				<UIDrawer
					ref={el => this.drawer = el}
					title="Criar orçamento"
					btnSaveText="Salvar"
				>
					<Form>
						<Form.Item>
							<Select
								placeholder="Mês"
								options={Object.keys(months).map((key, index) => ({
									label: months[key].label,
									value: months[key].value
								}))}
								value={this.state.month}
								disabled
							/>
						</Form.Item>
						<Form.Item>
							<Select
								placeholder="Tabela de preço"
								options={this.state.tabelaPrecos?.map((item) => ({
									label: item.name,
									value: item.id
								}))}
								value={this.state.tabelaPreco}
								onChange={this.changeTabelaPreco}
							/>
						</Form.Item>
						<Form.Item>
							<Select
								placeholder="Procedimento"
								options={this.state.procedimentos?.map((item) => ({
									label: item.name,
									value: item.id
								}))}
								value={this.state.procedimento}
								onChange={this.changeProcedimento}
							/>
						</Form.Item>
						<Button onClick={this.addProcedimento}>Adicionar</Button>
						<UITable
							style={{marginTop: 10}}
							showHeader={false}
							pagination={false}
							size="small"
							columns={columnsOrcamentoList}
							dataSource={this.state.orcamentoList}
							footer={() =>
								<div style={{width: "100%", display: "flex", justifyContent: "space-between", backgroundColor: "#bbfff6"}}>
									<span>Total</span>
									<span>{convertMoney(this.state.orcamentoList.reduce((a, b) => a + b.valor, 0))}</span>
								</div>
							}
						/>
					</Form>

				</UIDrawer>
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