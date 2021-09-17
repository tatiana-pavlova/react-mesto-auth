import React from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import tickIcoPath from "../images/tick_ico.svg";
import crossIcoPath from "../images/cross_ico.svg";
import * as auth from "./auth";

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({name:'', about:'', avatar:'', _id: ''})
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = React.useState(false);
  const [isInfoTooltipFail, setIsInfoTooltipFail] = React.useState(false);
  const [userData, setUserData] = React.useState({});
  const history = useHistory();

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  }

  const handleInfoTooltipSuccess = () => {
    setIsInfoTooltipSuccess(true);
  }

  const handleInfoTooltipFail = () => {
    setIsInfoTooltipFail(true);
  }


  const handleCardClick = (card) => {
    setSelectedCard(card);
  }
  
  React.useEffect (() => {
    api.getUserInfo()
      .then ((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])


  React.useEffect(() => {
    api.getInitialCards()
      .then((resCards) => {
        setCards(resCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [])

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    
    if(jwt) {
      auth.getContent(jwt).then((res) => {
        if(res) {
          setUserData({email: res.data.email});
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch(err => console.log(err));
    }
  },[history])

  
  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardDelete(card) {
    api.deleteCard (card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
  
  function closeAllPopups () {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipSuccess(false);
    setIsInfoTooltipFail(false);
    setSelectedCard({});
  }

  function handleUpdateUser(data) {
    api.editProfileInfo(data)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(data) {
    api.editUserAvatar(data.avatar)
      .then ((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(card) {
    api.loadNewCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  
  function signOut () {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="App">
        <div className="page">
          <div className="page__content">
            <Header email={userData.email} signOut={signOut} />
            <Switch>
              <ProtectedRoute exact path="/" loggedIn={loggedIn} component={Main} onEditProfile={handleEditProfileClick} onAddPlace={handleAddPlaceClick} onEditAvatar={handleEditAvatarClick} 
                      onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
              
              <Route path='/sign-up'>
                <Register onInfoTooltipSuccess={handleInfoTooltipSuccess} onInfoTooltipFail={handleInfoTooltipFail} />
              </Route>

              <Route path='/sign-in'>
                <Login handleLogin={handleLogin} onInfoTooltipFail={handleInfoTooltipFail} />
              </Route>

              <Route >
                {loggedIn? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              </Route>
            </Switch>
            <Footer />
          </div>

          

          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
          
          <PopupWithForm name="delete-card" title="Вы уверены?" onClose={closeAllPopups} buttonTitle="Да" />
        
          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip isOpen={isInfoTooltipSuccess} onClose={closeAllPopups}>
            <img className="popup__ico" src={tickIcoPath} alt="tick" />
            <h2 className="popup__info-title">Вы успешно зарегистрировались!</h2>
          </InfoTooltip>

          <InfoTooltip isOpen={isInfoTooltipFail} onClose={closeAllPopups}>
            <img className="popup__ico" src={crossIcoPath} alt="cross" />
            <h2 className="popup__info-title">Что-то пошло не так! Попробуйте ещё раз.</h2>
          </InfoTooltip>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;