import styled from "styled-components";
import { Input } from 'antd'

const {TextArea} = Input

export const Container = styled.div`
	.activity_conclued {
		//background-color:#d1ffd1;
		color:green;
	}
	.activity_vencida {
		//background-color:#fcc5c5;
		color:red;

	}
`
export const Row       = styled.div`
	margin-bottom:15px;
	display:flex;
	align-items:flex-start;
	justifyContent:center;

	.ant-form-item {
		width:100%;
	}

`

export const IconContainer = styled.div`
	width:20px;
	margin-right:10px;
`

export const CreatorText           = styled.div`
	margin-top:18px;
	font-weight:600;
	color:#686868;
	display:flex;
	align-items:flex-end;
`
export const ContainerFooterDrawer = styled.div`
	width:100%;
	display:flex;
	flex-direction:row;
	justify-content:space-between;
	align-items:center;

	.check-container {
		margin-right:20px;
		.ant-checkbox-wrapper {
			margin-right:5px;
		}
	}

	.container-buttons {
		display:flex;
	}

	button {
		margin:0 5px;
	}
`
export const NotasContainer        = styled.div`
	margin-top:20px;
`
export const Notas                 = styled.div`
`
export const NoteList              = styled.div`
	margin:10px 0;
`

export const EditFieldContainer = styled.div`
	display:flex;
	//justify-content:space-between;
	align-items:center;

	.button-hide-hover {
		display:none;
	}

	&:hover {
		.button-hide-hover {
			display:flex;
		}
	}
`

export const ATextArea = styled(TextArea)`
	background-color:#fffcdb;
`

export const NoteItem = styled.div`
	border:1px solid #b0b0b0;
	padding:10px;
	background-color:#fffcdb;
	border-radius:5px;

	display:flex;
	flex-direction:column;

	.name-notes {
		color:#575757;
		font-weight:600;
		font-size:10px;
	}
	.description-notes {
		font-size:13px;
		color:#000;
	}

	:after {
		z-index:2;
		content:'';
		position:absolute;
		left:-6px;
		top:5px;
		border-bottom:1px solid #b0b0b0;
		border-left:1px solid #b0b0b0;
		transform:rotate(45deg);
		background-color:#fffcdb;
		width:12px;
		height:12px;
	}
`

export const ModifyHoursContainer = styled.div`
	margin-left:10px;
	display:flex;
	align-items:center;
	justify-content:center;
	font-size:18px;

	margin-top:5px;

	.anticon {
		margin-right:10px;
	}
`

export const ContainerFilters = styled.div`

	background-color:#eee;
	display:flex;
	align-items:center;
	justify-content:center;
	padding:5px;

`

export const Filter = styled.div`
	margin:0px 5px;
	padding:4px 10px;
	border:1px solid #eee;
	border-radius:5px;
	background-color:${props => props.active ? "#abfce9" : "#eee"};
	display:flex;
	justify-content:center;
	align-items:center;
	cursor:pointer;
	position:relative;
`

export const RowContainer = styled.div`
	display:flex;
	flex-direction:row;
	align-items:center;
	justify-content:space-between;
`


