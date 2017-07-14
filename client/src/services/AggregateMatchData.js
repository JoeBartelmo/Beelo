/**
 * This aggregates all of the match data into a usable statistical form.
 * deck and players both consist of an object that contains two integer types
 * "win" and "total" which is contained within all sub-objects as well for further analysis.
 *
 * The data is utilized by the analyticsl charts located in client/src/components/chart_generators
 *
 * @param myDeck -> {name: deckname, colors: deckColorsString}
 * @param matches -> matches returned by the RestServiceEndpoint
 * @constructor
 */
module.exports.AggregateMatchData = function AggregateMatchData(myDeck, matches) {
    let utils = require('./Utilities').Utilities;
    //let friendlyName = utils.getColorName(myDeck) + ' ' + utils.toTitleCase(myDeck.name);
    //used to determine favoured archetypes
    let decks = {}; // "architype": {colors: {win: int, total: int }, win: int, total: int }
        //used to determine successful pilots
    let players = {};// "name": {win: int, total: int}

    function getPilot(match, deck) {
        deck = deck || myDeck;
        if (match.players[0].deck.name.toLowerCase() === deck.name.toLowerCase() &&
            match.players[0].deck.colors === deck.colors) {
            return match.players[0].name;
        }
        if (match.players[1].deck.name.toLowerCase() === deck.colors.toLowerCase() &&
            match.players[1].deck.colors === deck.colors) {
            return match.players[1].name;
        }
        //console.error('The given match does not contain deck "' + friendlyName + '"');
        return null;
    }

    function _getOpponent(match, deck) {
        deck = deck || myDeck;
        if (match.players[0].name === getPilot(match, deck)) {
            return match.players[1];
        }
        return match.players[0];
    }

    function recordWin(player, opponent, isWin) {
        let name = utils.toTitleCase(opponent.deck.name);
        let colors = opponent.deck.colors;

        decks[name] = decks[name] || {win:0,total:0};
        decks[name][colors] = decks[name][colors] || {win:0,total:0};
        players[player] = players[player] || {win:0,total:0};
        players[player][name] = players[player][name] || {win:0,total:0};
        players[player][name][colors] = players[player][name][colors] || {win:0,total:0};
        players.total = players.total || 0;

        if (isWin) {
            decks[name].win += 1;
            decks[name][opponent.deck.colors].win += 1;
            players[player].win += 1;
            players[player][name].win += 1;
            players[player][name][colors].win += 1;
        }
        decks[name].total += 1;
        decks[name][opponent.deck.colors].total += 1;
        players[player].total += 1;
        players[player].total += 1;
        players[player][name].total += 1;
        players[player][name][colors].total += 1;
        players.total += 1;
    }

    matches.forEach((match) => {
        let pilot = getPilot(match);
        if (pilot !== null) {
            let opponent = _getOpponent(match, myDeck);
            recordWin(pilot, opponent, pilot === match.winner);
        }
    });

    return {
        /**
         * Aggregated deck data
         * @returns {{}}
         */
        getDecks: function getDecks() { return decks; },
        /**
         * Aggregated player data
         * @returns {{}}
         */
        getPlayers: function getPlayers() { return players; },
        /**
         * Get's the opponent with reference to the given match and
         * the deckNAme
         * @param match
         * @param deck (optional): { name: string, colors: colorsString }
         * @returns String containing opponent
         */
        getOpponent: _getOpponent
    }

};
