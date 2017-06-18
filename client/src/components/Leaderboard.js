/**
 * Created by joe on 6/11/17.
 */
import React from 'react';
import {Table} from 'semantic-ui-react'

class Leaderboard extends React.Component {

    constructor(args) {
        super();
        this.RestService = args.RestService;
        this.state = {
            players: []
        }
    }

    componentDidMount() {
        this.RestService.getPlayers().then((result) => {
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

export {Leaderboard};
