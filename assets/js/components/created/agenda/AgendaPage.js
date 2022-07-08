import React, { Component } from "react";

import Agenda from "./components/Agenda";
import { connect } from "react-redux";
import { index } from "~/services/controller";
import axios from "axios";

import DrawerAdd from "./components/Agenda/components/Drawers/DrawerAdd";
import DrawerEdit from "./components/Agenda/components/Drawers/DrawerEdit";
import DrawerCliente from "./components/Agenda/components/Drawers/DrawerAddCliente";
import DrawerEditClient from "./components/Agenda/components/Drawers/DrawerEditCliente";
import DrawerChat from "./components/Agenda/components/Drawers/DrawerChat";

import moment from "moment";
import "moment/locale/pt-br";
import { Notify } from "~/modules/global";

moment.locale("pt-br");

class AgendaPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			selectedDate: undefined,
			status: false,
			dentists: [],
			recepcionists: []
		}
	}

	componentDidMount() {
		this.loadAll()
	}

	onUpdateAgenda = () => {
		this.agenda.load()
	}

	loadAll = () => {
		axios.all([
			index("users", { cargo: "dentista", clinica: this.props.clinic.id }),
			index("users", { cargo: "recepcionista", clinica: this.props.clinic.id })
		]).then(axios.spread((dentists, recepcionists) => {
			this.props.changeDentists(dentists.data)
			this.props.changeRecepcionist(recepcionists.data)
		})).catch(() => {
			Notify("error", 'Erro ao carregar complementos da agenda')
		})
	}

	onAppointmentCreate = (data) => {
		this.formAdd.onAppointmentCreate(data)
	}

	render() {
		const { agenda } = this.props
		const { selectedDate, status, dentists, recepcionists } = this.state
		return (
			<div>
				<Agenda
					ref={el => this.agenda = el}
					dentists={dentists}
					recepcionists={recepcionists}
					selectDate={this.onAppointmentCreate}
				/>
				{agenda.chatData && <DrawerChat chatData={agenda.chatData} />}
				<DrawerCliente />
				<DrawerEdit dentists={dentists} updateAgenda={this.onUpdateAgenda} />
				<DrawerEditClient />
				<DrawerAdd
					ref={el => this.formAdd = el}
					dentists={dentists}
					updateAgenda={this.onUpdateAgenda} />
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		clinic: state.clinic.selectedClinic,
		agenda: state.agenda
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeDentists: (data) => dispatch({
			type: "CHANGE_DENTISTAS",
			payload: data
		}),
		changeRecepcionist: (data) => dispatch({
			type: "CHANGE_RECEPCIONISTAS",
			payload: data
		})
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(AgendaPage);