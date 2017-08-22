import React, {Component} from 'react';
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
        const {total, tax, isTipIncluded, tip, payers} = this.state;
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
        this.setState((prevState) => {
            return {
                payer: {name: '', amount: 0},
                payers: [...prevState.payers, this.state.payer],
                showPayerModal: false
            }
        });
    }

    render() {
        const {isTipIncluded, tip, grandTotal, payer, payers, showPayerModal} = this.state;

        let totalPaid = 0;
        const payerList = payers.map((payer) => {
            totalPaid += parseFloat(payer.amount);
            return (
                <div className="app__receipt-row">
                    <p className="app__receipt-cell">{payer.name}</p>
                    <p className="app__receipt-cell positive">{payer.amount}</p>
                </div>
            );
        });
        const remainingBill = grandTotal - totalPaid;

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


                <button className="app__button" onClick={this.calculateGrandTotal}>split</button>

                    <div className={`app__receipt-grid ${grandTotal ? 'show' : ''}`}>
                        <div className={`app__receipt-row total-amount`}>
                            <p className=" app__receipt-cell">Total</p>
                            <p className="app__receipt-cell negative">{grandTotal}</p>
                        </div>
                        {payerList}
                        <div className={`app__receipt-row ${payers.length > 0 ? '' : 'hide'}`}>
                            <p className="app__receipt-cell">remaining</p>
                            <p className={`app__receipt-cell ${remainingBill > 0 ? 'negative' : 'positive'}`}>{remainingBill}</p>
                        </div>
                    </div>

                {grandTotal ? (
                    <button className="app__button" onClick={this.showPayerModal}>add payer</button>
                ) : null}

                <Modal show={showPayerModal}>
                    <div className="app__edit-payer-container">
                        <p className="app__edit-payer-heading">Edit Payer</p>

                        <div className="app__payer-fields">
                            <FormField label="Payer Name">
                                <input className="app__input" type="text" onChange={e => this.handleInputChange('payer', {name: e.target.value, amount: payer.amount})} value={payer.name} />
                            </FormField>

                            <FormField label="Payer Amount">
                                <input className="app__input" onChange={e => this.handleInputChange('payer', {name: payer.name, amount: e.target.value})} type="text"  value={payer.amount} />
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
