import React, {Component} from 'react';
import './app.css';

import FormField from './js/form-field.js';

class WhatDoIOwe extends Component {

    // Total: Total Bill
    // Tax: Used to calculate tax rate
    // isTipIncluded: Used to determine if tax is already included in the bill; whether it's cash or percentage value
    // tip: Tip Amount; can be dollar or percentage amount
    // grandTotal: Bill with tax and tip
    state = {
        total: 0,
        tax: 0,
        isTipIncluded: false,
        tip: 15,
        grandTotal: 0
    }

    calculateGrandTotal = () => {
        const {total, tax, isTipIncluded, tip} = this.state;
        const subtotal = total - tax;
        const grandTotalValue = isTipIncluded ? total : total + (subtotal * (tip / 100));

        this.setState({
            grandTotal: grandTotalValue
        });
    }

    handleInputChange = (field, value) => {
        this.setState({
            [field]: value
        })
    }

    handleTipChange = (isTipIncluded) => {
        this.setState({
            isTipIncluded,
            tip: isTipIncluded ? 0 : 15
        });
    }

    render() {
        const {isTipIncluded, tip} = this.state;

        return (
            <div className="app">
                <h1 className="app__header">what do i owe?</h1>

                <FormField label="Total">
                  <input className="app__input" type="number" onChange={e => this.handleInputChange('total', parseFloat(e.target.value))} />
                </FormField>

                <FormField label="Tax">
                  <input className="app__input" type="number" onChange={e => this.handleInputChange('tax', parseFloat(e.target.value))}/>
                </FormField>

                <FormField label="Is tip included?">
                  <select className="app__input" defaultValue="" onChange={e => this.handleTipChange(e.target.value)}>
                      <option value="true">Yes</option>
                      <option value="">No</option>
                  </select>
                </FormField>

                <FormField label={isTipIncluded ? "Included Tip" : "Tip"}>
                    <input className="app__input" type="number" onChange={e => this.handleInputChange('tip', parseFloat(e.target.value))} value={tip}/>
                    <span className="app__placeholder">{isTipIncluded ? "$" : "%"}</span>
                </FormField>


                <button className="app_split-btn" onClick={this.calculateGrandTotal}>split</button>
            </div>
        );
    }
}

export default WhatDoIOwe;
