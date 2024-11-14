import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import moment from 'moment'
import fetch from 'node-fetch'

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.json());

const KEY = process.env.API_KEY

const port = process.env.PORT || 4000

// --- *** Trending Movies *** ---
app.get('/', (req, res) => {

    let url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${KEY}`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: 'Trending Movies'
            })
        })
        .catch((error) => {
            console.log(`Error caught home ${error}`)
        })
})


// ----*** Popular Movies *** ---
app.get('/popular', (req, res) => {

    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${KEY}&language=en-US&page=1`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: 'Popular Movies'
            })
        })
        .catch((error) => {
            console.log(`Error caught popular ${error}`)
        })
})

// ----*** Top Rated Movies *** ---
app.get('/toprated', (req, res) => {

    let url = `https://api.themoviedb.org/3/movie/top_rated?api_key=${KEY}&language=en-US&page=1`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: 'Top Rated Movies'
            })
        })
        .catch((error) => {
            console.log(`Error caught popular ${error}`)
        })
})

// ---*** Now Playing Movies ***---
app.get('/nowplaying', (req, res) => {

    let url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${KEY}&language=en-US&page=1`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: 'Now Playing Movies'
            })
        })
        .catch((error) => {
            console.log(`Error caught popular ${error}`)
        })
})



// ----*** Upcoming Movies *** ---
app.get('/upcoming', (req, res) => {

    let url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${KEY}&language=en-US&page=1`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: 'Upcoming Movies'
            })
        })
        .catch((error) => {
            console.log(`Error caught popular ${error}`)
        })
})


app.get('/search/:value', (req, res) => {

    const val = req.params.value

    let url = `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&language=en-US&query=${val}&page=1&include_adult=false`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movies) => {

            res.render('home', {
                title: 'Movies Hub',
                movies: movies.results,
                moment: moment,
                heading: `Searched movies for "${val}"`
            })

        })
        .catch((error) => {
            console.log('error found when searching' + error)
        })
})

app.get('/movie/:id', (req, res) => {
    const id = req.params.id

    let url = `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=en-US`

    fetch(url)
        .then((data) => {
            return data.json()
        })
        .then((movie) => {

            // console.log(movie.id)
            let exturl = `https://api.themoviedb.org/3/movie/${movie.id}/external_ids?api_key=${KEY}`

            fetch(exturl)
                .then((response) => {
                    return response.json()
                })
                .then((obj) => {

                    let tturl = `https://api.themoviedb.org/3/movie/${obj.imdb_id}/videos?api_key=${KEY}`

                    fetch(tturl)
                        .then((response) => {
                            return response.json()
                        })
                        .then((response) => {
                            let key = response.results[0].key

                            for (let i = 1; i < response.results.length; i++) {
                                if (response.results[i].type === 'Trailer') {
                                    key = response.results[i].key
                                    break
                                }
                            }

                            res.render('movie', {
                                title: 'Movies Hub',
                                movie: movie,
                                moment: moment,
                                key: key
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
                .catch((err) => {
                    console.log('error caught' + err)
                })
        })
        .catch((error) => {
            console.log(`Error caught ${error}`)
        })

})

app.listen(port, () => {
    console.log(KEY)
    console.log(`Server is up & running on port ${port}`)
})
