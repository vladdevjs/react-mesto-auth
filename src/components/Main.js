import { useContext } from 'react';
import { CurrentUserContext } from './../contexts/CurrentUserContext';
import Card from './Card';
import placeholder from '../images/placeholder.jpg';

function Main(props) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className='content'>
      <section className='profile'>
        <div className='profile__card'>
          <div className='profile__avatar-container'>
            <img
              className='profile__avatar'
              src={
                currentUser?.avatar
                  ? `${currentUser?.avatar}`
                  : `${placeholder}`
              }
              alt='Аватар профиля'
            />
            <button
              type='button'
              className='profile__avatar-change'
              aria-label='Изменить аватар'
              onClick={props.onEditAvatar}
            ></button>
          </div>
          <div className='profile__info'>
            <h1 className='profile__name text-fit'>{currentUser?.name}</h1>
            <button
              type='button'
              className='profile__edit'
              aria-label='Редактировать профиль'
              onClick={props.onEditProfile}
            ></button>
            <p className='profile__description text-fit'>
              {currentUser?.about}
            </p>
          </div>
        </div>
        <button
          type='button'
          className='profile__add-card'
          aria-label='Добавить карточку'
          onClick={props.onAddPlace}
        ></button>
      </section>
      <section className='cards' aria-label='Карточки различных мест'>
        <ul className='cards__list'>
          {props.cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;
