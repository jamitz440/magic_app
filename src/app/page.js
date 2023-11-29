"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [cards, setCards] = useState({});
  const [card, setCard] = useState({});
  const [input, setInput] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [showCard, setShowCard] = useState(false);

  async function searchCard() {
    const q = input.replace(/\s/g, "+");
    const res = await fetch(
      `https://api.scryfall.com/cards/search?q=${q}&page=1`
    );
    const data = await res.json();
    setCards(data);
  }

  async function getCard(id) {
    const res = await fetch(`https://api.scryfall.com/cards/${id}`);
    const data = await res.json();
    setCard(data);
    setShowCard(true);
  }

  return (
    <div className="App">
      {showCard ? (
        <CardView card={card} setShowCard={setShowCard} />
      ) : (
        <CardSearch
          input={input}
          setInput={setInput}
          handleSearch={searchCard}
          getCard={getCard}
          cards={cards}
          setSelectedCard={setSelectedCard}
          setShowCard={setShowCard}
        />
      )}
    </div>
  );
}

const CardView = ({ card, setShowCard }) => {
  let imgSrc = card.card_faces
    ? card.card_faces[0].image_uris?.normal
    : card.image_uris?.normal;
  const [image, setImage] = useState(imgSrc);
  const [isVisible, setIsVisible] = useState(true);

  function handleFlip(e) {
    e.preventDefault();
    if (card.card_faces) {
      // Hide the image first
      setIsVisible(false);

      // Change the image source after a short delay
      setTimeout(() => {
        const newImg =
          image === card.card_faces[0].image_uris?.normal
            ? card.card_faces[1].image_uris?.normal
            : card.card_faces[0].image_uris?.normal;
        setImage(newImg);

        // Show the image with the new source
        setIsVisible(true);
      }, 300); // the duration should match the transition duration
    }
  }

  return (
    <div>
      <button onClick={() => setShowCard(false)}> back </button>
      <div className="grid grid-cols-2 gap-9 grid-rows-1 h-1/2">
        <div>
          {/* eslint-disable-next-line  */}
          <img
            alt={card.name}
            src={image}
            className={`transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div>
          {/* {Object.keys(card).map((item) => (
            <div key={card.name}>
              {item} : {card.item}
            </div>
          ))} */}
          {card.card_faces && <button onClick={handleFlip}> flip </button>}
        </div>
      </div>
    </div>
  );
};

const CardSearch = ({
  input,
  setInput,
  handleSearch,
  getCard,
  cards,
  setShowCard,
}) => {
  function handleInput(e) {
    setInput(e.target.value);
  }
  function handleClick(id) {
    getCard(id);
  }
  return (
    <>
      <input value={input} onChange={handleInput}></input>
      <button onClick={handleSearch}>get card</button>

      <div className="grid gap-4 grid-cols-4 grid-rows-auto mx-4">
        {cards.data?.map((card) => (
          <div
            onClick={() => handleClick(card.id)}
            key={card.name}
            className="hover:scale-110 transition-all duration-300 bg-zinc-500 rounded-lg"
          >
            {/* eslint-disable-next-line  */}
            <img
              className="rounded-xl"
              alt={card.name}
              src={
                card.card_faces
                  ? card.card_faces[0].image_uris?.normal
                  : card.image_uris?.normal
              }
            />
            <div className=" w-full h-auto text-white text-center">sadf</div>
          </div>
        ))}
      </div>
    </>
  );
};
