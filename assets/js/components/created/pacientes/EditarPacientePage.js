import React, { useState, useEffect } from "react";

import { useHistory, useRouteMatch, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { show } from "~/controllers/controller";

import { Dados } from "./components/Dados";
import Upload from "./components/Upload";
import { Orcamentos } from "./components/Orcamentos";
import FichaClinica from "./components/fichaClinica";
import Financeiro from "./components/financeiro/index";
import Boletos from "./components/boletos";
import Agendamentos from "./components/Agendamentos";
import Ortodontia from "./components/ortodontia";

import InfoPatient from './components/infoPatient'

import { Tabs } from "antd";

const {TabPane} = Tabs;

function EditarPacientePage(props) {
	const {token}  = useSelector(state => state.auth);
	const {params} = useRouteMatch();
	const history  = useHistory();

	const [patient, setPatient] = useState({});
	const [key, setKey]         = useState("orcamentos");

	const [reload, setReload]       = useState(false);
	const [reloadTab, setReloadTab] = useState(false);

	function useQuery() {
		const {search} = useLocation();

		return React.useMemo(() => new URLSearchParams(search), [search]);
	}

	let query = useQuery();

	useEffect(() => {
		if( query.get("tab") )
		{
			setKey(query.get("tab"));
		}
	}, [query]);

	const ReturnMenu = () => {
		switch( key )
		{
			case "perfil":
				return <Dados />;
			case "upload":
				return <Upload />;
			case "orcamentos":
				return <Orcamentos />;
			case "financeiro":
				return <Financeiro />;
			case "fichaClinica":
				return <FichaClinica />;
			case "boletos":
				return <Boletos />;
			case "agendamentos":
				return <Agendamentos />;
			case "ortodontia":
				return <Ortodontia />;
			default:
				return <Dados />;
		}
	};

	return (
		<>
			<div style={{padding: 0, backgroundColor: "#fff"}}>
				<InfoPatient />
				<Tabs
					style={{marginBottom: 0}}
					activeKey={key}
					onChange={setKey}
					type="card"
				>
					<TabPane tab="Perfil" key="perfil" />
					<TabPane tab="Upload" key="upload" />
					<TabPane tab="Orçamentos" key="orcamentos" />
					<TabPane tab="Financeiro" key="financeiro" />
					<TabPane tab="Boletos" key="boletos" />
					<TabPane tab="Ficha Clinica" key="fichaClinica" />
					<TabPane tab="Agendamentos" key="agendamentos" />
					<TabPane tab="Ortodontia" key="ortodontia" />
				</Tabs>
			</div>
			<ReturnMenu />
		</>
	);
}

export default EditarPacientePage;
