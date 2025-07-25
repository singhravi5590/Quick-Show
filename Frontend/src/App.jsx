import React from 'react';
import Navbar from './components/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favourite from './pages/Favourite';
import Footer from './components/Footer'
import {Toaster} from 'react-hot-toast';
import Layout from './pages/admin/Layout';
import AddShows from './pages/admin/AddShows';
import DashBoard from './pages/admin/DashBoard';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import { useAppContext } from './context/AppContext';
import { SignIn } from '@clerk/clerk-react';

const App = () => {

  const isAdminRoute = useLocation().pathname.startsWith('/admin');

  const {user} = useAppContext();



  return (
    <>
      <Toaster/>
      { !isAdminRoute && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/movies' element={<Movies/>}/>
        <Route path='/movies/:id' element={<MovieDetails/>}/>
        <Route path='/movies/:id/:date' element={<SeatLayout/>}/>
        <Route path='/movie-bookings' element={<MyBookings/>}/>
        <Route path='/favourites' element={<Favourite/>}/>
        <Route path='/admin/*' element={user ? (<Layout/>) : (
          <div className='min-h-screen flex justify-center items-center'>
            <SignIn fallbackRedirectUrl={'/admin'}/>
          </div>
        )}>
          <Route index element={<DashBoard/>}/>
          <Route path='add-shows' element={<AddShows/>}/>
          <Route path='list-shows' element={<ListShows/>}/>
          <Route path='list-bookings' element={<ListBookings/>}/>
        </Route>
      </Routes>
      { !isAdminRoute && <Footer/>}
    </>
  )
}

export default App