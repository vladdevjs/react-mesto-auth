function Login({ formValue, onLogin, onFormChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formValue.email, formValue.password);
  };

  return (
    <>
      <section className='sign-form'>
        <h1 className='sign-form__title'>Вход</h1>
        <form
          name='registration'
          className='form form_type_login'
          onSubmit={handleSubmit}
        >
          <fieldset className='form__fieldset'>
            <input
              type='email'
              id='email'
              name='email'
              className='form__field form__field_dark'
              placeholder='Email'
              value={formValue.email}
              onChange={handleChange}
            />
            <span className='form__field-error'></span>
            <input
              type='password'
              id='password'
              name='password'
              className='form__field form__field_dark'
              placeholder='Пароль'
              value={formValue.password}
              onChange={handleChange}
            />
          </fieldset>

          <button
            type='submit'
            className='button button_light'
            aria-label='Зарегистрироваться'
          >
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default Login;
