import { Link, useLocation } from 'react-router-dom';

function Header({ loggedIn, email, onSignOut }) {
  const location = useLocation();

  return (
    <header className='header'>
      <div className='header__logo'></div>
      <nav className='header__info'>
        <p className='header__email'>{loggedIn && email}</p>
        {loggedIn && location.pathname === '/' && (
          <Link
            to='/'
            className='header__link header__link_signed-in'
            onClick={onSignOut}
          >
            Выйти
          </Link>
        )}
        {!loggedIn && location.pathname === '/sign-in' && (
          <Link to='/sign-up' className='header__link'>
            Зарегистрироваться
          </Link>
        )}
        {!loggedIn && location.pathname === '/sign-up' && (
          <Link to='/sign-in' className='header__link'>
            Войти
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
