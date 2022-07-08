import React, { useState, useEffect } from "react";

import { Table, Space, Tooltip, Card, Skeleton, Empty, Modal } from "antd";
import {
  DollarCircleOutlined,
  FolderOpenOutlined,
  EditOutlined
} from "@ant-design/icons";
import { index, show } from "~/services/controller";
import { useSelector, useDispatch } from "react-redux";
import { useRouteMatch } from "react-router-dom";

import { convertMoney, convertDate } from "~/modules/Util";

import CardTable from "./components/card";

import ModalPayment from "./components/modalPayment";

function Financeiro() {
  const { selectedClinic } = useSelector(state => state.clinic);

  const { params } = useRouteMatch();

  const [modal, setModal] = useState(undefined);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(true);

  const [orcamentos, setOrcamentos] = useState([]);

  const [hascaixa, setHasCaixa] = useState(true);

  useEffect(() => {
    index("orcamentos", {
      paciente_id: params.id,
      status: "",
      returnType: "1"
    }).then(({ data }) => {
      setOrcamentos(data);
      setLoading(false);
    })
      .catch(err => { });
  }, [reload, params.id]);

  const loadOrcamento = id => {
    show("/orcamentos", id).then(async ({ data }) => {
      const paciente = await show("/patient", params.id).then(
        ({ data }) => {
          return data;
        }
      );
      setModal({ ...data, paciente });
    });
  };

  useEffect(() => {
    show("caixa/status", selectedClinic.id)
      .then(({ data }) => {
        setHasCaixa(data);
        if (!data) {
          warningModal();
        }
      })
      .catch(() => { });
  }, [selectedClinic.id]);

  function warningModal() {
    Modal.warning({
      title: "Atenção",
      content: "Nenhum caixa aberto!"
    });
  }

  if (loading) {
    return (
      <Card style={{ marginTop: 20 }}>
        <Skeleton active={true} rows={10} />
      </Card>
    );
  }

  if (!loading && orcamentos.length === 0) {
    return (
      <Card style={{ marginTop: 20 }}>
        <Empty description="Sem dados" />
      </Card>
    );
  }

  const close = () => {
    setModal(undefined);
    setReload(!reload);
  };

  return (
    <>
      <ModalPayment modal={modal} close={close} setModal={setModal} />

      {orcamentos.map((card, index) => (
        <CardTable
          key={card.id}
          data={card}
          modal={loadOrcamento}
          loading={loading}
          hascaixa={hascaixa}
        />
      ))}
    </>
  );
}

export default Financeiro;
