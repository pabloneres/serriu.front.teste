import React, { Component, Fragment } from "react";
import * as PropTypes from "prop-types";
import { Button, Modal, Spin } from "antd";

class UIModal extends Component {
	static propTypes = {
		formId            : PropTypes.any,
		isLoading         : PropTypes.bool,
		isSending         : PropTypes.bool,
		width             : PropTypes.any,
		title             : PropTypes.any,
		showBtnSave       : PropTypes.bool,
		btnSaveText       : PropTypes.any,
		btnSaveTextSending: PropTypes.any,
		modalProps        : PropTypes.object,
	};

	static defaultProps = {
		isLoading         : false,
		isSending         : false,
		width             : 500,
		title             : "",
		showBtnSave       : true,
		btnSaveText       : "Salvar",
		btnSaveTextSending: "Salvando",
		modalProps        : {},
	};

	constructor(props) {
		super(props);

		this.state = {
			visible: false
		}
	}

	onShow = () => {
		this.setState({
			visible: true
		})
	}

	onClose = () => {
		this.setState({
			visible: false
		})
	}

	render() {
		const {visible, formId, isLoading, isSending, width, title, showBtnSave, btnSaveTextSending, btnSaveText, modalProps} = this.props;

		return (
			<Modal
				visible={this.state.visible}
				style={{top: 20}}
				className="modal-form"
				title={title}
				width={width}
				destroyOnClose={true}
				maskClosable={!isLoading && !isSending}
				closable={!isLoading && !isSending}
				keyboard={!isLoading && !isSending}
				onCancel={this.onClose}
				onClose={this.onClose}
				centered
				footer={(
					<Fragment>
						<Button className="btn-close" onClick={this.props.onClose} icon="close" disabled={isLoading || isSending}>Cancelar</Button>
						{showBtnSave && <Button type="primary" form={formId} htmlType="submit" className="btn-save" icon="check" loading={isSending} disabled={isLoading}>{isSending ? btnSaveTextSending : btnSaveText}</Button>}
					</Fragment>
				)}
				{...modalProps}>
				{isLoading ? (
					<div className="text-center" style={{padding: 20}}>
						<Spin />
					</div>
				) : this.props.children}
			</Modal>
		)
	}
}

export default UIModal;
