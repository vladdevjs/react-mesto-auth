import React from 'react';
import { Link } from 'react-router-dom';

function Header({ email, route, logoutClass, linkAnchor, onSignOut }) {
  return (
    <header className='header'>
      <div className='header__logo'></div>
      <nav className='header__info'>
        <p className='header__email'>{email || ''}</p>
        <Link
          to={`${route}`}
          className={`header__link${logoutClass ? ` ${logoutClass}` : ''}`}
          onClick={linkAnchor === 'Выйти' && (() => onSignOut())}
        >
          {linkAnchor}
        </Link>
      </nav>
    </header>
  );
}

export default Header;
