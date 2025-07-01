import Booking from "../model/Bookings";


// API controller function to get user bookings
export async function getUserBookings(req, res){
    try {
        const user = req.auth().userId;
        
        const bookings = await Booking.find({user}).populate({
            path : 'show',
            populate : {path : "movie"}
        }).sort({createdAt : -1})
    } 
    catch (error) {
        res.json({
            success : false,
            error : error.message
        })
    }
}