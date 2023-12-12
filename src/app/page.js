"use client";
import { Elsie_Swash_Caps } from "next/font/google";
import { useState, useEffect } from "react";
import { FaDroplet, FaFire, FaSun, FaSkull, FaTree } from "react-icons/fa6";

export default function Home() {
  const [symbology, setSymbology] = useState({});

  const fetchSymbology = async () => {
    const res = await fetch("https://api.scryfall.com/symbology");
    const data = await res.json();
    setSymbology(data.data);
  };
  useEffect(function () {
    fetchSymbology();
  }, []);
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="flex flex-col justify-center items-center">
        <Card symbology={symbology} />
      </div>
    </div>
  );
}

const Card = ({ symbology }) => {
  const [card, setCard] = useState({});

  const fetchCard = async () => {
    const res = await fetch("https://api.scryfall.com/cards/random");
    const data = await res.json();
    setCard(data);
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return (
    <>
      <div>{card.name}</div>
      {card.mana_cost && <Mana mana={card.mana_cost} symbology={symbology} />}
      <img src={card.image_uris?.normal} className="h-64"></img>
      <button
        className="bg-zinc-300 p-2 rounded-md"
        onClick={() => fetchCard()}
      >
        Fetch Card
      </button>
    </>
  );
};

const Mana = ({ mana, symbology }) => {
  const fetchSymbol = ({ ma }) => {
    console.log(ma);
    const item = symbology?.find((obj) => obj.symbol === ma);
    if (item) {
      console.log("luck", item.svg_uri, ma);
      return (
        <svg width="20" height="20">
          <image
            href={item.svg_uri}
            src="yourfallback.png"
            width="20"
            height="20"
          />
        </svg>
      );
    } else {
      console.log("no luck", symbology[0].symbol, ma);
    }
  };
  //pass mana into scryfall symbol api
  const arr = mana.match(/.{1,3}/g);
  return (
    <div className="flex gap-2 bg-zinc-800 p-2 rounded-lg m-2 w-full">
      {arr.map((ma) => fetchSymbol({ ma }))}
    </div>
  );
};

// const Home =() => {
//   const [cards, setCards] = useState({});
//   const [card, setCard] = useState({});
//   const [input, setInput] = useState("");
//   const [selectedCard, setSelectedCard] = useState("");
//   const [showCard, setShowCard] = useState(false);

//   async function searchCard() {
//     const q = input.replace(/\s/g, "+");
//     const res = await fetch(
//       `https://api.scryfall.com/cards/search?q=${q}&page=1`
//     );
//     const data = await res.json();
//     setCards(data);
//   }

//   async function getCard(id) {
//     const res = await fetch(`https://api.scryfall.com/cards/${id}`);
//     const data = await res.json();
//     setCard(data);
//     setShowCard(true);
//   }

//   return (
//     <div className="App">
//       {showCard ? (
//         <CardView card={card} setShowCard={setShowCard} />
//       ) : (
//         <CardSearch
//           input={input}
//           setInput={setInput}
//           handleSearch={searchCard}
//           getCard={getCard}
//           cards={cards}
//           setSelectedCard={setSelectedCard}
//           setShowCard={setShowCard}
//         />
//       )}
//     </div>
//   );
// }

// const ManaIcon = ({ mana }) => {
//   function handleMana(mana) {
//     if ((mana === "{") | (mana === "}")) {
//       return;
//     } else if (!isNaN(mana)) {
//       return (
//         <div className="bg-zinc-800 w-6 rounded-full text-white text-center mx-auto">
//           {mana}
//         </div>
//       );
//     } else if (mana == "U") {
//       return (
//         <div className="bg-blue-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto">
//           <FaDroplet />
//         </div>
//       );
//     } else if (mana == "R") {
//       return (
//         <div className="bg-red-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto">
//           <FaFire />
//         </div>
//       );
//     } else if (mana == "W") {
//       return (
//         <div className="bg-amber-300 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto">
//           <FaSun />
//         </div>
//       );
//     } else if (mana == "B") {
//       return (
//         <div className="bg-zinc-400 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto">
//           <FaSkull />
//         </div>
//       );
//     } else if (mana == "G") {
//       return (
//         <div className="bg-emerald-400 w-6 rounded-full flex items-center justify-center h-6 text-sm mx-auto">
//           <FaTree />
//         </div>
//       );
//     }
//   }

//   return handleMana(mana);
// };

// const CardView = ({ card, setShowCard }) => {
//   let imgSrc = card.card_faces
//     ? card.card_faces[0].image_uris?.normal
//     : card.image_uris?.normal;
//   const [image, setImage] = useState(imgSrc);
//   const [isVisible, setIsVisible] = useState(true);
//   const [face, setFace] = useState(0);
//   const [manaLength, setManaLenth] = useState(
//     card.mana_cost
//       ? card.mana_costmatch(/.{1,3}/g).length
//       : card.card_faces[face].mana_cost.match(/.{1,3}/g).length
//   );

//   function handleManaChange() {
//     setManaLenth(card.card_faces[face].mana_cost.match(/.{1,3}/g).length);
//   }

//   function handleFlip(e) {
//     e.preventDefault();
//     if (card.card_faces) {
//       if (face === 0) {
//         setFace(1);
//       } else {
//         setFace(0);
//       }
//       handleManaChange();
//       // Hide the image first
//       setIsVisible(false);

//       // Change the image source after a short delay
//       setTimeout(() => {
//         const newImg =
//           image === card.card_faces[0].image_uris?.normal
//             ? card.card_faces[1].image_uris?.normal
//             : card.card_faces[0].image_uris?.normal;
//         setImage(newImg);

//         // Show the image with the new source
//         setIsVisible(true);
//       }, 300); // the duration should match the transition duration
//     }
//   }

//   return (
//     <div>
//       <button onClick={() => setShowCard(false)}> back </button>
//       <div className="grid grid-cols-2 gap-9 grid-rows-1 h-1/2 m-4">
//         <div>
//           {/* eslint-disable-next-line  */}
//           <img
//             alt={card.name}
//             src={image}
//             className={`transition-opacity duration-300 rounded-xl hover:scale-105${
//               isVisible ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         </div>
//         <div className="mx-2 bg-zinc-200 rounded-lg text-center">
//           <div className="text-md font-bold">{card.name}</div>
//           <div className="text-sm">
//             #{card.collector_number} &bull;{" "}
//             <span
//               className={`hover:text-lg transition-all duration-200 ${card.rarity}`}
//             >
//               {card.rarity[0].toUpperCase() + card.rarity.substring(1)}
//             </span>{" "}
//             &bull; {card.set_name}
//           </div>
//           <div
//             style={{
//               gridTemplateColumns: `repeat(${manaLength}, minmax(0, 1fr))`,
//             }}
//             className={`grid grid-rows-1 my-2`}
//           >
//             {card.mana_cost
//               ? card.mana_cost
//                   .split("")
//                   .map((letter) => <ManaIcon key={letter} mana={letter} />)
//               : card.card_faces[face].mana_cost
//                   .split("")
//                   .map((letter) => <ManaIcon key={letter} mana={letter} />)}
//           </div>
//           <div>{card.full_art.image_uris}</div>
//           <div>{card.type_line}</div>
//           <div>{card.color_identity}</div>
//           <div>{card.variation}</div>
//           {Object.keys(card).map((item) => (
//             <div key={card.name}>{item} :</div>
//           ))}

//           {card.card_faces && <button onClick={handleFlip}> flip </button>}
//         </div>
//       </div>
//     </div>
//   );
// };

// const CardSearch = ({
//   input,
//   setInput,
//   handleSearch,
//   getCard,
//   cards,
//   setShowCard,
// }) => {
//   function handleInput(e) {
//     setInput(e.target.value);
//   }
//   function handleClick(id) {
//     getCard(id);
//   }
//   return (
//     <>
//       <input value={input} onChange={handleInput}></input>
//       <button onClick={handleSearch}>get card</button>

//       <div className="grid gap-4 grid-cols-3 grid-rows-auto mx-4">
//         {cards.data?.map((card) => (
//           <div
//             onClick={() => handleClick(card.id)}
//             key={card.name}
//             className="hover:scale-110 transition-all duration-300 bg-zinc-500 rounded-lg"
//           >
//             {/* eslint-disable-next-line  */}
//             <img
//               className="rounded-xl"
//               alt={card.name}
//               src={
//                 card.card_faces
//                   ? card.card_faces[0].image_uris?.normal
//                   : card.image_uris?.normal
//               }
//             />
//             <div className=" w-full h-auto text-white text-center">sadf</div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };
