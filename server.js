const express = require('express');
//We import the app MODULE for the utilities with the file path.
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 3020;
//If we needed to access the req.coockie we would import this module
//const cookieParser = require('cookie-parser');
//app.use(cookieParser());

//If we wanted to work with an user session we would
/*const session = require('express-session');*/

//It seems we need the build to be connected ot the server
//we create a path for the React.js to be visible

/*
We import the path MODULE, for the utilities with the file path, 
we app.use() to mount middleware, we can access the request object
we serve the static file from the build from the ReactJs app,

	const path = require('path')

	app.use(express.static(path.join(__dirname, 'build')))

  app.get('/*', (req, res) => {
	  res.sendFile(path.join(__dirname, 'build', 'index.html'))
	})
*/

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'URLs to trust of allow');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if ('OPTIONS' == req.method) {
      res.sendStatus(200);
  } else {
    next();
  }
});


app.use(express.json())

//We install the postSQL client pg
const { Pool } = require("pg");

const connectionString = 
  `postgres://dbeaver_user:${process.env.DATABASE_PASSWORD}@dpg-cp6s87q0si5c73ajhufg-a/dbeaver`;

const pool = new Pool({
  connectionString,
});

/*
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "mrlzarate",
  port: 5432,
});
*/
let HOST = process.env.HOST

app.get("/", (req, res)=> {
  console.log( PORT )

  res.send( HOST + PORT )
})

app.get(`/metro`, (req, res)=> {
  console.log( "metro balling" )

  res.send("make it boom")
})

app.get(`/vedo`, (req, res)=> {

  pool
    .query(`SELECT * from users`)
    .then((risultato) => {
      if(risultato.rows.length){
        console.log( risultato.rows )

        res.send( risultato.rows )
      }
    })

})

app.post('/aggiungi', async (req, res) => {
  let {nomen, cognomen, pass, logged} = req.body
  let query = "INSERT INTO users (username, email, password, loggedin) VALUES ($1, $2, $3, $4)"

  try {
    const resultado = await pool.query(query, [nomen, cognomen, pass, logged])

    if (resultado) {
      res.status(202).send(resultado)
    } else {
      res.status(404).send(resultado)
    }
  } catch (error) {
    console.error(error)
    res.status(500).send("Internal Server Error")
  }
});

app.post(`/togli`, async (req, res)=>{

  let {elimina, passa} = req.body
  console.log( passa )

  let query = "DELETE from users WHERE username = $1 AND password = $2"

  try {
    const result = await pool.query(query, [elimina, passa])
 
    if(result.rowCount){
      res.status(202).send( result )
    }else{
      res.status(404).send( result )
    }
  } catch(error){
    console.log( error )
    res.status(500).send("Not more data")
  }

})


//listen() sets the localhost: endpoint 
app.listen(PORT, () => console.log(`Server is up and running ${PORT}`))