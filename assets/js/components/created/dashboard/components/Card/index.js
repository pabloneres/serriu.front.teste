import React from "react";

import {
  Container,
  HeaderCard,
  Title,
  Infos,
  Info,
  InfoTitleContainer,
  InfoTitle,
  InfoDescription
} from "./styles";

import { DollarOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons";

function Card({ data, click }) {
  return (
    <Container onClick={() => click()}>
      <HeaderCard>
        <Title>{data.name}</Title>
      </HeaderCard>
      <Infos>
        <Info>
          <InfoTitleContainer>
            <SmileOutlined />
            <InfoTitle>Pacientes</InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>{data.__meta__.patients_count}</InfoDescription>
        </Info>

        <Info>
          <InfoTitleContainer>
            <UserOutlined />
            <InfoTitle>Dentistas</InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>{data.__meta__.dentists_count}</InfoDescription>
        </Info>

        <Info>
          <InfoTitleContainer>
            <DollarOutlined />
            <InfoTitle>Faturamento / Ultimo mês</InfoTitle>
          </InfoTitleContainer>
          <InfoDescription>R$ 84.541,00</InfoDescription>
        </Info>
      </Infos>
    </Container>
  );
}

export default Card;
