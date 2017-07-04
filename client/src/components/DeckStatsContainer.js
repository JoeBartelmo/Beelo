'use strict';

import React from 'react';
import { Segment, Button, Divider } from 'semantic-ui-react'
import {assert} from 'chai';
import Select from 'react-select';
import {reactLocalStorage} from 'reactjs-localstorage';
import {DeckStatsAnalysis} from './DeckStatsAnalysis';

let consts = require('../services/Constants').Constants;
let colors = consts.COLORS;


const STATE_DECK = 'deckstats_deck',
      STATE_COLORS = 'deckstats_colors';

/**
 * Leaderboard display, takes in the RestService as an argument and
 * throws back the semantic ui table.
 */
class DeckStats extends React.Component {

    /**
     * Establishes state
     * @param args: { RestService :
     */
    constructor(args) {
        super();
        assert(args.RestService, 'DeckStatsContainer.js -> Expected arguments for constructor to contain RestService');
        this.RestService = args.RestService;
        this.state = {
            deckstats_deck: reactLocalStorage.getObject(STATE_DECK),
            deckstats_colors: reactLocalStorage.getObject(STATE_COLORS),
            deckAnalysis: true
        }
    }

    /**
     * On select for any input, we put the item into local storage for caching
     * and we assign this.state.obj -> value so the select inputs are properly
     * bound
     * @param obj
     * @param value
     */
    select(obj,value) {
        let newState = this.state;
        reactLocalStorage.setObject(obj, value);
        newState[obj] = value;
        newState.deckAnalysis = false;
        //refresh search.
        this.search(newState);
    }

    /**
     * Triggers a refresh of the DeckStatsAnalysisComponent
     * @param _state
     */
    search(_state) {
        this.setState(_state || {deckAnalysis: true}, () => {this.setState({deckAnalysis: true})});
    }

    /**
     * Renders our DeckStats component after component mounts.
     * @returns {XML}
     */
    render() {
        return (
            <div>
                Deck statistics will show you the most up-to-date matchup reports for a given deck.
                Additionally, once a deck is selected and the search has been conducted, you will
                be able to toggle through several views that allow for further analytical and
                statistical analysis.
                <Segment.Group horizontal>
                    <Segment>
                        <Select.Async
                            value={this.state.deckstats_deck}
                            placeholder='Select Deck Archetype'
                            onChange={(e) => this.select(STATE_DECK, e.label)}
                            loadOptions={this.RestService.getDecks}/>
                    </Segment>
                    <Segment>
                        <Select multi
                                value={this.state.deckstats_colors}
                                placeholder='Select Deck Colors'
                                onChange={(e) => this.select(STATE_COLORS, e)}
                                options={colors}/>
                    </Segment>
                </Segment.Group>
                <Button primary
                        onClick={() => this.search()}
                        style={{float: 'right'}}>Search</Button>
                <br/><br/>
                <Divider section/>
                {this.state.deckAnalysis ?
                    <DeckStatsAnalysis
                        RestService={this.RestService}
                        deck={this.state.deckstats_deck}
                        colors={this.state.deckstats_colors}/>
                    : <i>Click Search to Display Analysis for Chosen Deck.</i>}
            </div>
        )
    }
}

export {DeckStats};
