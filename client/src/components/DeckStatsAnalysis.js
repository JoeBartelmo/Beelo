import React from 'react';
import { Segment, Grid, Menu, Header} from 'semantic-ui-react'
import {assert} from 'chai';

let highcharts = require('highcharts');
let utils = require('../services/Utilities').Utilities;
let charts = require('./chart_generators/ChartContainer').ChartContainer;
let AggregateMatchData = require('../services/AggregateMatchData').AggregateMatchData;


/**
 * Leaderboard display, takes in the RestService as an argument and
 * throws back the semantic ui table.
 */
class DeckStatsAnalysis extends React.Component {

    /**
     * Establishes state
     * @param args: { deck : string, colors: [] }
     */
    constructor(args) {
        super();
        assert(args.RestService, 'DeckStatsAnalysis.js -> Expected arguments for constructor to contain RestService');
        this.RestService = args.RestService;
        this.state = {
            deck: args.deck || '',
            activeItem: 1,
            matches: 0,
            favors: [],
            colors: utils.toColors(args.colors || [])};
        this.deck = utils.getColorName(this.state.colors) + ' ' + utils.toTitleCase(this.state.deck);

        //highcharts
        this.deckChart = null;
        this.deckColorChart = null;
        this.playerChart = null;
    }

    /**
     * Wraps our class with getPlayers, on load we then will have this.state.players
     * be populated properly with the table objects.
     */
    componentDidMount() {
        let me = this;
        let deckObj = {deck: me.state.deck, name: me.state.deck, colors: me.state.colors };
        this.RestService.getMatches(deckObj)
            .then((matches) => {
                let data = AggregateMatchData(deckObj, matches);

                me.setState({matches:matches.length});

                // now that we have all of our data aggregated to maps: decks, players
                // we can simply assign our charts.
                switch (me.state.activeItem) {
                    case 1:
                        let deckChart = charts.DeckBaseAnalytics(deckObj, data.getDecks());
                        this.deckChart = new highcharts["Chart"]("deck-stats", deckChart);
                        break;
                    case 2:
                        let colors = utils.getColorsJson();
                        let advancedChart = charts.DeckAdvancedAnalytics(this.deck, colors, data.getDecks());
                        this.deckColorChart = new highcharts["Chart"]("advanced-stats", advancedChart);
                        break;
                    case 3:
                        let pieChart = charts.PlayerBaseAnalytics(this.deck, data.getPlayers());
                        this.playerChart = new highcharts["Chart"]("player-stats", pieChart);
                        break;
                    default:
                        console.error('Invalid choice made for active item: ' + me.state.activeItem);
                        break;
                }
            });
    }

    //Destroy chart before unmount.
    componentWillUnmount() {
        if (this.deckChart)
            this.deckChart.destroy();
        if (this.deckColorChart)
            this.deckColorChart.destroy();
        if (this.playerChart)
            this.playerChart.destroy();
    }

    handleItemClick = (id) => {
        this.setState({activeItem: id}, this.componentDidMount);
    };

    /**
     * Renders our Leaderboard component after component mounts.
     * @returns {XML}
     */
    render() {
        const { activeItem } = this.state;

        let me = this;
        let getImageColors = () => {
            let colors = utils.toColors(me.state.colors).split('');
            if (colors.length === 0) {
                return [(<img key={new Date().getMilliseconds()}  alt={'c'} style={{width:'20px',height:'20px'}}  src={require('../images/c.png')}/>)];
            }
            return colors.map((color) => (<img key={new Date().getMilliseconds()} alt={color} style={{width:'20px',height:'20px'}}  src={require('../images/' + color + '.png')}/>));
        };


        return (
            <div>
                <Header as='h3'>Deck Statistics for {this.deck} -- {getImageColors()} </Header>
                <p>
                    {this.deck} has a total of {this.state.matches} recorded matches.
                </p>
                <br/>
                <Grid>
                    <Grid.Column width={4}>
                        <Menu fluid vertical tabular>
                            <Menu.Item name='Deck Architype Statistics' active={activeItem === 1} onClick={() => {this.handleItemClick(1)}} />
                            <Menu.Item name='Advanced Architype Statistics' active={activeItem === 2} onClick={() => {this.handleItemClick(2)}} />
                            <Menu.Item name='Player Statistics' active={activeItem === 3} onClick={() => {this.handleItemClick(3)}} />
                        </Menu>
                    </Grid.Column>

                    <Grid.Column stretched width={12}>
                        <Segment>
                            {activeItem === 1 && (<div id="deck-stats"></div>)}
                            {activeItem === 2 && (<div id="advanced-stats"></div>)}
                            {activeItem === 3 && (<div id="player-stats"></div>)}
                            {activeItem === 4 && (<div id="probability-stats"></div>)}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export {DeckStatsAnalysis};
