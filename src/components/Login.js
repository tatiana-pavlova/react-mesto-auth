function Login (props) {
  return (
    <div className="register">
      <h2 className="register__title">Вход</h2>
      <form className="register__form">
        <div className="register__input-field">
          <input id="email-input" type="email" className="register__input" placeholder="Email" name="email" required/>
          <span className="email-input-error"></span>
        </div>
        <div className="register__input-field">
          <input id="password-input" type="password" className="register__input" placeholder="Пароль" name="password" required/>
          <span className="password-input-error"></span>
        </div>
        <button className="register__button" type="submit">Войти</button>
      </form>
    </div>
  )
}

export default Login;