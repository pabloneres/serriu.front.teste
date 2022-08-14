import React, { Component } from 'react'
import { Collapse, Table, Space, Tooltip, Button, Spin } from 'antd'

import CollapseShow from './collapse'
import { index, show } from '~/services/controller'
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";

import DrawerShow from './drawer'

class Orcamento extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isLoading      : true,
			data           : [],
			orcamento      : {},
			expandedRowKeys: []
		}

		this.columns = [
			{
				title    : "Id",
				dataIndex: "id"
			},
			{
				title    : "Criado em",
				dataIndex: "created_at",
				render   : data => <span>{convertDate(data)}</span>
			},
			{
				title    : "Total orçamento",
				dataIndex: "valor",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title    : "Total com desconto",
				dataIndex: "valorDesconto",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title : "Total pago",
				render: data => (
					<span>
                  {convertMoney(
					  data.procedimentos.reduce((a, b) => a + Number(b.desconto), 0) -
					  Number(data.restante)
				  )}
                </span>
				)
			},
			{
				title    : "Total a receber",
				dataIndex: "restante",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title    : "Retido Lab",
				dataIndex: "lab",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title : "",
				render: (data) => <Button onClick={() => this.drawer.onOpen(data.id)}>Receber</Button>
			}
		];
	}

	componentDidMount() {
		this.fetchGetAll()
	}

	fetchGetAll = () => {
		index("orcamentos", {
			paciente_id: this.props.params.id,
			status     : "",
			returnType : "1"
		}).then((response) => {
			this.setState({
				data: response.data.map((item) => ({...item, key: item.id}))
			})
		})
	}

	handleExpandRowClose = () => {
		this.setState({
			orcamento: {},
		})

		this.fetchGetAll()
	}

	_renderHeaderCollapse = (data = []) => {
		return (
			<Table
				columns={this.columns}
				dataSource={data}
				size="small"
				showHeader={false}
			/>
		)
	}

	render() {
		const {data} = this.state

		return (
			<div className='orcamento-page'>
				<Table
					columns={this.columns}
					dataSource={data}
					size="small"
					pagination={false}
				/>
				<DrawerShow
					ref={el => this.drawer = el}
					reload={this.fetchGetAll}
				/>
			</div>
		)
	}
}

export default Orcamento