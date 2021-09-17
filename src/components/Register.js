import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import * as auth from './auth';


function Register (props) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const history = useHistory();

  function resetForm () {
    setEmail('');
    setPassword('');
  }

  function handleEmailChange (e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange (e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    auth.register(password, email).then ((res) => {
      !res || res.status === 400 ? props.onInfoTooltipFail() : props.onInfoTooltipSuccess();
      if (res) {
        history.push('/sign-in');
      } 
    }) 
      .catch((err) => console.log(err))
      .finally (() => {
        resetForm();
      })
  }

  return (
    <div className="register">
      <h2 className="register__title">Регистрация</h2>
      <form className="register__form" onSubmit={handleSubmit}>
        <div className="register__input-field">
          <input id="email-input" type="email" className="register__input" value={email} onChange={handleEmailChange} 
                 placeholder="Email" name="email" required/>
          <span className="email-input-error"></span>
        </div>
        <div className="register__input-field">
          <input id="password-input" type="password" className="register__input" value={password} onChange={handlePasswordChange} 
                 placeholder="Пароль" name="password" required/>
          <span className="password-input-error"></span>
        </div>
        <button className="register__button" type="submit">Зарегистрироваться</button>
      </form>
      <p className="register__login-question">Уже зарегистрированы? <Link to="/sign-in" className="register__sign-in-link">Войти</Link></p>
    </div>
  )
}

export default Register;