import React, { Component } from 'react'
import { Button, Card, Empty, Table } from 'antd'
import { ContainerTable } from './styles'

class UITable extends Component {
	constructor(props) {
		super(props)
	}

	_renderTitle = () => {
		let titleTable = null

		if( this.props.titleTable !== false && this.props.titleTable !== null )
		{
			if( React.isValidElement(this.props.titleTable) )
			{
				titleTable = this.props.titleTable;
			}

			else if( typeof this.props.titleTable === "function" )
			{
				titleTable = this.props.titleTable();
			}
			else if( typeof this.props.titleTable === "string" )
			{
				titleTable = this.props.tittitleTablele;
			}
		}

		return titleTable
	}

	render() {
		return (
			<ContainerTable style={this.props.styleWrapper}>
				{this._renderTitle()}
				<Table {...this.props} />
			</ContainerTable>
		)
	}
}

export default UITable