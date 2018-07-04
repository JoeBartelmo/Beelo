
CREATE TABLE IF NOT EXISTS elo (
  name varchar(255),
  rating decimal NOT NULL,
  PRIMARY KEY (name));

CREATE TABLE IF NOT EXISTS deck ( 
  name varchar(512) NOT NULL,
  colors varchar(5) NOT NULL,
  CONSTRAINT full_deck UNIQUE (name,colors));

CREATE TABLE IF NOT EXISTS game (
  player1 varchar(255) NOT NULL,
  player2 varchar(255) NOT NULL,
  deck1 varchar(255) NOT NULL,
  colors1 varchar(5) NOT NULL,
  deck2 varchar(255) NOT NULL,
  colors2 varchar(5) NOT NULL,
  winner varchar(255) NOT NULL,
  stamp datetime NOT NULL,
  FOREIGN KEY (player1) REFERENCES elo(name),
  FOREIGN KEY (player2) REFERENCES elo(name),
  FOREIGN KEY (deck1, colors1) REFERENCES deck(name, colors),
  FOREIGN KEY (deck2, colors2) REFERENCES deck(name, colors),
  CONSTRAINT check_winner CHECK 
    (winner=player1.name OR winner=player2.name OR 
    winner='draw')
);
