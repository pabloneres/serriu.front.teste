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
  resumoCobranca,
  data,
  boletoParams,
  valor,
  back,
  paciente,
  send,
  showBack = true,
  width = 49,
  showButtons = true
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
          {!returnDisabledVerified() ? (
            <div>
              <Button
                onClick={() => {
                  send("gerar");
                }}
                type="primary"
                block
              >
                Gerar boletos
              </Button>
            </div>
          ) : (
            <></>
          )}

          <div style={{ marginTop: 10 }}>
            <Button
              onClick={() => {
                send("salvar");
              }}
              type="primary"
              block
            >
              Salvar negociação
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
