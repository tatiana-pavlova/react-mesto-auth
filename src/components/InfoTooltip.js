function InfoTooltip (props) {
  return (
    <div className={`popup ${props.isOpen? "popup_opened": ""}`}>
      <div className="popup__container">
        <div className="popup__info">
          {props.children}
        </div>
        <button className="popup__close" onClick={props.onClose}></button>
      </div>
    </div>
  )
}

export default InfoTooltip;