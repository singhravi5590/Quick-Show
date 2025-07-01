import { User } from "@clerk/express";
import Booking from "../model/Bookings.js"
import Show from "../model/Show";


// Controller for check admin
export async function isAdmin(req, res){
    try {
        res.json({
            success : true,
            isAdmin : true
        })        
    } 
    catch (error) {
        res.json({
            success : false,
            message : error.message
        })    
    }
}

export async function getDashBoardData(req, res){
    try {

        const booking = await Booking.find({isPaid : true});
        const activeShows = await Show.find({showDateTime : {$gte : new Date()}}).populate('Movie');

        const totalUser = await User.countDocuments();

        const dashboard = {
            totalBookings : booking.length,
            totalRevenue : booking.reduce((acc, book) => acc + book.amount, 0),
            activeShows,
            totalUser
        }

        res.json({
            success : true,
            dashboard
        })
    } 
    catch (error) {
        req.json({
            success : false,
            message : error.message
        })    
    }
}


// API to get all the shows

export async function getAllTheShows(req, res){
    try {
        const shows = await Show.find({showDateTime : {$gte : new Date()}}).populate('movie').sort({showDateTime : 1});

        res.json({
            success : true,
            shows
        })
    } 
    catch (error) {
        req.json({
            success : false,
            message : error.message
        })    
    }
}

// API to get All Bookings

export async function getAllBookings(req, res){
    try {
        const bookings = await Booking.find({}).populate('user').populate({
            path : "Show",
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