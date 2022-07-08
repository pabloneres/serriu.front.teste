import React, { useEffect, useState } from "react";
import axios from "axios";
import { store } from "~/services/controller";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Notify } from "~/modules/global";
import { Button, Form } from "antd"
import { ButtonContainer, CardContainer, Container, InputForm, InputMask, Item, RowForm, SectionForm, SelectForm } from "./styles";

function Dados({id}) {
	const history                   = useHistory();
	const {params, url}             = useRouteMatch();
	const {token, user}             = useSelector(state => state.auth);
	const {clinics, selectedClinic} = useSelector(state => state.clinic);
	const [isSending, setIsSending] = useState(false)
	const [form]                    = Form.useForm();
	const [ufs, setUfs]             = useState([]);
	const [reload, setReload]       = useState(false);

	useEffect(() => {
		axios
		.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
		.then(({data}) => {
			setUfs(data);
		})
		.catch(() => {
			return;
		});
	}, [token]);

	const initialPerfil = {
		firstName     : "",
		lastName      : "",
		email         : "",
		cpf           : "",
		rg            : "",
		gender        : "",
		birth         : "",
		marital_status: "",
		schooling     : "",
		tel           : "",
	};

	const propsFormPerfil = {
		firstName     : {
			name       : "firstName",
			type       : "text",
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "Nome",
			placeholder: "Digite seu Nome",
			disabled   : isSending
		},
		lastName      : {
			name       : "lastName",
			type       : "text",
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "Sobrenome",
			placeholder: "Digite seu Sobrenome",
			disabled   : isSending
		},
		email         : {
			name       : "email",
			type       : "email",
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "Email",
			placeholder: "Digite seu Email",
			disabled   : isSending
		},
		cpf           : {
			name       : "cpf",
			type       : "text",
			mask       : "999.999.999-99",
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "CPF",
			placeholder: "Digite seu CPF",
			disabled   : isSending
		},
		rg            : {
			name       : "rg",
			type       : "text",
			disabled   : isSending,
			mask       : "99.999.999-9",
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "RG",
			placeholder: "Digite seu RG",

		},
		gender        : {
			name    : "gender",
			rules   : [{required: true, message: "Campo Obrigatorio!"}],
			label   : "Sexo",
			disabled: isSending,
			options : [
				{
					label: "Masculino",
					value: "masculino"
				},
				{
					label: "Feminino",
					value: "feminino"
				}
			]
		},
		birth         : {
			name    : "birth",
			type    : "date",
			disabled: isSending,
			rules   : [{required: true, message: "Campo Obrigatorio!"}],
			label   : "Nascimento"
		},
		marital_status: {
			name    : "marital_status",
			rules   : [{required: true, message: "Campo Obrigatorio!"}],
			label   : "Estado civil",
			disabled: isSending,
			options : [
				{
					label: "Casado(a)",
					value: "casado"
				},
				{
					label: "Solteiro(a)",
					value: "solteiro"
				}
			]
		},
		schooling     : {
			name    : "schooling",
			rules   : [{required: true, message: "Campo Obrigatorio!"}],
			label   : "Escolaridade",
			disabled: isSending,
			options : [
				{
					value: "analfabeto",
					label: "Analfabeto"
				},
				{
					value: "funtamental_incompleto",
					label: "Fundamental - Incompleto"
				},
				{
					value: "funtamental_completo",
					label: "Fundamental - Completo"
				},
				{
					value: "ensino_medio_incompleto",
					label: "Ensino Médio - Incompleto"
				},
				{
					value: "ensino_medio_completo",
					label: "Ensino Médio - Completo"
				},
				{
					value: "superior_incompleto",
					label: "Nível Superior - Incompleto"
				},
				{
					value: "superior_completo",
					label: "Nível Superior - Completo"
				},
				{
					value: "pos_incompleto",
					label: "Pós Graduação - Incompleto"
				},
				{
					value: "pos_completo",
					label: "Pós Graduação - Completo"
				},
				{
					value: "mestrado_incompleto",
					label: "Mestrado - Incompleto"
				},
				{
					value: "mestrado_completo",
					label: "Mestrado - Completo"
				},
				{
					value: "doutorado_incompleto",
					label: "Doutorado - Incompleto"
				},
				{
					value: "doutorado_completo",
					label: "Doutorado - Completo"
				}
			]
		},
		tel           : {
			name       : "tel",
			type       : "text",
			mask       : "(99) 99999-9999",
			disabled   : isSending,
			rules      : [{required: true, message: "Campo Obrigatorio!"}],
			label      : "Celular",
			placeholder: "Digite seu Celular",
		},
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

	const handleFinish = (values) => {
		setIsSending(true)
		store("/patient", {...values, clinic_id: selectedClinic.id})
		.then((_) => {
			form.resetFields();
			setIsSending(false)
			return Notify("success", "Paciente cadastrado com sucesso.")
		})
		.catch((error) => {
			setIsSending(false)
			const validates = applyValidateStatus(error.data)
			form.setFields(validates)
		});
	};

	return (
		<Container>
			<CardContainer title="Novo paciente" bordered={false}>
				<Form
					layout="vertical"
					form={form}
					initialValues={initialPerfil}
					onFinish={handleFinish}
				>
					<SectionForm>
						<RowForm columns={3}>
							<Item {...propsFormPerfil.firstName}>
								<InputForm {...propsFormPerfil.firstName} />
							</Item>
							<Item {...propsFormPerfil.lastName}>
								<InputForm {...propsFormPerfil.lastName} />
							</Item>
							<Item {...propsFormPerfil.email}>
								<InputForm {...propsFormPerfil.email} />
							</Item>
						</RowForm>

						<RowForm columns={3}>
							<Item {...propsFormPerfil.cpf}>
								<InputMask {...propsFormPerfil.cpf} />
							</Item>
							<Item {...propsFormPerfil.rg}>
								<InputMask {...propsFormPerfil.rg} />
							</Item>
							<Item {...propsFormPerfil.gender}>
								<SelectForm {...propsFormPerfil.gender} />
							</Item>
						</RowForm>

						<RowForm columns={3}>
							<Item {...propsFormPerfil.birth}>
								<InputForm {...propsFormPerfil.birth} />
							</Item>
							<Item {...propsFormPerfil.marital_status}>
								<SelectForm {...propsFormPerfil.marital_status} />
							</Item>
							<Item {...propsFormPerfil.schooling}>
								<SelectForm {...propsFormPerfil.schooling} />
							</Item>
						</RowForm>

						<RowForm columns={3}>
							<Item {...propsFormPerfil.tel}>
								<InputMask {...propsFormPerfil.tel} />
							</Item>
						</RowForm>
					</SectionForm>

					<ButtonContainer>
						<Button
							disabled={isSending}
							style={{marginRight: 10}}
							onClick={() => {
								return history.push("/pacientes");
							}}
						>
							Cancelar
						</Button>
						<Button disabled={isSending} type="primary" htmlType="submit">
							Salvar
						</Button>
					</ButtonContainer>
				</Form>
			</CardContainer>
		</Container>
	);
}

export default Dados;
