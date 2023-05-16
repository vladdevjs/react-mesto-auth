import React, { useState } from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = useState('');
  const [link, setLink] = useState('');

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleReset() {
    setName('');
    setLink('');
  }
  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace({
      name: name,
      link: link,
    });
    handleReset();
  }
  return (
    <PopupWithForm
      name='card'
      title='Новое место'
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleReset();
      }}
      buttonName='Создать'
      onSubmit={handleSubmit}
    >
      <fieldset className='form__fieldset'>
        <input
          type='text'
          name='place'
          id='place'
          minLength='2'
          maxLength='30'
          className='form__field form__field_type_place'
          placeholder='Название'
          value={name || ''}
          onChange={handleNameChange}
          required
        />
        <span className='place-field-error form__field-error'></span>
        <input
          type='url'
          name='image'
          id='image'
          className='form__field form__field_type_image'
          placeholder='Ссылка на картинку'
          value={link || ''}
          onChange={handleLinkChange}
          required
        />
        <span className='image-field-error form__field-error'></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
