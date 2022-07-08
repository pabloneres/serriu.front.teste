import { Spin } from "antd"
import React, { Component } from "react"

import {Container} from './styles'

class UILoading extends Component {
    constructor (props) {
        super(props)
    }
    
    render() {
        return (
            <Container>
                <Spin/>
            </Container>
        )
    }
}

export default UILoading