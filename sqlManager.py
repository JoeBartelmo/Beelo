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
    match (id, player1, player2, deck1, deck2, player1_wins, player2_wins)
    '''
    db.cursor().execute("CREATE TABLE elo IF NOT EXISTS ("\ 
            "name varchar(255) PRIMARY KEY,"\
            "ranking decimal NOT NULL)")

    db.cursor().execute("CREATE TABLE deck IF NOT EXISTS ("\ 
            "id varchar(255) PRIMARY KEY,"\
            "name varchar(512) NOT NULL,"\
            "colors varchar(5) NOT NULL,"\
            "CONSTRAINT full_deck UNIQUE (name,colors))")

    db.cursor().execute("CREATE TABLE match IF NOT EXISTS ("\ 
            "id varchar(255) PRIMARY KEY,"\
            "player1 varchar(255) NOT NULL,"\
            "player2 varchar(255) NOT NULL,"\
            "deck1 varchar(255) NOT NULL,"\
            "deck2 varchar(255) NOT NULL,"\
            "player1_wins int NOT NULL,"
            "player2_wins int NOT NULL,"
            "FOREIGN KEY (player1) REFERENCES elo(player1),"\
            "FOREIGN KEY (player2) REFERENCES elo(player2),"\
            "FOREIGN KEY (deck1) REFERENCES deck(deck1),"\
            "FOREIGN KEY (deck2) REFERENCES deck(deck1)"\
            ")")

    db.commit()
    

