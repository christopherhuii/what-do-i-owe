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
    payer: { name: '', amount: 0 },
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

    handlePayerChange = (name, value) => {
      this.setState((prevState) => {
        return {
          payer: { ...prevState.payer, [name]: value }
        };
      });
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
        payer: { name: '', amount: 0 }
      });
    }

    savePayer = () => {
      const { name, amount } = this.state.payer;
      this.setState((prevState) => {
        return {
          payer: { name: '', amount: 0 },
          editPayerIndex: -1,
          payers:
          prevState.editPayerIndex > -1
            ? [...prevState.payers.slice(0, prevState.editPayerIndex), { name, amount: math.eval(amount) }, ...prevState.payers.slice(prevState.editPayerIndex + 1)]
            : [...prevState.payers, { name, amount: math.eval(amount) }],
          showPayerModal: false
        };
      });
    }

    editPayer = (payerIndex) => {
      this.setState((prevState) => {
        return {
          payer: prevState.payers[payerIndex],
          editPayerIndex: payerIndex,
          showPayerModal: true
        };
      });
    }

    deletePayer = (index) => {
      this.setState((prevState) => {
        return {
          payers: prevState.payers.filter((_, i) => i !== index)
        };
      });
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

    render() {
      const { isTipIncluded, total, tax, tip, grandTotal, payer, payers, showPayerModal } = this.state;

      let totalPaid = 0;
      const subtotal = total - tax - (isTipIncluded ? tip : ((total - tax) * (tip / 100)));
      const payerList = payers.map((scopedPayer, i) => {
        const payerAmount = parseFloat(scopedPayer.amount);
        const amountWithTaxAndTip = payerAmount + ((payerAmount / subtotal) * tax) + (isTipIncluded ? (payerAmount / subtotal) * tip : payerAmount * (tip / 100));
        totalPaid += amountWithTaxAndTip;
        return (
          <div className="app__receipt-row">
            <p className="app__receipt-cell left">{scopedPayer.name}</p>
            <p className="app__receipt-cell positive right">{`$${amountWithTaxAndTip.toFixed(2)}`}</p>
            <p className="app__receipt-cell right">
              <span className="app__table-action-btn" onClick={() => this.editPayer(i)}>&#x270E;</span>
              <span className="app__table-action-btn" onClick={() => this.deletePayer(i)}>&#10005;</span>
            </p>
          </div>
        );
      });
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
                  onChange={e => this.handlePayerChange('name', e.target.value)}
                  value={payer.name}
                />

                <FormInput
                  label="Payer Amount"
                  onChange={e => this.handlePayerChange('amount', e.target.value)}
                  value={payer.amount}
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
