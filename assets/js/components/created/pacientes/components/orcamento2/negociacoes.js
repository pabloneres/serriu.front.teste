import React, { Component } from 'react'

import { Button, Table, Form, Input, Row } from "antd"
import { convertDate, convertMoney } from "~/modules/Util";
import { DollarCircleOutlined } from "@ant-design/icons";
import { show } from "~/services/controller";
import InputCurrency from "~/utils/Currency";

class Negociacoes extends Component {
	constructor(props) {
		super(props);

		this.state = {
			item : null,
			saldo: 0
		}

		this.columns = [
			{
				title    : "Fatura",
				dataIndex: "id"
			},
			{
				title    : "Total",
				dataIndex: "total",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title    : "Pago",
				dataIndex: "pago",
				render   : data => <span>{convertMoney(data)}</span>
			},
			{
				title    : "F. Pagmento",
				dataIndex: "formaPagamento",
				render   : data => <span>{data}</span>
			},
			{
				title : "",
				render: data => <Button
					// disabled={data.status === "pago"}
					icon={<DollarCircleOutlined />} type="primary" onClick={() => this.fetch(data.id)} />
			}
		]
	}

	fetch = (id) => {
		show("/faturamento", id).then(({data}) => {
			this.setState({
				item: {
					...data,
					especialidades: data.especialidades
					.map(item => ({
						...item,
						valorAplicado: 0
					}))
					.filter(item => item.restante !== 0)
				}
			})
		});
	}

	_renderInnerTable = (record) => {
		return (
			<Table
				rowKey="id"
				showHeader={false}
				dataSource={record.pagamentos}
				columns={[
					{
						// title: 'Data',
						dataIndex: "created_at",
						render   : data => <span>{convertDate(data)}</span>
					},
					{
						dataIndex: "abertura",
						render   : data => (
							<span>
                {data.usuario
					? `Recebido por: ${data.usuario?.firstName} ${data.usuario?.lastName}`
					: "-"}
              </span>
						)
					},
					{
						// title: 'Valor',
						dataIndex: "valor",
						render   : data => <span>{convertMoney(data)}</span>
					},
					{
						// title: 'Forma de pagamento',
						dataIndex: "formaPagamento"
					}
				]}
				pagination={false}
			/>
		);
	};

	_renderNegociacoes = () => {
		const {data} = this.props

		return (
			<Table
				rowKey="id"
				size="small"
				columns={this.columns}
				dataSource={data.negociacoes}
				expandable={{
					rowExpandable    : record => record.pagamentos.length > 0,
					expandedRowRender: (record, index, indent, expanded) =>
						this._renderInnerTable(record)
				}}
				pagination={false}
			/>
		)
	}

	handleAddSaldo = () => {
		const {item, saldo} = this.state

		this.props.handleAddSaldo({
			item,
			saldo,
			addEntrada: item.formaPagamento === "boleto" ? true : false
		})
	}

	back = () => {
		this.setState({
			saldo: 0,
			item : null
		})
	}

	_renderNegociacao = () => {
		const {item, saldo} = this.state

		return (
			<div>
				<Table
					size="small"
					rowKey="id"
					columns={[
						{
							title    : "Fatura",
							dataIndex: "id"
						},
						{
							title    : "Total",
							dataIndex: "total",
							render   : data => <span>{convertMoney(data)}</span>
						},
						{
							title    : "Pago",
							dataIndex: "pago",
							render   : data => <span>{convertMoney(data)}</span>
						},
						{
							title : "Restante",
							render: data => (
								<span>{convertMoney(item.total - item.pago)}</span>
							)
						}
					]}
					dataSource={[item]}
					pagination={false}
				/>
				{(item.total !== item.pago) && (
					<Row className="mt-2" justify="space-between">
						<Form.Item>
							<InputCurrency
								onChange={(e) => {
									this.setState({
										saldo: e
									})
								}}
								max={item.total - item.pago}
							/>
						</Form.Item>
						<Button onClick={this.handleAddSaldo} disabled={saldo === 0} type="primary">Adicionar saldo</Button>
					</Row>
				)}
				<Button onClick={() => this.props.showResumo(item)} block>Visualizar resumo</Button>
				<Button className="mt-2" onClick={this.back} block type="primary">Alterar negociação</Button>
				<Button className="mt-2" onClick={this.back} block type="secondary">Voltar</Button>
			</div>
		)
	}

	render() {
		const {item} = this.state

		return (
			<div>
				{!item ? this._renderNegociacoes() : this._renderNegociacao()}
			</div>
		)
	}

}

export default Negociacoes