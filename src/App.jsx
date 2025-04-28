import { Routes, Route } from 'react-router-dom';
import Login from './login/Login'; // Adjust path as needed
import Sidebar from './components/Sidebar'; // Adjust path as needed

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sidebar" element={<Sidebar />} />
      {/* Other routes */}
    </Routes>
  );
}

export default App;
