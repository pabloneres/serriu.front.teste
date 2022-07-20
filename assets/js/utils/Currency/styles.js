import styled from 'styled-components';
import IntlCurrencyInput from "react-intl-currency-input";



export const Input = styled(IntlCurrencyInput)`
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-variant: tabular-nums;
    list-style: none;
    font-feature-settings: 'tnum', "tnum";
    position: relative;
    display: inline-block;
    width: 100%;
    min-width: 0;
    padding: 4px 11px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 1.5715;
    background-color: #fff;
    background-image: none;
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s;

    &:focus {
      border-color: #40a9ff;
    border-right-width: 1px !important;
    outline: 0;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    }
    
`;
