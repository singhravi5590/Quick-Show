import Booking from "../model/Bookings.js";
import Show from "../model/Show.js";

export async function checkSeatsAvailability(showId, selectedSeats) {
    try {
        const showData = await Show.findById(showId);
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some((seat) => occupiedSeats[seat]);
        
        return !isAnySeatTaken;
    } 
    catch (error) {
        console.log(error.message);
        return false;
    }
}

export async function createBooking(req, res){
    try {
        const {userId} = req.auth;
        const {showId, selectedSeats} = req.body;

        // Check if the seat is available 
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)
        if(!isAvailable){
            return res.json({ success : false, message : "Selected Seats are not available"})
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new Booking
        const Booking = await Booking.create({
            user : userId,
            show : showId,
            amount : showData.showPrice * selectedSeats.length,
            bookedSeats : selectedSeats
        })

        selectedSeats.map((seat) => {
            showData.occupiedSeats[seat] = userId
        })

        showData.markModified("occupiedSeats");
        await showData.save();

        // Stripe Gateway Initialize
        res.json({ success : true, message : 'Booked Successfully'})
    } 
    catch (error) {
        res.json({
            success : false,
            error :error.message})
    }
}

export async function getOccupiedSeats(req, res){
    try {
        const {showId} = req.params;
        const showData = await Show.findById(showId);

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({
            success : true,
            occupiedSeats
        })

    } 
    catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}
