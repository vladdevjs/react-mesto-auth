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
import ConfirmationPopup from './ConfirmationPopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';
import Spin from './Spin';
import useEscapeKey from '../utils/useEscapeKey';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isConfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [toolTipStatus, setToolTipStatus] = useState('success');
  const [selectedCard, setSelectedCard] = useState(null);
  const [сardToDelete, setСardToDelete] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setloggedIn] = useState(null);
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
    } else {
      setloggedIn(false);
    }
  }, [navigate]);

  const changeFormValue = (name, value) => {
    setFormValue({
      ...formValue,
      [name]: value,
    });
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

  function handleTrashIconCLick(card) {
    setIsConfirmationPopupOpen(true);
    setСardToDelete(card);
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
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
    setIsImagePopupOpen(true);
    setSelectedCard(card);
  }
  function closeAllPopups() {
    setIsImagePopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsConfirmationPopupOpen(false);
    setInfoTooltipOpen(false);
  }

  function handleUpdateUser(newUserInfo) {
    setIsLoading(true);
    api
      .changeProfileData(newUserInfo)
      .then((updatedUser) => {
        setCurrentUser(updatedUser);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }
  function handleUpdateAvatar(newAvatar) {
    setIsLoading(true);
    api
      .changeAvatar(newAvatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }

  function handleAddCards(newCard) {
    setIsLoading(true);
    api
      .addCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }

  useEscapeKey(closeAllPopups);

  if (loggedIn === null) {
    return <Spin />;
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <Header loggedIn={loggedIn} email={email} onSignOut={onSignOut} />
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
                onTrashIconClick={handleTrashIconCLick}
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
        isLoading={isLoading}
      />
      <AddPlacePopup
        isOpen={isAddPlacePopupOpen}
        onClose={closeAllPopups}
        onAddPlace={handleAddCards}
        isLoading={isLoading}
      />
      <EditAvatarPopup
        isOpen={isEditAvatarPopupOpen}
        onClose={closeAllPopups}
        onUpdateAvatar={handleUpdateAvatar}
        isLoading={isLoading}
      />
      <ImagePopup
        isOpen={isImagePopupOpen}
        card={selectedCard}
        onClose={closeAllPopups}
      />
      <ConfirmationPopup
        isOpen={isConfirmationPopupOpen}
        onClose={closeAllPopups}
        onSubmit={() => handleCardDelete(сardToDelete)}
      />

      <InfoToolTip
        isOpen={isInfoTooltipOpen}
        onClose={closeAllPopups}
        toolTipStatus={toolTipStatus}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
