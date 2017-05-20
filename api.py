"""
The end points necessary for the backend of Deadass Beebs ranking webpage.
@author - Hank Hang Kai Sheehan
"""
from flask import Flask, jsonify, request
from elopy import Implementation


app = Flask(__name__)
i = Implementation()


@app.route("/getRatings")
def getRatings():
	players = []
	for player in i.getRatingList():
		players.append({"name":player[0],"rating":player[1]})
	return jsonify({"players":players})

@app.route("/addPlayer", methods=['POST'])
def addPlayer():
	body = request.get_json()
	i.addPlayer(body["name"])
	return jsonify({"response":"player added"})

@app.route("/removePlayer", methods=['POST'])
def removePlayer():
	body = request.get_json()
	i.removePlayer(body["name"])
	return jsonify({"response":"player removed"})

@app.route("/recordMatch", methods=['POST'])
def reportMatch():
	body = request.get_json()
	if body["draw"] == True:
		i.recordMatch(body["player1"],body["player2"],draw=True)
	else:
		i.recordMatch(body["player1"],body["player2"],winner=body["winner"])
	return jsonify({"response":"match recorded"})

if __name__ == "__main__":
	app.run(debug=True)