Ferramentas utilizadas: Node.js, Express, Cheerio e Request.

O projeto está organizado da seguinte forma:

Views > index.js:

//Importa os componentes do pacote express para dentro de uma variável chamada express
const express = require("express") 

//Inicia uma instância do express dentro da variável app
const app = express()

//Jogando o arquivo covid.js que está na pasta routes para dentro da constante covid
const covid = require("../routes/covid")

//Usar porta 8080 caso não exista uma porta pré-carregada
const PORT = process.env.PORT || 8080

app.use('/covid', covid)

app.listen(PORT, function(){
    console.log("Servidor iniciado!")
})

Routes > covid.js:

const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router()

router.get('/world', function(req, res) {
    var url = 'https://www.atlasbig.com/en-us/coronavirus'

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html)
            var list = []

            $("#data-table").find("tbody tr").each(function(i) {
                var country = $(this).find("td").eq(1).text().trim()
                var casestotal = $(this).find("td").eq(2).text().trim()
                var casestoday = $(this).find("td").eq(3).text().trim()
                var casesyesterday = $(this).find("td").eq(4).text().trim()
                var casestwoago = $(this).find("td").eq(5).text().trim()
                var deathtotal = $(this).find("td").eq(6).text().trim()
                var deathtoday = $(this).find("td").eq(7).text().trim()
                var deathyesterday = $(this).find("td").eq(8).text().trim()
                var deathtwoago = $(this).find("td").eq(9).text().trim()
                var timestamp = new Date().getTime();

                list.push({
                    country,
                    casestotal,
                    casestoday,
                    casesyesterday,
                    casestwoago,
                    deathtotal,
                    deathtoday,
                    deathyesterday,
                    deathtwoago,
                    timestamp
                })
            })
        }

        fs.writeFile('../lists/world.json', JSON.stringify(list, null, 4), function(err) {
            console.log('O arquivo JSON se encontra em lists/world.json!')
        })

        res.send(list)
    })
})

router.get('/brazil', function(req, res) {
    var url = 'https://www.atlasbig.com/en-us/coronavirus-brazil'

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html)
            var list = []

            $("#data-table").find("tbody tr").each(function(i) {
                var federativeunit = $(this).find("td").eq(0).text().trim()
                var recovered = $(this).find("td").eq(9).text().trim()
                var cases = $(this).find("td").eq(10).text().trim()
                var death = $(this).find("td").eq(11).text().trim()
                var timestamp = new Date().getTime();

                list.push({
                    federativeunit,
                    recovered,
                    cases,
                    death,
                    timestamp
                })
            })
        }

        fs.writeFile('../lists/brazil.json', JSON.stringify(list, null, 4), function(err) {
            console.log('O arquivo JSON se encontra em lists/brazil.json!')
        })

        res.send(list)
    })
})

module.exports = router
