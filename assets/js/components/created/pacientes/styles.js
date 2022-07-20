import styled from "styled-components";
import { Card, Form, Input, Row, Select, Button, Steps } from "antd";
import Mask from "~/utils/mask";

export const Container = styled.div``;

export const CardContainer = styled(Card)``;

export const Formulario = styled(Form)``;

export const Item = styled(Form.Item)`
	width:100%;
`;

export const InputForm = styled(Input)``;

export const InputMask = styled(Mask)``;

export const SelectForm = styled(Select)``;

export const RowForm = styled.div`
	display:grid;
	gap:20px;
	grid-template-columns: ${props =>
		props.columns ? `repeat(${props.columns}, 1fr)` : "repeat(1, 1fr)"};
`;

export const SectionForm = styled.div``;

export const SectionTitle = styled.div`
	margin:10px 0 20px;
`;

export const Title = styled.span``;

export const FormButton = styled(Button)``;

export const ButtonContainer = styled.div`
	width:100%;
	display:flex;
	justify-content:flex-end;
`;

export const StepsContainer = styled(Steps)``;

export const Separate = styled.div`
	width:100%;
	border-bottom:1px solid black;
	margin:30px 0;
	border-color:#c4c4c4;
`;

export const InfoPatientContainer = styled.div`
	background-color:#f6f6f6;
	padding:15px;
	margin-bottom:20px;
	border-radius:10px;
	display:flex;
	flex-direction:row;

	img {
		border-radius:50%;
		width:90px;
		height:90px;
		margin-right:50px;
	}

	.infos_container {
		display:flex;
		flex-direction:row;
	}

	.info {
		margin-right:30px;

		h3 {
			font-size:16px;
			font-weight:bold;
			color:#2D3748;
		}
		span {
			font-size:14px;
		}
	}
`