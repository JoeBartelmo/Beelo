'''
This file serves as a set of generic commands that configure the SQL Database
and establish any needed data

@author - Joe Bartelmo
@author - Hank Hang Kai Sheehan
'''
import json

def refreshDatabase(db, imp):
        """
        Updates all players in the database with new elo ratings
        @param imp - The elopy.Implementation from which to grab the players
        """
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
        imp.players = []
        db.cursor().execute("SELECT * FROM elo")
        for player in db.cursor().fetchall():
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
                "id varchar(255),"
                "name varchar(512) NOT NULL,"
                "colors varchar(5) NOT NULL,"
                "PRIMARY KEY (id),"
                "CONSTRAINT full_deck UNIQUE (name,colors))"))

        db.cursor().execute(("CREATE TABLE IF NOT EXISTS game ("
                "id varchar(255),"
                "player1 varchar(255) NOT NULL,"
                "player2 varchar(255) NOT NULL,"
                "deck1 varchar(255) NOT NULL,"
                "deck2 varchar(255) NOT NULL,"
                "player1_wins int NOT NULL,"
                "player2_wins int NOT NULL,"
                "PRIMARY KEY (id),"
                "FOREIGN KEY (player1) REFERENCES elo(name),"
                "FOREIGN KEY (player2) REFERENCES elo(name),"
                "FOREIGN KEY (deck1) REFERENCES deck(id),"
                "FOREIGN KEY (deck2) REFERENCES deck(id)"
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
        db.cursor().execute(('INSERT IGNORE INTO elo VALUES' 
                '(\'' + name +'\',' + str(elo) + ')'))

        if not holdCommit:
            db.commit()

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

