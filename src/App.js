import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Explore from './pages/Explore';
import MLPlayground from './pages/MLPlayground';
import Dashboard from './pages/Dashboard';

const client = new ApolloClient({
  uri: 'https://ccss-graph-server.onrender.com/graphql', // <-- no trailing slash
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <div className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/explore" />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/ml" element={<MLPlayground />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
