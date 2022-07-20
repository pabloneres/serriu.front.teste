import React, { useEffect, useState } from "react";
import {
  Container,
  Span,
  AInput,
  AForm,
  ACheckBox,
  ASelect,
  ARadio,
  ARow,
  AButton
} from "./styles";
import { index, show, update } from "~/controllers/controller";
import { useSelector, useDispatch } from "react-redux";
import {
  Store,
  Select,
  ChangeConfig
} from "~/store/modules/clinic/Clinic.actions";

import { Notify } from "~/modules/global";

function Boleto(props) {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [cargos, setCargos] = useState([]);
  const [configs, setConfigs] = useState({});
  const [initial, setInital] = useState(undefined);

  const [reload, setReload] = useState(false);

  useEffect(() => {
    show(token, "/clinicConfig", selectedClinic.id).then(({ data }) => {
      setConfigs(data);
      setInital({
        ...initial,
        workBoletos: data.workBoletos,
        maxParcelas: data.maxParcelas,
        entMinima: data.entMinima,
        comissao_boleto: data.comissao_boleto
      });
    });
  }, [initial, reload, selectedClinic.id, token]);

  const sendConfigs = e => {
    update(token, "/clinicConfig", configs.id, e)
      .then(_ => {
        dispatch(ChangeConfig({ ...selectedClinic, config: e }));
        setReload(!reload);
        return Notify(
          "success",
          "Sucesso",
          "Configurações da clinicas foram atualizadas"
        );
      })
      .catch(err => {
        return Notify("error", "Erro", "Erro ao atualizar");
      });
  };

  return (
    <Container title="Boleto">
      {initial ? (
        <AForm
          layout="vertical"
          initialValues={initial}
          onFinish={e => sendConfigs(e)}
        >
          <ARow>
            <AForm.Item
              label="Essa clinica trabalha com boletos ?"
              name="workBoletos"
            >
              <ARadio.Group
                onChange={e =>
                  setConfigs({ ...configs, workBoletos: e.target.value })
                }
              >
                <ARadio value={true}>Sim</ARadio>
                <ARadio value={false}>Não</ARadio>
              </ARadio.Group>
            </AForm.Item>
          </ARow>
          <ARow>
            <AForm.Item
              label="Quantidade máxima de parcelas"
              name="maxParcelas"
            >
              <ASelect
                disabled={configs.workBoletos === false}
                options={[...Array(10).keys()].map((item, index) => ({
                  label: `${index + 1}X`,
                  value: index + 1
                }))}
              />
            </AForm.Item>
          </ARow>
          <ARow>
            <AForm.Item label="Entrada mínima permitida" name="entMinima">
              <AInput
                type="number"
                disabled={configs.workBoletos === false}
                suffix="%"
              />
            </AForm.Item>
          </ARow>
          <ARow>
            <AForm.Item
              label="Pagamento de comissão em boleto"
              name="comissao_boleto"
            >
              <ASelect
                disabled={configs.workBoletos === false}
                options={[
                  {
                    label: "Procedimento",
                    value: "procedimento"
                  },
                  {
                    label: "Orçamento",
                    value: "orcamento"
                  },
                  {
                    label: "Concluido",
                    value: "concluido"
                  }
                ]}
              />
            </AForm.Item>
          </ARow>
          <AButton htmlType="submit">Enviar</AButton>
        </AForm>
      ) : (
        ""
      )}
    </Container>
  );
}

export default Boleto;
