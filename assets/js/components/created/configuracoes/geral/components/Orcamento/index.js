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
import AdicionarOrcamentoPage from "./orcamentoForm/AdicionarOrcamentoPage";

import { Notify } from "~/modules/global";

function Orcamento(props) {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [cargos, setCargos] = useState([]);
  const [configs, setConfigs] = useState({});
  const [initial, setInital] = useState(undefined);

  const [reload, setReload] = useState(false);

  // useEffect(() => {
  //   show(token, "/clinicConfig", selectedClinic.id).then(({ data }) => {
  //     setConfigs(data);
  //     setInital({
  //       ...initial,
  //       workBoletos: data.workBoletos,
  //       maxParcelas: data.maxParcelas,
  //       entMinima: data.entMinima,
  //       comissao_boleto: data.comissao_boleto
  //     });
  //   });
  // }, [initial, reload, selectedClinic.id, token]);

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
    <Container>
      <AdicionarOrcamentoPage />
    </Container>
  );
}

export default Orcamento;
