import React, {Component} from 'react';
import math from 'mathjs';
import './app.css';

import FormField from './js/form-field.js';
import Modal from './js/modal.js';

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
        grandTotal: 0,
        payers: [],
        showPayerModal: false,
        payer: {name: '', amount: 0}
    }

    calculateGrandTotal = () => {
        const {total, tax, isTipIncluded, tip} = this.state;
        const subtotal = total - tax;
        const grandTotalValue = isTipIncluded ? total : total + (subtotal * (tip / 100));

        this.setState({
            grandTotal: grandTotalValue,
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

    handleEvaluateInput = (e) => {
        console.log(e.target.value);
    }

    showPayerModal = () => {
        this.setState({
            showPayerModal: true
        });
    }

    closePayerModal = () => {
        this.setState({
            showPayerModal: false,
            payer: {name: '', amount: 0}
        });
    }

    savePayer = () => {
        const {name, amount} = this.state.payer;
        this.setState((prevState) => {
            return {
                payer: {name: '', amount: 0},
                payers: [...prevState.payers, {name, amount: math.eval(amount)}],
                showPayerModal: false
            }
        });
    }

    render() {
        const {isTipIncluded, total, tax, tip, grandTotal, payer, payers, showPayerModal} = this.state;

        let totalPaid = 0;
        const subtotal = total - tax - (isTipIncluded ? tip : ((total - tax) * (tip / 100)));
        const payerList = payers.map((payer) => {
            const payerAmount = parseFloat(payer.amount);
            const amountWithTaxAndTip = payerAmount + (payerAmount / subtotal * tax) + (isTipIncluded ? payerAmount / subtotal * tip : payerAmount * (tip / 100));
            totalPaid += amountWithTaxAndTip;
            return (
                <div className="app__receipt-row">
                    <p className="app__receipt-cell">{payer.name}</p>
                    <p className="app__receipt-cell positive">{`$${amountWithTaxAndTip.toFixed(2)}`}</p>
                </div>
            );
        });
        const remainingBill = grandTotal - totalPaid;

        return (
            <div className="app">
                <h1 className="app__header">what do i owe?</h1>

                <FormField label="Total">
                  <input className="app__input" type="number" step="0.01" onChange={e => this.handleInputChange('total', parseFloat(e.target.value))} />
                </FormField>

                <FormField label="Tax">
                  <input className="app__input" type="number" step="0.01" onChange={e => this.handleInputChange('tax', parseFloat(e.target.value))}/>
                </FormField>

                <FormField label="Is tip included?">
                  <select className="app__input" defaultValue="" onChange={e => this.handleTipChange(e.target.value)}>
                      <option value="true">Yes</option>
                      <option value="">No</option>
                  </select>
                </FormField>

                <FormField label={isTipIncluded ? "Included Tip" : "Tip"}>
                    <input className="app__input" type="number" step="0.01" onChange={e => this.handleInputChange('tip', parseFloat(e.target.value))} value={tip}/>
                    <span className="app__placeholder">{isTipIncluded ? "$" : "%"}</span>
                </FormField>


                <button className="app__button" onClick={this.calculateGrandTotal}>split</button>

                    <div className={`app__receipt-grid ${grandTotal ? 'show' : ''}`}>
                        <div className={`app__receipt-row total-amount`}>
                            <p className=" app__receipt-cell">Total</p>
                            <p className="app__receipt-cell negative">{`-$${grandTotal.toFixed(2)}`}</p>
                        </div>
                        {payerList}
                        <div className={`app__receipt-row ${payers.length > 0 ? '' : 'hide'}`}>
                            <p className="app__receipt-cell">remaining</p>
                            <p className={`app__receipt-cell ${remainingBill.toFixed(2) > 0 ? 'negative' : 'positive'}`}>{remainingBill.toFixed(2)}</p>
                        </div>
                    </div>

                {grandTotal && remainingBill.toFixed(2) > 0 ? (
                    <button className="app__button" onClick={this.showPayerModal}>add payer</button>
                ) : null}

                <Modal show={showPayerModal} onClose={this.closePayerModal}>
                    <div className="app__edit-payer-container">
                        <p className="app__edit-payer-heading">Edit Payer</p>

                        <div className="app__payer-fields">
                            <FormField label="Payer Name">
                                <input className="app__input" type="text" onChange={e => this.handleInputChange('payer', {name: e.target.value, amount: payer.amount})} value={payer.name} />
                            </FormField>

                            <FormField label="Payer Amount">
                                <input className="app__input" type="number" step="0.01" onChange={e => this.handleInputChange('payer', {name: payer.name, amount: e.target.value})} type="text"  value={payer.amount} />
                            </FormField>
                        </div>

                        <button className="app__button" onClick={this.savePayer}>save</button>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default WhatDoIOwe;
