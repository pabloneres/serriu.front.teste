import { Form, Input, InputNumber, Modal, Row, Select } from 'antd'
import React, {Component} from 'react'
import { store, update } from '~/services/controller'

class ModalExecutar extends Component {
    constructor(props) {
        super(props)

        this.state = {
            visible: false,
            isSending: false,
            item: {}
        }

        this.fields = {
            arcoSup: {
                label: "Arco Superior",
                decorator: {
                    rules: [{
                        required: true
                    }]
                }
            },
            arcoSupTipo: {
                label: "Tipo Arco Superior",
                decorator: {
                    rules: [{
                        required: true
                    }]
                }
            },
            arcoInf: {
                label: "Arco Inferior",
                decorator: {
                    rules: [{
                        required: true
                    }]
                }
            },
            arcoInfTipo: {
                label: "Tipo Arco Inferior",
                decorator: {
                    rules: [{
                        required: true
                    }]
                }
            },
            braquetes: {
                label: "Braquetes",
                decorator: {
                    rules: [{
                        required: true
                    }]
                }
            },
            obs: {
                label: "Observação",
                decorator: {
                    rules: [{
                        required: false
                    }]
                }
            }
        }

        this.tiposArco = [
            {
                label: "Níquel-titânio (NiTi)",
                value: "NiTi"
            },
            {
                label: "Aço",
                value: "aco"
            },
        ]

        this.fiosArco = ["0.12", "0.14", "0.16", "0.18", "0.20", "16x16", "17x25", "19x25"]

    }


    onOpen = (item) => {
        this.setState({
            visible: true,
            item
        })
    }
 
    handleSubmit = () => {
        const {item} = this.state
        this.setState({
            isSending: true
        })

        this.form.validateFields().then((values) => {
            console.log("exercuef")
            update("ortodontia", item.id, values).then((data) => {
                console.log(data)
            }).catch((error) => {
                Modal.error({
                    title: "Erro",
                    content: String(error)
                })
            }) 

        }).catch((error) => {
            Modal.error({
                title: "Erro",
                content: String(error)
            })
            this.setState({
                isSending: false
            })
        })
    }

    render() {
        return (
            <Modal
                visible={this.state.visible}
                closable
                onCancel={() => this.setState({visible: false})}
                onOk={this.handleSubmit}
                okText="Salvar"
                okButtonProps={{
                    loading: this.state.isSending
                }}
                cancelButtonProps={{
                    disabled: this.state.isSending
                }}
            >
                <Form ref={el => this.form = el} layout="vertical" onFinish={this.handleSubmit}>
                  
                    <Form.Item name="arcoSuperior" label={this.fields.arcoSup.label} required rules={this.fields.arcoSup.decorator.rules}>
                        <Select
                           options={this.fiosArco.map(item => ({
                                label: item,
                                value: item
                           }))} 
                        />
                    </Form.Item>
                    <Form.Item name="tipoArcoSup" label={this.fields.arcoSupTipo.label} required rules={this.fields.arcoSupTipo.decorator.rules}>
                        <Select
                            options={this.tiposArco}
                        />
                    </Form.Item>
                
                    <Form.Item name="arcoInferior" label={this.fields.arcoInf.label} required rules={this.fields.arcoInf.decorator.rules}>
                        <Select 
                           options={this.fiosArco.map(item => ({
                                label: item,
                                value: item
                           }))} 
                        />
                    </Form.Item>
                    <Form.Item name="tipoArcoInf" label={this.fields.arcoInfTipo.label} required rules={this.fields.arcoInfTipo.decorator.rules}>
                        <Select
                            options={this.tiposArco}
                        />
                    </Form.Item>
                    <Form.Item name="obs" label={this.fields.obs.label} rules={this.fields.obs.decorator.rules}>
                        <Input.TextArea size={10} />
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}


export default ModalExecutar