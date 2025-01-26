import React from 'react'
import logo from '~/assets/images/logo.png'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from '@remix-run/react'
import Logout from './Logout'

const Navbar = () => {

  const [showLogout, setShowLogout] = React.useState<boolean>(false)

  const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0()

  return (
    <div>

      <div className="navbar p-6 flex justify-between items-center">
          <div className="navbar-left flex">
            <img src={logo} alt="Logo" className=" h-10 mt-2" />
            <div className='ml-2'>
              <h1 className="text-2xl font-bold">Monlam STT</h1>
              <p className="text-sm">By Monlam AI</p>
            </div>
          </div>
          <div className="navbar-right flex">
            {isAuthenticated ? <Link to="/dashboard" className="nav-link mr-6 flex items-center">Dashboard</Link> : null}
            {isAuthenticated ? <img src={user?.picture} alt="Profile" onClick={() => setShowLogout(pre => !pre)} className=" cursor-pointer h-14 w-14 rounded-full" /> : ''}
          </div>
        </div>    
      {showLogout ? <Logout /> : ''}
    </div>
  )
}

export default Navbar
