import React, {useState, useEffect} from "react";
import axios from "axios";
import Card from "./Card";
import "./DeckOfCards.css"

const BASE_URL = "http://deckofcardsapi.com/api/deck";

function DeckOfCards() {
    const [deck, setDeck] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);

    /* When page loads, load deck from API into state. This function only is used to store the new deck data in state ('deck').  Below in getCard(), we need deck.deck_id in order to call API that draws cards from that specific deck*/
    useEffect(() => {
        async function getDeckData() {
            // call the API that creates a new, shuffled deck
            let deckResult = await axios.get(`${BASE_URL}/new/shuffle/`);
            // add the data from the API call to 'deck' in state
            setDeck(deckResult.data);
        }
        // call the function
        getDeckData();
        // side effect function "getDeckData()" will run when page first loads and when page re-renders (when setDeck changes state - i.e. when game is over and page re-renders)
    }, [setDeck]);

   
    /* Draw a card and add card properties to "drawnCard" array in state */
    async function getCard() {
        // deconstruct deck_id from 'deck' so it can be added to the API url as the deck id 
        let { deck_id } = deck;

        try {
            // call the API to draw a card from the deck with deck_id 
            let drawResult = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

            // throw error message when deck no longer has any cards left
            if (drawResult.data.remaining === 0) {
                throw new Error("no cards remaining!");
            }

            // API call above (drawResult) returns an object containing the drawn card's data (includes code, suit, value and image of card drawn)
            const card = drawResult.data.cards[0];

            // ... spread duplicates the contents of the drawnCards array in state and makes a new array. The id, name and image of new card drawn is added to the end of the array. 
            setDrawnCards(drawnCards => [
                ...drawnCards,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
                ]);
        } catch (err) {
            alert(err);
            }
    }
    // map over the objects in the drawnCards array and for each card object, make a Card component with the card's id, name and image passed in 
    const cards = drawnCards.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
        
    return (
        <div className="DeckOfCards">
            {/* if 'deck' is not empty then create a button and when that button is clicked, call the getCard function */}
            {deck ? (<button className="DeckButton" onClick={getCard}>Draw a card!</button>)
                : null}
            {/* show each of the drawn cards in the 'cards' object */}
            <div className="Deck">{cards}</div>
        </div>
    )

    }


    export default DeckOfCards;

    
   





















    // this function only updates a url we have in state. It's a piece of state that stores a url string
//     const drawCard = card => {
//         setUrl(`https://deckofcardsapi.com/api/deck/${url.deck_id}/draw/?count=1`)
//     };

   

//     // this is called only once (after first render)
//     useEffect(() => {
//         async function newCard() {
//             // 'url' is in state
//             const newCardResult = await axios.get(url);
//             setCards(newCardResult.data.cards);  
//         }
//         newCard(); 
//         // url is a state prop as a dependency. UseEffect will only run when url changes (when button to draw a new card is clicked) and after 1st render   
//     }, [url]);

  
   
//     // async function drawCard () {
//     //     const newCardResult = await axios.get(`https://deckofcardsapi.com/api/deck/${cards}/draw/?count=52`);
//     //     console.log(newCardResult.data.cards)
//     //     setCards(newCardResult.data.cards)        
//     // };

   
    
//     return (
//         <div className ="DeckOfCards">
//             {/* map over cards array and for each object in the array, call the Card component with the drawCard function passed in */}
//             {cards.map((object) => (<Card drawCard={drawCard} /> 
//             ))}
          

//             {/* {cards ? <img src={cards} alt=""/>  : <h1>'Loading ...'</h1>}
//             <Card drawCard={drawCard} /> */}

             
//         </div>


//     )

// }

// export default DeckOfCards;


