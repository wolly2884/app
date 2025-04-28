import { useRoutes } from 'react-router-dom';
import Login from './components/Login';
import Sidebar from './components/Sidebar';

function App() {
  const routes = useRoutes([
    { path: '/login', element: <Login /> },
    { path: '/sidebar', element: <Sidebar /> },
    // Other routes
  ]);

  return routes;
}

export default App;