import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
`;

export const ContainerColumns = styled.div`
  display: flex;
  justify-content: space-bewtween;
  width: 100%;
  height: calc(100vh - 160px);
`

export const Column = styled.div`
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 100%;
  margin: 0 30px;
  padding: 10px 20px;
  padding-bottom: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: transparent;
`
export const ContainerCards = styled.div`
  flex: 1;
  overflow: auto;
`

export const Line = styled.div`
  width: 100%;
  height: 5px; 
  border-radius: 5px 5px 0 0;
  background-color: ${({background}) => background};
  `

  export const Title = styled.div`
  width: 100%;
  border-radius: 3px;
  border: 1px solid #d9d9d9;
  display: flex;
  justify-content: center;
  align-itens: center;
  font-weight: bold;
  font-size: 1.3rem;
  color: #000;
  margin-bottom: 10px;
  padding: 5px 0;
  `

  export const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-itens: center;
  font-weight: bold;
  font-size: 1.3rem;
  color: #404040;
  margin-bottom: 10px;
  `

export const Card = styled.div`
  width: 100%;
  border-radius: 10px;
  min-height: 20px;
  padding: 20px;
  margin-bottom: 10px;
  background-color: #fff;
  box-shadow: 8px 3px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid #f0f0f0;
`
export const Row = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;
export const RowCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify ? props.justify : 'flex-start'}
`;

export const NameDentista = styled.span`
  color: #707070;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 10px;
`;

export const DataText = styled.span`
  color: #707070;
  font-size: 1rem;
  margin: 0 10px;
`;


