import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const user = useUser();
  const {isSignedIn} = user;
  
  const {favouriteMovies} = useAppContext()
  
  const {openSignIn} = useClerk();
  const navigate = useNavigate();

  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5'>
      <Link to={'/'} className='max-md:flex-1'>
        <img src={assets.logo} alt="logo" className='w-36 h-auto' />
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-8 min-md:px-8 py-3 max-md:h-screen min-md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'} `}>
        <XIcon onClick={() => setIsOpen(!isOpen)} className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'/>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(!open)}} to={'/home'}>Home</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(!open)}} to={'/movies'}>Movies</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(!open)}} to={'/'}>Theatre</Link>
        <Link onClick={() => {scrollTo(0,0); setIsOpen(!open)}} to={'/'}>Releases</Link>
        { (favouriteMovies.length > 0) && <Link onClick={() => {scrollTo(0,0); setIsOpen(!open)}} to={'/favourites'}>Favourites</Link>}
      </div>
      <div className='flex items-center gap-8'>
        < SearchIcon className='max-md:hidden w-6 h-6 cursor-pointer' />
        {
          !isSignedIn ? (
            <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="My Bookings" labelIcon={<TicketPlus width={15}/>} onClick={() => navigate('/movie-bookings')}/>
              </UserButton.MenuItems>
            </UserButton>

          )
        }

      </div>

      <MenuIcon onClick={() => setIsOpen(!isOpen)} className='max-md:ml-2 md:hidden w-8 h-8 cursor-pointer'/>
    </div>
  )
}

export default Navbar