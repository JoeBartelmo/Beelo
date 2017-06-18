/**
 * Created by joe on 6/11/17.
 */

/**
 * Service for managing the rest calls to the python service.
 */
module.exports.RestService = function RestService() {
    let axios = require('axios');
    let constants = require('./Constants').Constants;

    this.components = {};
    let resetComponents = () => {
        this.components = {
            cache: false,
            players: false,
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

    const getPlayers = () => {
        if (this.components.players) {
            console.log('me.components.players', JSON.stringify(me.components.players));
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
    const getDecks = () => {
        if(me.components.decks) {
            console.log('me.components.decks', JSON.stringify(me.components.decks));
            return Promise.resolve(me.components.decks);
        }
        else {
            return axios.get(constants.GET_DECKS).then(response => {
                me.components.decks = {
                    options: response.data.decks.map(deck => mapToOption(deck))
                };
                return me.components.decks;
            });
        }
    };


    return {
        resetComponents: resetComponents,
        getPlayers: getPlayers,
        getDecks: getDecks,
        cacheAll: function cacheAll() {
            if (me.components.cache) {
                console.log('All endpoints have already been cached...');
                return Promise.resolve(me.components);
            }
            return Promise.all([getPlayers(), getDecks()])
                .then(() => Promise.resolve(me.components));
        }
    }
};
