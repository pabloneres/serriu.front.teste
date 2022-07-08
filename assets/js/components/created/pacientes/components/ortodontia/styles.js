import styled from "styled-components";
import { Table } from 'antd'
import { UITable } from "~/components/created/UISerriu";

export const OrtodontiaContainer = styled.div`

`

export const ATable = styled(UITable)`
	.ant-table-cell {
		padding:2px 8px !important;
	}

	height:100%;
`

export const ContainerTable = styled.div`
	width:${props => props.width || "100%"};
	display:flex;
	margin-left:20px;
	flex-direction:column;
	align-items:center;
`

export const TitleTableContainer = styled.div`
	width:100%;
	background-color:#0BB7AF;
	border-radius:10px;
	margin-bottom:10px;
	padding:3px;
	text-align:center;
	color:#fff;
	font-size:15px;
`

export const MonthRender = styled.div`
	border-radius:8px;
	border:1px solid #62C1D0;
	color:#62C1D0;
	font-weight:bold;
	height:25px;
	cursor:pointer;
	&:hover {
		background-color:#a7edfd;
	}
`

export const MonthPadding = styled.div`
	border:1px;
	height:25px;
`

export const DayRender = styled.div`

	font-size:14px;
	span {
		font-size:10px;
		color:#62C1D0;
		margin-right:5px;
	}
`