import { useAuth0 } from '@auth0/auth0-react'

const Logout = () => {

    const { logout } = useAuth0()

  return (
    <div className='absolute top-[85px] right-4 bg-black text-white border border-black rounded-lg hover:bg-white hover:text-black cursor-pointer transition-all duration-500 active:opacity-60'>
        <button className=' p-2 ' onClick={() => {
            localStorage.removeItem('email');
            logout({ logoutParams: { returnTo: window.location.origin } });
            }
        }
        >Logout</button>
    </div>
  )
}

export default Logout
