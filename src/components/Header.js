import Navigation from './Navigation';
import { useState } from 'react';

function Header({ loggedIn, email, onSignOut }) {
  const [isBurgerMenuOpen, setisBurgerMenuOpen] = useState(false);

  function handleBurgerMenuOpen() {
    setisBurgerMenuOpen(!isBurgerMenuOpen);
  }

  return (
    <>
      <header className='header'>
        <nav
          className={`burger__menu${
            isBurgerMenuOpen ? ' burger__menu_opened' : ''
          }`}
        >
          <Navigation loggedIn={loggedIn} email={email} onSignOut={onSignOut} />
        </nav>
        <div className='header__container'>
          <div className='header__logo'></div>
          <nav className='header__info'>
            <Navigation
              loggedIn={loggedIn}
              email={email}
              onSignOut={onSignOut}
            />
          </nav>
          <div
            className={`burger${isBurgerMenuOpen ? ' burger_close' : ''}`}
            onClick={handleBurgerMenuOpen}
          >
            <div className='burger__line'></div>
            <div className='burger__line'></div>
            <div className='burger__line'></div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
