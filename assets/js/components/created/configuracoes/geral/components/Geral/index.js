import React, { Component, useEffect, useState } from 'react';
import {
    Container,
    Span,
    AInput,
    AForm,
    ACheckBox,
    ASelect,
    ARadio,
    ARow,
    AButton
} from './styles';
import { index, show, update } from '~/services/controller'
import { useSelector, useDispatch, connect } from 'react-redux'
import { Store, Select, ChangeConfig } from '~/store/modules/clinic/Clinic.actions'

import { Notify } from '~/modules/global'
import { Input } from 'antd';
const { TextArea } = Input

class Geral extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            msg_whatsapp: "",
            comissoes_zeradas: null
        }
    }

    componentDidMount() {
        this.loadAll()
    }

    loadAll = () => {
        show('/clinicConfig', this.props.clinic.id).then((data) => {
            this.setState({
                msg_whatsapp: data.msg_whatsapp,
                comissoes_zeradas: data.comissoes_zeradas,
                loading: false
            })
        })
    }

    save = () => {
        const { comissoes_zeradas, msg_whatsapp } = this.state

        update('/clinicConfig', this.props.clinic.id, {
            msg_whatsapp,
            comissoes_zeradas
        }).then(_ => {
            // dispatch(ChangeConfig({ ...selectedClinic, config: e }))
            // setReload(!reload)
            this.props.changeConfig({
                config: {
                    comissoes_zeradas,
                    msg_whatsapp
                }
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
        const { loading, msg_whatsapp, comissoes_zeradas } = this.state

        return (
            <Container title="Geral">
                {!loading ?
                    <AForm style={{ width: "100%" }} layout="vertical">
                        <ARow style={{ marginTop: 20 }}>
                            <span>Gerar comissões zeradas ?</span>
                            <ARadio.Group
                                value={comissoes_zeradas}
                                onChange={e => {
                                    console.log(e)
                                    this.setState({ comissoes_zeradas: e.target.value })
                                }}
                            >
                                <ARadio value="1" >Sim</ARadio>
                                <ARadio value="0" >Não</ARadio>
                            </ARadio.Group>
                        </ARow>
                        <AButton onClick={this.save} >
                            Enviar
                        </AButton>
                    </AForm> : ''
                }
            </Container>
        )
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        clinic: state.clinic.selectedClinic,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeConfig: (data) => {
            dispatch(ChangeConfig(data));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Geral)