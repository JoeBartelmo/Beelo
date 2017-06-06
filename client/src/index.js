import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import os from 'os';

import Select from 'react-select';
import 'semantic-ui-css/semantic.min.css';
import 'react-select/dist/react-select.css';
import {reactLocalStorage} from 'reactjs-localstorage';
import {Container, Divider, Header, Table, Form} from 'semantic-ui-react'
import {Router, Route} from 'react-router';

//const GET_COLORS   = 'http://' + os.hostname() + '/getColors';
const GET_DECKS    = 'http://' + os.hostname() + '/getDecks';
const GET_PLAYERS  = 'http://' + os.hostname() + '/getPlayers';
const POST_MATCH   = 'http://' + os.hostname() + '/recordMatch';


//const VALID_COLORS = 'rgbuw';

// format select options like this
const results = [
    {
        label: 'Win',
        value: 'player1'
    },
    {
        label: 'Loss',
        value: 'player2'
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
function mapToOption(val, tag) {
    return {
        label: val,
        value: val,
        tag: tag
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
//function toTitleCase(str) {
//    return str.replace(/\w\S*/g, function(txt){
//        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//    });
//}

/*
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
*/

function toColors(objArray) {
    var colors = '';
    for(var i = 0; i < objArray.length; i++)
        colors += objArray[i].value;
    return colors.split('').sort().join('');
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
            players = {options: response.data.players.map(player => mapToOption(player.name, player.rating))};
            return players;
        });
    }
};

var decks = false;
const getDecks = () => {
    if(!(!decks) !== false) {
        return Promise.resolve(decks);
    }
    else {
        return axios.get(GET_DECKS).then(response => {
            decks = {options: response.data.decks.map(deck => mapToOption(deck))};
            return decks;
        });
    }
};

//trigger so it can cache faster
getPlayers();
getDecks();



class MatchReport extends React.Component {
    constructor() {
        super();
        this.state = {
            player1: reactLocalStorage.get('player1'),
            player2: reactLocalStorage.get('player2'),
            deck1: reactLocalStorage.get('deck1'),
            deck2: reactLocalStorage.get('deck2'),
            color1: reactLocalStorage.get('color1') || [],
            color2: reactLocalStorage.get('color2') || [],
            result: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(event) {
        //change state to match form
    }
    handleSubmit(event) {
        if(this.state.result !== null &&
        this.state.player1 !== null &&
        this.state.player2 !== null) {
            var payload = {
                winner: this.state.result.value,
                player1: this.state.player1.value,
                player2: this.state.player2.value,
                deck1: this.state.deck1.value,
                deck2: this.state.deck1.value,
                colors1: toColors(this.state.color1),
                colors2: toColors(this.state.color2)
            };

            console.log('color1-state', this.state.color1[0]);
            console.log('color1', payload.colors1);
            return axios.post(POST_MATCH, payload)
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    selectPlayer(p, value) {
        if(p === 1) {
            reactLocalStorage.setObject('player1', value);
            this.setState({player1: value});
        }
        else {
            reactLocalStorage.setObject('player2', value);
            this.setState({player2: value});
        }
    }
    selectDeck(p, value) {
        if(p === 1) {
            reactLocalStorage.setObject('deck1', value);
            this.setState({deck1: value});
        }
        else {
            reactLocalStorage.setObject('deck2', value);
            this.setState({deck2: value});
        }
    }
    selectColors(p, value) {
        if(p === 1) {
            reactLocalStorage.setObject('color1', value);
            this.setState({color1: value});
        }
        else {
            reactLocalStorage.setObject('color2', value);
            this.setState({color2: value});
        }
    }
    setResult(value){
        this.setState({result:value});
    }
    componentDidMount() {
        this.setState({
                player1: reactLocalStorage.getObject('player1'),
                player2: reactLocalStorage.getObject('player2'),
                deck1: reactLocalStorage.getObject('deck1'),
                deck2: reactLocalStorage.getObject('deck2'),
                color1: reactLocalStorage.getObject('color1') || [],
                color2: reactLocalStorage.getObject('color2') || [],
                result: null
            });
    }
    render() {
        return (
            <div id='match'>
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

    constructor() {
        super();
        this.state = {
            players: []
        }
    }

    componentDidMount() {
        getPlayers().then((result) => {
            for (let i = 0; i < result.options.length; i++) {
                result.options[i] = (
                    <Table.Row>
                        <Table.Cell>{result.options[i].value}</Table.Cell>
                        <Table.Cell>{result.options[i].tag}</Table.Cell>
                    </Table.Row>);
            }

            this.setState({
                players: result.options
            });
        });
    }
    render() {
        return (
            <Table celled padded>
                <Table.Header>
                    <Table.HeaderCell>Elo Rating</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {this.state.players}
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
