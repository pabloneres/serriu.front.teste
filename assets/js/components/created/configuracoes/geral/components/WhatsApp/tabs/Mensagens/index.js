import React, { Component } from 'react'
import { Button, Form, Input, Spin } from 'antd'
import { connect } from 'react-redux'
import { show, update } from '~/services/controller'
import { ChangeConfig } from '~/store/modules/clinic/Clinic.actions'
import Notify from '~/services/notify'

const {TextArea} = Input

class Mensagens extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isSending    : false,
			loading      : true,
			initialValues: {}
		}

	}

	componentDidMount() {
		this.loadAll()
	}

	loadAll = () => {
		show('/clinicConfig', this.props.clinic.id).then((data) => {
			this.setState({
				initialValues: data
			}, () => {
				this.setState({
					loading: false
				})
			})
		})
	}

	onSubmit = (values) => {
		this.setState({
			isSending: true
		})

		update('/clinicConfig', this.props.clinic.id, values).then(_ => {
			this.props.changeConfig({
				config: {
					...values
				}
			})
			this.setState({
				isSending: false
			})
			return Notify(
				'success',
				'Sucesso',
				'Configurações da clinicas foram atualizadas'
			)
		}).catch(err => {
			return Notify(
				'error',
				'Erro',
				'Erro ao atualizar'
			)
		})
	}

	render() {
		const {isSending, initialValues, loading} = this.state
		return (
			<div>
				<div style={{display: "flex"}}>
					<h4 style={{marginRight: 10}}>Variaveis: {" "}</h4>
					<span>{`{NOME_PACIENTE_COMPLETO}`}</span>,
					<span>{`{NOME_PACIENTE}`}</span>,
					<span>{`{SOBRENOME_PACIENTE}`}</span>,
					<span>{`{DATA_AGENDAMENTO}`}</span>,
					<span>{`{HORA_AGENDAMENTO}`}</span>,
					<span>{`{NOME_CLINICA}`}</span>,
					<span>{`{TELEFONE_CLINICA}`}</span>,
					<span>{`{AGENDADOR}`}</span>,
					<span>{`{TIPO}`}</span>
				</div>
				{
					loading ? (
						<Spin />
					) : (
						<Form layout='vertical' onFinish={this.onSubmit} initialValues={initialValues}>

							<Form.Item label="Confirmação" name="msg_confirmacao" help="Mensagem enviada no inicio do dia para o paciente confirmar.">
								<TextArea />
							</Form.Item>

							<Form.Item label="Lembrete de 1 hora" name="msg_lembrete" help="Lembrete que é enviado uma hora antes para o paciente.">
								<TextArea />
							</Form.Item>

							<Form.Item label="Notificação de agendamento" name="msg_notificacao" help="Notificação ao criar um novo agendamento">
								<TextArea />
							</Form.Item>
							<Button type='primary' htmlType='submit' loading={isSending}>Salvar</Button>
						</Form>
					)
				}

			</div>
		)
	}
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		changeConfig: (data) => {
			dispatch(ChangeConfig(data));
		},
	}
};

const mapStateToProps = (state, ownProps) => {
	return {
		clinic  : state.clinic.selectedClinic,
		settings: state.settings
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Mensagens);