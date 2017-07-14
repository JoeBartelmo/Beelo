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
    '''
    Inserts a new game into the database
    @param p1: player 1
    @param p2: player 2
    @param d1: deck 1
    @param d2: deck 2
    @param c1: colors 1 (optional)
    @param c2: colors 2 (optional) -- these both default to colorless when null
    @param winner: player 1 || player 2 || draw
    '''
    cursor = db.cursor()
    if p1 is not None and p2 is not None and d1 is not None and d2 is not None and winner is not None:
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

def getGames(db, player, deck, colors):
    '''
    Searches for all matches with chosen player & || deck & || colors
    @param db: database to search
    @param player: player to search through
    @param colors: (only searches if deck is not null) colors of deck
    '''
    cursor = db.cursor()

    if player is not None or deck is not None or colors is not None:
            sqlStr1 = '(SELECT * FROM game WHERE '
            sqlStr2 = '(SELECT * FROM game WHERE '
            needsAnd = False
            if player is not None:
                    sqlStr1 += 'player1 = \'' + player + '\''
                    sqlStr2 += 'player2 = \'' + player + '\''
                    needsAnd = True
            if deck is not None:
                    if needsAnd:
                            sqlStr1 += ' AND '
                            sqlStr2 += ' AND '
                    if colors is None:
                            colors = ''
                    sqlStr1 += 'deck1 = \'' + deck + '\''
                    sqlStr2 += 'deck2 = \'' + deck + '\''
                    sqlStr1 += ' AND '
                    sqlStr2 += ' AND '
                    sqlStr1 += 'colors1 = \'' + colors + '\''
                    sqlStr2 += 'colors2 = \'' + colors + '\''

            sqlstr = sqlStr1 + ') UNION ' + sqlStr2 + ');' 
            print sqlstr
            cursor.execute(sqlstr)
    else:
            cursor.execute('SELECT * FROM game;')
    games = []
    for game in cursor.fetchall():
            games.append({'players': [
                {'name': game[0], 
                    'deck': {'name': game[2], 'colors': game[3]}}, 
                {'name': game[1], 
                    'deck': {'name': game[4], 'colors': game[5]}}], 
                'winner': game[6],
                'timestamp': game[7]})
    return games

