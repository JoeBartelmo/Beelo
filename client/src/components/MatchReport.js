import React from 'react';
import {Table, Form} from 'semantic-ui-react'
import Select from 'react-select';
import {reactLocalStorage} from 'reactjs-localstorage';

let constants = require('../services/Constants.js').Constants;
let axios = require('axios');
//const VALID_COLORS = 'rgbuw';

function toColors(objArray) {
    let colors = '';
    for(let i = 0; i < objArray.length; i++)
        colors += objArray[i].value;
    return colors.split('').sort().join('');
}

// format select options like this
const results = [
    {label: 'Win', value: 'player1'},
    {label: 'Loss', value: 'player2'},
    {label: 'Draw', value: 'draw'}
];
const colors = [
    {label: 'Red', value: 'r'},
    {label: 'Blue', value: 'u'},
    {label: 'Green', value: 'g'},
    {label: 'Black', value: 'b'},
    {label: 'White', value: 'w'}
];

class MatchReport extends React.Component {
    constructor(args) {
        super();
        this.RestService = args.RestService;
        this.state = {
            allPlayers: [],
            player1: reactLocalStorage.getObject('player1'),
            player2: reactLocalStorage.getObject('player2'),
            deck1: reactLocalStorage.getObject('deck1'),
            deck2: reactLocalStorage.getObject('deck2'),
            colors1: reactLocalStorage.getObject('colors1') || [],
            colors2: reactLocalStorage.getObject('colors2') || [],
            result: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        if(this.state.result !== null &&
            this.state.player1 !== null &&
            this.state.player2 !== null) {
            let payload = {
                winner: this.state.result.value,
                player1: this.state.player1.value,
                player2: this.state.player2.value,
                deck1: this.state.deck1.value,
                deck2: this.state.deck1.value,
                colors1: toColors(this.state.colors1),
                colors2: toColors(this.state.colors2)
            };

            return axios.post(constants.POST_MATCH, payload)
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
    select(obj,value) {
        reactLocalStorage.setObject(obj, value);
        let newState = this.state;
        newState[obj] = value;
        this.setState(newState);
    }
    render() {
        return (
            <div id='matchReport'>
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
                                    placeholder='Select a deck'
                                    onChange={(e) => this.select('player1', e)}
                                    loadOptions={this.RestService.getPlayers} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.player2}
                                    placeholder='Select a deck'
                                    onChange={(e) => this.select('player2', e)}
                                    loadOptions={this.RestService.getPlayers} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Deck</Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck1}
                                    placeholder='Select a deck'
                                    onChange={(e) => this.select('deck1', e)}
                                    loadOptions={this.RestService.getDecks} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck2}
                                    placeholder='Select a deck'
                                    onChange={(e) => this.select('deck2', e)}
                                    loadOptions={this.RestService.getDecks} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Color[s]</Table.Cell>
                            <Table.Cell>
                                <Select
                                    multi
                                    value={this.state.colors1}
                                    placeholder='Select Deck Colors'
                                    onChange={(e) => this.select('colors1', e)}
                                    options={colors} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select
                                    multi
                                    value={this.state.colors2}
                                    placeholder='Select Deck Colors'
                                    onChange={(e) => this.select('colors2', e)}
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

export {MatchReport};
