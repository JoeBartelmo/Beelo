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
module.exports.DeckAdvancedAnalytics = function DeckAdvancedAnalytics(deckName, colors, decks) {
    let utils = require('../../services/Utilities').Utilities;
    return {
        chart: {type: 'column'},
        title: {text: 'Overall Match Win Percentages by Archetype and Colors'},
        subtitle: {text: 'The given is aggregated from all wins and losses made with ' + deckName},
        xAxis: {categories: Object.keys(decks).map((deck) => utils.toTitleCase(deck))},
        yAxis: {
            title: {text: 'Total Win Percentage (%)'}, min: 0, max: 100,
            plotBands: [{
                color: '#fff7f7',
                from: 0,
                to: 40
            }]
        },

        tooltip: {
            headerFormat: '<span style="font-size:9px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f}% Win Rate</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        legend: {enabled: false},
        credits: false,
        series: Object.keys(colors).map((color) => {
            return {
                name: colors[color],
                data: Object.keys(decks).map((deck) => {
                    if (decks[deck][color]) {
                        return (decks[deck][color].win.toFixed(3) / decks[deck][color].total.toFixed(3)) * 100.000
                    }
                    return null;
                })
            };
        })
    };
};
