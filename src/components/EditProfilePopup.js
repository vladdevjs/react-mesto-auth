import React, { useState, useEffect, useContext } from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from './../contexts/CurrentUserContext';

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = useState(null);
  const [description, setDescription] = useState(null);
  const currentUser = useContext(CurrentUserContext);

  useEffect(() => {
    setName(currentUser?.name);
    setDescription(currentUser?.about);
  }, [currentUser, isOpen]);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm
      name='profile'
      title='Редактировать профиль'
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      buttonName='Сохранить'
    >
      <fieldset className='form__fieldset'>
        <input
          type='text'
          name='name'
          id='name'
          minLength='2'
          maxLength='40'
          className='form__field form__field_type_name'
          placeholder='Имя'
          value={name || ''}
          onChange={handleNameChange}
          required
        />
        <span className='name-field-error form__field-error'></span>
        <input
          type='text'
          name='about'
          id='description'
          minLength='2'
          maxLength='200'
          className='form__field form__field_type_job'
          placeholder='Род деятельности'
          value={description || ''}
          onChange={handleDescriptionChange}
          required
        />
        <span className='description-field-error form__field-error'></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
