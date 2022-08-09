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

export const saveTokenToLocalStorage = (key, payload) => {
  // createLocalStorage(key);
  // const localStorageData = getLocalStorage(key);
  // localStorage.setItem(key, JSON.stringify({ ...localStorageData, token: payload }));
  localStorage.setItem(key, payload);
};

export const getToken = () => {
  const data = localStorage.getItem('token');
  return data;
};
// 1-favor não apagar os comentários, talvez precise deles mais tarde

// {
//   ranking: [
//     { name: nome_da_pessoa, score: 10, picture: url_da_foto_no_gravatar }
//   ],
//   token: token_recebido_pela_API
// }
