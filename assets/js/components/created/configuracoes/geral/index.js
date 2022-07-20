import React from "react";
import { Container, ATabs, ATabPane } from "./styles";

import GeralTab from "./components/Geral";
import DescontosTab from "./components/Descontos";
import BoletoTab from "./components/Boleto";
import EquipamentoTab from "./components/Equipamento";
import AgendaTab from "./components/Agenda";
import DespesasTab from "./components/Despesas";
import FormasPagamento from "./components/Formas de Pagamento";
import OrcamentoTab from "./components/Orcamento";
import WhatsApp from "./components/WhatsApp";

function Geral() {
  return (
    <Container>
      <ATabs type="card" size="middle" defaultActiveKey="1">
        <ATabPane tab="Geral" key="1">
          <GeralTab />
        </ATabPane>
        <ATabPane tab="Descontos" key="7">
          <DescontosTab />
        </ATabPane>
        <ATabPane tab="Agenda" key="2">
          <AgendaTab />
        </ATabPane>
        <ATabPane tab="Boleto" key="3">
          <BoletoTab />
        </ATabPane>
        {/* <ATabPane tab="Equipamento" key="4">
          <EquipamentoTab />
        </ATabPane>
        <ATabPane tab="Situação cadastral" key="5">
          <GeralTab />
        </ATabPane>
        <ATabPane tab="Personalização" key="6">
          <GeralTab />
        </ATabPane> */}
        <ATabPane tab="Formas de Pagamento" key="8">
          <FormasPagamento />
        </ATabPane>
        <ATabPane tab="Despesas" key="9">
          <DespesasTab />
        </ATabPane>
        <ATabPane tab="Orçamento" key="10">
          <OrcamentoTab />
        </ATabPane>
        <ATabPane tab="WhatsApp" key="11">
          <WhatsApp />
        </ATabPane>
      </ATabs>
    </Container>
  );
}

export default Geral;
