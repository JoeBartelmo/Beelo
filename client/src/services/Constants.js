let host = 'http://' + require('os').hostname();
module.exports.Constants = {
    GET_COLORS: host + '/getColors',
    GET_DECKS: host + '/getDecks',
    GET_PLAYERS: host + '/getPlayers',
    POST_MATCH: host + '/recordMatch',
    GET_MATCHES: host + '/getGames',

    RESULTS: [
        {label: 'Win', value: 'player1'},
        {label: 'Loss', value: 'player2'},
        {label: 'Draw', value: 'draw'}
    ],
    COLORS: [
        {label: 'Red', value: 'r'},
        {label: 'Blue', value: 'u'},
        {label: 'Green', value: 'g'},
        {label: 'Black', value: 'b'},
        {label: 'White', value: 'w'}
    ],
    THRESHOLDS: {
        "Favored": (val) => val > 55,
        "Slightly Favored": (val) => 53 < val && val <= 57,
        "Even": (val) => 47 <= val && val <= 53,
        "Slightly Unfavored": (val) => 43 >= val && val < 47,
        "Unfavored": (val) => val < 43
    }
};