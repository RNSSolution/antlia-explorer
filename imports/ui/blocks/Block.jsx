import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { Link,  } from 'react-router-dom';
import numbro from 'numbro';
import moment from 'moment';
import Avatar from '../components/Avatar.jsx';
import TransactionTabs from '../transactions/TransactionTabs.jsx';
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
export default class Block extends Component{
    constructor(props){
        super(props);

        this.state = {
            transferTxs: {},
            stakingTxs: {},
            distributionTxs: {},
            governanceTxs: {},
            slashingTxs: {},
        };
    }

    componentDidUpdate(prevProps){
        if (this.props != prevProps){
            if (this.props.transactionsExist){
                // console.log("have txs.");
                this.setState({
                    transferTxs: this.props.transferTxs,
                    stakingTxs: this.props.stakingTxs,
                    distributionTxs: this.props.distributionTxs,
                    governanceTxs: this.props.governanceTxs,
                    slashingTxs: this.props.slashingTxs
                })
            }
        }
    }

    render(){
        if (this.props.loading){
            return <Container id="block">
                <Spinner type="grow" color="primary" />
            </Container>
        }
        else{
            if (this.props.blockExist){
                // console.log(this.props.block);
                let block = this.props.block;
                let proposer = block.proposer();
                let moniker = proposer?proposer.description.moniker:'';
                let identity = proposer?proposer.description.identity:'';

                return <Container id="block" className="paddingleft">
                    <Helmet>
                        <title>Block {numbro(block.height).format("0,0")} on Colors Explorer | Colors</title>
                        <meta name="description" content={"Block details of height "+numbro(block.height).format("0,0")} />
                    </Helmet>
                    <h4><T>blocks.block</T> {numbro(block.height).format("0,0")}</h4>
                    <Card>
                        <div className="card-header backgroundcolor"><T>common.information</T></div>
                        <CardBody>
                            <Row>
                                <Col md={4} className="label"><T>common.hash</T></Col>
                                <Col md={8} className="value address">{block.hash}</Col>
                                <Col md={4} className="label"><T>blocks.proposer</T></Col>
                                <Col md={8} className="value"><Link to={"/validator/"+((proposer)?proposer.operator_address:'')}><Avatar moniker={moniker} identity={identity} address={block.proposerAddress} list={true} /> {moniker}</Link></Col>
                                <Col md={4} className="label"><T>blocks.numOfTransactions</T></Col>
                                <Col md={8} className="value">{numbro(block.transNum).format("0,0")}</Col>
                                <Col md={4} className="label"><T>common.time</T></Col>
                                <Col md={8} className="value">{moment.utc(block.time).format("D MMM YYYY, h:mm:ssa z")} ({moment(block.time).fromNow()})</Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <TransactionTabs 
                        transferTxs={this.state.transferTxs}
                        stakingTxs={this.state.stakingTxs}
                        distributionTxs={this.state.distributionTxs}
                        governanceTxs={this.state.governanceTxs}
                        slashingTxs={this.state.slashingTxs}
                    />
                </Container>
            }
            else{
                return <Container id="block" className="paddingleft"><div><T>block.notFound</T></div></Container>
            }
        }
    }
}