import React, {useState, useEffect, useRef} from "react";
import axios from "axios";
import Card from "./Card";
import "./DeckOfCards.css"

const BASE_URL = "http://deckofcardsapi.com/api/deck";

function DeckOfCardsWithTimer() {
    const [deck, setDeck] = useState(null);
    const [drawnCards, setDrawnCards] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
     // useRef() makes an object which has a 'current' property. This property gives a timer id to be referenced later when setInterval of timer and when clearInterval in cleanup function. Intially set timerRef to null.
    const timerRef = useRef(null);

    /* When page loads, load deck from API into state. This function only is used to store the new deck data in state ('deck').  Below in getCard(), we need deck.deck_id in order to call the API that draws cards from that specific deck*/
    useEffect(() => {
        async function getDeckData() {
            // call the API that creates a new, shuffled deck
            let deckResult = await axios.get(`${BASE_URL}/new/shuffle/`);
            // add the data from the API call to 'deck' in state
            setDeck(deckResult.data);
        }
        // call the function
        getDeckData();
        // side effect function "getDeckData" will run when page first loads and when page re-renders (when setDeck changes state - i.e - when game is over and page re-renders)
    }, [setDeck]);

   
    /* Draw a card and add card properties to "drawnCard" array in state */
    useEffect (() => {
        async function getCard() {
        // deconstruct deck_id from 'deck' so it can be added to the API url as the deck id 
        let { deck_id } = deck;

        try {
            // call the API to draw a card from the deck with deck_id 
            let drawResult = await axios.get(`${BASE_URL}/${deck_id}/draw/`);

            // throw error message when deck no longer has any cards left and stop auto draw by setting AutoDraw to false
            if (drawResult.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("No cards left in deck!");
            }

            // API call above (drawResult) returns an object containing the drawn card's data (includes code, suit, value and image of card drawn)
            const card = drawResult.data.cards[0];

            // ... spread duplicates the contents of the drawnCard's array in state and makes a new array. The id, name and image of new card drawn is added to the end of the array. 
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
       
        // when click button to start auto draw, autoDraw is set to true and timerRef.current equals an id number. When stop auto draw, autoDraw is toggled to false and timerRef.current equals null.
        // if autoDraw is true and !timerRef.current (does not equal null) then start the timer and execute the getCard() function every second by setting timerRef.current (the timer id) equal to a 1 second interval of executing getCard(). If autodraw is false and if timer.Ref.current =null, then getCard() stops being executed.
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
            console.log(autoDraw)
            console.log(timerRef.current);
        }
        
        return () => {
            // clearInterval() is a clean up function that cancels the timer. Setting timerRef.current back to null stops setInterval() function from running.
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
        // if either or all of autoDraw, setAutoDraw or deck change state, this will cause a re-render of the useEffect function.  
    }, [autoDraw, setAutoDraw, deck]);

        // this function changes the value of autoDraw from true to false and false to true everytime button is clicked. 
        // Before first click of button to start auto draw, autoDraw is set to false. When click button to start deck being automatically drawn, autoDrawn is set to true. When click again to stop autoDraw, autodraw is set to false.
        const toggleAutoDraw = () => {
            setAutoDraw(auto => !auto);
        }
    // map over the objects in the drawnCards array and for each card object, make a Card component with the card's id, name and image passed in 
    const cards = drawnCards.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));
        
    return (
        <div className="DeckOfCards">
            {/* if 'deck' is not empty then create a button and when that button is clicked, call the toggleAutoDraw() function. The button text will toggle between "STOP DRAWING" and "START DRAWING" depending on if autoDraw is true or false */}
            {deck ? (
                <button className="DeckButton" onClick={toggleAutoDraw}>
                    {autoDraw ? "STOP" : "START"} DRAWING!
                </button>
            ) : null}
            {/* show each of the drawn cards in the 'cards' object */}
            <div className="Deck">{cards}</div>
        </div>
    );

    }


    export default DeckOfCardsWithTimer;