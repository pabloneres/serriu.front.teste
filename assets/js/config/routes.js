import Login from "~/screens/login"
import Dashboard from "~/screens/dashboard"
import Cargos from "~/components/created/administrador/cargos"
import AdicionarUsuario from "~/components/created/usuarios/AdicionarUsuario"
import ClinicaPage from "~/components/created/clinicas/ClinicaPage"
import AdicionarClinicaPage from "~/components/created/clinicas/AdicionarClinicaPage"
import EditarClinicaPage from "~/components/created/clinicas/EditarClinicaPage"
import AgendaPage from "~/components/created/agenda/AgendaPage"
import OrcamentoPage from "~/components/created/pacientes/components/orcamento/OrcamentoPage"
import AdicionarOrcamentoPage from "~/components/created/pacientes/components/orcamento/AdicionarOrcamentoPage"
import EditarOrcamentoPage from "~/components/created/pacientes/components/orcamento/EditarOrcamentoPage"
import FinanceiroPage from "~/components/created/financeiro/FinanceiroPage"
import Fluxo from "~/components/created/financeiro/components/Fluxo"
import CaixaPrincipal from "~/components/created/financeiro/components/CaixaPrincipal"
import Caixas from "~/components/created/financeiro/components/Caixas"
import Lab from "~/components/created/financeiro/components/Lab"
import DentistaPage from "~/components/created/usuarios/dentistas/DentistaPage"
import AdicionarDentistaPage from "~/components/created/usuarios/dentistas/AdicionarDentistaPage"
import EditarDentistaPage from "~/components/created/usuarios/dentistas/EditarDentistaPage"
import Profile from "~/components/created/profile"
import PacientePage from "~/components/created/pacientes/PacientePage"
import AdicionarPacientePage from "~/components/created/pacientes/AdicionarPacientePage"
import EditarPacientePage from "~/components/created/pacientes/EditarPacientePage"
import Monitoramento from "~/components/created/monitoramento"
import Recepcao from "~/components/created/recepcao"
import Recepcionista from "~/components/created/usuarios/recepcionista"
import AdicionarRecepcionistaPage from "~/components/created/usuarios/recepcionista/AdicionarRecepcionistaPage"
import EditarRecepcionistaPage from "~/components/created/usuarios/recepcionista/EditarRecepcionistaPage"
import TabelaPreco from "~/components/created/configuracoes/tabelaPreco/TabelaPreco"
import TabelaEspecialidade from "~/components/created/configuracoes/tabelaEspecialidade/TabelaEspecialidade"
import TabelaProcedimento from "~/components/created/configuracoes/tabelaProcedimento/TabelaProcedimento"
import RelatorioPage from "~/components/created/configuracoes/relatorios/RelatorioPage"
import Equipamentos from "~/components/created/administrador/equipamentos"
import Geral from "~/components/created/configuracoes/geral"
import Lixeira from "~/components/created/configuracoes/lixeira"
import Laboratorios from "~/components/created/configuracoes/laboratorios"
import Laboratorioservices from "~/components/created/configuracoes/laboratorioservices"
import Leads from "~/components/created/leads"
import Atividades from "~/components/created/atividades"
import Pdf from "~/components/created/Pdf"
import Teste from "~/components/created/teste"

export const PUBLIC_ROUTES = []

export const SESSION_ROUTES = [
	{
		path     : "/entrar",
		component: Login,
		exact    : true,
	},
];

export const PRIVATE_ROUTES = [
	{
		component: Dashboard,
		exact    : true,
		path     : "/",
	},
	// {
	//     component: Dashboard,
	//     exact: true,
	//     path: "/dashboard",
	// },
	{
		component: Cargos,
		exact    : true,
		path     : "/cargos",
	},
	{
		component: AdicionarUsuario,
		exact    : true,
		path     : "/usuario/adicionar",
	},
	{
		component: ClinicaPage,
		exact    : true,
		path     : "/clinicas",
	},
	{
		component: AdicionarClinicaPage,
		exact    : true,
		path     : "/clinicas/:id",
	},
	{
		component: EditarClinicaPage,
		exact    : true,
		path     : "/clinicas/editar/:id",
	},
	{
		component: AgendaPage,
		exact    : true,
		path     : "/agenda",
	},
	{
		component: OrcamentoPage,
		exact    : true,
		path     : "/orcamento",
	},
	{
		component: AdicionarOrcamentoPage,
		exact    : true,
		path     : "/orcamento/:id/adicionar",
	},
	{
		component: EditarOrcamentoPage,
		exact    : true,
		path     : "/orcamento/editar/:id",
	},
	{
		component: FinanceiroPage,
		exact    : true,
		path     : "/financeiro",
	},
	{
		component: Fluxo,
		exact    : true,
		path     : "/fluxo",
	},
	{
		component: CaixaPrincipal,
		exact    : true,
		path     : "/caixa/principal",
	},
	{
		component: Caixas,
		exact    : true,
		path     : "/caixas",
	},
	{
		component: Lab,
		exact    : true,
		path     : "/laboratorio",
	},
	{
		component: DentistaPage,
		exact    : true,
		path     : "/dentista",
	},
	{
		component: AdicionarDentistaPage,
		exact    : true,
		path     : "/dentista/adicionar",
	},
	{
		component: EditarDentistaPage,
		exact    : true,
		path     : "/dentista/editar/:id",
	},
	{
		component: Profile,
		exact    : true,
		path     : "/profile",
	},
	{
		component: PacientePage,
		exact    : true,
		path     : "/pacientes",
	},
	{
		component: AdicionarPacientePage,
		exact    : true,
		path     : "/paciente/adicionar",
	},
	{
		component: EditarPacientePage,
		exact    : true,
		path     : "/paciente/editar/:id",
	},
	{
		component: Monitoramento,
		exact    : true,
		path     : "/monitoramento",
	},
	{
		component: Recepcao,
		exact    : true,
		path     : "/recepcao",
	},
	{
		component: Recepcionista,
		exact    : true,
		path     : "/recepcionista",
	},
	{
		component: AdicionarRecepcionistaPage,
		exact    : true,
		path     : "/recepcionista/adicionar",
	},
	{
		component: EditarRecepcionistaPage,
		exact    : true,
		path     : "/recepcionista/editar/:id",
	},
	{
		component: TabelaPreco,
		exact    : true,
		path     : "/tabela-precos",
	},
	{
		component: TabelaEspecialidade,
		exact    : true,
		path     : "/tabela-especialidades",
	},
	{
		component: TabelaProcedimento,
		exact    : true,
		path     : "/tabela-precos/:id/procedimentos",
	},
	{
		component: RelatorioPage,
		exact    : true,
		path     : "/relatorios",
	},
	{
		component: Equipamentos,
		exact    : true,
		path     : "/esps",
	},
	{
		component: Geral,
		exact    : true,
		path     : "/configuracao_geral",
	},
	{
		component: Lixeira,
		exact    : true,
		path     : "/lixeira",
	},
	{
		component: Laboratorios,
		exact    : true,
		path     : "/laboratorios",
	},
	{
		component: Laboratorioservices,
		exact    : true,
		path     : "/laboratorios/:id",
	},
	{
		component: Leads,
		exact    : true,
		path     : "/leads",
	},
	{
		component: Atividades,
		exact    : true,
		path     : "/atividades",
	},
	{
		component: Pdf,
		exact    : true,
		path     : "/pageTeste/:id",
	},
	{
		component: Teste,
		exact    : true,
		path     : "/teste/:id",
	},
]

export const ROUTES = [
	{
		component: Login,
		exact    : true,
		path     : "/entrar",
		logged   : false
	},
	{
		component: Dashboard,
		exact    : true,
		path     : "/",
		logged   : true
	},
	{
		component: Dashboard,
		exact    : true,
		path     : "/dashboard",
		logged   : true
	},
	{
		component: Cargos,
		exact    : true,
		path     : "/cargos",
		logged   : true
	},
	{
		component: AdicionarUsuario,
		exact    : true,
		path     : "/usuario/adicionar",
		logged   : true
	},
	{
		component: ClinicaPage,
		exact    : true,
		path     : "/clinicas",
		logged   : true
	},
	{
		component: AdicionarClinicaPage,
		exact    : true,
		path     : "/clinicas/:id",
		logged   : true
	},
	{
		component: EditarClinicaPage,
		exact    : true,
		path     : "/clinicas/editar/:id",
		logged   : true
	},
	{
		component: AgendaPage,
		exact    : true,
		path     : "/agenda",
		logged   : true
	},
	{
		component: OrcamentoPage,
		exact    : true,
		path     : "/orcamento",
		logged   : true
	},
	{
		component: AdicionarOrcamentoPage,
		exact    : true,
		path     : "/orcamento/:id/adicionar",
		logged   : true
	},
	{
		component: EditarOrcamentoPage,
		exact    : true,
		path     : "/orcamento/editar/:id",
		logged   : true
	},
	{
		component: FinanceiroPage,
		exact    : true,
		path     : "/financeiro",
		logged   : true
	},
	{
		component: Fluxo,
		exact    : true,
		path     : "/fluxo",
		logged   : true
	},
	{
		component: CaixaPrincipal,
		exact    : true,
		path     : "/caixa/principal",
		logged   : true
	},
	{
		component: Caixas,
		exact    : true,
		path     : "/caixas",
		logged   : true
	},
	{
		component: Lab,
		exact    : true,
		path     : "/laboratorio",
		logged   : true
	},
	{
		component: DentistaPage,
		exact    : true,
		path     : "/dentista",
		logged   : true
	},
	{
		component: AdicionarDentistaPage,
		exact    : true,
		path     : "/dentista/adicionar",
		logged   : true
	},
	{
		component: EditarDentistaPage,
		exact    : true,
		path     : "/dentista/editar/:id",
		logged   : true
	},
	{
		component: Profile,
		exact    : true,
		path     : "/profile",
		logged   : true
	},
	{
		component: PacientePage,
		exact    : true,
		path     : "/pacientes",
		logged   : true
	},
	{
		component: AdicionarPacientePage,
		exact    : true,
		path     : "/paciente/adicionar",
		logged   : true
	},
	{
		component: EditarPacientePage,
		exact    : true,
		path     : "/paciente/editar/:id",
		logged   : true
	},
	{
		component: Monitoramento,
		exact    : true,
		path     : "/monitoramento",
		logged   : true
	},
	{
		component: Recepcao,
		exact    : true,
		path     : "/recepcao",
		logged   : true
	},
	{
		component: Recepcionista,
		exact    : true,
		path     : "/recepcionista",
		logged   : true
	},
	{
		component: AdicionarRecepcionistaPage,
		exact    : true,
		path     : "/recepcionista/adicionar",
		logged   : true
	},
	{
		component: EditarRecepcionistaPage,
		exact    : true,
		path     : "/recepcionista/editar/:id",
		logged   : true
	},
	{
		component: TabelaPreco,
		exact    : true,
		path     : "/tabela-precos",
		logged   : true
	},
	{
		component: TabelaEspecialidade,
		exact    : true,
		path     : "/tabela-especialidades",
		logged   : true
	},
	{
		component: TabelaProcedimento,
		exact    : true,
		path     : "/tabela-precos/:id/procedimentos",
		logged   : true
	},
	{
		component: RelatorioPage,
		exact    : true,
		path     : "/relatorios",
		logged   : true
	},
	{
		component: Equipamentos,
		exact    : true,
		path     : "/esps",
		logged   : true
	},
	{
		component: Geral,
		exact    : true,
		path     : "/configuracao_geral",
		logged   : true
	},
	{
		component: Lixeira,
		exact    : true,
		path     : "/lixeira",
		logged   : true
	},
	{
		component: Laboratorios,
		exact    : true,
		path     : "/laboratorios",
		logged   : true
	},
	{
		component: Laboratorioservices,
		exact    : true,
		path     : "/laboratorios/:id",
		logged   : true
	},
	{
		component: Leads,
		exact    : true,
		path     : "/leads",
		logged   : true
	},
	{
		component: Atividades,
		exact    : true,
		path     : "/atividades",
		logged   : true
	},
	{
		component: Pdf,
		exact    : true,
		path     : "/pageTeste/:id",
		logged   : true
	},
	{
		component: Teste,
		exact    : true,
		path     : "/teste/:id",
		logged   : true
	},
]