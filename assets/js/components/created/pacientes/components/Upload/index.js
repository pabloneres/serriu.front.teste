import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Col, Button, Navbar, Nav } from "react-bootstrap";

import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from "~/services/controller";
import { UploadOutlined } from "@ant-design/icons";
import { Input, Upload, Radio, message } from "antd";


import {
  Container,
  ContainerTitle,
  Title,
  ContainerUpload,
  ImageUpload,
  UploadButton
} from "./styles";

function UploadClient(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const { access_token: token } = useSelector(state => state.auth);
  const history = useHistory();
  const [patient, setPatient] = useState({});
  const [reload, setReload] = useState(false);

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
      message.error(`${info.file.name} falha no upload!`);
    }
  };

  useEffect(() => {
    show("/patient", params.id)
      .then(({ data }) => {
        setPatient(data);
      })
      .catch(err => history.push("/pacientes"));
  }, [history, params.id, reload]);

  const handleUpdate = (e, prop) => {
    const data = { ...patient, [prop]: e.target.value };
    setPatient(data);

    update("/patient", params.id, data)
      .then(_ => {
        notify("Dados atualizados", "success", 1000);
        // setReload(!reload)
      })
      .catch(error => console.error(error));
  };

  return (
    <Card>
      <CardHeader title="Uploads do Paciente"></CardHeader>
      <CardBody>
        <Container>
          <ContainerUpload>
            <ContainerTitle>
              <Title>Upload - CPF</Title>
            </ContainerTitle>
            <ImageUpload
              src={`${process.env.REACT_APP_API_URL}/attachment/${patient.cpf_file}`}
              fallback="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
              onClick={() => { }}
            />
            <Upload
              {...prop}
              showUploadList={false}
              onChange={e => changeImage(e, "cpf_file")}
            >
              <UploadButton>Clique para enviar</UploadButton>
            </Upload>
            <Radio.Group
              onChange={e => {
                handleUpdate(e, "cpf_verified");
              }}
              value={patient.cpf_verified}
            >
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>

          <ContainerUpload>
            <ContainerTitle>
              <Title>Upload - RG</Title>
            </ContainerTitle>
            <ImageUpload
              src={`${process.env.REACT_APP_API_URL}/attachment/${patient.rg_file}`}
              fallback="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
              onClick={() => { }}
            />
            <Upload
              {...prop}
              showUploadList={false}
              onChange={e => changeImage(e, "rg_file")}
            >
              <UploadButton>Clique para enviar</UploadButton>
            </Upload>
            <Radio.Group
              onChange={e => {
                handleUpdate(e, "rg_verified");
              }}
              value={patient.rg_verified}
            >
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>

          <ContainerUpload>
            <ContainerTitle>
              <Title>Upload - Endereço</Title>
            </ContainerTitle>
            <ImageUpload
              src={`${process.env.REACT_APP_API_URL}/attachment/${patient.address_file}`}
              fallback="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
              onClick={() => { }}
            />
            <Upload
              {...prop}
              showUploadList={false}
              onChange={e => changeImage(e, "address_file")}
            >
              <UploadButton>Clique para enviar</UploadButton>
            </Upload>
            <Radio.Group
              onChange={e => {
                handleUpdate(e, "address_verified");
              }}
              value={patient.address_verified}
            >
              <Radio value={1}>Verificado</Radio>
              <Radio value={0}>Não verificado</Radio>
            </Radio.Group>
          </ContainerUpload>
        </Container>
      </CardBody>
    </Card>
  );
}

export default UploadClient;
