const DECKS_KEY = '_decks';

const saveDecks = function(decks) {
  localStorage.setItem(DECKS_KEY, JSON.stringify(decks));
};

export const loadDecks = function() {
  const decks = localStorage.getItem(DECKS_KEY);
  if (decks) {
    return JSON.parse(decks);
  }
  return false;
};

export const addDeck = function(name, expansions) {
  const decks = loadDecks() || [];
  decks.push({
    name,
    expansions
  });
  saveDecks(decks);
  return decks;
};

export const removeDeck = function(name) {
  const decks = loadDecks() || [];
  let pos = -1;
  decks.forEach((item, p) => {
    if (item.name === name) {
      pos = p;
    }
  });
  if (pos >= 0) {
    decks.splice(pos, 1);
    saveDecks(decks);
  }
  return decks;
};
