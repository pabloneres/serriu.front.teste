import React, { Component } from 'react';

import connection from '~/services/socket';

// a global variable so we can disconnect once we unmount
let subscription;

class Room extends Component {
	state = {
		messages: []
	};

	componentDidMount() {
		connection.connect();

		// storing the subscription in the global variable
		// passing the incoming data handler fn as a second argument
		subscription = connection.subscribe(`room:1`, this.handleMessageAdd);

		// loading existing messages
	}

	componentWillUnmount() {
		subscription.close();
	}

	handleMessageAdd = message => {
		const {type, data} = message;

		// you could handle various types here, like deleting or editing a message
		switch( type )
		{
			case 'room:newMessage':
				this.setState(prevState => ({
					messages: [...prevState.messages, data]
				}));
				break;
			default:
		}
	};

	render() {
		const {messages} = this.state;
		const {id}       = this.props;

		return (
			<div className="mx-auto p-3 flex flex-col h-screen justify-between" style={{maxWidth: '800px'}}>
			</div>
		)
	}
}

export default Room;
