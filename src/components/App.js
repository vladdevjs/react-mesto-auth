import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from './../contexts/CurrentUserContext';
import api from '../utils/api';
import * as auth from '../utils/auth';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import InfoToolTip from './InfoTooltip';
import AddPlacePopup from './AddPlacePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [toolTipStatus, setToolTipStatus] = useState('success');
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setloggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [formValue, setFormValue] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      Promise.all([api.getUserData(), api.getInitialCards()])
        .then(([userData, cardData]) => {
          setCurrentUser(userData);
          setCards(cardData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    tokenCheck();
  }, []);

  const changeFormValue = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value,
    });
  };

  const tokenCheck = () => {
    if (localStorage.getItem('token')) {
      const jwt = localStorage.getItem('token');
      if (jwt) {
        auth.checkToken(jwt).then((res) => {
          if (res) {
            setloggedIn(true);
            setEmail(res.data.email);
            navigate('/', { replace: true });
          }
        });
      }
    }
  };

  function onRegister(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setToolTipStatus('success');
        setInfoTooltipOpen(true);
        setFormValue({ email: '', password: '' });
        navigate('/sign-in', { replace: true });
      })
      .catch(() => {
        setToolTipStatus('error');
        setInfoTooltipOpen(true);
      });
  }

  function onLogin(email, password) {
    if (!email || !password) {
      return;
    }
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setloggedIn(true);
          localStorage.setItem('token', data.token);
          setEmail(email);
          setFormValue({ email: '', password: '' });
          navigate('/', { replace: true });
        }
      })
      .catch(() => {
        setToolTipStatus('error');
        setInfoTooltipOpen(true);
      });
  }

  function onSignOut() {
    localStorage.removeItem('token');
    setloggedIn(false);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((error) => {
        console.log(`Ошибка изменения статуса лайка: ${error}`);
      });
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((error) => {
        console.log(`Ошибка удаления карточки: ${error}`);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }
  function handleCardClick(card) {
    setSelectedCard(card);
  }
  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltipOpen(false);
    setSelectedCard(null);
  }

  function handleUpdateUser(newUserInfo) {
    api
      .changeProfileData(newUserInfo)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function handleUpdateAvatar(newAvatar) {
    api
      .changeAvatar(newAvatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddCards(newCard) {
    api
      .addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header
        // linkAnchor='Выйти'
        loggedIn={loggedIn}
        email={email}
        // route=''

        onSignOut={onSignOut}
      />
      <Routes>
        <Route
          path='/'
          element={
            <>
              <ProtectedRouteElement
                element={Main}
                loggedIn={loggedIn}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardLike={handleCardLike}
                onCardDelete={handleCardDelete}
                cards={cards}
              />
              <Footer />
            </>
          }
        />

        <Route
          path='/sign-up'
          element={
            <Register
              onRegister={onRegister}
              formValue={formValue}
              onFormChange={changeFormValue}
            />
          }
        />
        <Route
          path='/sign-in'
          element={
            <Login
              formValue={formValue}
              onLogin={onLogin}
              onFormChange={changeFormValue}
            />
          }
        />
        <Route
          path='*'
          element={
            loggedIn ? (
              <Navigate to='/' replace />
            ) : (
              <Navigate to='/sign-in' replace />
            )
          }
        />
      </Routes>
      <EditProfilePopup
        isOpen={isEditProfilePopupOpen}
        onClose={closeAllPopups}
        onUpdateUser={handleUpdateUser}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddCards}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
      />
      <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      <InfoToolTip
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        toolTipStatus={toolTipStatus}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
