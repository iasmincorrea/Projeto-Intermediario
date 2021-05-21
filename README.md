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

    //Definindo o prefixo /covid para a rota
    app.use('/covid', covid)

    //Inicia o servidor com a porta 8080 caso não exista uma porta pré-carregada
    app.listen(PORT, function(){
        console.log("Servidor iniciado!")
    })

Routes > covid.js:

    //Importa os componentes do pacote express para dentro de uma variável chamada express
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

Estrutura dos dados retornados:

Rota: /covid/world

URL: https://www.atlasbig.com/en-us/coronavirus

Obs: Estatísticas dos casos de corona vírus no mundo, listando todos os países com o número de casos total, de hoje, ontem e de dois dias atrás. Além de o número de mortes total, de hoje, ontem e de dois dias atrás + a data e horário do processamento da requisição.

[{
  
  "country": "United States of America",
  
  "casestotal": "32,087,980",
  
  "casestoday": "7,373",
  
  "casesyesterday": "55,925",
  
  "casestwoago": "51,509",
  
  "deathtotal": "571,865",
  
  "deathtoday": "71",
  
  "deathyesterday": "967",
  
  "deathtwoago": "655",
  
  "timestamp": 1621543837126

}]

Rota: /covid/brazil

URL: https://www.atlasbig.com/en-us/coronavirus-brazil

Obs: Estatísticas dos casos de corona vírus no Brasil, listando todos os estados com o número total de recuperados, o número de casos em uma população de 100K, número de mortes em uma população de 100K + a data e horário do processamento da requisição.

[{

  "federativeunit": "São Paulo",
  
  "recovered": "2,548,139",
  
  "cases": "6,371",
  
  "death": "209",
  
  "timestamp": 1621543840536
  
}]
