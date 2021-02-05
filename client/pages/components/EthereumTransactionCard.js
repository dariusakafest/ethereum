import {url_cloudflare} from "../config";
import {Badge, Card, Form, ListGroup, Table, Alert} from "react-bootstrap";
import React, {useState} from "react";

function TableTransaction({transaction}) {
    function hexToDec(hex) {
        let integer = parseInt(hex, 16);
        return isNaN(integer) ? hex : integer;
    }

    function getTotalPriceByBlock(block) {
        let price = 0;

        if (!block.transactions) {
            return price;
        }

        block.transactions.forEach((item, key) => {
            if (typeof item.gasPrice != 'undefined') {
                price += hexToDec(item.gasPrice);
            }
        });
        return price;
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
                    <Badge variant="info">{transaction.transactions.length} transactions</Badge>
                </td>
            </tr>
            <tr>
                <td>Mined by:</td>
                <td>{String(hexToDec(transaction.miner))}</td>
            </tr>
            <tr>
                <td>Uncles Reward:</td>
                <td>{ transaction.uncles ? transaction.uncles.map(function (uncle, key) {
                    return <Badge variant="info" index={key}>{uncle}</Badge>
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

export class EthereumTransactionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transaction: null,
            value: '',
            invalidValue: false,
            loading: false
        };

        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.loadTransaction(this.state.value);
    }

    handleChange(event) {
        this.loadTransaction(event.target.value);

        if (event.target.value && isNaN(parseInt(event.target.value))) {
            this.setState({
                invalidValue: true
            });
        } else {
            this.setState({
                invalidValue: false
            });
        }

        this.setState({value: event.target.value});
    }

    loadTransaction(search) {
        let self = this;

        this.setState({
            loading: true
        });

        let value = 'latest';

        search = parseInt(search);

        if (search && !isNaN(search)) {
            value = '0x'+Number(search).toString(16);
        }

        fetch(
            url_cloudflare,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":[value, true],"id":1})
            }
        )
        .then(res => res.json())
        .then((response) => {
            self.setState({
                transaction: response.result
            });

            self.setState({
                loading: false
            });
        }, function () {
            self.setState({
                loading: false
            });
        })
        ;
    }

    render() {
        const {transaction, invalidValue, loading} = this.state;

        return (
            <Card>
                <Card.Body>
                    <Card.Title>Ethereum transaction {this.state.value}</Card.Title>
                    <Form.Group controlId="formLookTransaction">
                        <Form.Control value={this.state.value} onChange={this.handleChange} type="text" placeholder="Write please ID transaction" />
                        <Form.Text className="text-muted">
                            Enter please here id transaction, for example: 45464665
                        </Form.Text>
                        {invalidValue ? <Alert variant="danger">Invalid value</Alert> : ''}
                    </Form.Group>
                    {
                        loading
                        ?  <Alert variant="info">Loading...</Alert>
                        : (
                            transaction
                            ? <TableTransaction transaction={transaction}></TableTransaction>
                            : <Alert variant="danger">Not loaded</Alert>
                        )
                    }
                </Card.Body>
            </Card>
        );
    }
}