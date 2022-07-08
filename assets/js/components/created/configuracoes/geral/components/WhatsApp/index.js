import React, { Component } from 'react'
import { Tabs } from 'antd'

import SettingsWhatsApp from "./tabs/SettingsWhatsApp"
import Grupos from "./tabs/Grupos"
import Mensagens from "./tabs/Mensagens"


const { TabPane } = Tabs
class WhatsApp extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Tabs defaultActiveKey='3'>
                <TabPane key="3" tab="Mensagens">
                    <Mensagens />
                </TabPane>
                <TabPane key="1" tab="Configurações">
                    <SettingsWhatsApp />
                </TabPane>
                <TabPane key="2" tab="Grupos">
                    <Grupos />
                </TabPane>
            </Tabs>
        )
    }
}

export default WhatsApp