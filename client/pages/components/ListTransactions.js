import {Card, ListGroup} from "react-bootstrap";
import React, { useState } from 'react';
import {url_api} from "../config";

export class ListTransactions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        }
    }

    componentDidMount() {
        fetch(
            url_api + 'list'
        )
            .then(res => res.json())
            .then((response) => {

                this.setState({
                    transactions: response.result
                });
            })
        ;
    }

    hexToDec(hex) {
        return parseInt(hex, 16);
    }

    render() {
        const {transactions} = this.state;
        const self = this;

        return (
            <Card>
                <Card.Body>
                    <Card.Title>List transations</Card.Title>
                    <ListGroup variant="flush">
                        { transactions.map(function (transaction, key) {
                            return (
                                <ListGroup.Item key={key}>{ transaction.result.hash }</ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Card.Body>
            </Card>
        );
    }
}