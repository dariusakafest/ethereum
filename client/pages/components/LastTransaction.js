import {Card, Form} from "react-bootstrap";
import React, { useState } from 'react';
import {
    Table,
    Badge,
    Alert
} from 'react-bootstrap';
import {url_api} from "../config";

function TableTransaction({transaction}) {

    function getTotalPriceByBlock(block) {
        let price = 0;

        if (!block.transactions) {
            return price;
        }

        block.transactions.forEach ((item) => {
            price += hexToDec(item.gasPrice);
        });
        return price;
    }

    function hexToDec(hex) {
        let value = parseInt(hex, 16);

        return (isNaN(value) ? '' : value);
    }

    return (
        <Table responsive bordered>
            <tbody>
            <tr>
                <td>Timestamp:</td>
                <td>{(new Date(hexToDec(transaction.timestamp))).toDateString()}</td>
            </tr>
            <tr>
                <td>Transactions:</td>
                <td>
                    {
                        transaction.transactions
                        ?  <Badge variant='info'>{transaction.transactions.length} transactions</Badge>
                        : ''
                    }
                </td>
            </tr>
            <tr>
                <td>Mined by:</td>
                <td>{hexToDec(transaction.miner)}</td>
            </tr>
            <tr>
                <td>Uncles Reward:</td>
                <td>{ transaction.uncles ? transaction.uncles.map(function (uncle, key) {
                    return <Badge variant="info" key={key}>{uncle}</Badge>
                }) : '' }</td>
            </tr>
            <tr>
                <td>Difficulty:</td>
                <td>{hexToDec(transaction.difficulty)}</td>
            </tr>
            <tr>
                <td>Total Difficulty:</td>
                <td>{hexToDec(transaction.totalDifficulty)}</td>
            </tr>
            <tr>
                <td>Size:</td>
                <td>{hexToDec(transaction.size)}</td>
            </tr>
            <tr>
                <td>Gas Used:</td>
                <td>{hexToDec(transaction.gasUsed)}</td>
            </tr>
            <tr>
                <td>Gas Limit:</td>
                <td>{hexToDec(transaction.gasLimit)}</td>
            </tr>
            <tr>
                <td>Extra Data:</td>
                <td>{hexToDec(transaction.extraData)}</td>
            </tr>
            <tr>
                <td>Ether Price:</td>
                <td>{getTotalPriceByBlock(transaction)}</td>
            </tr>
            </tbody>
        </Table>
    );
}


export class LastTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: [],
            invalidTransation: false,
            invalidMessage: '',
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.loadTransaction();
    }

    handleChange(event) {
        this.loadTransaction(event.target.value);
        this.setState({
            value: event.target.value
        });
    }

    loadTransaction(id)
    {
        this.setState({
            loading: true
        });

        let block = 'latest';
        if (id && !isNaN(parseInt(id))) {
            block = id;
        }

        if (id && isNaN(parseInt(id))) {
            this.setState({
                loading: false,
                invalidTransation: true,
                invalidMessage: 'Invalid ID transaction'
            });
            return;
        }

        fetch(
            url_api + block
        )
            .then(res => res.json())
            .then((response) => {
                let result = response.result;

                if (response.id) {
                    this.setState({
                        transaction: response.result,
                        invalidTransation: false,
                        invalidMessage: ''
                    });
                } else {
                    this.setState({
                        transaction: response.result,
                        invalidTransation: true,
                        invalidMessage: result.message
                    });
                }
                this.setState({
                    loading: false
                });
            }, () => {
                this.setState({
                    loading: false,
                    invalidTransation: true,
                    invalidMessage: 'Can not get response from server: ' + url_api
                });
            })
        ;
    }

    render() {
        let {transaction, loading, invalidTransation, invalidMessage} = this.state;

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Last transation</Card.Title>
                    <Form.Group controlId="formLookTransaction">
                        <Form.Control type="text" value={this.state.value} onChange={this.handleChange} placeholder="Write please ID transaction" />
                        <Form.Text className="text-muted">
                            Enter please here id transaction, for example: 45464665
                        </Form.Text>
                    </Form.Group>
                    {
                        loading
                        ? <Alert variant="info">Loading...</Alert>
                        : (
                            invalidTransation
                            ? <Alert variant="danger">{invalidMessage}</Alert>
                            : <TableTransaction transaction={transaction}></TableTransaction>
                        )
                    }
                </Card.Body>
            </Card>
        );
    }
}