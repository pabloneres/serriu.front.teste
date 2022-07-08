import React, { useEffect, useState } from "react";
import { Button, Drawer, Form, Input, Spin } from "antd";
import InputMask from "~/utils/mask";
import { store } from "~/services/controller";
import { useDispatch, useSelector } from "react-redux";
import { Notify } from "~/modules/global";

function DrawerCliente() {
	const dispatch                  = useDispatch()
	const {addCliente}              = useSelector(state => state.agenda);
	const {token}                   = useSelector(state => state.auth);
	const {selectedClinic}          = useSelector(state => state.clinic);
	const [form]                    = Form.useForm();
	const [isSending, setIsSending] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	let initialValues = {
		firstName: addCliente,
		lastName : "",
		tel      : ""
	}

	const handleClose = () => {
		dispatch({
			type   : "ADD_CLIENT",
			payload: undefined
		})
	}

	useEffect(() => {
		changeData();
	}, [addCliente, changeData]);

	const changeData = () => {
		initialValues = {...initialValues, firstName: addCliente}

		setTimeout(() => {
			setIsLoading(false)
		}, 1000)
	};

	const close = () => {
		form.resetFields();
		handleClose()
	};

	const applyValidateStatus = (errors) => {
		let errorTypes = {
			unique  : "Em uso, informe outro.",
			required: "Campo obrigatorio."
		}

		if( errors && Array.isArray(errors) )
		{
			let validates = errors.map((error) => ({
				name  : error.field,
				errors: [`${errorTypes[error.validation]}`]
			}))

			return validates
		}
		return []
	}

	const onFinish = (values) => {
		setIsSending(true)
		initialValues = {
			firstName: "",
			lastName : "",
			tel      : ""
		}
		store("/patient", {...values, clinic_id: selectedClinic.id})
		.then((_) => {
			form.resetFields();
			setIsSending(false)
			handleClose()
			return Notify("success", "Paciente cadastrado com sucesso.")
		})
		.catch((error) => {
			setIsSending(false)
			const validates = applyValidateStatus(error.data)
			form.setFields(validates)
		});
	};

	return (
		<Drawer
			destroyOnClose={true}
			zIndex={5000}
			title="Adicionar paciente"
			width={400}
			visible={addCliente}
			onClose={close}
		>
			{
				isLoading ? (
					<Spin />
				) : (
					<Form
						form={form}
						layout="vertical"
						onFinish={onFinish}
						initialValues={initialValues}
					>
						<Form.Item
							rules={[{required: true, message: "Campo obrigatório"}]}
							label="Nome"
							name="firstName"
						>
							<Input
								placeholder="Nome"
								disabled={isSending}
							/>
						</Form.Item>
						<Form.Item
							rules={[{required: true, message: "Campo obrigatório"}]}
							label="Sobrenome"
							name="lastName"
						>
							<Input
								placeholder="Sobrenome"
								disabled={isSending}
							/>
						</Form.Item>
						<Form.Item
							name="tel"
							type="text"
							rules={[
								{required: true, message: "Campo obrigatório"}
							]}
							label="Telefone"
						>
							<InputMask
								name="tel"
								mask="(99) 99999-9999"
								maskPlaceholder={null}
								disabled={isSending}
							/>
						</Form.Item>
						<Button htmlType="submit" type="primary" disabled={isSending}>
							Salvar
						</Button>
					</Form>
				)
			}
		</Drawer>
	);
}

export default DrawerCliente;
