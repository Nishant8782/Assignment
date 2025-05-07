import Navbar from '../Components/Navbar/Navbar';
import Sidebar from '../Components/Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <>
  <div style={{ display:"flex"}}>
  <Sidebar />
    <div style={{ width: "100vw"}}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  </div>
   
  </>
);

export default Layout;
