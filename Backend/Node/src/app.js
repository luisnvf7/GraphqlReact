const express = require('express')

const { graphqlHTTP } = require("express-graphql")

const schema = require('./Schema/schema')

const app = express()

const mongoose = require('mongoose')

const cors = require('cors')

mongoose.connect('mongodb://localhost/graphqlReact')
    .then(() => console.log("conectado a la base de datos"))

app.use(cors())

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.listen(4000, () => {
    console.log("Escuchando en el puerto 4000")
})