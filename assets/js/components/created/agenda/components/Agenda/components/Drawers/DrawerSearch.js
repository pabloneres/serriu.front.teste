import React, { useEffect, useState } from "react";
import { Drawer, Empty } from "antd";
import { index } from "~/services/controller";
import { useSelector } from "react-redux";

import CardAgendamento from "../CardAgendamento";

function DrawerSearch({ searchPaciente, setSearchPaciente }) {
	const { token } = useSelector(state => state.auth);
	const { selectedClinic } = useSelector(state => state.clinic);

	const [agendamentos, setAgendamentos] = useState([]);

	useEffect(() => {
		if (searchPaciente) {
			load()
		}
	}, [searchPaciente, selectedClinic.id, token]);

	const load = () => {
		index("agendamento", { clinica_id: selectedClinic.id, paciente_id: searchPaciente, showAll: true }).then(({ data }) => {
			setAgendamentos(data);
		});
	}

	return (
		<Drawer
			destroyOnClose={true}
			title="Agendamentos do cliente"
			width={600}
			visible={searchPaciente ? true : false}
			onClose={() => setSearchPaciente(undefined)}
		>
			{agendamentos.length > 0 ? (
				agendamentos.map((item, index) => {
					return <CardAgendamento key={index} data={item} />;
				})
			) : (
				<Empty description="Nenhum agendamento encontrado" />
			)}
		</Drawer>
	);
}

export default DrawerSearch;
