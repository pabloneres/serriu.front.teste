import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";

import "moment/locale/pt-br";

import { persistor, store } from "~/redux/store/configureStore";
import Main from "../js/screens/Main";
import "antd/dist/antd.css";
import './index.css'

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<Main />
				</PersistGate>
			</Provider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById("root"));
