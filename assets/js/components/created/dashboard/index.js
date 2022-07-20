import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, ContainerBody, Title } from "./styles";
import { useDispatch, useSelector } from "react-redux";

import { index, index_old, show } from "~/services/controller";
import { INDEX_CLINICS, Select, Store } from "~/store/modules/clinic/Clinic.actions";
import { StoreSettings } from "~/store/modules/settings/actions";
import { LogoutUser } from "~/store/modules/auth/Auth.actions";
import { INDEX_DENTIST, INDEX_RECEPCIONIST } from "~/store/modules/user/actions";

import Card from "./components/Card";
import axios from "axios";

class Dashboard extends Component {
	constructor(props) {
		super(props)

		this.state = {
			clinics: []
		}
	}

	componentDidMount() {
		this.loadAll()
	}

	loadAll = () => {
		index("clinic", {patientInfo: true, dentistInfo: true})
		.then((response) => {
			this.props.storeClinics(response.data)
			this.setState({
				clinics: response.data
			})
			this.loadClinic(response.data);
	
			return index("settings")
		}).then(response => {
			this.props.storeSettings(response.data)
		})
		.catch(_ => {
			// dispatch(LogoutUser());
			// history.push("/entrar");
		});
	
		// if( selectedClinic?.id )
		// {
		// 	axios.all([
		// 		index("clinic"),
		// 		show("clinic", selectedClinic.id),
		// 		index("users", {cargo: "dentista", clinica: selectedClinic.id}),
		// 		index("users", {cargo: "recepcionista", clinica: selectedClinic.id})
		// 	]).then(axios.spread((clinics, clinic, dentists, recepcionist) => {
		// 		dispatch(INDEX_CLINICS(clinics))
		// 		dispatch(Select(clinic))
		// 		dispatch(INDEX_DENTIST(dentists))
		// 		dispatch(INDEX_RECEPCIONIST(recepcionist))
		// 	}))
		// }
	}

	loadClinic = data => {
		const index = data.findIndex(item => item.id === this.props.clinic.id);
		if( index !== -1 )
		{
			this.props.selectClinic(data[index])
		}
	};

	handleClick = item => {
		this.props.selectClinic(item)
	};

	render () {
		const { clinics } = this.state

		return (
			<Container>
				<Title>Selecione uma clinica</Title>
				<ContainerBody>
					{clinics.map(item => (
						<Card key={item.id} click={() => this.handleClick(item)} data={item} />
					))}
				</ContainerBody>
			</Container>
		);
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		selectClinic: (data) => dispatch(Select(data)),
		storeClinics: (data) => dispatch(Store(data)),
		storeSettings: (data) => dispatch(StoreSettings(data))
	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		isAdmin      : state.auth.department_id === "administrador",
		token        : state.auth.token,
		user         : state.auth.user,
		clinic       : state.clinic.selectedClinic,
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)