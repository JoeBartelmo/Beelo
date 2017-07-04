'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

import 'semantic-ui-css/semantic.min.css';
import 'react-select/dist/react-select.css';
import { RestLeaderboard, RestMatchReport, RestDeckStats} from './Wrappers';
import {Container, Menu, Header} from 'semantic-ui-react';

import {BrowserRouter as Router, Route} from 'react-router-dom'

let activeItem = window.location.pathname;
const BasicExample = () => (
    <Router>
        <div>
            <Container>
                <Menu pointing secondary>
                    <Menu.Item name='home' active={activeItem.includes('leaderboard')} href="/leaderboard"/>
                    <Menu.Item name='report match' active={activeItem.includes('report')} href="/reportMatch"/>
                    <Menu.Item name='deck statistics' active={activeItem.includes('deckStatistics')} href="/deckStatistics"/>
                </Menu>
                <Header as='h1'>Elo System</Header>
                <Route exact path="/" component={RestLeaderboard}/>
                <Route exact path="/leaderboard" component={RestLeaderboard}/>
                <Route path="/reportMatch" component={RestMatchReport}/>
                <Route path="/deckStatistics" component={RestDeckStats}/>
            </Container>
        </div>
    </Router>
);

ReactDOM.render(React.createElement(BasicExample), document.getElementById('menuroot'));
