import React, {Component} from "react";

import {Table} from 'antd'
import {DeleteOutlined} from '@ant-design/icons'

class Procedimentos extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [
                {
                    name: "Tratamento canal MOLAR",
                    infos: "44 - V, 13",
                    value: "R$ 800,00"
                }
            ]
        }

        this.columns = [
            {
                title: "Procedimentos",
                width: 280,
                render: this._renderProcedimento
            },
            {
                title: "Pagamento"
            },
            {
                title: "Status"
            },
        ]
    }

    _renderProcedimento = (data) => {
        return (
            <div className="render-procedimento">
                <span className="title-procedimento">{data.name}</span>
                <span className="infos-procedimento">{data.infos}</span>
                <span className="value-procedimento">{data.value}</span>
                
                <a className="delete-button"><DeleteOutlined/></a>
            </div>
        )
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          // Column configuration not to be checked
          name: record.name,
        }),
      };

    render() {
        const {data} = this.state

        return (
            <div className="procedimento-page">
                <Table
                    className="table-edit"
                    size="small"
                    columns={this.columns}
                    dataSource={data}
                    rowSelection={{
                        type: "checkbox",
                        ...this.rowSelection,
                    }}
                    pagination={false}
                />
            </div>
        )
    }
}

export default Procedimentos