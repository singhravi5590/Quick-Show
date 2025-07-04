import Booking from "../model/Bookings.js";
import { clerkClient } from "@clerk/express";
import Movie from "../model/Movie.js";


// API controller function to get user bookings
export async function getUserBookings(req, res){
    try {
        const user = req.auth().userId;
        
        const bookings = await Booking.find({user}).populate({
            path : 'show',
            populate : {path : "movie"}
        }).sort({createdAt : -1})

        res.json({
            success : true,
            bookings
        })
    } 
    catch (error) {
        res.json({
            success : false,
            error : error.message
        })
    }
}

// API Controller function to update Favourite Movie in clerk User Metadata

export async function updateFavourite(req, res){
    try {
        const {movieId} = req.body;
        const {userId} = req.auth();

        const user = await clerkClient.users.getUser(userId);

        if(!user.privateMetadata.favourites){
            user.privateMetadata.favourites = [];
        }

        if(!user.privateMetadata.favourites.includes(movieId)){
            user.privateMetadata.favourites.push(movieId);
        }
        else{
            user.privateMetadata.favourites = user.privateMetadata.favourites.filter((item) => item !== movieId)
        }

        await clerkClient.users.updateUserMetadata(userId, {privateMetadata : user.privateMetadata})
        
        res.json( {success : true, message : "Favourite Movie Updated Successfully"})
    }
     catch (error) {
        res.json({
            success : false,
            error : error.message,
        })
    }
}


// API to get all the favourites movies

export async function getFavourites(req, res){
    try {
        const user = await clerkClient.users.getUser(req.auth.userId);
        const favourites = user.privateMetadata.favourites;

        // Getting movie from database
        const movies = await Movie.find({_id : {$in: favourites}});

        res.json({
            success : true,
            movies
        })
    } 
    catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}