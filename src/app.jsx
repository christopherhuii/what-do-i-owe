// @flow

import React, { Component } from 'react';
import math from 'mathjs';
import './app.css';

import FormInput from './js/form-input';
import FormSelect from './js/form-select';
import Modal from './js/modal';

class WhatDoIOwe extends Component {
  // total: total + tax
  // tax: used to calculate tax rate
  // isTipIncluded: Used to determine if tax is already included in the bill;
  // whether it's cash or percentage value
  // tip: tip amount; can be dollar or percentage amount
  // grandTotal: total + tax + tip

  // payers: array of payer
  // showPayerModal: indicates whether the payer model is displayed
  // payer: {name: 'John Doe', amount: 100}
  // editPayerIndex: index of the active payer inside of payers

  state = {
    total: 0,
    tax: 0,
    isTipIncluded: false,
    tip: 15,
    grandTotal: 0,
    payers: [],
    showPayerModal: false,
    payer: { name: '', expressionAmount: 0, evalAmount: 0 },
    editPayerIndex: -1
  }


  componentDidUpdate(prevProps, prevState) {
    const { total, tax, tip, isTipIncluded } = this.state;

    if (prevState.total !== total ||
      prevState.tax !== tax ||
      prevState.isTipIncluded !== isTipIncluded ||
      prevState.tip !== tip
    ) {
      this.handleGrandTotalChange();
    }
  }

    handleTipChange = (e) => {
      this.setState({
        [e.target.name]: e.target.value,
        tip: e.target.value ? 0 : 15
      });
    }

    handlePayerNameChange = (e) => {
      e.persist();
      this.setState(prevState => ({
        payer: { ...prevState.payer, name: e.target.value }
      }));
    }

    handlePayerAmountChange = (e) => {
      e.persist();
      this.setState(prevState => ({
        payer: {
          ...prevState.payer,
          expressionAmount: e.target.value
        }
      }));
    }

    handleGrandTotalChange = () => {
      this.setState({
        grandTotal: this.calculateGrandTotal()
      });
    }

    showPayerModal = () => {
      this.setState({
        showPayerModal: true
      });
    }

    closePayerModal = () => {
      this.setState({
        showPayerModal: false,
        payer: { name: '', expressionAmount: 0, evalAmonut: 0 }
      });
    }

    savePayer = () => {
      const { isTipIncluded, tax, total, tip, payer } = this.state;
      const subtotal = total - tax - (isTipIncluded ? tip : 0);
      const payerAmount = parseFloat(math.eval(payer.expressionAmount));
      const amountWithTaxAndTip = payerAmount + ((payerAmount * (tax / subtotal))) + (isTipIncluded ? (payerAmount / subtotal) * tip : payerAmount * (tip / 100));
      this.setState(prevState => ({
        payer: { name: '', expressionAmount: 0, evalAmount: 0 },
        editPayerIndex: -1,
        payers:
        prevState.editPayerIndex > -1
          ? [
            ...prevState.payers.slice(0, prevState.editPayerIndex),
            { name: payer.name, expressionAmount: payer.expressionAmount, evalAmount: amountWithTaxAndTip },
            ...prevState.payers.slice(prevState.editPayerIndex + 1)
          ]
          : [...prevState.payers, { name: payer.name, expressionAmount: payer.expressionAmount, evalAmount: amountWithTaxAndTip }],
        showPayerModal: false
      }));
    }

    editPayer = payerIndex => () => {
      this.setState(prevState => ({
        payer: prevState.payers[payerIndex],
        editPayerIndex: payerIndex,
        showPayerModal: true
      }));
    }

    deletePayer = payerIndex => () => {
      this.setState(prevState => ({
        payers: prevState.payers.filter((_, i) => i !== payerIndex)
      }));
    }

    handleNumberFieldChange = (e) => {
      this.setState({
        [e.target.name]: parseFloat(e.target.value || 0)
      });
    }

    calculateGrandTotal = () => {
      const { total, tax, isTipIncluded, tip } = this.state;

      if (total) {
        const subtotal = total - tax;
        const grandTotalValue = isTipIncluded ? total : total + (subtotal * (tip / 100));

        return grandTotalValue;
      }

      return 0;
    }

    renderPayer = (payer, index) => (
      <div className="app__receipt-row">
        <p className="app__receipt-cell left">{payer.name}</p>
        <p className="app__receipt-cell positive right">{`$${payer.evalAmount.toFixed(2)}`}</p>
        <p className="app__receipt-cell right">
          <span className="app__table-action-btn" onClick={this.editPayer(index)}>&#x270E;</span>
          <span className="app__table-action-btn" onClick={this.deletePayer(index)}>&#10005;</span>
        </p>
      </div>
    )

    render() {
      const { isTipIncluded, tip, grandTotal, payer, payers, showPayerModal } = this.state;

      const payerList = payers.map(this.renderPayer);
      const totalPaid = payers.reduce((payerTotal = 0, payerObj) => payerTotal + payerObj.evalAmount, 0);
      const remainingBill = grandTotal - totalPaid;

      return (
        <div className="app">
          <a href="/"><h1 className="app__header">what do i owe?</h1></a>

          <FormInput
            label="Total"
            onChange={this.handleNumberFieldChange}
            name="total"
            step={0.01}
            type="number"
            placeholder="$"
          />

          <FormInput
            label="Tax"
            onChange={this.handleNumberFieldChange}
            name="tax"
            step={0.01}
            type="number"
            placeholder="$"
          />

          <FormSelect
            label="Is tip included?"
            defaultValue=""
            name="isTipIncluded"
            onChange={this.handleTipChange}
            options={[{ text: 'Yes', value: true }, { text: 'No', value: '' }]}
          />

          <FormInput
            label={isTipIncluded ? 'Included Tip ($)' : 'Tip (%)'}
            onChange={this.handleNumberFieldChange}
            name="tip"
            step={0.01}
            type="number"
            placeholder={isTipIncluded ? '$' : '%'}
            value={tip}
          />

          <div className={`app__receipt-grid ${grandTotal ? 'show' : ''}`}>
            <div className={'app__receipt-row total-amount'}>
              <p className=" app__receipt-cell left">Total</p>
              <p className="app__receipt-cell negative right">{`-$${grandTotal.toFixed(2)}`}</p>
              <p className="app__receipt-cell" />
            </div>
            {payerList}
            <div className={`app__receipt-row ${payers.length > 0 ? '' : 'hide'}`}>
              <p className="app__receipt-cell left">remaining</p>
              <p className={`app__receipt-cell ${remainingBill.toFixed(2) > 0 ? 'negative' : 'positive'} right`}>
                {remainingBill > 0 ? `-$${remainingBill.toFixed(2)}` : `$${remainingBill.toFixed(2)}`}
              </p>
              <p className="app__receipt-cell" />
            </div>
          </div>

          {grandTotal && remainingBill.toFixed(2) > 0 ? (
            <button className="app__button" onClick={this.showPayerModal}>add payer</button>
          ) : null}

          <Modal show={showPayerModal} onClose={this.closePayerModal}>
            <div className="app__edit-payer-container">
              <p className="app__edit-payer-heading">Edit Payer</p>

              <div className="app__payer-fields">
                <FormInput
                  label="Payer Name"
                  onChange={this.handlePayerNameChange}
                  value={payer.name}
                />

                <FormInput
                  label="Payer Amount"
                  onChange={this.handlePayerAmountChange}
                  value={payer.expressionAmount}
                />
              </div>

              <button className="app__button" onClick={this.savePayer}>save</button>
            </div>
          </Modal>
        </div>
      );
    }
}

export default WhatDoIOwe;
