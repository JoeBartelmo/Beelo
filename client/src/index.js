import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Divider, Form, Header, Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

var players = [
        {
            key:'hank',
            value:'hank',
            flag:'hank',
            text:'Hank'
        },
        {
            key:'bill',
            value:'bill',
            flag:'bill',
            text:'Bill'
        }
];

const results = [
    {
        key:'win',
        value:'win',
        flag:'win',
        text:'Win'
    },
    {
        key:'loss',
        value:'loss',
        flag:'loss',
        text:'Loss'
    },
    {
        key:'draw',
        value:'draw',
        flag:'draw',
        text:'Draw'
    }
];

class MatchReport extends React.Component {
    render() {
        return (
            <Form>
                <Form.Group widths='equal'>
                    <Form.Select placeholder='Select a player' options={players}/>
                    <Form.Select placeholder='Select a player' options={players}/>
                </Form.Group>
                <Form.Field>
                    <Form.Select placeholder='Select a result' options={results}/>
                </Form.Field>
            </Form>
        )
    }
}

class Leaderboard extends React.Component {
    render() {
        return (
            <Table celled padded>
                <Table.Header>
                    <Table.HeaderCell>Ranking</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>1000</Table.Cell>
                        <Table.Cell>Bill</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell>1000</Table.Cell>
                        <Table.Cell>Hank</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        )
    }
}

ReactDOM.render(
    (<Container>
        <Header as='h1'>Elo System</Header>
        <MatchReport/>
        <Divider/>
        <Leaderboard/>
    </Container>),
    document.getElementById('root')
);
