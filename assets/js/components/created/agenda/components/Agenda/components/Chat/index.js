import React, {Component, Fragment, PureComponent} from "react" 

import {ContainerMessageClinic, ContainerMessage, Message, InfosContainer, Hour, User} from './styles'
import moment from "moment"

class ItemChat extends PureComponent {
    constructor(props) {
        super(props)
    }

    render() {
        const {message, sendTo, created_at, usuario} = this.props
            
        return (
            <Fragment>
                {
                    sendTo === "clinic" ? (
                        <ContainerMessageClinic>
                            <Message>
                                {message}
                            </Message>
                            <InfosContainer>
                                <User>
                                    ~ {`${usuario?.firstName} ${usuario?.lastName}`}
                                </User>
                                <Hour>
                                 {moment(created_at).format("DD/MM/YYYY [  ] HH:mm")}
                                </Hour>
                            </InfosContainer>
                        </ContainerMessageClinic>
                    ) : (
                        <ContainerMessage>
                            <Message>
                                {message}
                            </Message>
                            <InfosContainer>
                                <User>
                                    Paciente
                                </User>
                                <Hour>
                                 {moment(created_at).format("DD/MM/YYYY [  ] HH:mm")}
                                </Hour>
                            </InfosContainer>
                        </ContainerMessage>
                    )
                }
            </Fragment>
        )
    }
}

export default ItemChat