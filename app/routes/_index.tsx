import Navbar from '~/Component/Navbar';
import hero from '~/assets/images/hero.png';
import logo from '~/assets/images/logo.png';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from '@remix-run/react';
import { createCookie } from "@remix-run/node";
import { useEffect } from 'react';


const BACKEND_URL = 'http://127.0.0.1:8000';


export default function Index() {
  const navigate = useNavigate()
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  
  const data = {
    email: user?.email || '',
    name: user?.name || ''
  }

  const image_url = "https://lh3.googleusercontent.com/a/ACg8ocJfZhwM9S8-1H1m8NBzsQTuGPO_ZsTSBoqeAUtlBK37m6Vb9uAF=s96-c";

  const register = async () => {
    try {
      const url = `${BACKEND_URL}/user/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
        }),
      });
      if (response.ok) {

        const data = await response.json();
        console.log(data);
        navigate('/dashboard');
      }
    } catch (error) {
      navigate(0);
      console.error('Error:', error);
    }
  }
  useEffect(() => {
    if (isAuthenticated) {
      register();
    }
  }, [user]);

  return (
    <>
        {/* <Auth0Provider domain="dev-vz6o17motc18g45h.us.auth0.com" clientId="RHBKvxr8sWksscmmGZMSlXDbJP2UsVNx" authorizationParams={{redirect_uri: "http://localhost:5173/"}} cacheLocation="localstorage" useRefreshTokens={true}> */}
          <Navbar />
          <div className=' flex w-full justify-center items-center'>
            <div>
              <img src={hero} alt="hero" className="w-3/4" />
            </div>
            <div className=' w-2/4'>
              <div className=' flex items-center justify-center text-4xl font-bold mt-4'>
                <img src={logo} alt="logo" className=' h-16'/>
              </div>
              <div className=' flex items-center justify-center font-semibold mt-4'>
                <h2>SIGN UP / SIGN IN IN ACCOUNT</h2>
              </div>
              <div className=' flex items-center justify-center mt-4'>
                <button className=' border border-black transition-all duration-400 bg-white text-black p-2 rounded-lg hover:text-white hover:bg-black active:opacity-60' onClick={e => loginWithRedirect()}>Google</button>
              </div>
            </div>
          </div>
        {/* </Auth0Provider> */}
    </>
  );
}
