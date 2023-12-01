"use client";
import { useState, useEffect } from "react";
import { FaDroplet, FaFire, FaSun, FaSkull, FaTree } from "react-icons/fa6";

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


const ManaIcon = ({mana}) => {
  
  function handleMana(mana){
    if(mana === '{' | mana === '}'){
      return
    }else if(!isNaN(mana)){
      return <div className="bg-zinc-800 w-6 rounded-full text-white text-center mx-auto">{mana}</div>
    }else if(mana =='U'){
      return <div className="bg-blue-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto"><FaDroplet /></div>
    }else if(mana =='R'){
      return <div className="bg-red-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto"><FaFire /></div>
    }else if(mana =='W'){
      return <div className="bg-amber-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto"><FaSun /></div>
    }else if(mana =='B'){
      return <div className="bg-zinc-400 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto"><FaSkull /></div>
    }else if(mana =='G'){
      return <div className="bg-emerald-400 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto"><FaTree /></div>
    }
  }
  
  return(handleMana(mana))
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
  let cost = card.mana_cost.match(/.{1,3}/g)

  

  return (
    <div>
      <button onClick={() => setShowCard(false)}> back </button>
      <div className="grid grid-cols-2 gap-9 grid-rows-1 h-1/2 m-4">
        <div>
          {/* eslint-disable-next-line  */}
          <img
            alt={card.name}
            src={image}
            className={`transition-opacity duration-300 rounded-xl hover:scale-105${
              isVisible ? "opacity-100" : "opacity-0"
            }`} />
                  </div>
        <div className="mx-2 bg-zinc-200 rounded-lg text-center">
          <div className="text-md font-bold">{card.name}</div>
          <div className="text-sm">#{card.collector_number} &bull; {card.rarity[0].toUpperCase() + card.rarity.substring(1)} &bull; {card.set_name}</div>
          <div className={`grid grid-rows-1 my-2 grid-cols-${card.mana_cost.match(/.{1,3}/g).length.toString()}`}>{card.mana_cost.split('').map((letter) =>  <ManaIcon mana={letter}/>)}</div>
          <div>{card.id}</div>
          {card.mana_cost}
          {card.mana_cost.match(/.{1,3}/g).length}
          <div>{card.type_line}</div>
          <div>{card.reprint}</div>
          <div>{card.variation}</div>
          {Object.keys(card).map((item) => (
            <div key={card.name}>
              {item} : 
            </div>
          ))}

          {card.card_faces && <button onClick={handleFlip}> flip </button>}
        </div>
      </div>
    </div>
  );
};

const Blue = () => {return(<div className="bg-blue-200 text-center content-center w-6 rounded-full h-6 my-2 flex items-center justify-center text-xs"><FaDroplet /></div>)}

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

      <div className="grid gap-4 grid-cols-3 grid-rows-auto mx-4">
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
