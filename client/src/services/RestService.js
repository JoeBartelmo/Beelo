'use strict';

/**
 * Service for managing the rest calls to the python service.
 */
module.exports.RestService = function RestService() {
    let axios = require('axios');
    let constants = require('./Constants').Constants;
    let utils = require('./Utilities').Utilities;

    this.components = {};
    let resetCache = () => {
        this.components = {
            cache: false,
            players: false,
            colors: false,
            decks: false
        };
    };
    let me = this;

    /**
     * Maps input value to react-option format
     *
     * @param val value to convert
     * @return object
     */
    function mapToOption(val, tag) {
        return {
            label: val,
            value: val,
            tag: tag
        }
    }

    /**
     * Responsible for performing the get request to get all players.
     * @returns Promise <List<Player>>
     */
    const getPlayers = () => {
        if (this.components.players) {
            //console.log('me.components.players', JSON.stringify(me.components.players));
            return Promise.resolve(me.components.players);
        }
        else {
            return axios.get(constants.GET_PLAYERS).then(response => {
                me.components.players = {
                    options: response.data.players.map(player => mapToOption(player.name, player.rating))
                };
                return me.components.players;
            });
        }
    };

    /**
     * Responsible for performing the get request to get all decks.
     * @returns Promise <List<Deck>>
     */
    const getDecks = () => {
        if(me.components.decks) {
            //console.log('me.components.decks', JSON.stringify(me.components.decks));
            return Promise.resolve(me.components.decks);
        }
        else {
            return axios.get(constants.GET_DECKS).then(response => {
                me.components.decks = {
                    options: response.data.decks.map(deck => mapToOption(utils.toTitleCase(deck)))
                };
                return me.components.decks;
            });
        }
    };

    return {
        /**
         * Synchronous, simply wipes cache so you can call the flask server
         * directly.
         */
        resetCache: resetCache,

        /**
         * Returns a promise containing a list of player object types
         */
        getPlayers: getPlayers,

        /**
         * Returns a promise containing a list of deck object types.
         */
        getDecks: getDecks,

        /**
         * All get methods are cached locally
         * @returns {Promise.<{}>}
         */
        cacheAll: function cacheAll() {
            if (me.components.cache) {
                console.log('All endpoints have already been cached...');
                return Promise.resolve(me.components);
            }
            return Promise.all([getPlayers(), getDecks()])
                .then(() => Promise.resolve(me.components));
        },

        /**
         * Forms a post request to the flask service that
         * @param object { player1, player2, winner, deck1, deck2, colors1, colors2 }
         * @returns {Promise.<T>}
         */
        postMatch: function postMatch(object) {
            if(object &&
                object.result !== null &&
                object.player1 !== null &&
                object.player2 !== null) {
                let payload = {
                    winner: object.result.value,
                    player1: object.player1.value,
                    player2: object.player2.value,
                    deck1: object.deck1.value.toLowerCase(),
                    deck2: object.deck2.value.toLowerCase(),
                    colors1: utils.toColors(object.colors1),
                    colors2: utils.toColors(object.colors2)
                };

                return axios.post(constants.POST_MATCH, payload)
                    .catch(function (error) {
                        console.log(error);
                    });
            }},

        /**
         * Grabs All matches if object is null, otherwise forms a query for target game set
         * @param object { player: string, deck: string, colors: array }
         * @returns {Promise.<TResult>}
         */
        getMatches: function getMatches(object) {
            if(object) {
                let url = constants.GET_MATCHES + '?';
                if(object.player) {
                    url += 'player=' + object.player + '&'
                }
                if (object.deck) {
                    url += 'deck=' + object.deck.toLowerCase() + '&colors=' + utils.toColors(object.colors)
                }
                return axios.get(url)
                    .then(response => {return response.data.games });
            }
            else {
                return axios.get(constants.GET_MATCHES)
                    .then(response => {return response.data.games });
            }
        }
    }
};
