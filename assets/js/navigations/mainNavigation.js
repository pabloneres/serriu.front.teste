import React, { Component } from "react";
import { connect } from "react-redux";
import * as PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";

const SubMenu = Menu.SubMenu;

class MainNavigation extends Component {
	static propTypes = {
		onClick: PropTypes.func,
	};

	static defaultProps = {
		onClick: () => null,
	};

	render() {
		const {location}    = this.props;
		let base            = "";
		let defaultOpenKeys = [];
		let paths           = location.pathname.split("/").filter(function(el) {
			return el;
		});

		paths.forEach((path, index) => {
			if( path )
			{
				defaultOpenKeys.push(`/${path}`);

				if( index === 0 )
				{
					base = `/${path}`;
				}
			}
		});

		return (
			<Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname, base]} defaultOpenKeys={defaultOpenKeys} selectedKeys={[location.pathname, base]} onClick={this.props.onClick}>
				<Menu.Item key="/">
					<NavLink to="/">
						<Icon type="dashboard" />
						<span className="nav-text">Dashboard</span>
					</NavLink>
				</Menu.Item>
				{(
					this.props.permissions.includes("users.list")
					|| this.props.permissions.includes("roles.list")
					|| this.props.permissions.includes("log.list")
					|| this.props.permissions.includes("system-log.list")) && (
					<SubMenu key="/administrator" title={<span><Icon type="control" /><span>Administrador</span></span>}>
						{this.props.permissions.includes("users.list") && <Menu.Item key="/administrator/users">
							<NavLink to="/administrator/users">
								<span className="nav-text">Usuários</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("roles.list") && <Menu.Item key="/administrator/roles-and-permissions">
							<NavLink to="/administrator/roles-and-permissions">
								<span className="nav-text">Papéis e permissões</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("log.list") && <Menu.Item key="/administrator/logs">
							<NavLink to="/administrator/logs">
								<span className="nav-text">Registro de alterações</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("system-log.list") && <Menu.Item key="/administrator/system-log">
							<NavLink to="/administrator/system-log">
								<span className="nav-text">Registro de erros</span>
							</NavLink>
						</Menu.Item>}
					</SubMenu>
				)}
				{this.props.permissions.includes("ads.list") && <Menu.Item key="/ads">
					<NavLink to="/ads">
						<Icon type="area-chart" />
						<span className="nav-text">Anúncio</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("faq.list") && <Menu.Item key="/faq">
					<NavLink to="/faq">
						<Icon type="question-circle" />
						<span className="nav-text">Ajuda</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("activities.list") && <Menu.Item key="/activities">
					<NavLink to="/activities">
						<Icon type="file-text" />
						<span className="nav-text">Atividades</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("ratings.list") && <Menu.Item key="/ratings">
					<NavLink to="/ratings">
						<Icon type="star" />
						<span className="nav-text">Avaliações</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("comments.list") && <Menu.Item key="/comments">
					<NavLink to="/comments">
						<Icon type="message" />
						<span className="nav-text">Coméntarios</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("ask-agronomists.list") && (
					<SubMenu key="/ask-agronomists" title={<span><Icon type="question-circle" /><span>Consulte os agrônomos</span></span>}>
						<Menu.Item key="/ask-agronomists/questions">
							<NavLink to="/ask-agronomists/questions">
								<span className="nav-text">Perguntas</span>
							</NavLink>
						</Menu.Item>
						<Menu.Item key="/ask-agronomists/answers">
							<NavLink to="/ask-agronomists/answers">
								<span className="nav-text">Respostas</span>
							</NavLink>
						</Menu.Item>
					</SubMenu>
				)}
				{(
					this.props.permissions.includes("active-ingredients.list")
					|| this.props.permissions.includes("chemical-groups.list")
					|| this.props.permissions.includes("cultures.list")
					|| this.props.permissions.includes("defensives.list")
					|| this.props.permissions.includes("nutritional-deficiencies.list")
					|| this.props.permissions.includes("diseases.list")
					|| this.props.permissions.includes("companies.list")
					|| this.props.permissions.includes("fertilizers.list")
					|| this.props.permissions.includes("leaf-fertilizers.list")
					|| this.props.permissions.includes("machines-implements.list")
					|| this.props.permissions.includes("news.list")
					|| this.props.permissions.includes("weeds.list")
					|| this.props.permissions.includes("pests.list")
					|| this.props.permissions.includes("varieties.list")) && (
					<SubMenu key="/contents" title={<span><Icon type="file-text" /><span>Conteúdos</span></span>}>
						{this.props.permissions.includes("cultures.list") && <Menu.Item key="/contents/cultures">
							<NavLink to="/contents/cultures">
								<span className="nav-text">Culturas</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("defensives.list") && <Menu.Item key="/contents/defensives">
							<NavLink to="/contents/defensives">
								<span className="nav-text">Defensivos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("nutritional-deficiencies.list") && <Menu.Item key="/contents/nutritional-deficiencies">
							<NavLink to="/contents/nutritional-deficiencies">
								<span className="nav-text">Deficiências nutricionais</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("diseases.list") && <Menu.Item key="/contents/diseases">
							<NavLink to="/contents/diseases">
								<span className="nav-text">Doenças</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("companies.list") && <Menu.Item key="/contents/companies">
							<NavLink to="/contents/companies">
								<span className="nav-text">Empresas</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("fertilizers.list") && <Menu.Item key="/contents/fertilizers">
							<NavLink to="/contents/fertilizers">
								<span className="nav-text">Fertilizantes/Corretivos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("leaf-fertilizers.list") && <Menu.Item key="/contents/leaf-fertilizers">
							<NavLink to="/contents/leaf-fertilizers">
								<span className="nav-text">Fertilizantes foliares</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("chemical-groups.list") && <Menu.Item key="/contents/chemical-groups">
							<NavLink to="/contents/chemical-groups">
								<span className="nav-text">Grupos químicos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("active-ingredients.list") && <Menu.Item key="/contents/active-ingredients">
							<NavLink to="/contents/active-ingredients">
								<span className="nav-text">Ingredientes ativos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("machines-implements.list") && <Menu.Item key="/contents/types-machines-implements">
							<NavLink to="/contents/types-machines-implements">
								<span className="nav-text">Tipos de Máquinas/Implementos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("machines-implements.list") && <Menu.Item key="/contents/machines-implements">
							<NavLink to="/contents/machines-implements">
								<span className="nav-text">Máquinas/Implementos</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("news.list") && <Menu.Item key="/contents/news">
							<NavLink to="/contents/news">
								<span className="nav-text">Notícias</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("weeds.list") && <Menu.Item key="/contents/weeds">
							<NavLink to="/contents/weeds">
								<span className="nav-text">Plantas daninhas</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("pests.list") && <Menu.Item key="/contents/pests">
							<NavLink to="/contents/pests">
								<span className="nav-text">Pragas</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("tables-conversions.list") && <Menu.Item key="/contents/tables-conversions">
							<NavLink to="/contents/tables-conversions">
								<span className="nav-text">Tabelas/Conversões</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("varieties.list") && <Menu.Item key="/contents/varieties">
							<NavLink to="/contents/varieties">
								<span className="nav-text">Variedades</span>
							</NavLink>
						</Menu.Item>}
					</SubMenu>
				)}
				{(
					this.props.permissions.includes("settings-social.list")
					|| this.props.permissions.includes("settings-notifications.list")
					|| this.props.permissions.includes("settings-general.list")) && (
					<SubMenu key="/settings" title={<span><Icon type="setting" /><span>Configuração</span></span>}>
						{this.props.permissions.includes("settings-general.list") && <Menu.Item key="/settings/general">
							<NavLink to="/settings/general">
								<span className="nav-text">Geral</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("settings-notifications.list") && <Menu.Item key="/settings/notifications">
							<NavLink to="/settings/notifications">
								<span className="nav-text">Notificações</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("settings-social.list") && <Menu.Item key="/settings/social">
							<NavLink to="/settings/social">
								<span className="nav-text">Rede social</span>
							</NavLink>
						</Menu.Item>}
					</SubMenu>
				)}
				{this.props.permissions.includes("denunciations.list") && <Menu.Item key="/denunciations">
					<NavLink to="/denunciations">
						<Icon type="security-scan" />
						<span className="nav-text">Denúncias</span>
					</NavLink>
				</Menu.Item>}
				{(
					this.props.permissions.includes("about.list")
					|| this.props.permissions.includes("privacy-policy.list")
					|| this.props.permissions.includes("terms-of-use.list")) && (
					<SubMenu key="/institutional" title={<span><Icon type="info-circle" /><span>Institucional</span></span>}>
						{this.props.permissions.includes("privacy-policy.list") && <Menu.Item key="/institutional/privacy-policy">
							<NavLink to="/institutional/privacy-policy">
								<span className="nav-text">Política de privacidade</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("about.list") && <Menu.Item key="/institutional/about">
							<NavLink to="/institutional/about">
								<span className="nav-text">Sobre</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("terms-of-use.list") && <Menu.Item key="/institutional/terms-of-use">
							<NavLink to="/institutional/terms-of-use">
								<span className="nav-text">Termos de uso</span>
							</NavLink>
						</Menu.Item>}
					</SubMenu>
				)}
				{this.props.permissions.includes("splash.list") && <Menu.Item key="/splash">
					<NavLink to="/splash">
						<Icon type="picture" />
						<span className="nav-text">Splash</span>
					</NavLink>
				</Menu.Item>}
				{(
					this.props.permissions.includes("push-general.list")
					|| this.props.permissions.includes("push-user.list")) && (
					<SubMenu key="/push" title={<span><Icon type="notification" /><span>Push</span></span>}>
						{this.props.permissions.includes("push-general.list") && <Menu.Item key="/push/general">
							<NavLink to="/push/general">
								<span className="nav-text">Geral</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("push-city.list") && <Menu.Item key="/push/city">
							<NavLink to="/push/city">
								<span className="nav-text">Por cidade</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("push-state.list") && <Menu.Item key="/push/state">
							<NavLink to="/push/state">
								<span className="nav-text">Por estado</span>
							</NavLink>
						</Menu.Item>}
						{this.props.permissions.includes("push-user.list") && <Menu.Item key="/push/user">
							<NavLink to="/push/user">
								<span className="nav-text">Por usuário</span>
							</NavLink>
						</Menu.Item>}
					</SubMenu>
				)}
				{this.props.permissions.includes("report-a-problem.list") && <Menu.Item key="/report-a-problem">
					<NavLink to="/report-a-problem">
						<Icon type="bug" />
						<span className="nav-text">Problemas relatados</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("customers.list") && <Menu.Item key="/customers">
					<NavLink to="/customers">
						<Icon type="team" />
						<span className="nav-text">Usuários</span>
					</NavLink>
				</Menu.Item>}
				{this.props.permissions.includes("customers.list") && <Menu.Item key="/customers-deleted">
					<NavLink to="/customers-deleted">
						<Icon type="user-delete" />
						<span className="nav-text">Usuários excluídos</span>
					</NavLink>
				</Menu.Item>}
			</Menu>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		permissions: state.auth.userData.permissions,
	};
};

export default connect(mapStateToProps)(withRouter(MainNavigation));
