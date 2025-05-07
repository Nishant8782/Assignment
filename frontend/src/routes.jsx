import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './routing/Layout';
import AuthLayout from './routing/AuthLayout';

import Login from './Components/Login/Login';
import Signup from './Components/Register/Register';
import Candidate from './Components/Candidate/Candidate';
import Employees from './Components/Employees/Employees';
import Attendence from './Components/Attendence/Attendence';
import Leaves from './Components/Leaves/Leaves';
import ProtectedRoute from './routing/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/hr',
    element: 
    <ProtectedRoute>
      <MainLayout />
      
    </ProtectedRoute>,
    children: [
      { path: 'candidates', element: <ProtectedRoute><Candidate /></ProtectedRoute> },
      { path: 'employee', element: <ProtectedRoute><Employees /></ProtectedRoute> },
      { path: 'attendance', element: <ProtectedRoute><Attendence /></ProtectedRoute> },
      { path: 'leaves', element: <ProtectedRoute><Leaves /></ProtectedRoute> },
      
    ],
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: '/', element: <Login /> },
      { path: 'signup', element: <Signup /> },
    ],
  },
]);

export default router;
