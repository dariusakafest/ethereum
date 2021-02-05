import Head from 'next/head'
import {
    Container,
    Row,
    Col,
    Card,
    CardColumns,
    Form
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListTransactions} from "./components/ListTransactions"
import {LastTransaction} from "./components/LastTransaction"
import {EthereumTransactionCard} from "./components/EthereumTransactionCard"

export default function Home() {
  return (
      <Container>
          <h1 className="logo text-center"><span>Ethereum</span> test project</h1>
          <Row>
              <Col md={12}>
                  <Card>
                      <Card.Img variant="top" src="logo.png"/>
                  </Card>
              </Col>
          </Row>
          <Row>
              <Col md={12}>
                  <h2 className="text-center">Information from cloudflare server</h2>
              </Col>
              <Col md={12}>
                  <EthereumTransactionCard></EthereumTransactionCard>
              </Col>
          </Row>
          <Row>
              <Col md={12}>
                  <h2 className="text-center">Information from localhost server</h2>
              </Col>
              <Col md={12}>
                  <ListTransactions></ListTransactions>
              </Col>
              <Col md={12}>
                  <LastTransaction></LastTransaction>
              </Col>
          </Row>
      </Container>
  )
}
