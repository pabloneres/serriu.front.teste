import React, { Fragment } from "react";

import { ContainerWrapper, ResumoContainer, InfoRow } from "./styles";
import { convertMoney, convertDate, currencyToInt } from "~/modules/Util";
import { BackComponent } from "~/modules/global";
import moment from "moment";
import {
	Table,
	Select,
	Button,
	Tooltip,
	Input,
	InputNumber,
	DatePicker,
	Form,
	Modal
} from "antd";

const {TextArea} = Input;

function Resumo({
					resumoCobranca,
					data,
					boletoParams,
					handleSubmit,
					valor,
					back,
					paciente,
					showBack = true,
					showButtons = true
				}) {

	const returnDisabledVerified = () => {
		if(
			paciente.cpf_verified === 0 ||
			paciente.rg_verified === 0 ||
			paciente.address_verified === 0
		)
		{
			return true; // true = desabilitado
		}

		return false;
	};

	return (
		<ContainerWrapper style={{width: "100%"}}>
			{showBack && (<BackComponent action={back} />)}
			<ResumoContainer>
				{resumoCobranca && (
					<Fragment>
						<div className="header-panel-resumo">
							<span>Resumo</span>
						</div>

						<InfoRow>
							<span>Tipo da cobrança</span>
							<span>{resumoCobranca.tipoCobranca}</span>
						</InfoRow>

						<InfoRow>
							<span>Valor da cobrança</span>
							<span>{convertMoney(valor)}</span>
						</InfoRow>

						<InfoRow>
							<span>Entrada</span>
							<span>{convertMoney(boletoParams.entrada)}</span>
						</InfoRow>

						{boletoParams.parcelas && (
							<InfoRow>
								<span>Parcelas</span>
								<span>{boletoParams.parcelas} parcelas de{" "}{convertMoney((valor - boletoParams.entrada) / boletoParams.parcelas)}{" "}({convertMoney(valor - boletoParams.entrada)}) </span>
							</InfoRow>
						)}

						<InfoRow>
							<span>Nome do cliente</span>
							<span>{paciente.firstName} {paciente.lastName}</span>
						</InfoRow>

						<InfoRow>
							<span>E-mail do cliente</span>
							<span>{paciente.email}</span>
						</InfoRow>

						{resumoCobranca.vencimento && (
							<InfoRow>
								<span>Data vencimento</span>
								<span>{moment(boletoParams.vencimento).format("L")}</span>
							</InfoRow>
						)}

						<div className="info-boleto label-descricao">
							<span>Descrição</span>
							<TextArea
								showCount
								maxLength={200}
								value={resumoCobranca.descricao}
								disabled
							/>
						</div>
					</Fragment>
				)}
			</ResumoContainer>

			{showButtons && (
				<Fragment>
					{(!returnDisabledVerified()) && (
						<div>
							<Button
								onClick={() => handleSubmit({gerar: false})}
								type="primary"
								block
							>
								Gerar boletos
							</Button>
						</div>
					)}

					<Button
						type="primary"
						onClick={handleSubmit}
					>
						{returnDisabledVerified() ? "Receber entrada e salvar negocaição" : "Receber entrada e gerar boletos"}
					</Button>
				</Fragment>
			)}
		</ContainerWrapper>
	);
}

export default Resumo;
