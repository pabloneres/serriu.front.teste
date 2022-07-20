import React, { Component } from 'react'
import { store } from "~/services/controller"
import axios from 'axios'
import { connect } from 'react-redux'
import { Store } from "~/store/modules/clinic/Clinic.actions";
import { zapiDisconect, zapiStatus } from "~/services/zapiServices"

import '../../styles.css'

import { Button, Input } from 'antd'
import { StoreSettings, UpdateSettings } from '~/store/modules/settings/actions';

class SettingsWhatsApp extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data     : null,
			token    : "",
			instancia: "",
			image    : "",
			phone    : "",
			message  : "",
			loading  : false,
			status   : false,
			check    : null
		}
	}

	componentDidMount() {
		this.setState({
			instancia: this.props.settings.app_zapi_token_instance,
			token    : this.props.settings.app_zapi_user_token
		})
		this.loadAll()
	}

	componentWillUnmount() {
		clearInterval(this.state.check)
	}

	loadAll = () => {
		clearInterval(this.state.check)
		zapiStatus({
			app_zapi_token_instance: this.props.settings.app_zapi_token_instance,
			app_zapi_user_token    : this.props.settings.app_zapi_user_token
		}).then(({data}) => {
			this.setState({
				status: data.connected
			}, () => {
				this.checkStatus()
			})
		})
	}

	updateToken = () => {
		const data = [
			{
				setting_name: "app_zapi_token_instance",
				value       : this.state.instancia
			},
			{
				setting_name: "app_zapi_user_token",
				value       : this.state.token
			},
		]

		store('settings', data).then(() => {
			const updates = {}
			data.forEach((item) => {
				updates[item.setting_name] = item.value
			})

			this.setState({
				instancia: updates.app_zapi_token_instance,
				token    : updates.app_zapi_user_token
			})

			this.props.updateSettings(updates)

			this.loadStatus()
		}).catch((error) => {
			console.log(error)
		})
	}

	generateQR = async() => {
		const {instancia, token} = this.state

		this.setState({
			loading: true
		})

		const {data} = await axios.get(`https://api.z-api.io/instances/${instancia}/token/${token}/qr-code/image`)

		console.log(data)

		this.setState({
			image: data.value
		})

		this.setState({
			loading: false
		})
	}

	sendMessage = async() => {
		const {phone, message, token, instancia} = this.state

		await axios.post(`https://api.z-api.io/instances/${instancia}/token/${token}/send-option-list`, {
			phone     : phone,
			message,
			optionList: {
				title      : "Horarios Disponiveis",
				buttonLabel: "Abrir lista de opções",
				options    : [
					{
						"id"         : "1",
						"description": "00:00",
						"title"      : "Sabado"
					},
					{
						"id"         : "2",
						"description": "01:00",
						"title"      : "Segunda"
					},
					{
						"id"         : "3",
						"description": "01:00",
						"title"      : "terca"
					},
					{
						"id"         : "4",
						"description": "01:00",
						"title"      : "quarta"
					},
				]
			}
		})

		this.setState({
			message: ""
		})
	}

	checkStatus = () => {
		this.setState({
			check: setInterval(() => {
				this.loadStatus()
			}, 10000)
		})
	}

	loadStatus = () => {
		zapiStatus({
			app_zapi_token_instance: this.state.instancia,
			app_zapi_user_token    : this.state.token
		}).then(({data}) => {
			this.setState({
				status: data.connected
			})
		})
	}

	disconect = () => {
		zapiDisconect().then(() => {
			this.loadAll()
		})
	}

	render() {
		return (
			<div className="container">
				<div className="status-container">
					<div>
						<Button type='primary' onClick={this.disconect}>Desconectar</Button>
					</div>
					<div className='status'>
                        <span>
                            Status da instância
                        </span>
						{
							this.state.status ?
								<div className='status-online' /> :
								<div className='status-offline' />
						}
					</div>
				</div>
				<div className="row">
					<div className="container_insert">
						<h2>Configurar Instancia</h2>
						<Input
							style={{marginBottom: 10}}
							onChange={e => this.setState({instancia: e.target.value})}
							value={this.state.instancia}
							placeholder='TOKEN DA INSTANCIA' />
						<Input
							style={{marginBottom: 10}}
							onChange={e => this.setState({token: e.target.value})}
							value={this.state.token}
							placeholder='SEU TOKEN'
						/>
						<Button onClick={this.updateToken}>SALVAR</Button>
					</div>
					<div className="container_generate">
						<h2>Gerar QR</h2>
						<img src={this.state.image} alt="qr_code" className='image_qr' />
						<Button onClick={this.generateQR} loading={this.state.loading}>Gerar Token</Button>
					</div>
				</div>
				<div className="row">
					<div className="container_send">
						<h2>Teste de envio</h2>
						<Input
							style={{marginBottom: 10}}
							onChange={e => this.setState({phone: e.target.value})}
							value={this.state.phone}
							placeholder='Telefone' />
						<Input
							style={{marginBottom: 10}}
							onChange={e => this.setState({message: e.target.value})}
							value={this.state.message}
							placeholder='Mensagem'
						/>
						<Button onClick={this.sendMessage}>Enviar</Button>
					</div>
					<div></div>
				</div>
			</div>
		)
	}

}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		updateClinicData: (data) => {
			dispatch(Store(data))
		},
		updateSettings  : (data) => {
			dispatch(UpdateSettings(data))
		},
		storeSettings   : (data) => {
			dispatch(StoreSettings(data))
		}
	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		clinic  : state.clinic.selectedClinic,
		settings: state.settings
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsWhatsApp);
