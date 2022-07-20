import React, { Component, Fragment } from 'react'
import { index, show } from '~/services/controller'
import { Drawer, Spin } from 'antd'
import { connect } from 'react-redux'
import ItemChat from '../Chat'
import moment from 'moment'

import { store } from "~/services/controller"
import { zapiSendMessage } from "~/services/zapiServices"
import replaceNumber from '~/helpers/replaceNumber'
import Notify from '~/services/notify'
import { WhatsAppOutlined } from '@ant-design/icons'

class DrawerChat extends Component {
    constructor(props) {
        super(props)

        this.state = {
            interactions: [],
            loading: true
        }
    }

    componentDidMount() {
        this.loadInteractions()
    }


    loadInteractions = () => {
        if (this.props.chatData) {
            show("zapiInteraction", this.props.chatData?.id).then(({ data }) => {
                this.setState({
                    interactions: data,
                }, () => {
                    this.setState({
                        loading: false
                    })
                })
            })
        }
    }

    returnDay = startDate => {
        let hoje = moment().format("l");
        let agendamento = moment(startDate).format("l");

        if (hoje === agendamento) {
            return `*HOJE* (${moment(startDate).format("LLLL")}`;
        }

        if (
            agendamento ===
            moment()
                .add(1, "d")
                .format("l")
        ) {
            return `*AMANHÃ* (${moment(startDate).format("LLLL")})`;
        }

        return `${moment(startDate).format("LLLL")}`;
    };

    returnMessage = () => {
        const { chatData, clinic } = this.props
        const text = `Olá ${chatData.paciente.firstName}, aqui é da ${clinic.name_fantasy
            }, não esqueça do seu horário agendado para ${this.returnDay(
                chatData.startDate
            )}. Se acontecer algum imprevisto nos avise, ligue no ${clinic.tel
            } ou responda essa mensagem, até mais.`;

        return text
    }

    handleSaveNote = () => {
        const { chatData } = this.props
        store("notasPosVenda", {
            nota: `Confirmação de agendamento via WhatsApp`,
            agendamento_id: chatData.id
        }).then(_ => { });
    };

    returnWhatsApi = async () => {
        const { chatData } = this.props

        await this.handleSaveNote();

        zapiSendMessage({
            phone: "55" + replaceNumber(chatData.paciente.tel),
            message: this.returnMessage()
        }).then(data => {
            Notify("success", "Paciente notificado com sucesso via Whatsapp")
        })
    };


    render() {
        const { chatData } = this.props
        const { interactions, loading } = this.state

        return (
            <div>
                <Drawer
                    contentWrapperStyle={{ overflow: "hidden" }}
                    autoFocus
                    destroyOnClose={true}
                    width={700}
                    visible={chatData ? true : false}
                    title={
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                            <span>Interações com {chatData?.paciente?.firstName}</span>
                            <span>
                                <WhatsAppOutlined
                                    onClick={() => this.returnWhatsApi()}
                                    style={{ fontSize: 25, color: "green", cursor: "pointer", marginRight: 10 }}
                                />
                            </span>

                        </div>
                    }
                    onClose={this.props.onClose}
                >
                    <Fragment>
                        {
                            loading ? (
                                <Spin spinning />
                            ) : (
                                <div>
                                    {interactions.map((item, index) => {
                                        return (
                                            <ItemChat
                                                key={index}
                                                message={item.message}
                                                sendTo={item.sendTo}
                                                created_at={item.created_at}
                                                usuario={item.usuario}
                                            />
                                        )
                                    })}
                                </div>
                            )
                        }
                    </Fragment>
                </Drawer>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClose: () => {
            dispatch({
                type: "OPEN_CHAT",
                payload: undefined
            })
        }
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        clinic: state.clinic.selectedClinic,
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(DrawerChat);
