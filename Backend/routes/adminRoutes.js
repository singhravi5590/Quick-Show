import express from 'express'
import { protectAdmin } from '../middleware/auth.js';
import { getAllBookings, getAllTheShows, getDashBoardData, isAdmin } from '../controller/adminContoller.js';

const adminRouter = express.Router();


adminRouter.get('/is-admin', protectAdmin, isAdmin);
adminRouter.get('/dashboard', protectAdmin, getDashBoardData);
adminRouter.get('/all-shows', protectAdmin, getAllTheShows);
adminRouter.get('/all-bookings', protectAdmin, getAllBookings);



export default adminRouter;