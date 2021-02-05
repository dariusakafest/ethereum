import {Card, Form} from "react-bootstrap";
import React, { useState } from 'react';
import {
    Table,
    Badge
} from 'react-bootstrap';
import {url_api} from "../config";

export class LastTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: []
        }
    }

    componentDidMount() {
        fetch(
            url_api + 'latest'
        )
            .then(res => res.json())
            .then((response) => {
                this.setState({
                    transaction: response.result
                });
            })
        ;
    }

    getTotalPriceByBlock(block) {
        let self = this;

        let price = 0;

        if (!block.transactions) {
            return price;
        }

        block.transactions.forEach(function (item) {
            price += self.hexToDec(item.gasPrice);
        });
        return price;
    }

    hexToDec(hex) {
        let value = parseInt(hex, 16);

        return (isNaN(value) ? '' : value);
    }

    render() {
        let {transaction} = this.state;

        if (!transaction) {
            return (
                <div>Loading</div>
            );
        }

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Last transation</Card.Title>
                    <Form.Group controlId="formLookTransaction">
                        <Form.Control type="text" placeholder="Write please ID transaction" />
                        <Form.Text className="text-muted">
                            Enter please here id transaction, for example: 45464665
                        </Form.Text>
                    </Form.Group>
                    <Table responsive bordered>
                        <tbody>
                            <tr>
                                <td>Block Height:</td>
                                <td>sdfsdf</td>
                            </tr>
                            <tr>
                                <td>Timestamp:</td>
                                <td>{this.hexToDec(transaction.timestamp)}</td>
                            </tr>
                            <tr>
                                <td>Transactions:</td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>Mined by:</td>
                                <td>{this.hexToDec(transaction.miner)}</td>
                            </tr>
                            <tr>
                                <td>Uncles Reward:</td>
                                <td>{ transaction.uncles ? transaction.uncles.map(function (uncle, key) {
                                    return <Badge variant="info" key={key}>{uncle}</Badge>
                                }) : '' }</td>
                            </tr>
                            <tr>
                                <td>Difficulty:</td>
                                <td>{this.hexToDec(transaction.difficulty)}</td>
                            </tr>
                            <tr>
                                <td>Total Difficulty:</td>
                                <td>{this.hexToDec(transaction.totalDifficulty)}</td>
                            </tr>
                            <tr>
                                <td>Size:</td>
                                <td>{this.hexToDec(transaction.size)}</td>
                            </tr>
                            <tr>
                                <td>Gas Used:</td>
                                <td>{this.hexToDec(transaction.gasUsed)}</td>
                            </tr>
                            <tr>
                                <td>Gas Limit:</td>
                                <td>{this.hexToDec(transaction.gasLimit)}</td>
                            </tr>
                            <tr>
                                <td>Extra Data:</td>
                                <td>{this.hexToDec(transaction.extraData)}</td>
                            </tr>
                            <tr>
                                <td>Ether Price:</td>
                                <td>{this.getTotalPriceByBlock(transaction)}</td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        );
    }
}