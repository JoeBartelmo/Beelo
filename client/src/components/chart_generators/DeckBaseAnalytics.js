/**
 * JSON that generates deck win and loss across all decks faced and all colors faced.
 * It takes the aggregated players data that contain all wins and losses with a given deck and displays them
 * in a pie chart
 * @param deckName name of the deck
 * @param colors locally stored color data
 * @param decks aggregated deck data
 * @returns Highchart Data
 * @constructor
 */
module.exports.DeckBaseAnalytics = function DeckBaseAnalytics(deckName, decks) {
    let utils = require('../../services/Utilities').Utilities;
    return {
        chart: {type: 'column'},
        title: {text: 'Overall Match Win Percentages by Archetype'},
        subtitle: {text: 'The given is aggregated from all wins and losses made with ' + deckName},
        xAxis: {type: 'category'},
        yAxis: {
            title: {text: 'Total Win Percentage (%)'}, min: 0, max: 100,
            plotBands: [{
                color: '#fff7f7',
                from: 0,
                to: 40
            }]
        },
        tooltip: {valueSuffix: '% Win Rate'},
        legend: {enabled: false},
        credits: false,
        series: [{
            name: 'Deck Archetype (all colors)',
            data: Object.keys(decks).map((deck) =>
                [utils.toTitleCase(deck), (decks[deck].win.toFixed(3) / decks[deck].total.toFixed(3)) * 100.000])
        }]
    };
}