import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  const linkStyle = (path) =>
    pathname === path
      ? 'text-blue-500 font-bold border-b-2 border-blue-500'
      : 'text-gray-700 hover:text-blue-500';

  return (
    <nav className="flex items-center gap-6 px-4 py-3 bg-white shadow sticky top-0 z-10">
      <Link to="/explore" className={linkStyle('/explore')}>Explore</Link>
      <Link to="/ml" className={linkStyle('/ml')}>ML Sandbox</Link>
      <Link to="/dashboard" className={linkStyle('/dashboard')}>Dashboard</Link>
    </nav>
  );
};

export default Navbar;
