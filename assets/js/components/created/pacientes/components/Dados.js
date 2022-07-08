import React, { useState, useEffect } from "react";
// import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Col, Button, Navbar, Nav } from "react-bootstrap";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from "~/services/controller";
import { Input, Tooltip, Card, Image, Upload, message } from "antd";
import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import InputMask from "~/utils/mask";
import axios from "axios";

export function Dados({ history }) {
  const { params, url } = useRouteMatch();
  const { access_token: token } = useSelector(state => state.auth);

  // const [patient, setPatient] = useState({})
  const [user, setUser] = useState({});
  const [ufs, setUfs] = useState([]);
  const [patient, setPatient] = useState({});
  const [reload, setReload] = useState(false);

  useEffect(() => {
    show("/patient", params.id)
      .then(({ data }) => {
        let patient = {};
        for (var prop in data) {
          if (data[prop] === null) {
            patient = { ...patient, [prop]: "" };
          } else {
            patient = { ...patient, [prop]: data[prop] };
          }
        }

        setPatient(patient);
      })
      .catch(err => history.push("/pacientes"));
  }, [history, params.id, reload]);

  const pacienteSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Campo obrigatorio!"),
    lastName: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Campo obrigatorio!"),
    cpf: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    rg: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    address: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    uf: Yup.string()
      .min(2, "Minimum 2 symbols")
      .max(10, "Maximum 50 symbols"),
    city: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    birth: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    gender: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    tel: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Campo obrigatorio!"),
    marital_status: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols"),
    schooling: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
  });

  // console.log(patient);

  // // console
  // //   .log
  // //   // Object.keys(patient).forEach((key, index) => {
  // //   //   if (patient[key] === null) {
  // //   //     setPatient({ ...patient, [key]: "" });
  // //   //   }
  // //   // })
  // //   ();

  const formik = useFormik({
    initialValues: patient,
    enableReinitialize: true,
    validationSchema: pacienteSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      update("/patient", params.id, values)
        .then(() => {
          notify("Dados atualizados", "success", 1000);
          reload();
          // history.push("/paciente")
        })
        .catch(err => {
          return;
          // retirar a linha debaixo e retornar o erro
          // setSubmitting(false);
        });
    }
  });

  const suffix = status => {
    switch (status) {
      case 0:
        return (
          <Tooltip title="Não verificado">
            <CloseCircleOutlined twoToneColor="red" />
          </Tooltip>
        );
      case 1:
        return (
          <Tooltip title="Verificado">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
          </Tooltip>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    axios
      .get("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then(({ data }) => {
        setUfs(data);
      })
      .catch(() => {
        return;
      });
  }, []);

  const prop = {
    name: "image",
    action: process.env.REACT_APP_API_URL + "/attachment",
    headers: {
      Authorization: "Bearer " + token
    }
  };

  const changeImage = (info, file) => {
    if (info.file.status === "done") {
      console.log(info.file.response.fileName);
      update("patient", params.id, {
        [file]: info.file.response.fileName
      }).then(() => {
        setReload(!reload);
      });
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };
  const ExtraPaciente = url => {
    return (
      <Upload
        {...prop}
        onChange={e => changeImage(e, "avatar_url")}
        showUploadList={false}
      >
        <Image
          width={50}
          style={{ borderRadius: 8 }}
          src={`${process.env.REACT_APP_API_URL}/attachment/${url}`}
          fallback="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
        />
      </Upload>
    );
  };

  return (
    <Card title="Editar paciente" extra={ExtraPaciente(patient.avatar_url)}>
      <Form onSubmit={formik.handleSubmit}>
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
        <Form.Row>
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Nome *</Form.Label>
            <Form.Control
              placeholder="Digite seu nome"
              type="text"
              name="firstName"
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.firstName}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Sobrenome *</Form.Label>
            <Form.Control
              placeholder="Digite seu sobrenome"
              type="text"
              name="lastName"
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.lastName}</div>
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>CPF *</Form.Label>
            <InputMask
              suffix={suffix(patient.cpf_verified)}
              mask="999.999.999-99"
              className="input-mask"
              placeholder="Digite seu CPF"
              name="cpf"
              {...formik.getFieldProps("cpf")}
            />
            {formik.touched.cpf && formik.errors.cpf ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.cpf}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>RG</Form.Label>
            <InputMask
              suffix={suffix(patient.rg_verified)}
              mask="99.999.999-9"
              type="text"
              className="input-mask"
              placeholder="Digite seu RG"
              name="rg"
              {...formik.getFieldProps("rg")}
            />
            {formik.touched.rg && formik.errors.rg ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.rg}</div>
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Endereço</Form.Label>
            <Input
              suffix={suffix(patient.address_verified)}
              type="text"
              className="input-mask"
              placeholder="Digite seu Endereço"
              name="address"
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.address}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Cidade</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite sua Cidade"
              name="city"
              {...formik.getFieldProps("city")}
            />
            {formik.touched.city && formik.errors.city ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.city}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group controlId="formGridAddress1">
            <Form.Label>UF *</Form.Label>
            <Form.Control as="select" name="uf" {...formik.getFieldProps("uf")}>
              <option value=""></option>
              {ufs.map(uf => {
                return (
                  <option key={uf.sigla} value={uf.sigla}>
                    {uf.sigla}
                  </option>
                );
              })}
            </Form.Control>
            {formik.touched.uf && formik.errors.uf ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.uf}</div>
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Data de Nascimento</Form.Label>
            <Form.Control
              type="date"
              name="birth"
              {...formik.getFieldProps("birth")}
            />
            {formik.touched.birth && formik.errors.birth ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.birth}</div>
              </div>
            ) : null}
          </Form.Group>

          <Col xs={6}>
            <Form.Group controlId="formGridAddress1">
              <Form.Label>Email</Form.Label>
              <Input
                suffix={suffix(patient.email_verified)}
                placeholder="Digite seu email"
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </Form.Group>
          </Col>

          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Genêro</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              {...formik.getFieldProps("gender")}
            >
              <option value=""></option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </Form.Control>
            {formik.touched.gender && formik.errors.gender ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.gender}</div>
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>

        <Form.Row>
          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Celular *</Form.Label>
            <InputMask
              suffix={suffix(patient.tel_verified)}
              mask="(99) 99999-9999"
              type="text"
              className="input-mask"
              placeholder="Digite seu celular"
              name="tel"
              {...formik.getFieldProps("tel")}
            />
            {formik.touched.tel && formik.errors.tel ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tel}</div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Estado Civil</Form.Label>
            <Form.Control
              as="select"
              name="marital_status"
              {...formik.getFieldProps("marital_status")}
            >
              <option value=""></option>
              <option value="solteiro">Solteiro(a)</option>
              <option value="casado">Casado(a)</option>
            </Form.Control>
            {formik.touched.marital_status && formik.errors.marital_status ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.marital_status}
                </div>
              </div>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} controlId="formGridAddress1">
            <Form.Label>Escolaridade</Form.Label>
            <Form.Control
              as="select"
              name="schooling"
              {...formik.getFieldProps("schooling")}
            >
              <option value=""></option>
              <option value="analfabeto">Analfabeto</option>
              <option value="funtamental_incompleto">
                Fundamental - Incompleto
              </option>
              <option value="funtamental_completo">
                Fundamental - Completo
              </option>
              <option value="ensino_medio_incompleto">
                Ensino Médio - Incompleto
              </option>
              <option value="ensino_medio_completo">
                Ensino Médio - Completo
              </option>
              <option value="superior_incompleto">
                Nível Superior - Incompleto
              </option>
              <option value="superior_completo">
                Nível Superior - Completo
              </option>
              <option value="pos_incompleto">Pós Graduação - Incompleto</option>
              <option value="pos_completo">Pós Graduação - Completo</option>
              <option value="mestrado_completo">Mestrado - Incompleto</option>
              <option value="mestrado_completo">Mestrado - Completo</option>
              <option value="doutorado_incompleto">
                Doutorado - Incompleto
              </option>
              <option value="doutorado_completo">Doutorado - Completo</option>
            </Form.Control>
            {formik.touched.schooling && formik.errors.schooling ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  {formik.errors.escolaridade}
                </div>
              </div>
            ) : null}
          </Form.Group>
        </Form.Row>

        <div className="text-right">
          <Link to="/pacientes">
            <Button className="mr-2" variant="danger">
              Cancelar
            </Button>
          </Link>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </div>
      </Form>
    </Card>
  );
}
