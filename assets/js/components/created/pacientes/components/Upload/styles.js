import styled from "styled-components";
import { Upload, Button, Image } from "antd";

export const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
`;

export const ContainerTitle = styled.div``;

export const Title = styled.span`
  font-size: 20px;
`;

export const ContainerUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const ImageUpload = styled(Image)`
  height: 350px;
  margin: 10px 0;
`;
export const UploadButton = styled(Button)``;
