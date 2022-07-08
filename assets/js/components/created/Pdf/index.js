import React, { Component } from 'react';
import { render } from 'react-dom';
import Doc from '~/services/docService';
import PdfContainer from './PdfContainer';
import Orcamento from "./Orcamento"

class Pdf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Still, Jaime',
      rank: 'SGT',
      description: 'Demonstrate how to export an HTML section to PDF'
    };
  }

  onChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState((state) => {
      state[name] = value;
      return state;
    })
  }

  createPdf = (html) => Doc.createPdf(html);

  render() {
    console.log(this.state);
    return (
      <Orcamento/>
    );
  }
}

export default Pdf
