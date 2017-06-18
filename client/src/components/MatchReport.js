import React from 'react';
import {Table, Form} from 'semantic-ui-react'
import Select from 'react-select';
import {reactLocalStorage} from 'reactjs-localstorage';
import {assert} from 'chai'

//const VALID_COLORS = 'rgbuw';

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
