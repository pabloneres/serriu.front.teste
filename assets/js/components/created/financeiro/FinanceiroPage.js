import React, { useState, useEffect } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import Receber from "./components/Receber";
import Boletos from "./components/Boletos";
import { Recebidos } from "./components/Recebidos";
import { Orcamentos } from "./components/Orcamentos";
import { FichaClinica } from "./components/FichaClinica";
import Analise from "./components/Analise";
import Aprovacao from "./components/Aprovacao";
import Comissoes from "./components/Comissoes";
import { Caixa } from "./components/Caixa";
import Solicitacoes from "./components/Solicitacoes";

import { Tabs } from "antd";

const { TabPane } = Tabs;

function FinanceiroPage(props) {
  const { params, url } = useRouteMatch();
  const [key, setKey] = useState("aprovacao");

  const ReturnMenu = () => {
    switch (key) {
      case "receber":
        return <Receber />;
      case "aprovacao":
        return <Aprovacao />;
      case "boletos":
        return <Boletos />;
      case "analise":
        return <Analise />;
      case "comissoes":
        return <Comissoes />;
      case "recebidos":
        return <Recebidos />;
      case "orcamentos":
        return <Orcamentos />;
      case "fichaClinica":
        return <FichaClinica />;
      case "caixa":
        return <Caixa />;
      case "solicitacoes":
        return <Solicitacoes />;
      default:
        return <Receber />;
    }
  };

  return (
    <>
      <div style={{ padding: 0, backgroundColor: "#fff" }}>
        <Tabs
          style={{ marginBottom: 0 }}
          activeKey={key}
          onChange={e => {
            setKey(e);
          }}
          type="card"
        >
          <TabPane key="aprovacao" tab="Aprovaçao" />
          <TabPane key="analise" tab="Análise" />
          <TabPane key="boletos" tab="Boletos" />
          <TabPane key="comissoes" tab="Comissões" />
          <TabPane key="solicitacoes" tab="Solicitações de Saque" />
        </Tabs>
      </div>
      <ReturnMenu />
    </>
  );
}

export default FinanceiroPage;
