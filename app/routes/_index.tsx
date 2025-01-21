import logo from 'app/assets/images/logo.png';
import Dashboard from './Page/Dashboard';


export default function Index() {
  return (
    <>
      <div className="navbar p-6 flex justify-between items-center">
        <div className="navbar-left flex">
          <img src={logo} alt="Logo" className=" h-10 mt-2" />
          <div className='ml-2'>
            <h1 className="text-2xl font-bold">Monlam STT</h1>
            <p className="text-sm">By Monlam AI</p>
          </div>
        </div>
        <div className="navbar-right flex">
          <a href="/dashboard" className="nav-link mr-6 flex items-center">Dashboard</a>
          <div className=" border border-black w-14 h-14 rounded-full flex items-center"></div>
        </div>
      </div>
      <Dashboard />
    </>
  );
}
