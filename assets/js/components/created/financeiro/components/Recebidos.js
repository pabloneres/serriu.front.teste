import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Link } from "react-router-dom";

import { Table, Modal, Button, Form, Col, InputGroup } from "react-bootstrap";

 
import { useHistory, useRouteMatch } from "react-router-dom";
import { useSelector, connect } from "react-redux";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "~/_metronic/_helpers";
import { index, update, show } from "~/controllers/controller";

export function Recebidos(props) {
  const { params, url } = useRouteMatch();
  const { intl } = props;
  const {
    user: { authToken }
  } = useSelector(state => state.auth);
  const history = useHistory();

  const [reload, setReload] = useState(false);

  const [modal, setModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const [paymentInfos, setPaymentInfos] = useState();

  const [pagamentos, setPagamentos] = useState();

  const [ordem, setOrdem] = useState(undefined);
  const [orcamento, setOrcamento] = useState(undefined);

  const [showModal, setShowModal] = useState(false);

  // useEffect(() => {
  //   index(authToken, `/financeiro/user?status_id=${3}&pago=${1}`).then(
  //     ({ data }) => {
  //       setPagamentos(data);
  //     }
  //   );
  // }, [reload]);

  if (!pagamentos) {
    return <></>;
  }

  const ModalPayment = props => {
    return (
      <Modal show={modal} onHide={() => { }} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar pagamento ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja confirmar pagamento de {paymentInfos.pacientes.name} ?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setModal(false);
            }}
          >
            Cancelar
          </Button>
          <Button variant="primary" onClick={() => payment()}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handlePayment = data => {
    console.log(data);
    setPaymentInfos(data);
    setModal(true);
  };

  const payment = () => {
    update(
      `/financeiro/pagamento?ordem_id=${paymentInfos.id}
    &procedimento_id=${paymentInfos.procedimentos_orcamentos_id}
    &is_entrada=${paymentInfos.is_entrada}`,
      null,
      null,
      authToken
    ).then(() => {
      setReload(!reload);
    });
    setModal(!modal);
  };

  function ReturnStatus(status) {
    switch (status) {
      case 0:
        return <strong style={{ color: "red" }}>Salvo</strong>;
      case 1:
        return <strong style={{ color: "green" }}>Aprovado</strong>;
      case 2:
        return <strong style={{ color: "orange" }}>Em andamento</strong>;
      case 3:
        return <strong style={{ color: "blue" }}>Executado</strong>;
    }
  }

  function returnReferencia(params) {
    console.log(params);

    if (params.is_entrada === 1) {
      return "Entrada do Orçamento";
    }

    if (params.cobranca === "total") {
      return "Total do Orçamento";
    }

    return "Procedimento Executado";
  }

  const viewDetails = ordem => {
    show(authToken, "/orcamento", ordem.orcamento_id).then(({ data }) => {
      setOrcamento(data);
      setOrdem(ordem);
      setModalInfo(!modalInfo);
    });
  };

  const ShowModal = () => {
    if (!ordem || !orcamento) {
      return <></>;
    }

    return (
      <Modal show={modalInfo} size="lg">
        <Modal.Header>Orçamento</Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Informações</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Referência</td>
                <td>{returnReferencia(ordem)}</td>
              </tr>
              <tr>
                <td>Dentista</td>
                <td>{orcamento.dentistas.name}</td>
              </tr>
              <tr>
                <td>Data</td>
                <td>{orcamento.criado_em}</td>
              </tr>
              <tr>
                <td>Status do Orçamento</td>
                <td>{ReturnStatus(orcamento.status)}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Procedimentos</th>
                <th>Dente</th>
                <th>Faces</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orcamento.procedimentos_orcamentos
                ? orcamento.procedimentos_orcamentos.map(procedimento => (
                  <tr key={procedimento.id}>
                    <td>{procedimento.procedimento_nome}</td>
                    <td>
                      {procedimento.label ? procedimento.label : "Geral"}
                    </td>
                    <td>
                      {procedimento.faces.lenght && procedimento.faces.lenght > 0
                        ? procedimento.faces.map(face => (
                          <span style={{ color: "red" }}>
                            {face.label}{" "}
                          </span>
                        ))
                        : "Geral"}
                    </td>
                    <td>
                      {procedimento.valor.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL"
                      })}
                    </td>
                    <td>
                      {procedimento.status === 1 ? (
                        <span style={{ color: "green" }}>Executado</span>
                      ) : (
                        <span style={{ color: "red" }}>Pendente</span>
                      )}
                    </td>
                  </tr>
                ))
                : ""}
            </tbody>
          </Table>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Forma de pagamento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Forma Cobrança</td>
                <td>{ordem.cobranca === "total" ? "Total" : "Procedimento"}</td>
              </tr>
              <tr>
                <td>Forma de Pagamento</td>
                <td>
                  {ordem.pagamento === "dinheiro" ? "Dinheiro" : "Boleto"}
                </td>
              </tr>
              <tr>
                <td>Condição de Pagamento</td>
                <td>{ordem.condicao === "vista" ? "À vista" : "Parcelado"}</td>
              </tr>

              {ordem.condicao === "parcelado" ? (
                <tr>
                  <td>Parcelamento</td>
                  <td>
                    {ordem.valor
                      ? `Entrada de ${ordem.valor.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL"
                      })} + `
                      : ""}
                    <span style={{ color: "red" }}>
                      {`${orcamento.parcelas} X ${(
                        (orcamento.total - orcamento.entrada) /
                        orcamento.parcelas
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL"
                      })}`}
                    </span>
                  </td>
                </tr>
              ) : (
                ""
              )}
            </tbody>
          </Table>
          <div
            className="text-right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>
              Total{" "}
              <strong>
                {ordem.valor.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL"
                })}
              </strong>
            </span>
            <div>
              {ordem.pago === 0 ? (
                <Button
                  onClick={() => {
                    setShowModal(!showModal);
                    handlePayment({
                      id: ordem.id,
                      name: ordem.pacientes.name
                    });
                  }}
                  className="mr-2"
                  variant="primary"
                >
                  Receber
                </Button>
              ) : (
                ""
              )}
              <Button
                onClick={() => {
                  setModalInfo(!modalInfo);
                }}
                className="mr-2"
                variant="danger"
              >
                Fechar
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return (
    <Card>
      {modal ? <ModalPayment /> : ""}
      <ShowModal />
      <CardHeader title="A Receber"></CardHeader>
      <CardBody>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Data</th>
              <th>Paciente</th>
              <th>Dentista</th>
              <th>Valor</th>
              <th style={{ width: 100 }}></th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map(item => (
              <tr key={item.id}>
                <td>{item.criado_em}</td>
                <td>{item.pacientes.name}</td>
                <td>{item.dentistas.name}</td>
                <td>
                  {item.valor.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL"
                  })}
                </td>
                <td style={{ display: "flex", justifyContent: "space-around" }}>
                  <span
                    onClick={() => viewDetails(item)}
                    style={{ cursor: "pointer" }}
                    className="svg-icon menu-icon"
                  >
                    <SVG
                      style={{
                        fill: "#3699FF",
                        color: "#3699FF",
                        marginLeft: 8
                      }}
                      src={toAbsoluteUrl("/media/svg/icons/Design/view.svg")}
                    />
                  </span>
                  {/* <span
                    onClick={() => handlePayment(item)}
                    style={{ cursor: "pointer" }}
                    className="svg-icon menu-icon"
                  >
                    <SVG
                      style={{
                        fill: "#3699FF",
                        color: "#3699FF",
                        marginLeft: 8,
                      }}
                      src={toAbsoluteUrl("/media/svg/icons/Design/Money.svg")}
                    />
                  </span> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
}
