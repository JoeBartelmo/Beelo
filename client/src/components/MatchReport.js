import React from 'react';
import {Table, Form} from 'semantic-ui-react'
import Select from 'react-select';
import {reactLocalStorage} from 'reactjs-localstorage';
import {assert} from 'chai'

let consts = require('../services/Constants').Constants;
let colors = consts.COLORS;
let results = consts.RESULTS;

const STATE_PLAYER1 = 'player1',
    STATE_PLAYER2 = 'player2',
    STATE_DECK1 = 'deck1',
    STATE_DECK2 = 'deck2',
    STATE_COLORS1 = 'colors1',
    STATE_COLORS2 = 'colors2';


/**
 * MatchReport is the handler that allows one to select:
 * players, deck architypes, deck colors, and who won or loss
 */
class MatchReport extends React.Component {

    /**
     * Establishes state
     * @param args: { RestService }
     */
    constructor(args) {
        super();
        assert(args.RestService, 'MatchReport.js -> Expected arguments for constructor to contain RestService');
        this.RestService = args.RestService;
        this.state = {
            allPlayers: [],
            player1: reactLocalStorage.getObject(STATE_PLAYER1),
            player2: reactLocalStorage.getObject(STATE_PLAYER2),
            deck1: reactLocalStorage.getObject(STATE_DECK1),
            deck2: reactLocalStorage.getObject(STATE_DECK2),
            colors1: reactLocalStorage.getObject(STATE_COLORS1) || [],
            colors2: reactLocalStorage.getObject(STATE_COLORS2) || [],
            result: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * Performs the post request to the rest service
     * @param state
     * @returns {*|Promise.<T>}
     */
    handleSubmit(state) {
        return this.RestService.postMatch(this.state);
    }

    /**
     * On select for any input, we put the item into local storage for caching
     * and we assign this.state.obj -> value so the select inputs are properly
     * bound
     * @param obj
     * @param value
     */
    select(obj,value) {
        reactLocalStorage.setObject(obj, value);
        let newState = this.state;
        newState[obj] = value;
        this.setState(newState);
    }

    /**
     * Renders the match report DOM and binds all states to this.state.
     * TODO: [Maybe] Should be seperated out into multiple components; to be decided
     * @returns {XML}
     */
    render() {
        return (
            <div id='matchReport'>
                 <div style={{"paddingBottom":"10px"}}>
                     Below is the match reporting system, select the players, the decks they
                     were playing and the colors of the decks, as well as whether the first
                     player won or lost. Once Ready, click the button at the bottom to submit
                     the match report.
                 </div>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Player 1</Table.HeaderCell>
                            <Table.HeaderCell>Player 2</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>Name</Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.player1}
                                    placeholder='Select Player 1'
                                    onChange={(e) => this.select(STATE_PLAYER1, e)}
                                    loadOptions={this.RestService.getPlayers} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.player2}
                                    placeholder='Select Player 2'
                                    onChange={(e) => this.select(STATE_PLAYER2, e)}
                                    loadOptions={this.RestService.getPlayers} />
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>Deck</Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck1}
                                    placeholder='Select Deck Archetype'
                                    onChange={(e) => this.select(STATE_DECK1, e)}
                                    loadOptions={this.RestService.getDecks} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select.Async
                                    value={this.state.deck2}
                                    placeholder='Select Deck Archetype'
                                    onChange={(e) => this.select(STATE_DECK2, e)}
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
                                    onChange={(e) => this.select(STATE_COLORS1, e)}
                                    options={colors} />
                            </Table.Cell>
                            <Table.Cell>
                                <Select
                                    multi
                                    value={this.state.colors2}
                                    placeholder='Select Deck Colors'
                                    onChange={(e) => this.select(STATE_COLORS2, e)}
                                    options={colors} />
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Select
                    value={this.state.result}
                    placeholder='Select Player 1 Win/Loss/Draw'
                    onChange={(e) => this.select('result', e)}
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
