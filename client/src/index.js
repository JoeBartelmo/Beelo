import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import 'react-select/dist/react-select.css';
import { RestLeaderboard, RestMatchReport} from './Wrappers';
import {Container, Menu, Header} from 'semantic-ui-react';

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

import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom'


let activeItem = window.location.pathname;
const BasicExample = () => (
    <Router>
        <div>
            <Container>
                <Menu pointing secondary>
                    <Menu.Item name='home' active={activeItem.includes('leaderboard')} href="/leaderboard"/>
                    <Menu.Item name='report match' active={activeItem.includes('report')} href="/reportMatch"/>
                </Menu>
                <Header as='h1'>Elo System</Header>
                <Route exact path="/" component={RestLeaderboard}/>
                <Route exact path="/leaderboard" component={RestLeaderboard}/>
                <Route path="/reportMatch" component={RestMatchReport}/>
            </Container>
        </div>
    </Router>
);

ReactDOM.render(React.createElement(BasicExample), document.getElementById('menuroot'));
