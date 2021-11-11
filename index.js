const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/artanddesign/2019/sep/17/frieze-london-installs-first-augmented-reality-work-regents-park',
        base: '',
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/virtual-reality-nights-out-take-on-cinema-adele-at-forefront-of-new-craze',
        base: '',
    },
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/article/facebook-plans-physical-shops-to-sell-virtual-reality-cd56xnc2j',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/education/stem-awards/defence-technology/augmented-reality-in-the-military',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/2021/11/02/arts/mark-zuckerberg-meta.html',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/av/technology-41419109',
        base: 'https://www.bbc.co.uk',
    },

]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("reality")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my AR/VR News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("reality")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))