# Beelo

Beelo is a simple application that connects to a mySql server to store matchups for Magic the Gathering. The user interface is done with React JS, so you'll need node installed; additionally the sql communication is done in python.


## Installation
Install the dependencies and devDependencies and start the server:
[Python 2.7](https://www.python.org/download/releases/2.7/)
[NodeJS](https://nodejs.org/en/)
```sh
git clone https://github.com/HankMD/Beelo.git
sudo apt-get install python-mysqldb python-psutil python-yaml
pip install flask
npm i -g react-native-cli
cd Beelo/client
npm i
```
For the Test environment:
```sh
npm test
```
And production:
```sh
npm start
```

Alternatively you can simply launch both the api and the server by going to the root Beelo directory and typing `./run-server.sh`

## Website Overview (screenshots)
### Leaderboard Screen (home)
![Alt text](/screenshots/leaderboard.png "Leaderboard for Beelo")
### Match Reporting
![Alt text](/screenshots/match_report.png "Match Reporting for Beelo")
### Deck Statistics (base deck stats)
![Alt text](/screenshots/deckstats.png "Deck Stats for Beelo")
### Deck Statistics (advanced deck stats)
![Alt text](/screenshots/advanced_stats.png "Deck Stats for Beelo")
### Deck Statistics (base deck stats)
![Alt text](/screenshots/player_stats.png "Deck Stats for Beelo")
