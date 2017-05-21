"""
The end points necessary for the backend of Deadass Beebs ranking webpage.
@author - Hank Hang Kai Sheehan
"""
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from elopy import Implementation
from operator import itemgetter
import MySQLdb

db = MySQLdb.connect(host='localhost',
                     user='root',
                     passwd='icucicu1',
                     db='beelo')
cur = db.cursor()

app = Flask(__name__)
CORS(app)
i = Implementation()

def refreshDatabase(imp):
        for player in i.players:
                cur.execute("UPDATE elo "\
                            "SET rating="+str(player.rating)+" "\
                            "WHERE name='"+player.name+"'")
        db.commit()

def refreshImplementation(imp):
        imp.players = []
        cur.execute("SELECT * FROM elo")
        for player in cur.fetchall():
                imp.addPlayer(player[0],rating=player[1])

@app.route("/")
def index():
        return render_template("index.html")

@app.route("/getRatings")
def getRatings():
        refreshImplementation(i)
        players = []
        cur.execute("SELECT * FROM elo")
        for player in cur.fetchall():
                players.append({"name":player[0],"rating":player[1]})
        players = sorted(players, key=itemgetter('rating'), reverse=True)
        return jsonify({"players":players})

@app.route("/recordMatch", methods=['POST'])
def reportMatch():
        refreshImplementation(i)
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
                        i.recordMatch(body["player1"],body["player2"],winner=body["winner"])

                refreshDatabase(i)
                return jsonify({"response":"match recorded"})

if __name__ == "__main__":
        app.run(host='0.0.0.0',port=80,debug=True,threaded=True)
