import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "../../styles";
import { Button, Select } from "antd";
import SearchPatient from "../SearchPatient";
import DrawerSearch from "../Drawers/DrawerSearch";
import moment from "moment";
import { zapiStatus } from '~/services/zapiServices'
import { Notify } from "~/modules/global";
// import { Container } from './styles';
const { Option } = Select;

function Filtros({ agendar, onChangeFilters }) {
	const settings = useSelector(state => state.settings)
	const { dentistas, recepcionistas } = useSelector(state => state.agenda)
	const dispatch = useDispatch()

	const [filters, setFilter] = useState({})
	const [statusApi, setStatusApi] = useState(false)

	const [searchPaciente, setSearchPaciente] = useState();
	const [status, setStatus] = useState([
		{
			label: "Agendado",
			value: "agendado",
			color: "#fdffcc"
		},
		{
			label: "Confirmado",
			value: "confirmado",
			color: "#67d7fd"
		},
		{
			label: "C. pelo paciente",
			value: "cancelado_paciente",
			color: "#fed1d1"
		},
		{
			label: "C. pelo dentista",
			value: "cancelado_dentista",
			color: "#d3abfb"
		},
		{
			label: "Atendido",
			value: "atendido",
			color: "#65edc1"
		},
		{
			label: "Não compareceu",
			value: "nao_compareceu",
			color: "#ff9e6e"
		}
	]);

	useEffect(() => {
		checkStatus()
	}, [])

	useEffect(() => {
		onChangeFilters(filters)
	}, [filters])

	const changeFilter = (data) => {
		setFilter(data)
	}

	const agendarAgora = () => {
		let startDate = moment().add(5, "minutes")
		let endDate = moment(startDate).add(30, "minutes")

		agendar({
			startDate,
			endDate
		})
	}

	const checkStatus = () => {
		check()

		setInterval(() => {
			check()
		}, 30000)
	}

	const check = () => {
		zapiStatus({
			app_zapi_token_instance: settings.app_zapi_token_instance,
			app_zapi_user_token: settings.app_zapi_user_token,
		}).then(({ data }) => {
			setStatusApi(data.connected)

			if (data.connected === false) {
				Notify("warning", "O serviço de mensagens está desconectado", "Contate o administrador da clínica!", 4)
			}
		})
	}

	return (
		<Row>
			<DrawerSearch
				searchPaciente={searchPaciente}
				setSearchPaciente={setSearchPaciente}
			/>
			<div style={{ width: "100%" }}>
				<Select
					allowClear
					placeholder="Filtrar dentista"
					style={{ width: "20%", margin: "0 5px" }}
					value={filters.dentistas}
					onChange={e => {
						changeFilter({ ...filters, dentistas: e });
					}}
				>
					{dentistas?.map(dentista => (
						<Option key={dentista.id} value={dentista.id}>
							<span
								role="img"
								style={{
									backgroundColor: dentista.profile.scheduleColor,
									padding: 5,
									marginRight: 5
								}}
							/>
							<span>{dentista.firstName}</span>
						</Option>
					))}
				</Select>
				<Select
					allowClear
					placeholder="Filtrar agendador"
					style={{ width: "20%", margin: "0 5px" }}
					// mode="multiple"
					value={filters.agendadores}
					onChange={e => changeFilter({ ...filters, agendadores: e })}
				>
					{recepcionistas?.map(recepcionista => (
						<Option key={recepcionista.id} value={recepcionista.id}>
							<span role="img" />
							<span>{recepcionista.firstName}</span>
						</Option>
					))}
				</Select>
				<Select
					allowClear
					placeholder="Filtrar tipo"
					style={{ width: "20%", margin: "0 5px" }}
					// mode="multiple"
					value={filters.tipo}
					onChange={e => changeFilter({ ...filters, tipo: e })}
				>
					<Option value="avaliacao">Avaliação</Option>
					<Option value="retorno">Retorno</Option>
				</Select>
				<Select
					allowClear
					placeholder="Filtrar status"
					style={{ width: "20%", margin: "0 5px" }}
					// mode="multiple"
					value={filters.status}
					onChange={e => changeFilter({ ...filters, status: e })}
				>
					{status.map(status => (
						<Option key={status.value} value={status.value}>
							<span
								role="img"
								style={{
									backgroundColor: status.color,
									padding: 5,
									marginRight: 5
								}}
							/>
							<span>{status.label}</span>
						</Option>
					))}
				</Select>
			</div>
			<SearchPatient setSearchPaciente={setSearchPaciente} />
			<Button style={{ marginLeft: 10 }} type="primary" onClick={agendarAgora}>Agendar</Button>

			<div className='status'>
				{
					statusApi ?
						<div className='status-online' title="Status da API" /> :
						<div className='status-offline' />
				}
			</div>
		</Row>
	);
}

export default memo(Filtros);
