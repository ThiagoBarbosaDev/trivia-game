// const createLocalStorage = (key) => {
//   if (!JSON.parse(localStorage.getItem(key))) {
//     localStorage.setItem(key, JSON.stringify({}));
//   }
// };

// const getLocalStorage = (key) => JSON.parse(localStorage.getItem(key));

const saveTokenToLocalStorage = (key, payload) => {
  // createLocalStorage(key);
  // const localStorageData = getLocalStorage(key);
  // localStorage.setItem(key, JSON.stringify({ ...localStorageData, token: payload }));
  localStorage.setItem(key, payload);
};

// 1-favor não apagar os comentários, talvez precise deles mais tarde
// 2-se for adicionar outros helpers, tire o export default da linha 20 e adicione um export antes de
// cada função a ser exportada.

export default saveTokenToLocalStorage;

// {
//   ranking: [
//     { name: nome_da_pessoa, score: 10, picture: url_da_foto_no_gravatar }
//   ],
//   token: token_recebido_pela_API
// }
