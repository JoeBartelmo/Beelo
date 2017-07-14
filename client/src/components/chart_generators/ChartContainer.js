/**
 * This is a wrapper class to access all of the chart data
 * @type {{DeckAdvancedAnalytics, DeckBaseAnalytics, PlayerBaseAnalytics}}
 */
module.exports.ChartContainer = {
    DeckAdvancedAnalytics: require('./DeckAdvancedAnalytics').DeckAdvancedAnalytics,
    DeckBaseAnalytics: require('./DeckBaseAnalytics').DeckBaseAnalytics,
    PlayerBaseAnalytics: require('./PlayerBaseAnalytics').PlayerBaseAnalytics
};
