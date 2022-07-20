import React from "react";

import { ContainerWrapper, ResumoContainer, InfoRow } from "./styles";
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { BackComponent } from "~/modules/global";
import moment from "moment";
import {
  Table,
  Select,
  Button,
  Tooltip,
  Input,
  InputNumber,
  DatePicker,
  Form,
  Modal
} from "antd";
const { TextArea } = Input;

function Resumo({
  faturamento,
  resumoCobranca,
  data,
  boletoParams,
  valor,
  back,
  paciente,
  send,
  sendBoleto,
  gerar,
  showBack = true,
  width = 49,
  showButtons = true,
  close,
  loadingGerar,
  formaPagamento,
  setFormaPagamento
}) {
  const returnDisabledVerified = () => {
    if (
      paciente.cpf_verified === 0 ||
      paciente.rg_verified === 0 ||
      paciente.address_verified === 0
    ) {
      return true; // true = desabilitado
    }

    return false;
  };

  return (
    <ContainerWrapper style={{ width: `${width}%` }}>
      {showBack ? <BackComponent action={back} /> : <></>}
      <ResumoContainer>
        {resumoCobranca ? (
          <>
            <div className="header-panel-resumo">
              <span>Resumo</span>
            </div>

            <InfoRow>
              <span>Tipo da cobrança</span>
              <span>{resumoCobranca.tipoCobranca}</span>
            </InfoRow>

            <InfoRow>
              <span>Valor da cobrança</span>
              <span>{convertMoney(valor)}</span>
            </InfoRow>

            <InfoRow>
              <span>Entrada</span>
              <span>{convertMoney(boletoParams.entrada)}</span>
            </InfoRow>

            {boletoParams.parcelas ? (
              <InfoRow>
                <span>Parcelas</span>
                <span>
                  {boletoParams.parcelas} parcelas de{" "}
                  {convertMoney(
                    (valor - boletoParams.entrada) / boletoParams.parcelas
                  )}{" "}
                  ({convertMoney(valor - boletoParams.entrada)})
                </span>
              </InfoRow>
            ) : (
              ""
            )}

            <InfoRow>
              <span>Nome do cliente</span>
              <span>
                {paciente.firstName} {paciente.lastName}
              </span>
            </InfoRow>

            <InfoRow>
              <span>E-mail do cliente</span>
              <span>{paciente.email}</span>
            </InfoRow>

            {resumoCobranca.vencimento ? (
              <InfoRow>
                <span>Data vencimento</span>
                <span>{moment(boletoParams.vencimento).format("L")}</span>
              </InfoRow>
            ) : (
              ""
            )}

            {/* <InfoRow>
              <span>Método de pagamento</span>
              <span>{boletoParams.metodoPagamento}</span>
            </InfoRow> */}

            <div className="info-boleto label-descricao">
              <span>Descrição</span>
              <TextArea
                showCount
                maxLength={200}
                value={resumoCobranca.descricao}
                disabled
                // onChange={(e) =>
                //   setResumoCobranca({
                //     ...resumoCobranca,
                //     descricao: e.target.value,
                //   })
                // }
              />
            </div>
          </>
        ) : (
          ""
        )}
      </ResumoContainer>

      {showButtons ? (
        <>
          {!returnDisabledVerified() && faturamento ? (
            <div>
              <Button
                loading={loadingGerar}
                onClick={() => gerar()}
                type="primary"
                block
              >
                Gerar boletos
              </Button>
            </div>
          ) : (
            <></>
          )}

          <div>
            {returnDisabledVerified() && !faturamento ? (
              <Button onClick={() => send()} type="primary" block>
                Receber entrada e salvar negociação
              </Button>
            ) : (
              <></>
            )}

            {!returnDisabledVerified() ? (
              <>
                <div className="header-pagamento">
                  <span>Selecione a forma de pagamento</span>
                </div>
                <Select
                  style={{ width: "100%", marginBottom: 10 }}
                  value={formaPagamento}
                  options={[
                    {
                      label: "Dinheiro",
                      value: "dinheiro"
                    },
                    {
                      label: "Débito",
                      value: "debito"
                    },
                    {
                      label: "Crédito",
                      value: "credito"
                    },
                    {
                      label: "Pix",
                      value: "pix"
                    }
                  ]}
                  onChange={e => {
                    setFormaPagamento(e);
                  }}
                />
                <Button
                  style={{ marginTop: 5 }}
                  onClick={() => {
                    sendBoleto();
                  }}
                  type="primary"
                  block
                  loading={loadingGerar}
                >
                  Receber entrada e gerar boletos
                </Button>
              </>
            ) : (
              <></>
            )}

            <Button style={{ marginTop: 5 }} onClick={() => close()} block>
              Fechar
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </ContainerWrapper>
  );
}

export default Resumo;
