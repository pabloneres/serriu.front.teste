import React from "react";

import { ContainerCard, DataContainer, NotaContainer } from "./styles";
import moment from "moment";

function CardNote({ data }) {
  if (!data) {
    return <></>;
  }

  return (
    <ContainerCard>
      <NotaContainer>{data.nota}</NotaContainer>
      <DataContainer>
        <span>
          Criado por{" "}
          <strong>
            {data.usuario.firstName} {data.usuario.lastName}
          </strong>{" "}
          &nbsp;
        </span>
        <span>
          em {moment(data.created_at).format("DD/MM/YYYY [às] HH:mm")}
        </span>
      </DataContainer>
    </ContainerCard>
  );
}

export default CardNote;
