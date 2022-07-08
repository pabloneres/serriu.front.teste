import React, {Component} from "react"

import {Input} from "antd"

class UIInput extends Component {
	constructor(props) {
		super(props)

		this.state = {
			value: (this.props.value === null || typeof this.props.value === "undefined") ? "" : String(this.props.value),
		}
	}

	onChangeText = (value) => {
		let newValue = value;

		this.setState({
			value: newValue
		});

		if( this.props.onChangeText )
		{
			this.props.onChangeText(newValue);
		}
	}

	/**
	 * Blur on input
	 */
	blur = () => {
		if( this.textInput.isFocused() )
		{
			this.textInput.blur();
		}
	};

	/**
	 * Set value
	 *
	 * @param value
	 */
	setValue = (value) => {
		this.setState({
			value: (value === null || typeof value === "undefined") ? "" : String(value),
		});
	};

	/**
	 * Get value
	 */
	getValue = () => this.state.value;



	render() {
		return (
			<Fragment>
				<Input
					{...this.props}
				/>
			</Fragment>
		)
	}
}

export default UIInput