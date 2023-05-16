import React, { useRef, useEffect } from 'react';
import PopupWithForm from './PopupWithForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {
  const avatarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateAvatar({
      avatar: avatarRef.current?.value,
    });
  }

  function handleReset() {
    avatarRef.current.value = '';
  }

  return (
    <PopupWithForm
      name='avatar'
      title='Обновить аватар'
      isOpen={isOpen}
      onClose={() => {
        onClose();
        handleReset();
      }}
      onSubmit={handleSubmit}
      buttonName='Сохранить'
    >
      <fieldset className='form__fieldset'>
        <input
          type='url'
          name='avatar'
          id='avatar'
          className='form__field form__field_type_avatar'
          placeholder='Ссылка на аватар'
          ref={avatarRef}
          required
        />
        <span className='avatar-field-error form__field-error'></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
