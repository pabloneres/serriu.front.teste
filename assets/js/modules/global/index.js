import React from 'react';
import { RollbackOutlined } from '@ant-design/icons'

import { notification } from 'antd'
import styled from 'styled-components';

export const ContainerButton = styled.div`
	display:flex;
	align-items:center;
	cursor:pointer;
`;

export const Span = styled.span`
	margin-left:10px;
`;

export const FormRow = styled.div`
	padding:${props => props.padding ? 10 : 0};
	display:grid;
	gap:10px;
	grid-template-columns: ${props => props.columns ? `repeat(${props.columns}, 1fr)` : '1fr'};
`;

export const FormJustify = styled.div`
	width:100%;
	display:flex;
	justify-content:space-between;
	border-bottom:1px dashed black;
`;

export const Card = styled.div`
	background-color:white;
	padding:15px;
	width:100%;
	margin:20px 0;
	border-radius:10px;
`;

export const Notify = (type, title, message, duration = 4.5) => {
	switch( type )
	{
		case 'error':
			return notification[type]({
				message    : title,
				description: message,
				placement  : 'bottomRight',
				duration,
				style      : {backgroundColor: '#fff2f0', borderWidth: 1, border: 'solid #ffccc7'}
			});
		case 'success':
			return notification[type]({
				message    : title,
				description: message,
				placement  : 'bottomRight',
				duration,
				style      : {backgroundColor: '#f6ffed', borderWidth: 1, border: 'solid #b7eb8f'}
			});
		case 'warning':
			return notification[type]({
				message    : title,
				description: message,
				placement  : 'bottomRight',
				duration,
				style      : {backgroundColor: '#f5f5da', borderWidth: 1, border: 'solid #f5f5a4'}
			});

		default:
			break;
	}

}

export const BackComponent = ({action}) => {
	return (
		<ContainerButton onClick={() => action()}>
			<RollbackOutlined />
			<Span>
				Voltar
			</Span>
		</ContainerButton>
	)
}