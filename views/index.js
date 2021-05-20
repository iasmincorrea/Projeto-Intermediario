const express = require("express")
const app = express()
const covid = require("../routes/covid")
const PORT = process.env.PORT || 8080

app.use('/covid', covid)

app.listen(PORT, function(){
    console.log("Servidor iniciado!")
})