import './App.css'
import { useCache } from './context/CacheContext';
import Connect from './pages/Connect';
import Home from './pages/Home';

function App() {
  const { isConnected } = useCache();

  return (
    <div className="min-h-screen bg-gray-100">
      {isConnected ? <Home /> : <Connect />}
    </div>
  );
}

export default App
