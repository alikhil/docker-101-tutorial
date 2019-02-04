// @ts-check


const express = require('express')
const bodyParser = require('body-parser');
const pg = require('pg')

const app = express()
app.use(bodyParser.json());
const port = process.env.PORT || 3000 

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5454/postgres'

initEverything()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/todos', (req, res) => { 
    const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
})

app.post("/todos", (req, res) => {
    const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
})

function initEverything() {
    const client = new pg.Client(connectionString)
    client.connect();
    const query = client.query('CREATE TABLE IF NOT EXISTS items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)')
    query.on('end', () => { client.end(); })
}


app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`)
)


