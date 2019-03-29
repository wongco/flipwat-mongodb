DROP TABLE IF EXISTS cards;

CREATE TABLE cards
(
  id serial PRIMARY KEY,
  question text NOT NULL,
  answer text NOT NULL,
  category text NOT NULL,
  createdat timestamp DEFAULT current_timestamp NOT NULL
);

-- COPY cards(question, answer, category) FROM '~/coding/flipwat-backend/rawcards.csv' DELIMITER ',' CSV HEADER;
-- \copy cards(question, answer, category) FROM '~/coding/flipwat-backend/rawcards.csv' DELIMITER ',' CSV;
\copy cards(question, answer, category) FROM '~/coding/flipwat-backend/rawcards.csv' DELIMITER ',' CSV;
