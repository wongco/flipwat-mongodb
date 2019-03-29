DROP TABLE IF EXISTS cards;

CREATE TABLE cards
(
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  createdAt timestamp DEFAULT current_timestamp NOT NULL
);