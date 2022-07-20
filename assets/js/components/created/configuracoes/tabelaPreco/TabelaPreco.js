import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from '~/services/controller'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import { useFormik } from "formik";
import * as Yup from "yup";

import {
	Card,
	CardHeader,
	CardHeaderToolbar,
	CardBody,
} from "~/_metronic/_partials/controls";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function TabelaPreco() {
	const {token}                   = useSelector((state) => state.auth);
	const {selectedClinic}          = useSelector((state) => state.clinic);
	const [tabelas, setTabelas]     = useState([])
	const [logout, setLogout]       = useState(false)
	const [show, setShow]           = useState(false);
	const [reload, setReload]       = useState(false);
	const [showEdit, setShowEdit]   = useState(false);
	const [tableEdit, setTableEdit] = useState([]);
	const history                   = useHistory();

	let initialValues = {
		name: ''
	}

	const tabelaSchema  = Yup.object().shape({
		name: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required('Campo obrigatorio!')
	});
	const tabelaSchema2 = Yup.object().shape({
		name: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required('Campo obrigatorio!')
	});

	const formik = useFormik({
		initialValues,
		validationSchema: tabelaSchema,
		onSubmit        : (values, {setStatus, setSubmitting, resetForm}) => {
			store('preco', {...values, clinic_id: selectedClinic.id})
			.then(() => {
				resetForm()
				setShow(false)
			})
			.catch((err) => {
				return
				// retirar a linha debaixo e retornar o erro
				// setSubmitting(false);
			})
		},
	});

	const formik2 = useFormik({
		initialValues     : {
			name: tableEdit[1]
		},
		enableReinitialize: true,
		validationSchema  : tabelaSchema2,
		onSubmit          : (values, {setStatus, setSubmitting, resetForm}) => {
			update('preco', tableEdit[0], values)
			.then(() => {
				resetForm()
				setShowEdit(false)
				setReload(!reload)
			})
			.catch((err) => {
				return
				// retirar a linha debaixo e retornar o erro
				// setSubmitting(false);
			})
		},
	});

	useEffect(() => {
		index("preco", {id: selectedClinic.id})
		.then(({data}) => {
			setTabelas(data)
		}).catch((err) => {
			if( err.response.status === 401 )
			{
				setLogout(true)
			}
		})
	}, [show, reload])

	if( logout )
	{
		return <Redirect to="/logout" />
	}

	function handleDelete(id) {
		destroy('preco', id).then(() => {
			setReload(!reload)
		})
	}

	function handleEdit(id, name) {
		setTableEdit([id, name])
		setShowEdit(true)
	}

	function handleOpen(id) {
		setShowEdit(true)
	}

	return (
		<Card>
			<Modal show={show}
				   size="lg"
				   aria-labelledby="contained-modal-title-vcenter"
				   centered
			>
				<Modal.Header>Cadastrar tabela</Modal.Header>
				<Modal.Body>
					<Form
						onSubmit={formik.handleSubmit}
					>
						{formik.status && (
							<div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
								<div className="alert-text font-weight-bold">{formik.status}</div>
							</div>
						)}
						<Form.Row>
							<Form.Group as={Col} controlId="formGridEmail">
								<Form.Label>Nome da tabela *</Form.Label>
								<Form.Control
									type="text"
									name="name"
									{...formik.getFieldProps("name")}
								/>
								{formik.touched.name && formik.errors.name ? (
									<div className="fv-plugins-message-container">
										<div className="fv-help-block">{formik.errors.name}</div>
									</div>
								) : null}
							</Form.Group>
						</Form.Row>
						<div className="text-right">
							<Button onClick={() => {
								setShow(false)
							}} className="mr-2" variant="danger">
								Cancelar
							</Button>
							<Button variant="primary" type="submit">
								Salvar
							</Button>
						</div>

					</Form>
				</Modal.Body>
			</Modal>
			<Modal show={showEdit}
				   size="lg"
				   aria-labelledby="contained-modal-title-vcenter"
				   centered
			>
				<Modal.Header>Cadastrar tabela</Modal.Header>
				<Modal.Body>
					<Form
						onSubmit={formik2.handleSubmit}
					>
						{formik2.status && (
							<div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
								<div className="alert-text font-weight-bold">{formik2.status}</div>
							</div>
						)}
						<Form.Row>
							<Form.Group as={Col} controlId="formGridEmail">
								<Form.Label>Nome da tabela *</Form.Label>
								<Form.Control
									type="text"
									name="name"
									{...formik2.getFieldProps("name")}
								/>
								{formik2.touched.name && formik2.errors.name ? (
									<div className="fv-plugins-message-container">
										<div className="fv-help-block">{formik2.errors.name}</div>
									</div>
								) : null}
							</Form.Group>
						</Form.Row>
						<div className="text-right">
							<Button onClick={() => {
								setShowEdit(false)
							}} className="mr-2" variant="danger">
								Cancelar
							</Button>
							<Button variant="primary" type="submit">
								Salvar
							</Button>
						</div>

					</Form>
				</Modal.Body>
			</Modal>

			<CardHeader title="Tabelas de Preço">
				<CardHeaderToolbar>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setShow(true)}
					>
						Adicionar tabela
					</button>
				</CardHeaderToolbar>
			</CardHeader>
			<CardBody>
				<Table striped bordered hover>
					<thead>
						<tr>
							<th>Nome</th>
							<th style={{"width": 100}}>Ações</th>
						</tr>
					</thead>
					<tbody>
						{tabelas.map(tabela => (
							<tr key={tabela.id}>
								<td><Link to={`/tabela-precos/${tabela.id}/procedimentos`}>{tabela.name}</Link></td>
								<td><Link to={''} />
									<span onClick={() => {
										handleEdit(tabela.id, tabela.name)
									}} className="svg-icon menu-icon">
										<EditOutlined />
									</span>
									<span onClick={() => handleDelete(tabela.id)} style={{"cursor": "pointer"}} className="svg-icon menu-icon">
										<DeleteOutlined />
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</CardBody>
		</Card>
	);
}

export default TabelaPreco