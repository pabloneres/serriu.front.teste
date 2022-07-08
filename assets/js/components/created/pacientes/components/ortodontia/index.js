import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OrtodontiaContainer, ATable, MonthRender, DayRender, MonthPadding, ContainerTable, TitleTableContainer } from './styles.js'
import { UITable, UIModal } from "~/components/created/UISerriu";
import { Select } from 'antd'
import { convertDate, convertMoney } from '~/modules/Util';

class Ortodontia extends Component {
	static propTypes = {
		imageUrl: PropTypes.string
	}

	constructor(props) {
		super(props);

		this.state = {
			columnsFinanceiro: [
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
			columnsOrtodontia: [
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
			financeiroSeed   : [
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
			ortodontiaSeed   : [
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
		// this.modal.onShow()
	}

	onPressMonth = (data) => {
		console.log(this.props)
	}

	render() {

		const {financeiroSeed, ortodontiaSeed} = this.state

		return (
			<OrtodontiaContainer>
				<div style={{display: "flex"}}>
					<ContainerTable width="50%">
						<TitleTableContainer>
							Financeiro
						</TitleTableContainer>
						<ATable
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
			</OrtodontiaContainer>
		)
	}
}

export default Ortodontia