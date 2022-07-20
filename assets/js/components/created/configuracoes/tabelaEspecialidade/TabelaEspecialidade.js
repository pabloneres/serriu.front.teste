import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useHistory, Redirect, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import SVG from 'react-inlinesvg'
import { Link } from 'react-router-dom'
import { index, destroy, store, update } from '~/services/controller'
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { Modal, Button, Form, Col, InputGroup } from 'react-bootstrap'
import Select from 'react-select';
import { useFormik } from "formik";
import * as Yup from "yup";

import {
	Card,
	CardHeader,
	CardHeaderToolbar,
	CardBody,
} from "~/_metronic/_partials/controls";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

function TabelaEspecialidade() {
	const {params, url}                       = useRouteMatch()
	const {token}                             = useSelector((state) => state.auth);
	const [especialidades, setEspecialidades] = useState([])
	const [name, setName]                     = useState('')
	const [logout, setLogout]                 = useState(false)
	const [show, setShow]                     = useState(false);
	const [showEdit, setShowEdit]             = useState(false);
	const [tableEdit, setTableEdit]           = useState([]);
	const [reload, setReload]                 = useState(false);
	const history                             = useHistory();

	let initialValues = {
		name: ''
	}

	const tabelaSchema  = Yup.object().shape({
		name: Yup.string()
		.min(3, "Minimum 3 symbols")
		.max(50, "Maximum 50 symbols")
		.required('Campo obrigatorio!'),
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
			store('especialidade', {...values, can_edit: true})
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
			update('especialidade', tableEdit[0], values)
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
		index('especialidade')
		.then(({data}) => {
			setEspecialidades(data)
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
		destroy('especialidade', id).then(() => {
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
				<Modal.Header>Cadastrar especialidade</Modal.Header>
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
								<Form.Label>Nome da especialidade *</Form.Label>
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
				<Modal.Header>Editar especialidade</Modal.Header>
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
								<Form.Label>Nome da especialidade *</Form.Label>
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

			<CardHeader title={`Especialidades`}>
				<CardHeaderToolbar>
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setShow(true)}
					>
						Adicionar especialidade
					</button>
				</CardHeaderToolbar>
			</CardHeader>
			<CardBody>

				<Table
					style={{marginTop: 10}}
					striped bordered hover
				>
					<thead>
						<tr>
							<th>Nome</th>
							<th style={{"width": 100}}>Ações</th>
						</tr>
					</thead>
					<tbody>
						{especialidades.map(especialidade => (
							<tr key={especialidade.id}>
								<td>{especialidade.name}</td>
								<td>
									{especialidade.can_edit && (
										<span
											onClick={() => {
												handleEdit(especialidade.id, especialidade.name)
											}} className="svg-icon menu-icon">
											<EditOutlined />
										</span>
									)}
									{
										especialidade.can_edit && (
											<span onClick={() => handleDelete(especialidade.id)} style={{"cursor": "pointer"}} className="svg-icon menu-icon">
												<DeleteOutlined />
											</span>
										)
									}
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			</CardBody>
		</Card>
	);
}

export default TabelaEspecialidade