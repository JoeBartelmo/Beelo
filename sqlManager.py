'''
This file serves as a set of generic commands that configure the SQL Database
and establish any needed data

@author - Joe Bartelmo
@author - Hank Hang Kai Sheehan
'''
import json
import time

def refreshDatabase(db, imp):
        """
        Updates all players in the database with new elo ratings
        @param imp - The elopy.Implementation from which to grab the players
        """
        print 'refreshing database'
        for player in imp.players:
                db.cursor().execute("UPDATE elo "\
                            "SET rating="+str(player.rating)+" "\
                            "WHERE name='"+player.name+"'")
        db.commit()

def refreshImplementation(db, imp):
        """
        Grabs all players from the SQL database and puts them into the provided
        implementation
        @param imp - The elopy.implementation from which to refresh the players
        """
        print 'refreshing elopy'
        cursor = db.cursor()
        imp.players = []
        cursor.execute("SELECT * FROM elo")

        for player in cursor.fetchall():
                imp.addPlayer(player[0],rating=player[1])

def createTables(db):
        '''
        Creates three tables in the database:
        elo (name, ranking)
        deck (id, name, colors)
        game (id, player1, player2, deck1, deck2, player1_wins, player2_wins)
        '''
        db.cursor().execute(("CREATE TABLE IF NOT EXISTS elo ("
                "name varchar(255),"
                "rating decimal NOT NULL,"
                "PRIMARY KEY (name))"))

        db.cursor().execute(("CREATE TABLE IF NOT EXISTS deck (" 
                "name varchar(512) NOT NULL,"
                "colors varchar(5) NOT NULL,"
                "CONSTRAINT full_deck UNIQUE (name,colors))"))

        db.cursor().execute(("CREATE TABLE IF NOT EXISTS game ("
                "player1 varchar(255) NOT NULL,"
                "player2 varchar(255) NOT NULL,"
                "deck1 varchar(255) NOT NULL,"
                "colors1 varchar(5) NOT NULL,"
                "deck2 varchar(255) NOT NULL,"
                "colors2 varchar(5) NOT NULL,"
                "winner varchar(255) NOT NULL,"
                "stamp datetime NOT NULL,"
                "FOREIGN KEY (player1) REFERENCES elo(name),"
                "FOREIGN KEY (player2) REFERENCES elo(name),"
                "FOREIGN KEY (deck1, colors1) REFERENCES deck(name, colors),"
                "FOREIGN KEY (deck2, colors2) REFERENCES deck(name, colors),"
                "CONSTRAINT check_winner CHECK "
                    "(winner=player1.name OR winner=player2.name OR "
                    "winner='draw')"
                ")"))

        db.commit()

def addPlayer(db, name, elo = 1000.0, holdCommit = False):
        '''
        Adds a given player into the elo database
        @param db: database to add players
        @param name: name of the player
        @param elo: current elo rating for the player
        @param holdCommit: forces to not commit to database if True
        '''
        if name is not None and elo is not None:
            db.cursor().execute(('INSERT IGNORE INTO elo VALUES' 
                    '(\'' + name +'\',' + str(elo) + ')'))

        if not holdCommit:
            db.commit()

def getPlayer(db, name):
        '''
        Get individual player from the database
        @param db: database to fetch player
        @param name: name of the player
        '''
        db.cursor().execute('SELECT * FROM elo WHERE name=\'' + name +'\';')
        players = []
	for player in cur.fetchall():
		players.append({"name":player[0],"rating":float(player[1])})
        if len(players) == 1:
            return players[0]
        return None

def addPlayersJson(db, jsonFile):
        '''
        Inserts all players from a json file into a datbase
        @param db: database to add players
        @param jsonFile: The json file path from which to insert players
        '''
        cursor = db.cursor()
        with open(jsonFile) as json_data:
                jsonContents = json.load(json_data)
        for player in jsonContents:
                addPlayer(db, player['name'], player['rating'], True)
        db.commit()

def addDeck(db, name, colors):
    '''
    Insert a new deck into the database if it does not already exist
    @param db: database to add the deck
    @param name: name of the deck
    '''
    if name is not None and colors is not None:
        db.cursor().execute(('INSERT IGNORE INTO deck VALUES ('
            "'" + name.lower() + "',"
            "'" + colors.lower() + "');"))
        db.commit()

def addGame(db, p1, p2, d1, d2, c1, c2, winner):
    cursor = db.cursor()
    if p1 is not None and p2 is not None and d1 is not None and d2 is not None:
        print 'executing'
        sqlString = ('INSERT INTO game VALUES ('
            "'" + p1 + "',"
            "'" + p2 + "',"
            "'" + d1.lower() + "',"
            "'" + c1.lower() + "',"
            "'" + d2.lower() + "',"
            "'" + c2.lower() + "',"
            "'" + winner + "',"
            "'" + time.strftime('%Y-%m-%d %H:%M:%S') + "');")
        print sqlString
        cursor.execute(sqlString)
        db.commit()
        print 'commit'

