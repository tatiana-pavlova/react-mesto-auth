import logoPath from '../images/logo.svg';


function Header(props) {
  return (
    <header className="header">
      <img src={logoPath} alt="Логотип Mesto Russia" className="header__logo"/>
      {props.children}
    </header>
  );
}

export default Header;