import React , {Component, Fragment} from 'react'
import { Button, Card, Empty, Spin, Table, Drawer, Upload, message, List } from 'antd'
import {UILoading} from '~/components/created/UISerriu'
import {connect} from 'react-redux'
import { show, store } from '~/services/controller'
import { FormControl, FormControlLabel, Input, InputLabel } from '@mui/material'
import Notify from '~/services/notify'
import InputMask from '~/utils/mask'
import {zapiValidateNumber} from '~/services/zapiServices'

class Grupos extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSending     : false,
            isValidate    : false,
            loading       : true,
            data          : [],
            groupName     : '',
            currentNumber : '',
            numberNotExist: false,
            numbers       : [], 
            profileImage  : null,
            columns       : [
                {
                    title: "Nome do grupo",
                    dataIndex: "groupName",
                },
                {
                    title: "Link",
                    dataIndex: "invitationLink",
                    render: data => <a target="_blank" href={data}>{data}</a>
                },
            ],
            visibleDrawer: false
        }
    }

    componentDidMount() {
        this.loadGroups()
    }

    loadGroups = () => {
        show("zapiGroups", this.props.clinic.id).then(data => {
            this.setState({
                loading: false,
                data   : data
            })
        })
    }

    openDrawer = () => {
        this.setState({
            visibleDrawer: true
        })
    }
    closeDrawer = () => {
        this.setState({
            visibleDrawer: false
        })
    }

    changeImage = (info, file) => {
        if (info.file.status === "done") {
            this.setState({
                profileImage: info.file.response.fileName
            })
        } else if (info.file.status === "error") {
          message.error(`${info.file.name} falha no upload!`);
        }
      };

    validateNumber = () => {
        return zapiValidateNumber("55" + this.state.currentNumber)
    }

    onSubmit = () => {
        const {groupName, profileImage, numbers} = this.state
        const {clinic} = this.props

        this.setState({
            isSending: true
        })

        if (!groupName.length) {
            return
        }

        store('zapiGroups', {
            groupName,
            profileImage,
            numbers,
            clinica_id: clinic.id
        }).then(data => {
            Notify("success", "Grupo criado com sucesso")

            this.setState({
                groupName    : "",
                numbers      : [],
                visibleDrawer: false,
                profileImage : null
            })
        })
    }

    addNumber = () => {
        const numbers = this.state.numbers

        this.validateNumber().then(data => {
            if (!data.exists) {
                this.setState({
                    numberNotExist: true,
                    currentNumber : ''
                }, () => {
                    setTimeout(() => {
                        this.setState({
                            numberNotExist: false,
                        })
                    }, 1500)
                })
                return
            } 

            numbers.push("55" + this.state.currentNumber)
    
            this.setState({
                numbers: numbers,
                currentNumber: ''
            })
        })

    }

    render() {
        const {loading, data, columns, profileImage} = this.state

        const props = {
            name: "image",
            action: process.env.REACT_APP_API_URL + "/attachment",
            headers: {
              Authorization: "Bearer " + this.props.token
            }
        };

        return (
            <Fragment>
                <Card
                    extra={<Button type='primary' onClick={this.openDrawer}>Novo Grupo</Button>}
                >
                    {

                        loading ? (
                            <UILoading/>
                            ) : (
                            <Fragment>
                                <Table
                                    columns={columns}
                                    dataSource={this.state.data}
                                />
                            </Fragment>
                        )
                    }
                </Card>
                <Drawer
                    width={600}
                    visible={this.state.visibleDrawer}
                    title="Criar novo grupo"
                    extra={<Button type='primary' loading={this.state.isSending} disabled={this.state.numbers < 1 || !this.state.groupName.length} onClick={this.onSubmit}>Salvar</Button>}
                    onClose={this.closeDrawer}
                >
                    <div style={{width: "100%", display: "flex", alignItems: "center", flexDirection: "column"}}>
                        <Upload
                            {...props}
                            showUploadList={false}
                            onChange={e => this.changeImage(e, "profileImage")}
                        >
                            {profileImage ? (
                                <img
                                    style={{width: 180, height: 180, borderRadius: "50%", margin: 20}}
                                    src={`${process.env.REACT_APP_API_URL}/attachment/${profileImage}`}
                                />
                            ) : 
                                (
                                    <img
                                        style={{width: 100, height: 100, borderRadius: "50%", margin: 20}}
                                        src="https://raw.githubusercontent.com/koehlersimon/fallback/master/Resources/Public/Images/placeholder.jpg"
                                    />
                                )
                            }
                        </Upload>
                        <FormControl fullWidth={true}>
                            <InputLabel>Nome do grupo</InputLabel>
                            <Input onChange={e => this.setState({groupName: e.target.value})} value={this.state.groupName} id="groupName" name="groupName"/>
                        </FormControl>
                        <FormControl fullWidth={true} style={{margin: 20}}>
                            <InputLabel>Número</InputLabel>
                            <Input onChange={e => this.setState({currentNumber: e.target.value})} value={this.state.currentNumber} id="number" name='number'/>
                            <div style={{display: "flex", justifyContent: "space-between"}}>
                                {this.state.numberNotExist ? <span style={{color: "red"}}>Número não é valido</span> : <span></span>}
                                <span>Ex: 11999999999</span>
                            </div>
                        </FormControl>
                        <Button block type='primary' onClick={this.addNumber} disabled={this.state.currentNumber.length !== 11} >Adicionar</Button>
                        <span>Necessário pelo menos 1 numeros</span>
                        <List
                            style={{width: "100%", marginTop: 20}}
                            header={<span>Números adicionados</span>}
                            dataSource={this.state.numbers}
                            bordered
                            renderItem={item => (
                                <List.Item>{item}</List.Item>
                            )}
                        />
                    </div>
                </Drawer>
            </Fragment>
        )
    }
}

const mapStateToProps = (state, onwProps) => {
    return {
        clinic: state.clinic.selectedClinic,
        token: state.auth.token
    }
}

export default connect(mapStateToProps, null)(Grupos)