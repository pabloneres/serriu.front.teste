import React, { Component } from "react"
import { EditOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { UIButton, UIPopover } from "~/components/created/UISerriu";
import { Input } from "antd";
import { EditFieldContainer } from "~/components/created/atividades/styles";
import { update } from "~/services/controller";
import replaceNumber from "~/helpers/replaceNumber";

class EditDataPerson extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	onEditSingle = (id, value) => {
		update("leads", id, value).then((data) => {
			this.props.reload()
			this.popover.onHide()
		})
	}

	openWhatsWeb = (data) => {
		const link = `https://wa.me/${replaceNumber(data)}`

		window.open(link, "_blank");
	}

	render() {
		const {data} = this.props

		return (
			<EditFieldContainer>
				<div style={{display: "flex", alignItems: "center"}}>
					<span>
						{data.name}
					</span>
				</div>

				<div className="button-hide-hover">
					<UIPopover ref={el => this.popover = el} destroyTooltipOnHide autoAdjustOverflow trigger="click" placement="bottomLeft" content={
						<div>
							<Input ref={el => this.input = el} defaultValue={data.name} onPressEnter={(e) => this.onEditSingle(data.id, {name: e.target.value})} />
						</div>
					}
					>
						<UIButton style={{marginLeft: 5}}>
							<EditOutlined />
						</UIButton>
					</UIPopover>
				</div>

			</EditFieldContainer>
		)
	}
}

export default EditDataPerson