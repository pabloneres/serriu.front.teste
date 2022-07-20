import React, { useState, useEffect } from "react";

import { Container } from "./styles";
import { Table, Space, Tooltip, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { index, store, show } from "~/services/controller";
import { useRouteMatch } from "react-router-dom";
import {
  FolderOpenOutlined,
  DollarCircleOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  BarcodeOutlined,
  ShareAltOutlined
} from "@ant-design/icons";
import { convertDate, convertMoney, convertDateNoTime } from "~/modules/Util";

function Boletos({ data, modal }) {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const { params } = useRouteMatch();
  const [orcamentos, setOrcamentos] = useState([]);
  const [reload, setReload] = useState(false);
  const [paciente, setPaciente] = useState();

  useEffect(() => {
    index("boletos", {
      paciente_id: params.id
    }).then(({ data }) => {
      setOrcamentos(data);
    });
    show("/patient", params.id).then(({ data }) => {
      setPaciente(data);
    });
  }, [params.id, reload]);

  const apiWhatsApp = boleto => {
    const message = `Olá seu boleto vence hoje, segue o link para efetuar o pagamento: ${boleto}`;
    return `https://api.whatsapp.com/send?phone=55${paciente.tel
      }&text=${encodeURI(message)}`;
  };

  const ReturnStatus = status => {
    switch (status) {
      case "salvo":
        return <span style={{ color: "orange" }}>Cliente não verificado</span>;
      case "pago":
        return <span style={{ color: "green" }}>Paga</span>;
      case "PENDING":
        return <span style={{ color: "green" }}>Pendente</span>;
      case "RECEIVED_IN_CASH":
        return <span style={{ color: "green" }}>Recebida em dinheiro</span>;
      case "RECEIVED":
        return <span style={{ color: "green" }}>Recebida</span>;

      default:
        return status;
    }
  };

  const columnsTotal = [
    {
      title: "Criado em",
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Orçamento",
      dataIndex: "orcamento_id"
    },
    {
      title: "Negociação",
      dataIndex: "id"
    },
    {
      title: "Total da negociação",
      dataIndex: "negociacao",
      render: data => <span>{convertMoney(data.total)}</span>
    },
    {
      title: "Entrada",
      dataIndex: "entrada",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Parcelas",
      render: data => (
        <span>
          {data.parcelas} X{" "}
          {convertMoney((data.negociacao.total - data.entrada) / data.parcelas)}
        </span>
      )
    },
    {
      title: "Ações",
      render: data => (
        <Space size="middle">
          <Tooltip title="Imprimir carnê">
            <span
              onClick={() => window.open(data.carneLink, "_blank")}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <PrinterOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
        </Space>
      )
    }
  ];

  const confirmarRecebimentoDInheiro = data => {
    Modal.confirm({
      title: "Confirmar recebimento em dinheiro ?",
      icon: <ExclamationCircleOutlined />,
      content: `Deseja confirmar o recebimento da ${data.description
        } No valor de ${convertMoney(data.value)} ?`,
      okText: "Sim",
      cancelText: "Não",
      onOk() {
        handlePaynentCash(data.id);
      },
      onCancel() { }
    });
  };

  const handlePaynentCash = id => {
    store(`/asaas/paymentCash/${id}`, {
      clinica_id: selectedClinic.id
    }).then(() => {
      setReload(!reload);
    });
  };

  const columnsBoletoInner = [
    {
      title: "Criado em",
      dataIndex: "created_at",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Descrição",
      dataIndex: "description",
      width: 300,
      render: data => (
        <>
          {data ? (
            <Tooltip
              overlayStyle={{ maxWidth: 400, minWidth: 400 }}
              placement="top"
              title={data}
            >
              <span>{String(data).substr(0, 30)}...</span>
            </Tooltip>
          ) : (
            "Entrada"
          )}
        </>
      )
    },
    {
      title: "Parcela",
      render: data => (
        <span>{data.description ? data.description.split(".")[0] : "-"}</span>
      )
    },
    {
      title: "Nª fatura",
      dataIndex: "invoiceNumber",
      render: data => <span>{data ? data : "-"}</span>
    },
    {
      title: "Valor",
      render: data => (
        <span>
          {data.valor
            ? convertMoney(data.valor) + ` (${data.formaPagamento})`
            : convertMoney(data.value)}
        </span>
      )
    },
    {
      title: "Vencimento",
      render: data => (
        <span>
          {data.vencimento
            ? convertDateNoTime(data.vencimento)
            : convertDateNoTime(data.dueDate)}
        </span>
      )
    },
    {
      title: "Pagamento",
      render: data => (
        <span>
          {data.paymentDate ? (
            <>
              {convertDateNoTime(data.paymentDate)}{" "}
              <CheckCircleOutlined style={{ color: "green" }} />
            </>
          ) : data.valor ? (
            convertDateNoTime(data.updated_at)
          ) : (
            <ClockCircleOutlined />
          )}
        </span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      render: data => <span>{ReturnStatus(data)}</span>
    },
    {
      title: "Ações",
      render: data => (
        <Space size="middle">
          <Tooltip placement="top" title="Visualizar boleto">
            <span
              onClick={() => window.open(data.bankSlipUrl, "_blank")}
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <BarcodeOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>

          {data.status !== "RECEIVED" &&
            data.status !== "RECEIVED_IN_CASH" &&
            data.status !== "AGUARDANDO" ? (
            <Tooltip placement="top" title="Confirmar recebimento em dinheiro">
              <span
                onClick={() => confirmarRecebimentoDInheiro(data)}
                style={{ cursor: "pointer" }}
                className="svg-icon menu-icon"
              >
                <DollarCircleOutlined twoToneColor="#fff" />
              </span>
            </Tooltip>
          ) : (
            <></>
          )}
          <Tooltip placement="top" title="Compartilhar boleto">
            <span
              onClick={() =>
                window.open(apiWhatsApp(data.bankSlipUrl), "_blank")
              }
              style={{ cursor: "pointer" }}
              className="svg-icon menu-icon"
            >
              <ShareAltOutlined twoToneColor="#fff" />
            </span>
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Table
      size="small"
      columns={columnsTotal}
      rowKey="id"
      dataSource={orcamentos}
      expandable={{
        rowExpandable: record => record.boletos.length > 0,
        expandedRowRender: (record, index, indent, expanded) => (
          <Table
            size="small"
            columns={columnsBoletoInner}
            dataSource={record.boletos}
            pagination={false}
          />
        )
      }}
    />
  );
}

export default Boletos;
