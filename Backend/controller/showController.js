import axios from "axios";
import Movie from "../model/Movie.js";
import Show from "../model/Show.js";

// API to get now playing movies from TMDB API
export async function getNowPlayingMovies(req, res){
    try {
        const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
            headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
        })

        const movies = data.results;
        res.json({success : true, movies : movies});
    } 
    catch (error) {
        console.log(error.message);
        res.json({
            success : false,
            error : error.message,
        })
    }
}

// API to add a new show to the database
export async function addShow(req, res){
    try {
        const {movieId, showsInput, showPrice} = req.body;
        const movie = await Movie.findById(movieId);

        if(!movie){
            // fetch movie details and credit from TMDB API
            const [movieDetailsResponse, movieCreditResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                    headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
                }),
                axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
                    headers : {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
                })
            ])
            const movieApiData = movieDetailsResponse.data;
            const movieCreditsData = movieCreditResponse.data;

            const movieDetails = {
                _id : movieId,
                title : movieApiData.title,
                overview : movieApiData.overview,
                poster_path : movieApiData.poster_path,
                backdrop_path : movieApiData.backdrop_path,
                release_date : movieApiData.release_date,
                original_language : movieApiData.original_language,
                tagline : movieApiData.tagline || '',
                genres : movieApiData.genres,
                casts : movieCreditsData.cast,
                vote_average : movieApiData.vote_average,
                run_time : movieApiData.runtime
            }

            const movie = await Movie.create(movieDetails);
        }

        const showsTocreate = [];
        showsInput.forEach(show => {
            const showDate = show.date;
            show.time.forEach((time) => {
                const dateTimeString = `${showDate}T${time}`
                showsTocreate.push({
                    movie : movieId,
                    showDateTime : new Date(dateTimeString),
                    showPrice,
                    occupiedSeats : {}
                })
            })
        });

        if(showsTocreate.length > 0){
            await Show.insertMany(showsTocreate);
        }

        res.json({success : true, message : 'Show Added Successfully'})
        
    } 
    catch (error) {
        res.json({
            success : false,
            error : error.message,
        })    
    }
}


// API to get all the shows from the database

export async function getShows(req, res){
    try {
        const shows = await Show.find({showDateTime : {$gte : new Date()}}).populate('Movie').sort({showDateTime : 1})
        

        const uniqueShows = new Set(shows.map(show => show.movie));

        res.json({
            success : true,
            shows : Array.from(uniqueShows),
        })
    } 
    catch (error) {
        res.json({
            success : false,
            error : error.message
        })
    }
}

// API to get a single show from the database
export async function getShow(req, res){
    try {
        const {movieId} = req.params();
        const shows = await Show.find({movie : movieId, showDateTime : {$gte : new Date()}});

        const movie = await Movie.findById(movieId);
        const dateTime = {};

        shows.forEach((show) => {
            const date = show.showDateTime.toISOString().split("T")[0];
            if(!dateTime[date]){
                dateTime[date] = []
            }

            dateTime[date].push({ time : show.dateTime, showId : show._id})
        })
        
        res.json({
            success : true,
            movie : movie,
            dateTime : dateTime
        })
    } 
    catch (error) {
        res.json({
            success : false,
            error : error.message
        })    
    }
}