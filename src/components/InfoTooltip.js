

function InfoTooltip (props) {
  return (
    <div className="popup">
      <div className="popup__container">
        <div className="popup__info">
          {props.children}
        </div>
        <button className="popup__close"></button>
      </div>
    </div>
  )
}

export default InfoTooltip;