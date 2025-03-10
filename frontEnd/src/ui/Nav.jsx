import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png'; // !!!Ensure logo is correctly imported!!!

const Nav = () => {
  // Array of navigation links
  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/form', name: 'Form' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/signup', name: 'Signup' },
    { path: '/login', name: 'Login' },
    { path: '/logout', name: 'Logout' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Logo and Brand Name on the Left */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          5S+S
        </Link>

        {/* Navbar Links on the Right */}
        <div className="d-flex ms-auto">
          {navLinks.map(({ path, name }) => (
            <NavLink
              key={path}
              to={path}
              className="nav-link text-white ms-4"
              style={({ isActive }) => ({
                backgroundColor: isActive ? '#0056b3' : 'transparent',
                padding: '10px 15px',
                borderRadius: '5px',
              })}
            >
              {name}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
