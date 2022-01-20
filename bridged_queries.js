const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const { static } = require('express')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('./public'))
app.use(morgan('short'))

app.post('/user_create', (req, res) => {
  console.log("Trying to create a new user...")
  console.log("How do we get the form data???")
  
  // console.log("First name: " + req.body.create_first_name)
  // console.log("Last name: " + req.body.create_last_name)
  const firstName = req.body.create_first_name
  const lastName = req.body.create_last_name

  const queryString = "insert into Users (first_name, last_name) values (?, ?)"
  getConnection().query(queryString, [firstName, lastName], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert new user: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted a new user with id: ", results.insertedId);
  })

  // res.end()
})

function getConnection() {
  return mysql.createConnection({
    host: '*OMITTED*',
    user: '*OMITTED*',
    password: '*OMITTED*',
    database: '*OMITTED*',
    port: 3306
})}

app.get('/user/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)
  
  const connection = getConnection()
  
  const userId = req.params.id
  const queryString = "select * from Users where id = ?"
  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for Users: " + err)
      res.sendStatus(500)
      return
    }

    console.log("fetched Users successfully");
    
    const users = rows.map(row => {
      return {firstName: row.first_name, lastName: row.last_name}
    })
    
    res.json(users)
  })

})

app.get("/", (req, res) => {
  console.log("Responding to root")
  res.send("Hello from root")
})

app.get("/users", (req, res) => {
  const user1 = {firstName: "Stephen", lastName: "Curry"}
  const user2 = {firstName: "Kevin", lastName: "Durant"}
  res.json([user1, user2])
})

// localhost:3002
app.listen(3002, () => {
  console.log("Server is up and listening on 3002...")
});

