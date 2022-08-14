import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Layout } from "antd";

class Error404 extends Component {
	render() {
		return (
			<Layout className="page-error-404" style={{margin: "0 auto", marginTop: 100}}>
				<Layout.Content>
					<div className="page-content" key="1">
						<figure className={"icon"}>
							<img src="images/404.svg" style={{width: 180}} />
						</figure>
						<h1>Página não encontrada!</h1>
						<p>O conteúdo que você solicitou não foi encontrado em nossos servidores.</p>
						<Link to="/">
							<Button type="primary" size="large">Voltar para o Início</Button>
						</Link>
					</div>
				</Layout.Content>
			</Layout>
		)
	}
}

export default Error404
