import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { Table, Card, Button, Modal, Input, Form, Tooltip, Space } from "antd";
import { index, show, store, destroy } from "~/services/controller";
import { useSelector } from "react-redux";
import InputCurrency from "~/utils/Currency";
import Fechamento from "./components/Fechamento";
import { convertDate, convertMoney } from "~/modules/Util";
import { Notify } from "~/modules/global";
import { ExclamationCircleOutlined } from "@ant-design/icons";

function Caixas() {
	const {token, userData} = useSelector(state => state.auth);
	const {selectedClinic}  = useSelector(state => state.clinic);

	const [showModal, setShowModal]           = useState(false);
	const [showModalOpen, setShowModalOpen]   = useState(undefined);
	const [showModalClose, setShowModalClose] = useState(undefined);
	const [name, setName]                     = useState();
	const [reload, setReload]                 = useState(false);
	const [valorInicial, setValorInicial]     = useState();
	const [metodos, setMetodos]               = useState([]);

	const [caixas, setCaixas] = useState([]);

	const permission = userData.department_id !== "administrador" ? false : true;

	useEffect(() => {
		index("caixa", {clinic_id: selectedClinic.id}).then(({data}) => {
			if( !permission )
			{
				const caixas = data.filter(
					item => !item.abertura || item.abertura.user_id === userData.id
				);
				setCaixas(caixas);
			}
			else
			{
				setCaixas(data);
			}
		});
	}, [permission, reload, selectedClinic.id, userData.id]);

	useEffect(() => {
		index("metodosPagamento").then(({data}) => {
			setMetodos(data);
		});
	}, []);

	const returnStatus = status => {
		switch( status )
		{
			case 0:
				return "Fechado";
				break;
			case 1:
				return "Aberto";
			default:
				break;
		}
	};

	function confirm(id) {
		Modal.confirm({
			title     : "Confirmar",
			icon      : <ExclamationCircleOutlined />,
			content   : `Deseja excluir o caixa ?`,
			okText    : "Sim",
			cancelText: "Nâo",
			onOk      : () => handleDelete(id)
		});
	}

	const handleDelete = id => {
		destroy("caixa", id)
		.then(() => {
			setReload(!reload);
		})
		.catch(() => {
			return Notify("error", "Não permitido");
		});
	};

	const columns = [
		{
			title    : "Caixa",
			dataIndex: "name"
		},
		{
			title    : "Usuário",
			dataIndex: "abertura",
			render   : data => (
				<span>
          {data && data.usuario
			  ? `${data.usuario.firstName} ${data.usuario.lastName}`
			  : "-"}
        </span>
			)
		},
		{
			title : "Status",
			render: data => (
				<span>
          {returnStatus(data.status)}
					{" | "}
					{data.abertura ? convertDate(data.abertura.created_at) : ""}
        </span>
			)
		},
		{
			title : "Ações",
			width : 120,
			render: data => (
				<Space>
					{data.status === 0 ? (
						<Tooltip title="Abrir caixa">
							<a onClick={() => setShowModalOpen(data.id)}>
								Abrir Caixa
							</a>
						</Tooltip>
					) : (
						<Tooltip title="Fechar caixa">
							<a onClick={() => setShowModalClose(data.id)}>
								Fechar Caixa
							</a>
						</Tooltip>
					)}
					{permission ? (
						<Tooltip title="Excluir caixa">
							<a onClick={() => confirm(data.id)}>
								<i class="fas fa-trash-alt"></i>
							</a>
						</Tooltip>
					) : (
						<></>
					)}
				</Space>
			)
		}
	];

	const handleOpen     = () => {
		store(`/caixa/abrir/${showModalOpen}`, {
			valor: valorInicial
		})
		.then(_ => {
			setReload(!reload);
			setShowModalOpen(undefined);
			setValorInicial(0);
			return Notify("success", "Caixa aberto");
		})
		.catch(_ => {
			setReload(!reload);
			setShowModalOpen(undefined);
			setValorInicial(0);
			return Notify("error", "Não permitido");
		});
	};
	const handleClose    = () => {
		store(`/caixa/fechar/${showModalOpen}`, {
			valor: valorInicial
		}).then(_ => {
			setReload(!reload);
			setShowModalOpen(undefined);
		});
	};
	const send           = data => {
		let obj = {};
		data.forEach(e => {
			obj = {...obj, [e.value]: e.valor};
		});

		store(`caixa/fechar/${showModalClose}`, obj).then(({data}) => {
			setReload(!reload);
			setShowModalClose(undefined);
		});
	};
	const handleAddCaixa = () => {
		store("caixa/criar", {
			clinic_id: selectedClinic.id,
			name     : name
		}).then(({data}) => {
			setReload(!reload);
			setShowModal(false);
			setName("");
		});
	};

	return (
		<Card
			title="Caixas"
			extra={
				<>
					{permission ? (
						<Button type="primary" onClick={() => setShowModal(true)}>
							Adicionar
						</Button>
					) : (
						<></>
					)}
				</>
			}
		>
			<Modal
				width={1000}
				title="Fechar caixa"
				visible={showModalClose ? true : false}
				footer={null}
				okText="Abrir"
				cancelText="Cancelar"
				onCancel={() => setShowModalClose()}
			>
				<Fechamento
					utils={{
						metodos
					}}
					send={send}
				/>
			</Modal>
			<Modal
				closable={false}
				title="Abrir caixa"
				visible={showModalOpen ? true : false}
				onCancel={() => setShowModalOpen(undefined)}
				onOk={handleOpen}
				okText="Abrir"
				cancelText="Cancelar"
			>
				<Form layout="vertical">
					<Form.Item label="Valor inicial">
						<InputCurrency
							onChange={e => setValorInicial(e)}
							value={valorInicial}
						/>
					</Form.Item>
				</Form>
			</Modal>
			<Modal
				title="Adicionar caixa"
				visible={showModal}
				onCancel={() => setShowModal(false)}
				onOk={handleAddCaixa}
				okText="Adicionar"
				cancelText="Cancelar"
			>
				<Form layout="vertical">
					<Form.Item label="Nome">
						<Input onChange={e => setName(e.target.value)} value={name} />
					</Form.Item>
				</Form>
			</Modal>
			<Table
				size="small"
				columns={columns}
				dataSource={caixas}
				pagination={false}
			/>
		</Card>
	);
}

export default Caixas;
