import React from "react";
import './Card.css';

/** Single card: just renders the card as received from deck. */
function Card({name, image}) {

    return <img className="Card"
              alt={name}
              src={image}/>;
  }


export default Card;