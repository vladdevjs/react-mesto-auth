import React from 'react';

function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_type_${props.name} ${
        props.isOpen ? 'popup_opened' : ''
      }`}
    >
      <div className='popup__container'>
        <button
          type='button'
          className='popup__close'
          aria-label='Закрыть форму'
          onClick={props.onClose}
        ></button>
        <h3 className='popup__title'>{props.title}</h3>
        <form
          name={props.name}
          className={`form form_type_${props.name}`}
          onSubmit={props.onSubmit}
          noValidate
        >
          {props.children}
          <button type='submit' className='button'>
            {props.buttonName}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
