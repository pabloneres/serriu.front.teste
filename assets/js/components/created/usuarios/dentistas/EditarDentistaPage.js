import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Form, Col, Button, Navbar, Nav } from "react-bootstrap";
 
import { useHistory, useRouteMatch } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { update, show } from "~/controllers/controller";

import Dados from "./components/Dados";
// import Comissoes from "./components/Comissoes/index";
import { Comissoes } from "./components/Comissoes_bkp";
import { ConfigComissoes } from "./components/ConfigComissoes";
import AgendaDentista from "./components/Agenda";
import ConfigAgenda from "./components/ConfigAgenda";
import { Recebidos } from "./components/Recebidos";
import { Especialidades } from "./components/Especialidades";
import Conta from "./components/Conta";

import { Tabs } from "antd";

// import { AdicionarOrcamentoPage } from "~/components/created/orcamento/AdicionarOrcamentoPage";

const { TabPane } = Tabs;

function EditarDentistaPage({ id }) {
  const { params, url } = useRouteMatch();

  const { token } = useSelector(state => state.auth);
  const history = useHistory();

  const [user, setUser] = useState({});
  const [ufs, setUfs] = useState([]);
  const [menu, setMenu] = useState("conta");

  function HandleChangeMenu() {
    const itensMenu = {
      perfil: () => <Dados id={id} />,
      configComissoes: () => <ConfigComissoes id={id} />,
      agendaDentista: () => <AgendaDentista id={id} />,
      configAgenda: () => <ConfigAgenda id={id} />,
      especialidades: () => <Especialidades id={id} />,
      conta: () => <Conta id={id} />
    };
    return itensMenu[menu]();
  }

  return (
    <Card>
      <Nav className="mr-auto" variant="tabs">
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("perfil");
            }}
            className={menu == "perfil" ? "active" : ""}
          >
            Perfil
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("conta");
            }}
            className={menu == "conta" ? "active" : ""}
          >
            Conta Corrente
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("agendaDentista");
            }}
            className={menu == "agendaDentista" ? "active" : ""}
          >
            Agenda de Trabalho
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("configAgenda");
            }}
            className={menu == "configAgenda" ? "active" : ""}
          >
            Configuração de Agenda
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("especialidades");
            }}
            className={menu == "especialidades" ? "active" : ""}
          >
            Especialidades
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            onClick={() => {
              setMenu("configComissoes");
            }}
            className={menu == "configComissoes" ? "active" : ""}
          >
            Configuração Comissão
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <HandleChangeMenu />
    </Card>
  );
}

export default EditarDentistaPage;
