import { useAuth0 } from '@auth0/auth0-react'

const Logout = () => {

    const { logout } = useAuth0()

  return (
    <div className='absolute top-20 w-36 right-4 bg-black text-white border border-black p-2 rounded-lg hover:bg-white hover:text-black cursor-pointer transition-all duration-500 active:opacity-60'>
        <button onClick={() => {
            localStorage.removeItem('email');
            logout({ logoutParams: { returnTo: window.location.origin } });
            }
        }
        >Logout</button>
    </div>
  )
}

export default Logout
