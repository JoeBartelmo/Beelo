"""
The end points necessary for the backend of MTG elo ranking webpage.
@author - Hank Hang Kai Sheehan
@author - Joe Bartelmo
"""
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from elopy import Implementation
from operator import itemgetter
import MySQLdb
import json
import sys
import argparse
from os.path import isfile

'''
Instantiate flask, CORS, and elopy Implementation
'''
app = Flask(__name__)
CORS(app)
root_implementation = Implementation()
server_configuration = './config.json'

def refreshDatabase(imp):
        """
        Updates all players in the database with new elo ratings
        @param imp - The elopy.Implementation from which to grab the players
        """
        for player in imp.players:
                cur.execute("UPDATE elo "\
                            "SET rating="+str(player.rating)+" "\
                            "WHERE name='"+player.name+"'")
        db.commit()

def refreshImplementation(imp):
        """
        Grabs all players from the SQL database and puts them into the provided
        implementation
        @param imp - The elopy.implementation from which to refresh the players
        """
	imp.players = []
	cur.execute("SELECT * FROM elo")
	for player in cur.fetchall():
		imp.addPlayer(player[0],rating=player[1])

@app.route("/")
def index():
        """
        Simply renders the root page for the site.
        @return the rendered root html
        """
	return render_template("index.html")

@app.route("/getRatings")
def getRatings():
        """
        Obtains the generic ELO ratings for each player in the elo database.
        @return a json object listing players and their attributes
        """
	refreshImplementation(i)
        players = []
	cur.execute("SELECT * FROM elo")
	for player in cur.fetchall():
		players.append({"name":player[0],"rating":player[1]})
	players = sorted(players, key=itemgetter('rating'), reverse=True)
        return jsonify({"players":players})

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
        refreshImplementation(root_implementation)
        body = request.get_json()

        if body == None:

                winner = request.form.getlist('winner')[0]
                player1 = request.form.getlist('player1')[0]
                player2 = request.form.getlist('player2')[0]

                if winner == "draw":
                        print "draw"
                        i.recordMatch(player1,player2,draw=True)
                elif winner == "player1":
                        print 1
                        i.recordMatch(player1,player2,winner=player1)
                elif winner == "player2":
                        print 2
                        i.recordMatch(player1,player2,winner=player2)

                refreshDatabase(i)
                return jsonify({"response":"match recorded"})
        else:
                if body["draw"] == True:
                        i.recordMatch(body["player1"],body["player2"],draw=True)
                else:
                        i.recordMatch(body["player1"],body["player2"],
                                winner=body["winner"])

                refreshDatabase(i)
                return jsonify({"response":"match recorded"})

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

        args = parser.parse_args()
        # If there are no arguments and the config file exists
        if args.db is None and args.username is None \
                and args.password is None \
                and isfile(server_configuration):
                with open(server_configuration) as json_data:
                        jsonContents = json.load(json_data)
                args.username = jsonContents['username']
                args.password = jsonContents['password']
                args.db       = jsonContents['database']
        # if there are no arguments, and there is no config file
        elif args.db is None and args.username is None and \
                args.password is None: 
                print 'Invalid arguments or configuration file, run with --help'
                print 'Alternatively configure your config.json file.'
                sys.exit(1)
        db = MySQLdb.connect(host='localhost',
                             user = args.username,
                             passwd = args.password,
                             db = args.db)
        cur = db.cursor()
        # Instantiate all the tables if they don't exist
        createTables(db)
        app.run(host='0.0.0.0',port=80,debug=True,threaded=True)

