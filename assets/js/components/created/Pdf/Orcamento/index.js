import React, { Fragment, useEffect, useState, createRef } from 'react';
import { useRouteMatch } from 'react-router-dom'
import {show} from '~/services/controller'
import { useSelector } from 'react-redux';
import { Spin } from 'antd'
import { convertDate, convertMoney } from '~/modules/Util';
import docService from '~/services/docService'
import { Button } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
// import { Container } from './styles';
import "./styles.css"


import logo from '~/assets/serriu_logo.png'

function OrcamentoPdf({id, ref}) {
    const docRef = createRef()
    const createPdf = (html) => docService.createPdf(html);

    const {params} = useRouteMatch()
    
    const {selectedClinic} = useSelector(state => state.clinic)
    
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadOrcamento()
    }, [])

    const loadOrcamento = () => {
        show('fichaClinica/getOrcamento', id, {paciente: true}).then(data => {
            setData(data)
            setLoading(false)
        })
    }

    const savePdf = () => {
        createPdf(docRef.current)
    }

    const handleDownloadImage = async () => {
        const element = docRef.current;
        const canvas = await html2canvas(element, {
            scale: 1
        })
    
        const data = canvas.toDataURL('image/jpg', 10.0);

        let pdf = new jsPDF("p", "px", "a4"); // A4 size page of PDF
    
            let imgWidth = 445;
            let pageHeight = pdf.internal.pageSize.height;
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
    
            pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(data, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
              }
              window.open(
                pdf.output("bloburl", { filename: "new-file.pdf" }),
                "_blank"
              );
      };


    return (
        <Fragment>
            <div style={{marginBottom: 30}}>
                <Button block type='primary' onClick={savePdf}>Imprimir</Button>
            </div>
            {loading ? 
                <Spin/>
                : <div className="container_pdf" ref={docRef}>
                <div className="container_title">
                    <span className="title_orcamento">ORÇAMENTO</span>
                </div>
                <div className="header_pdf">
                    <div className="column_pdf">
                        <img src={logo} alt="" srcset="" className='logo_pdf' />
                        {/* <span className='text_logo'>{selectedClinic.name}</span> */}
                    </div>
                    <div className="container_infos">
                        <span className="info_text customer_name">{data.paciente.firstName} {data.paciente.lastName}</span>
                        <span className="info_text">{data.paciente.address}</span>
                        <span className="info_text">{data.paciente.city}</span>
                        <span className="info_text">{data.paciente.tel}</span>
                    </div>
                </div>
                <div className="infos_clinica">
                    <div className="column_info">
                        <div className="row_info">
                            <span className="label_info">
                                Nome
                            </span>
                            <span className="text_info_clinica">
                                {selectedClinic.name}
                            </span>
                        </div>
                        <div className="row_info">
                            <span className="label_info">
                                Endereço
                            </span>
                            <span className="text_info_clinica">
                                {selectedClinic.address} - {selectedClinic.city}
                            </span>
                        </div>
                        <div className="row_info">
                            <span className="label_info">
                                Telefone
                            </span>
                            <span className="text_info_clinica">
                                {selectedClinic.tel}
                            </span>
                        </div>
                        <div className="row_info">
                            <span className="label_info">
                                CPF/CNPJ
                            </span>
                            <span className="text_info_clinica">
                                {selectedClinic.register}
                            </span>
                        </div>
                        {/* <div className="row_info">
                            <span className="label_info">
                                Email
                            </span>
                            <span className="text_info_clinica">
                                {selectedClinic.email}
                            </span>
                        </div> */}
                    </div>
                </div>
                {/* <div className="separate"></div> */}
                <div className="infos_created">
                    <div className='info_created'>
                        <span className='title_created'>Orçamento nº:</span>
                        <span>{data.id}</span>
                    </div>
                    <div className='info_created'>
                        <span className='title_created'>Criado em:</span>
                        <span>{convertDate(data.created_at)}</span>
                    </div>
                    <div className='info_created' style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <span className='title_created'>Avaliador:</span>
                        <span>{data.has_avaliador && `${data.has_avaliador.firstName} ${data.has_avaliador.lastName}`}</span>
                    </div>
                </div>
                {/* <div className="separate"></div> */}
                <div className="container_content">
                    <table>
                        <tr className="header_table">
                            <th>Procedimento</th>
                            <th>Dente</th>
                            <th>Fatura</th>
                            <th>Data Exc.</th>
                            <th>Profissional</th>
                            <th>Status Pgt.</th>
                            <th>Total Unitario</th>
                            <th>Total com Desconto</th>
                        </tr>

                        {
                            data.especialidades.map(especialidade => {
                                let valorDesconto = especialidade.procedimentos.reduce((a, b) => a + Number(b.desconto), 0)

                                let valorTotal = especialidade.procedimentos.reduce((a, b) => a + b.valor, 0)

                                console.log(especialidade)
                                return (
                                    <Fragment>
                                        <div className="container_title_especialidade">
                                            <span>{especialidade.especialidade.name}</span>
                                        </div>
                                        {especialidade.procedimentos.map(item => {
                                            return (
                                                <tr>
                                                    <td>{item.procedimento.name}</td>
                                                    <td>{item.dente || "Geral"}</td>
                                                    <td>{item.negociacao_id || "n/a"}</td>
                                                    <td>{item.data_execucao ? convertDate(item.data_execucao, '') : "n/a"}</td>
                                                    <td>{item.has_titular ? `${item.has_titular?.firstName} ${item.has_titular?.lastName}` : "n/a"}</td>
                                                    <td>{item.status_pagamento || "n/a"}</td>
                                                    <td>{convertMoney(item.valor)}</td>
                                                    <td>{convertMoney(item.desconto)}</td>
                                                </tr>
                                            )
                                        })}
                                        {/* <div className="separate"></div> */}
                                        <tr style={{paddingTop: 20, fontWeight: 'bold'}}>
                                            <td className='space_total'></td>
                                            <td className='space_total'></td>
                                            <td className='space_total'></td>
                                            <td className='space_total'></td>
                                            <td className='space_total'></td>
                                            <td className='space_total'></td>
                                            <td className='space_total'><span>{convertMoney(valorTotal)}</span></td>
                                            <td className='space_total'>{convertMoney(valorDesconto)}</td>
                                        </tr>
                                        <tr>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                            <td><div className='line_divider'></div></td>
                                        </tr>
                                    </Fragment>
                                )
                            })
                        }

                    </table>
                    <div className="footer_table">
                        <div className="row_total">
                            <span>Subtotal</span>
                            <span className='label_valor_total'>{convertMoney(data.valor)}</span>
                        </div>
                        <div className="row_total">
                            <span>Total com desconto</span>
                            <span className='label_valor_total'>{convertMoney(data.valorDesconto)} ({convertMoney(data.valor - data.valorDesconto)})</span>
                        </div>
                        <div className="row_total total_container">
                            <span>Total</span>
                            <span className='label_valor_total'>{convertMoney(data.valorDesconto)}</span>
                        </div>
                    </div>
                </div>
                <div className="signatures">
                    <div className="container_signature">
                        <div className="separate signature"></div>
                        <span>Profissional Responsável</span>
                    </div>
                    <div className="container_signature">
                        <div className="separate signature"></div>
                        <span style={{textAlign: 'center'}}>Autorização do paciente ou responsável <br/> para tratamentos, exames a serem realizados.</span>
                    </div>
                </div>
            </div>}
        </Fragment>
  )
}

export default OrcamentoPdf;