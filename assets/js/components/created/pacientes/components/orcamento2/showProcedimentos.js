import React, { Component, useState, useEffect, useRef, useContext } from 'react'

import { Form, Table, Space, Popconfirm } from 'antd'

import { convertMoney } from "~/modules/Util";
import {
	DeleteOutlined,
} from "@ant-design/icons";

import propTypes from 'prop-types'

import { Notify } from "~/modules/global";
import InputCurrency from "~/utils/Currency";
import { destroy } from "~/controllers/controller";
import { useSelector } from "react-redux";

const EditableContext = React.createContext(null);

class ShowProcedimentos extends Component {
	static props = {
		data: propTypes.array
	}

	static defaultProps = {
		data: []
	}

	constructor(props) {
		super(props)

		this.state = {
			editing: false,
			columns: [
				{
					title: "Proc.",
					// align : "center",
					width : 200,
					render: data => <span>{data.procedimento?.name} {" "}
						({data.dente ? data.dente : "Geral"}{" "}
						{data.faces ? this.returnFaces(data.faces) : ""})
					</span>
				},
				// {
				// 	title : "Dente",
				// 	align : "center",
				// 	render: data => (
				// 		<span>
				// 		  {data.dente ? data.dente : "Geral"}{" "}
				// 			{data.faces ? this.returnFaces(data.faces) : <></>}
				// 		</span>
				// 	)
				// },
				{
					title : "Valor un",
					align : "center",
					width : 120,
					render: data => <span>{data.valor ? convertMoney(data.valor) : ""}</span>
				},
				{
					title    : "Desc. (+)(-)",
					align    : "center",
					width    : 120,
					editable : true,
					dataIndex: "desconto",
					render   : data => <span>{convertMoney(data)}</span>

				},
				{
					title    : "Fatura",
					align    : "center",
					dataIndex: "negociacao_id"
				},
				{
					title    : "Exec.",
					align    : "center",
					dataIndex: "status_execucao",
					render   : data => <span>{data}</span>
				},
				{
					title : "",
					align : "center",
					width : 30,
					render: data => {
						if( data.negociacao_id )
						{
							return <></>;
						}
						return (
							<Space>
								<Popconfirm
									title="Deseja remover o procedimento ?"
									onConfirm={() => handleRemoveItem(data.id)}
								>
									<DeleteOutlined />
								</Popconfirm>
								{/* <FolderOutlined /> */}
							</Space>
						);
					}
				}
			]
		}

	}

	handleSave = row => {
		if( row.valorTotal > row.valor )
		{
			return Notify("error", "Erro geral", "erro geral test")
		}
	};

	components = {
		body: {
			row : EditableRow,
			cell: EditableCell
		}
	};

	columnsNew = () => this.state.columns.map(col => {
		if( !col.editable )
		{
			return col;
		}

		return {
			...col,
			onCell: record => ({
				record,
				editable  : col.editable,
				dataIndex : col.dataIndex,
				title     : col.title,
				handleSave: this.handleSave
			})
		};
	});

	onChangeSelected = (e) => {
		this.props.onChangeSelected(e)
	}

	rowSelection = {
		onChange        : (rowKey, selectedRows) => {
			this.onChangeSelected(selectedRows)
		},
		getCheckboxProps: record => ({
			disabled: record.negociacao_id
		}),
	};

	rowClassName = (row, index) => {
		if( row.status_pagamento === "pago" ) return "row-color-green";
		if( row.status_pagamento === "parcial" ) return "row-color-orange";
	};

	returnFaces = data => {
		if( data.length === 0 )
		{
			return "";
		}

		return (
			<>
				{data.map(item => (
					<span style={{color: "red", marginRight: 5}}>{item.label}</span>
				))}
			</>
		);
	};

	render() {
		const {data, procedimentosSelecionados} = this.props

		console.log(procedimentosSelecionados)

		return (
			<div
				className="procedimento-list"
			>

				<Table
					size="small"
					pagination={false}
					components={this.components}
					dataSource={data.map(item => ({
						...item,
						valorTotal: item.desconto === 0 ? item.valor : item.desconto,
						key       : item.id
					}))}
					columns={this.columnsNew()}
					rowClassName={this.rowClassName}
					rowSelection={{
						type: "checkbox",
						...this.rowSelection,
					}}
				/>
			</div>
		)
	}
}

export default ShowProcedimentos

const EditableRow = ({index, ...props}) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const EditableCell = ({
						  title,
						  editable,
						  children,
						  dataIndex,
						  record,
						  handleSave,
						  ...restProps
					  }) => {
	const [editing, setEditing] = useState(false);
	const inputRef              = useRef(null);
	const form                  = useContext(EditableContext);
	useEffect(() => {
		// if (editing) {
		//   inputRef.current.focus();
		// }
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({
			[dataIndex]: record[dataIndex]
		});
	};

	const save = async() => {
		try
		{
			const values = await form.validateFields();
			toggleEdit();
			this.handleSave({...record, ...values});
		}
		catch( errInfo )
		{
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if( editable )
	{
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0
				}}
				name={dataIndex}
				rules={[
					{
						required: true,
						message : `${title} is required.`
					}
				]}
			>
				<InputCurrency ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};