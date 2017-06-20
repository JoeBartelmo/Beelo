/**
 * Created by joe on 6/18/17.
 */
import React from 'react';
import {Leaderboard} from './components/Leaderboard';
import {MatchReport} from './components/MatchReport';

let RestService = require('./services/RestService.js').RestService();

class RestLeaderboard extends React.Component {
    render() { return (<Leaderboard RestService={RestService} />); }
}

class RestMatchReport extends React.Component {
    render() { return (<MatchReport RestService={RestService} />); }
}

export {RestLeaderboard, RestMatchReport};
