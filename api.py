"""
The end points necessary for the backend of MTG elo ranking webpage.
@author - Hank Hang Kai Sheehan
@author - Joe Bartelmo
"""
from flask import Flask, redirect,jsonify, request, render_template
from flask_cors import CORS
from elopy import Implementation
from operator import itemgetter
import MySQLdb
import json
import sys
import argparse
from os.path import isfile
from sqlManager import *

'''
Instantiate flask, CORS, and elopy Implementation
'''
app = Flask(__name__)
CORS(app)
root_implementation = Implementation()
server_configuration = './config.json'
deck_list = './data/decks.json'
color_list = './data/color_translations.json'
args = None

def getKey(jsonDict, key, res = None):
    '''
    Helper method for just getting a key
    '''
    if key not in jsonDict:
        return res
    return jsonDict[key]

@app.route("/")
def index():
        """
        Simply renders the root page for the site.
        @return the rendered root html
        """
        global args
        return redirect('http://' + args.route + ":3000", code=302)

@app.route("/getPlayers")
def getPlayers():
        """
        Obtains the generic ELO ratings for each player in the elo database.
        @return a json object listing players and their attributes
        """
        #TODO:
        #ordering = request.args.get('order')
        #filterBy = request.args.get('filter')
        #sqlFilter = ''
        #if filterBy is not None:
        #    if filterBy.lower() == 'elo':
        #        
        players = []
	cur.execute("SELECT * FROM elo ORDER BY rating DESC")
	for player in cur.fetchall():
		players.append({"name":player[0],"rating":float(player[1])})
	#players = sorted(players, key=itemgetter('rating'), reverse=True)
        return jsonify({"players":players})

@app.route("/getPlayer")
def getPlayer(player = None):
        """
        Obtains the generic ELO ratings for one player in the elo database.
        @return a json object list of one player and their attributes
        """
	#refreshImplementation(db, root_implementation)
        players = []
        if player is None:
            player = request.args.get('name')
        return jsonify({"player":getPlayer(db, player)})

@app.route("/getDecks")
def getDecks():
    """
    Obtains a list of all known deck types
    """
    decks = []
    cur.execute("SELECT DISTINCT name FROM deck")
    for deck in cur.fetchall():
            decks.append(deck[0])
    with open(deck_list) as json_data:
            jsonContents = json.load(json_data)
    for deck in jsonContents:
            # this is slow for sets of decks > 10000, so we don't care
            # but TODO would be to fix this impl
            if deck.lower() not in [x.lower() for x in decks]:
                    decks.append(deck)
    return jsonify({"decks": decks})

@app.route("/getGames")
def getGamesQuery():
    """
    Obtains a list of all reported games
    """
    player = request.args.get('player')
    deck = request.args.get('deck')
    colors = request.args.get('colors')

    games = getGames(db,player, deck, colors)
    return jsonify({"games": games})

color_cache = None
@app.route("/getColors")
def getColors():
    """
    Obtains a list of all color types
    """
    global color_cache
    if color_cache is None:
            color_cache = {}
            with open(color_list) as json_data:
                    jsonContents = json.load(json_data)
            for color in jsonContents:
                    color_cache[color] = jsonContents[color]
            color_cache = jsonify({"colors": color_cache})

    return color_cache

#
# TODO: This currently explodes because of flask bs, look into gunicorn
#
@app.route("/recordMatch", methods=['POST'])
def reportMatch():
        """
        Updates the database with the new statistics given by the post body obj
        @POST_BODY: json constructed object that replicates like the following:
        {
            winner: draw|player1|player2,
            player1: player_name,
            player2: player_name
        }

        """

        body = request.get_json()
        refreshImplementation(db, root_implementation)

        winner = getKey(body, 'winner')
        player1 = getKey(body, 'player1')
        player2 = getKey(body, 'player2')
        deck1 = getKey(body, 'deck1')
        deck2 = getKey(body, 'deck2')
        colors1 = getKey(body, 'colors1', '')
        colors2 = getKey(body, 'colors2', '')

        if player1 is not None and player2 is not None:
            #
            # Handle elo 
            #
            if winner == "draw":
                win = 'draw'
                root_implementation.recordMatch(player1,player2,draw=True)
            elif winner == "player1":
                win = player1
                root_implementation.recordMatch(player1,player2,winner=player1)
            elif winner == "player2":
                win = player2
                root_implementation.recordMatch(player1,player2,winner=player2)
            refreshDatabase(db,root_implementation)

            #
            # Handle deck insertion
            #
            if deck1 is not None:
                addDeck(db, deck1, colors1)
            if deck2 is not None:
                addDeck(db, deck2, colors2)
            #
            # Record the win/loss for deck records
            #
            if deck1 is not None and deck2 is not None:
                addGame(db, player1, player2, 
                        deck1, deck2, colors1, colors2, win)

            print 'Match succesfully processed!'
            return jsonify({})
        print 'Player 1 or player 2 was null; cannot process match request'

if __name__ == "__main__":
        parser = argparse.ArgumentParser(description = "This file [api.py] is"\
                " an api that connects with a local mysql server for the "\
                "purposes of an ELO system for Magic the Gathering")
        
        parser.add_argument("-d", "--db", metavar = "Database",
                type = str, help="a string associated with the name for "\
                        "the MySQL local server database")
        parser.add_argument("-u", "--username", metavar = "Username",
                type = str, help="a string associated with the username for "\
                        "the MySQL local server")
        parser.add_argument("-p", "--password", metavar = "Password",
                type = str, help="a string associated with the password which"\
                        " is associated with the username for the MySQL local"\
                        " server")
        parser.add_argument("-r", "--route", metavar = "Route",
                type = str, help="a string associated with the ip address or"\
                        " domain name for the server this app is running on.")
        parser.add_argument("--players", metavar = "Route",
                type = str, help="a string associated with the path to a json"\
                        " file that is populated with players (data/blah.json)")

        global args
        args = parser.parse_args()
        # If there are no arguments and the config file exists
        if args.db is None and args.username is None \
                and args.password is None and args.route is None \
                and isfile(server_configuration):
                with open(server_configuration) as json_data:
                        jsonContents = json.load(json_data)
                args.username = jsonContents['username']
                args.password = jsonContents['password']
                args.db       = jsonContents['database']
                args.route    = jsonContents['route']
                args.players  = jsonContents['players']
        # if there are no arguments, and there is no config file
        elif args.db is None and args.username is None and \
                args.password is None and args.route is None: 
                print 'Invalid arguments or configuration file, run with --help'
                print 'Alternatively configure your config.json file.'
                sys.exit(1)
        db = MySQLdb.connect(host='localhost',
                             user = args.username,
                             passwd = args.password,
                             db = args.db)
        # Instantiate all the tables if they don't exist
        createTables(db)
        # Add players if they don't already exist
        if args.players is not None:
            addPlayersJson(db, args.players)

        cur = db.cursor()
        app.run(host='0.0.0.0',port=80,debug=True,threaded=False)

