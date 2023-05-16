import { Link } from 'react-router-dom';

function Register({ formValue, onRegister, onFormChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formValue.email, formValue.password);
  };

  return (
    <section className='sign-form'>
      <h1 className='sign-form__title'>Регистрация</h1>
      <form
        name='registration'
        onSubmit={handleSubmit}
        className='form form_type_registration'
      >
        <fieldset className='form__fieldset'>
          <input
            type='email'
            id='email'
            name='email'
            className='form__field form__field_dark'
            placeholder='Email'
            value={formValue.email || ''}
            onChange={handleChange}
          />
          <span className='form__field-error'></span>

          <input
            type='password'
            id='password'
            name='password'
            className='form__field form__field_dark'
            placeholder='Пароль'
            value={formValue.password || ''}
            onChange={handleChange}
          />
        </fieldset>

        <button
          type='submit'
          className='button button_light'
          aria-label='Зарегистрироваться'
        >
          Зарегистрироваться
        </button>
      </form>
      <p className='sign-form__text'>
        Уже зарегистрированы?{' '}
        <Link className='sign-form__link' to='/sign-in'>
          Войти
        </Link>
      </p>
    </section>
  );
}

export default Register;
