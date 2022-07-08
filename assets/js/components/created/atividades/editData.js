import React, { Component } from "react"
import { EditOutlined, WhatsAppOutlined } from "@ant-design/icons";
import { UIButton, UIPopover } from "~/components/created/UISerriu";
import { Input } from "antd";
import { EditFieldContainer } from "~/components/created/atividades/styles";
import { update } from "~/services/controller";
import replaceNumber from "~/helpers/replaceNumber";

class EditData extends Component {
	constructor(props) {
		super(props)

		this.state = {}
	}

	onEditSingle = (id, value) => {
		update("atividades", id, value).then((data) => {
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
				{data.phone && <div style={{display: "flex", alignItems: "center"}}>
								<span>
									{data.phone}
								</span>
					<WhatsAppOutlined
						className="whatsapp-button"
						onClick={() => this.openWhatsWeb(data.phone)}
						style={{
							fontSize  : 16,
							color     : "green",
							cursor    : "pointer",
							marginLeft: 10
						}}
					/>
				</div>}

				<div className="button-hide-hover">
					<UIPopover ref={el => this.popover = el} destroyTooltipOnHide autoAdjustOverflow trigger="click" placement="bottomLeft" content={
						<div>
							<Input ref={el => this.input = el} defaultValue={data.phone} onPressEnter={(e) => this.onEditSingle(data.id, {phone: e.target.value})} />
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

export default EditData