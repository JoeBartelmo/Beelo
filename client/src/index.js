import React from 'react';
import ReactDOM from 'react-dom';
import {Container, Divider, Form, Header, Table} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css';

const getRatingsEndpoint = '/getRatings';
const recordMatchEndpoint = '/recordMatch';

var players = [];

// format select options like this
var results = [
    {
        text: 'Win',
        value: 'win',
        key: 'win',
        flag: 'win'
    },
    {
        text: 'Loss',
        value: 'loss',
        key: 'loss',
        flag: 'loss'
    },
    {
        text: 'Draw',
        value: 'draw',
        key: 'draw',
        flag: 'draw'
    }
];


class MatchReport extends React.Component {
    constructor() {
        super();
        this.state = {
            names: [],
            playerLeft: '',
            playerRight: '',
            result: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        //change state to match form
    }
    handleSubmit(event) {
        event.preventDefault();
        //send to server
    }
    render() {
        return (
            <Form onSubmit = {this.handleSubmit}>
                <Form.Group widths='equal'>
                    <Form.Select placeholder='Select a player' options={[/* TODO: Put players here once got from API */]}/>
                    <Form.Select placeholder='Select a player' options={[]}/>
                </Form.Group>
                <Form.Field>
                    <Form.Select placeholder='Select a result' options={results}/>
                </Form.Field>
                <Form.Button>Record Match</Form.Button>
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
