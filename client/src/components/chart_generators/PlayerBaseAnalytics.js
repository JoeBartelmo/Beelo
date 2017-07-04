/**
 * JSON that generates the player analytical data.
 * It takes the aggregated players data that contain all wins and losses with a given deck and displays them
 * in a pie chart
 * @param deckName name of the deck
 * @param players aggregated player data
 * @returns Highchart Data
 * @constructor
 */
module.exports.PlayerBaseAnalytics = function PlayerBaseAnalytics(deckName, players) {
    return {
        chart: {type: 'pie'},
        title: {text: 'Players Using ' + deckName},
        subtitle: {text: 'The given is aggregated from all wins and losses made with ' + deckName},
        tooltip: {valueSuffix: '%'},
        legend: {enabled: false},
        credits: false,
        plotOptions: {pie: {shadow: false, center: ['50%', '50%']}},
        series: [{
            name: 'Players',
            size: '60%',
            dataLabels: {
                formatter: function () {
                    return this.y > 5 ? this.point.name : null;
                },
                color: '#ffffff',
                distance: -30
            },
            data: Object.keys(players)
                .filter((player) => typeof(players[player]) !== 'number')
                .map((player) => {
                    players[player].percentage = (players[player].total / players.total) * 100;
                    return {
                        name: player, y: players[player].percentage
                    };
                }),
        }, {
            name: 'Matchups',
            size: '80%',
            innerSize: '60%',
            data: [].concat.apply([],
                Object.keys(players)
                    .filter((player) => typeof(players[player]) !== 'number')
                    .map((player) => {
                        return [].concat([], Object.keys(players[player])
                            .filter((player) => typeof(players[player]) !== 'number')
                            .map((deck) => {
                                return {
                                    name: deck,
                                    y: (players[player][deck].total / players.total) * 100
                                };
                            }));
                    })).filter((result) => !isNaN(result.y)),
            dataLabels: {
                formatter: function () {
                    // display only if larger than 1
                    return this.y > 1 ? '<b>' + this.point.name + ':</b>' : null;
                }
            },
            id: 'matchups'
        },
        ],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 400
                },
                chartOptions: {
                    series: [{
                        id: 'matchups',
                        dataLabels: {
                            enabled: false
                        }
                    }]
                }
            }]
        }
    };
};