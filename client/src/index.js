import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import os from 'os';

import Select from 'react-select';
import 'semantic-ui-css/semantic.min.css';
import 'react-select/dist/react-select.css';
import {Container, Divider, Header, Table, Form} from 'semantic-ui-react'

const GET_COLORS   = 'http://' + os.hostname() + '/getColors';
const GET_DECKS    = 'http://' + os.hostname() + '/getDecks';
const GET_PLAYERS  = 'http://' + os.hostname() + '/getPlayers';
const POST_MATCH   = 'http://' + os.hostname() + '/recordMatch';

const VALID_COLORS = 'rgbuw';

// format select options like this
const results = [
    {
        label: 'Win',
        value: 'win'
    },
    {
        label: 'Loss',
        value: 'loss'
    },
    {
        label: 'Draw',
        value: 'draw'
    }
];

const colors = [
    {
        label: 'Red',
        value: 'r'
    },
    {
        label: 'Blue',
        value: 'u'
    },
    {
        label: 'Green',
        value: 'g'
    },
    {
        label: 'Black',
        value: 'b'
    },
    {
        label: 'White',
        value: 'w'
    }
];

/**
 * Maps input value to react-option format
 *
 * @param val value to convert
 * @return object
 */
function mapToOption(val) {
    return {
        label: val,
        value: val
    }
}

/**
 * Converts input string to title case string
 *
 * test mardu control ----> Test Mardu Control
 *
 * @param str string to convert
 * @return string
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function isValidColor(str) {
    for (let i = 0; i < str.length; i++) {
        if (!VALID_COLORS.includes(str.charAt(i))) {
            return false;
        }
    }
    return true;
}

function toFormalColor(color, objectMap) {
    if (color !== null && objectMap !== null) {
        return objectMap[color.toLower().split('').sort().join('')];
    }
    return 'Unknown';
}

//TODO if needed
function toColors(formalColor, objectMap) {
    if (formalColor !== null && objectMap !== null) {
        return toTitleCase(formalColor);
    }
    return null;
}

/**
 * All asynchronous loaded items
 */
var players = false;
const getPlayers = () => {
    if(players) {
        return Promise.resolve(players);
    }
    else {
        return axios.get(GET_PLAYERS).then(response => {
            players = {options: response.data.players.map(player => mapToOption(player.name))};
            return players;
        });
    }
};

var decks = false;
const getDecks = () => {
    if(!(!decks) !== false) {
        return decks;
    }
    else {
        return axios.get(GET_DECKS).then(response => {
            decks = {options: response.data.decks.map(deck => mapToOption(deck))};
            return decks;
        });
    }
};



class MatchReport extends React.Component {
    constructor() {
        super();
        this.state = {
            player1: null,
            player2: null,
            deck1: null,
            deck2: null,
            color1: [],
            color2: [],
            result: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        //change state to match form
    }
    handleSubmit(event) {
        event.preventDefault();
        console.log('testing this ish')
        //send to server
    }
    selectPlayer(p, value) {
        if(p === 1)
            this.setState({player1: value});
        else
            this.setState({player2: value});
    }
    selectDeck(p, value) {
        if(p === 1)
            this.setState({deck1: value});
        else
            this.setState({deck2: value});
    }
    selectColors(p, value) {
        console.log(value);
        if(p === 1)
            this.setState({color1:value});
        else
            this.setState({color2:value});
    }
    setResult(value){
        this.setState({result:value});
    }
    render() {
        return (
            <div id = 'match'>
                <Table definition>
                    <Table.Header>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Player 1</Table.HeaderCell>
                        <Table.HeaderCell>Player 2</Table.HeaderCell>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Name</Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.player1}
                                    placeholder='Select a player'
                                    onChange={(e) => this.selectPlayer(1, e)}
                                    loadOptions={getPlayers} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.player2}
                                    placeholder='Select a player'
                                    onChange={(e) => this.selectPlayer(2, e)}
                                    loadOptions={getPlayers} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Deck</Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck1}
                                    placeholder='Select a deck'
                                    onChange={(e) => this.selectDeck(1, e)}
                                    loadOptions={getDecks} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck2}
                                    placeholder='Select a deck'
                                    onChange={(e) => this.selectDeck(2, e)}
                                    loadOptions={getDecks} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Color[s]</Table.Cell>
                            <Table.Cell>
                                <Select
                                    multi
                                    value={this.state.color1}
                                    placeholder='Select Deck Colors'
                                    onChange={(e) => this.selectColors(1, e)}
                                    options={colors} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select
                                    multi
                                    value={this.state.color2}
                                    placeholder='Select Deck Colors'
                                    onChange={(e) => this.selectColors(2, e)}
                                    options={colors} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Select
                    value={this.state.result}
                    placeholder='Select Player 1 win/loss/draw'
                    onChange={(e) => this.setResult(e)}
                    options={results} />
                <br/>
                <Form onSubmit={this.handleSubmit} style={{float:'right'}}>
                    <Form.Button primary>Record Match</Form.Button>
                </Form>
                <br/>
                <br/>
            </div>
               )
    }
}

class Leaderboard extends React.Component {
    render() {
        return (
            <Table celled padded>
                <Table.Header>
                    <Table.HeaderCell>Elo Rating</Table.HeaderCell>
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
        <div style={{"paddingBottom":"10px"}}>
        Below is the match reporting system, select the players, the decks they
        were playing and the colors of the decks, as well as whether the first
        player won or lost. Once Ready, click the button at the bottom to submit
        the match report.
        </div>
        <MatchReport/>
        <Divider/>
        <Leaderboard/>
    </Container>),
    document.getElementById('root')
);
