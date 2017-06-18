/**
 * Created by joe on 6/11/17.
 */
import React from 'react';
import {Table} from 'semantic-ui-react'
import {assert} from 'chai';

/**
 * Leaderboard display, takes in the RestService as an argument and
 * throws back the semantic ui table.
 */
class Leaderboard extends React.Component {

    /**
     * Establishes state
     * @param args: { RestService :
     */
    constructor(args) {
        super();
        assert(args.RestService, 'Leaderboards.js -> Expected arguments for constructor to contain RestService');
        this.RestService = args.RestService;
        this.state = {
            players: []
        }
    }

    /**
     * Wraps our class with getPlayers, on load we then will have this.state.players
     * be populated properly with the table objects.
     */
    componentDidMount() {
        this.RestService.getPlayers().then((result) => {
            result = result || {options:[]};
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

    /**
     * Renders our Leaderboard component after component mounts.
     * @returns {XML}
     */
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

export {Leaderboard};
