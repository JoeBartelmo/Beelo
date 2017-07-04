'use strict';

import React from 'react';
import {Leaderboard} from './components/Leaderboard';
import {MatchReport} from './components/MatchReport';
import {DeckStats} from './components/DeckStatsContainer';

let RestService = require('./services/RestService.js').RestService();

class RestLeaderboard extends React.Component {
    render() { return (<Leaderboard RestService={RestService} />); }
}

class RestMatchReport extends React.Component {
    render() { return (<MatchReport RestService={RestService} />); }
}

class RestDeckStats extends React.Component {
    render() { return (<DeckStats RestService={RestService} />); }
}

export {RestLeaderboard, RestMatchReport, RestDeckStats};
