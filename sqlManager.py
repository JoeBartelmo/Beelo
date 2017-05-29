'''
This file serves as a set of generic commands that configure the SQL Database
and establish any needed data

@author: Joe Bartelmo
'''


def createTables(db):
    '''
    Creates three tables in the database:
    elo (name, ranking)
    deck (id, name, colors)
    game (id, player1, player2, deck1, deck2, player1_wins, player2_wins)
    '''
    db.cursor().execute(("CREATE TABLE IF NOT EXISTS elo ("
            "name varchar(255),"
            "ranking decimal NOT NULL,"
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
    

