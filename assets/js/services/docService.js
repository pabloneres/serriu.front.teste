import { savePDF } from '@progress/kendo-react-pdf';

function teste(params) {
  console.log(params)
}

class DocService {
  createPdf = (html) => {
    savePDF(html, { 
      paperSize: 'a4',
      fileName: 'orcamento.pdf',
      margin: 2,
      scale: 0.65,
      proxyURL: process.env.REACT_APP_API_URL + '/pdf/' + Math.floor(Math.random() * (1 + 1000000000000)) + 1,
      forceProxy: true,
      proxyTarget: "pdftab",     
    })
  }
}

const Doc = new DocService();
export default Doc;