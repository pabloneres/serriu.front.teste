import React, { useEffect, useState } from "react";
import axios from "axios";
import { index, store } from "~/services/controller";
import { useSelector } from "react-redux";
import { Button, Checkbox, Form } from 'antd'
import { CardContainer, Container, InputForm, InputMask, Item, RowForm, SectionForm, SectionTitle, SelectForm, Title, } from "./styles";
import { Notify } from "~/modules/global";

function AdicionarUsuario() {
	const { token } = useSelector((state) => state.auth);
	// const {clinics}                 = useSelector((state) => state.clinic);
	const [form] = Form.useForm();
	const [acessos, setAcessos] = useState([]);
	const [cargo, setCargo] = useState();
	const [cargos, setCargos] = useState([]);
	const [ufs, setUfs] = useState([]);
	const [isSendind, setIsSending] = useState(false)
	const [clinics, setClinics] = useState([])

	useEffect(() => {
		axios
			.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
			.then(({ data }) => {
				setUfs(data);
			})
			.catch(() => {
				return;
			});

		index('/department').then(({ data }) => {
			setCargos(data.map(item => ({
				...item,
				label: item.name,
				value: item.id
			})
			))
		}).catch(() => {
			return;
		});

		index("clinic").then(({ data }) => {
			setClinics(data)
		})
	}, [token]);

	const initialDados = {
		username: "",
		code: "",
		password: "",
		cargo: "",
		firstName: "",
		lastName: "",
		email: "",
		cpf: "",
		rg: "",
		gender: "",
		birth: "",
		marital_status: "",
		schooling: "",
		tel: "",
		croUF: "",
		croNumber: "",
		scheduleView: "",
		scheduleColor: "#000000",
	};

	const propsFormDados = {
		username: {
			name: "username",
			type: "text",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Usuário",
			placeholder: "Digite um Usuário",
			disabled: isSendind
		},
		code: {
			name: "code",
			type: "text",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Senha financeira",
			placeholder: "Digite um código para desconto",
			disabled: isSendind
		},
		password: {
			name: "password",
			type: "password",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Senha",
			placeholder: "**********",
			disabled: isSendind
		},
		cargo: {
			name: "cargo",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Cargo",
			options: cargos,
			disabled: isSendind
		}
	};

	const propsFormPerfil = {
		firstName: {
			name: "firstName",
			type: "text",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Nome",
			placeholder: "Digite seu Nome",
		},
		lastName: {
			name: "lastName",
			type: "text",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Sobrenome",
			placeholder: "Digite seu Sobrenome",
		},
		email: {
			name: "email",
			type: "email",
			rules: [{ required: true, message: "Campo Obrigatorio!" }, { type: "email", message: "Digite um email válido." }],
			label: "Email",
			placeholder: "Digite seu Email",
		},
		cpf: {
			name: "cpf",
			type: "text",
			mask: "999.999.999-99",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "CPF",
			placeholder: "Digite seu CPF",
		},
		rg: {
			name: "rg",
			type: "text",
			mask: "99.999.999-9",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "RG",
			placeholder: "Digite seu RG",
		},
		gender: {
			name: "gender",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Sexo",
			options: [
				{
					label: "Masculino",
					value: "masculino",
				},
				{
					label: "Feminino",
					value: "feminino",
				},
			],
		},
		birth: {
			name: "birth",
			type: "date",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Nascimento",
		},
		marital_status: {
			name: "marital_status",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Estado civil",
			options: [
				{
					label: "Casado(a)",
					value: "casado",
				},
				{
					label: "Solteiro(a)",
					value: "solteiro",
				},
			],
		},
		schooling: {
			name: "schooling",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Escolaridade",
			options: [
				{
					value: "analfabeto",
					label: "Analfabeto",
				},
				{
					value: "funtamental_incompleto",
					label: "Fundamental - Incompleto",
				},
				{
					value: "funtamental_completo",
					label: "Fundamental - Completo",
				},
				{
					value: "ensino_medio_incompleto",
					label: "Ensino Médio - Incompleto",
				},
				{
					value: "ensino_medio_completo",
					label: "Ensino Médio - Completo",
				},
				{
					value: "superior_incompleto",
					label: "Nível Superior - Incompleto",
				},
				{
					value: "superior_completo",
					label: "Nível Superior - Completo",
				},
				{
					value: "pos_incompleto",
					label: "Pós Graduação - Incompleto",
				},
				{
					value: "pos_completo",
					label: "Pós Graduação - Completo",
				},
				{
					value: "mestrado_incompleto",
					label: "Mestrado - Incompleto",
				},
				{
					value: "mestrado_completo",
					label: "Mestrado - Completo",
				},
				{
					value: "doutorado_incompleto",
					label: "Doutorado - Incompleto",
				},
				{
					value: "doutorado_completo",
					label: "Doutorado - Completo",
				},
			],
		},
		tel: {
			name: "tel",
			type: "text",
			mask: "(99) 99999-9999",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Celular",
			placeholder: "Digite seu Celular",
		},
		croUF: {
			name: "croUF",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "CRO UF",
			options: ufs.map((uf) => ({
				label: uf.sigla,
				value: uf.sigla,
			})),
		},
		croNumber: {
			name: "croNumber",
			type: "text",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "CRO Numero",
			placeholder: "Digite seu CRO",
		},
		scheduleView: {
			name: "scheduleView",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Visualizar agenda",
			options: [
				{
					label: "Clinica",
					value: "clinica",
				},
				{
					label: "Propria",
					value: "propria",
				},
			],
		},
		scheduleColor: {
			name: "scheduleColor",
			type: "color",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Cor da agenda",
		},
	};

	const propsFormAcesso = {
		acesso: {
			name: "acesso",
			rules: [{ required: true, message: "Campo Obrigatorio!" }],
			label: "Clinicas que o usuário terá acesso",
			options: clinics.map(clinic => ({
				label: clinic.name,
				value: clinic.id
			}))
		}
	}

	const applyValidateStatus = (errors) => {
		let errorTypes = {
			unique: "Em uso, informe outro.",
			required: "Campo obrigatorio."
		}

		if (errors && Array.isArray(errors)) {
			let validates = errors.map((error) => ({
				name: error.field,
				errors: [`${errorTypes[error.validation]}`]
			}))

			return validates
		}
		return []
	}

	const handleFinish = (values) => {
		setIsSending(true)
		store("/users", values)
			.then((_) => {
				form.resetFields();
				setIsSending(false)
				return Notify("success", "Usúario cadastrado com sucesso.")
			})
			.catch((error) => {
				setIsSending(false)
				const validates = applyValidateStatus(error.data)
				form.setFields(validates)
			});
	};

	return (
		<Container>
			<CardContainer title="Novo usuário" bordered={false}>
				<Form
					layout="vertical"
					form={form}
					initialValues={initialDados}
					onFinish={handleFinish}
					onFinishFailed={console.log}
				>
					<SectionForm>
						<SectionTitle>
							<Title>
								Dados do Usuário
							</Title>
						</SectionTitle>
						<RowForm columns={3}>
							<Item {...propsFormDados.cargo}>
								<SelectForm
									onChange={(e) => {
										setCargo(e);
									}}
									{...propsFormDados.cargo}
								/>
							</Item>
							<Item {...propsFormDados.username}>
								<InputForm {...propsFormDados.username} />
							</Item>
							<Item {...propsFormDados.password}>
								<InputForm {...propsFormDados.password} />
							</Item>
						</RowForm>
						<RowForm columns={3}>
							<Item {...propsFormDados.code}>
								<InputForm {...propsFormDados.code} />
							</Item>
						</RowForm>
					</SectionForm>

					<SectionForm>
						<SectionTitle>
							<Title>
								Dados pessoais
							</Title>
						</SectionTitle>
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

					{
						cargo === "dentista" && (
							<SectionForm>
								<SectionTitle>
									<Title>Dados Dentista</Title>
								</SectionTitle>
								<RowForm columns={3}>
									<Item {...propsFormPerfil.croUF}>
										<SelectForm {...propsFormPerfil.croUF} />
									</Item>
									<Item {...propsFormPerfil.croNumber}>
										<InputForm {...propsFormPerfil.croNumber} />
									</Item>
									<Item {...propsFormPerfil.scheduleView}>
										<SelectForm {...propsFormPerfil.scheduleView} />
									</Item>
								</RowForm>

								<RowForm columns={3}>
									<Item {...propsFormPerfil.scheduleColor}>
										<InputForm {...propsFormPerfil.scheduleColor} />
									</Item>
								</RowForm>
							</SectionForm>
						)
					}

					<SectionForm>
						<RowForm>
							{
								cargo === "administrador" ?
									<Title>o cargo ADMINISTRADOR tem acesso a todas as clinicas!</Title>
									:
									<Item {...propsFormAcesso.acesso}>
										<Checkbox.Group {...propsFormAcesso.acesso} value={acessos} onChange={(e) => setAcessos(e)} />
									</Item>
							}
						</RowForm>
					</SectionForm>
					<div style={{ display: "flex", justifyContent: "flex-end" }}><Button loading={isSendind} htmlType="submit" type="primary">Salvar</Button></div>
				</Form>

			</CardContainer>
		</Container>
	);
}

export default AdicionarUsuario;
