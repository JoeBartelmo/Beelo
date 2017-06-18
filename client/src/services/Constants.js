/**
 * Created by joe on 6/11/17.
 */

let host = 'http://' + require('os').hostname();
module.exports.Constants = {
    GET_COLORS: host + '/getColors',
    GET_DECKS: host + '/getDecks',
    GET_PLAYERS: host + '/getPlayers',
    POST_MATCH: host + '/recordMatch'
};