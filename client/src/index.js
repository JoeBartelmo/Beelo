import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import 'react-select/dist/react-select.css';
import {Container, Divider, Header} from 'semantic-ui-react'
//import {Router, Route} from 'react-router';
import {Leaderboard} from './components/Leaderboard';
import {MatchReport} from './components/MatchReport';

/**
 * Converts input string to title case string
 *
 * test mardu control ----> Test Mardu Control
 *
 * @param str string to convert
 * @return string
 */
//function toTitleCase(str) {
//    return str.replace(/\w\S*/g, function(txt){
//        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
//    });
//}

/*
function isValidColor(str) {
    for (let i = 0; i < str.length; i++) {
        if (!VALID_COLORS.includes(str.charAt(i))) {
            return false;
        }
    }
    return true;
}

function toFormalColor(color, objectMap) {
    if (color !== null && objectMap !== null) {
        return objectMap[color.toLower().split('').sort().join('')];
    }
    return 'Unknown';
}
*/

let RestService = require('./services/RestService.js').RestService();
ReactDOM.render(
    (<Container>
        <Header as='h1'>Elo System</Header>
        <div style={{"paddingBottom":"10px"}}>
            Below is the match reporting system, select the players, the decks they
            were playing and the colors of the decks, as well as whether the first
            player won or lost. Once Ready, click the button at the bottom to submit
            the match report.
        </div>
        <MatchReport RestService={RestService}/>
        <Divider/>
        <Leaderboard RestService={RestService}/>
    </Container>),
    document.getElementById('root')
);
