import React, { useEffect, useState } from "react";
import axios from "axios";
import { store, index, show, update } from "~/controllers/controller";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Checkbox, Skeleton } from "antd";
import { Notify } from "~/modules/global";
import {
  Container,
  CardContainer,
  Formulario,
  Item,
  InputForm,
  SelectForm,
  RowForm,
  InputMask,
  SectionForm,
  SectionTitle,
  Title,
  ButtonContainer,
  FormButton,
  StepsContainer,
  Separate
} from "./styles";

function Dados({ id }) {
  const { params, url } = useRouteMatch();
  const { token, user } = useSelector(state => state.auth);
  const { clinics } = useSelector(state => state.clinic);
  const [dadosForm] = Formulario.useForm();
  const [perfilForm] = Formulario.useForm();
  const [acessoForm] = Formulario.useForm();
  const [formDado, setFormDado] = useState({});
  const [formPerfil, setFormPerfil] = useState({});
  const [acessos, setAcessos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [cargo, setCargo] = useState();
  const [cargos, setCargos] = useState([]);
  const [ufs, setUfs] = useState([]);
  const [reload, setReload] = useState(false);

  const [clinicasAcessos, setClinicasAcessos] = useState([]);
  const [loadUser, setLoadUser] = useState();

  useEffect(() => {
    setLoadUser();
    show(token, "/users", id || params.id).then(({ data }) => {
      setLoadUser({ ...data, ...data.profile, id: data.id });
      setClinicasAcessos(data.acessos.map(item => item.clinic_id));
    });
  }, [reload, id, params.id, token]);

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(({ data }) => {
        setUfs(data);
      })
      .catch(() => {
        return;
      });

    index(token, "/department")
      .then(({ data }) => {
        setCargos(
          data.map(item => ({
            ...item,
            label: item.name,
            value: item.id
          }))
        );
      })
      .catch(() => {
        return;
      });
  }, [token]);

  const initialDados = {
    username: "",
    code: "",
    password: "",
    cargo: ""
  };
  const initialPerfil = {
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
    scheduleColor: ""
  };

  const propsFormDados = {
    username: {
      name: "username",
      type: "text",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Usuário",
      placeholder: "Digite um Usuário"
    },
    code: {
      name: "code",
      type: "text",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Senha financeira",
      placeholder: "Digite um código para desconto"
    },
    password: {
      name: "password",
      type: "password",
      rules: [{ required: false, message: "Campo Obrigatorio!" }],
      label: "Senha",
      placeholder: "**********"
    },
    cargo: {
      name: "cargo",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Cargo",
      options: cargos
    }
  };

  const propsFormPerfil = {
    firstName: {
      name: "firstName",
      type: "text",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Nome",
      placeholder: "Digite seu Nome"
    },
    lastName: {
      name: "lastName",
      type: "text",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Sobrenome",
      placeholder: "Digite seu Sobrenome"
    },
    email: {
      name: "email",
      type: "email",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Email",
      placeholder: "Digite seu Email"
    },
    cpf: {
      name: "cpf",
      type: "text",
      mask: "999.999.999-99",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "CPF",
      placeholder: "Digite seu CPF"
    },
    rg: {
      name: "rg",
      type: "text",
      mask: "99.999.999-9",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "RG",
      placeholder: "Digite seu RG"
    },
    gender: {
      name: "gender",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Sexo",
      options: [
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
    birth: {
      name: "birth",
      type: "date",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Nascimento"
    },
    marital_status: {
      name: "marital_status",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Estado civil",
      options: [
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
    schooling: {
      name: "schooling",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Escolaridade",
      options: [
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
    tel: {
      name: "tel",
      type: "text",
      mask: "(99) 99999-9999",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Celular",
      placeholder: "Digite seu Celular"
    },
    croUF: {
      name: "croUF",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "CRO UF",
      options: ufs.map(uf => ({
        label: uf.sigla,
        value: uf.sigla
      }))
    },
    croNumber: {
      name: "croNumber",
      type: "text",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "CRO Numero",
      placeholder: "Digite seu CRO"
    },
    scheduleView: {
      name: "scheduleView",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Visualizar agenda",
      options: [
        {
          label: "Clinica",
          value: "clinica"
        },
        {
          label: "Propria",
          value: "propria"
        }
      ]
    },
    scheduleColor: {
      name: "scheduleColor",
      type: "color",
      rules: [{ required: true, message: "Campo Obrigatorio!" }],
      label: "Cor da agenda"
    }
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
  };

  const updateUser = data => {
    update(token, "users", loadUser.id, data).then(data => {
      setReload(!reload);
      return Notify("success", "Registro atualizado");
    });
  };

  return (
    <Container>
      {!loadUser ? (
        <Skeleton active loading={!loadUser} paragraph={{ rows: 10 }} />
      ) : (
        <CardContainer title="Dados pessoais" bordered={false}>
          <Formulario
            layout="vertical"
            form={perfilForm}
            initialValues={loadUser}
            onFinish={data => {
              updateUser(data);
            }}
          >
            <SectionForm>
              <SectionTitle>
                {/* <Title>
              Perfil
            </Title> */}
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

            {cargo === "dentista" ? (
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
            ) : (
              ""
            )}

            <Separate />

            <SectionForm>
              <SectionTitle></SectionTitle>
              <RowForm columns={3}>
                <Item {...propsFormDados.username}>
                  <InputForm {...propsFormDados.username} />
                </Item>
                <Item {...propsFormDados.password}>
                  <InputForm {...propsFormDados.password} />
                </Item>
                <Item {...propsFormDados.code}>
                  <InputForm {...propsFormDados.code} />
                </Item>
              </RowForm>
            </SectionForm>

            {user.departament_id ? (
              <>
                <Separate />
                <SectionForm>
                  <SectionTitle></SectionTitle>
                  <RowForm>
                    {formDado.cargo === "administrador" ? (
                      <Title>
                        o cargo ADMINISTRADOR tem acesso a todas as clinicas!
                      </Title>
                    ) : (
                      <Item {...propsFormAcesso.acesso}>
                        <Checkbox.Group
                          {...propsFormAcesso.acesso}
                          value={acessos}
                          onChange={e => setAcessos(e)}
                        />
                      </Item>
                    )}
                  </RowForm>
                </SectionForm>
              </>
            ) : (
              <></>
            )}
            <ButtonContainer>
              <FormButton
                type="primary"
                // onClick={() => {
                //   handleFinish();
                // }}
                htmlType="submit"
              >
                Salvar
              </FormButton>
            </ButtonContainer>
          </Formulario>
        </CardContainer>
      )}
    </Container>
  );
}

export default Dados;
