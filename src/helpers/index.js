const createLocalStorage = (key) => {
  if (!JSON.parse(localStorage.getItem(key))) {
    localStorage.setItem(key, JSON.stringify([]));
  }
};

const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

const setLocalStorage = (key, payload) => localStorage.setItem(key, JSON
  .stringify(payload));

export const updateRanking = (payload) => {
  createLocalStorage('ranking');
  const rankingData = getLocalStorage('ranking');
  const updatedRanking = [...rankingData, payload];
  setLocalStorage('ranking', updatedRanking);
  return updatedRanking;
};

export const saveTokenToLocalStorage = (key, payload) => localStorage
  .setItem(key, payload);

export const getToken = () => {
  const data = localStorage.getItem('token');
  return data;
};

export const capitalizeFirstLetter = (string) => string
  .charAt(0).toUpperCase() + string.slice(1);
