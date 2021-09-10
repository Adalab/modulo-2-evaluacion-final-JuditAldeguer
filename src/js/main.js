'use strict';

//VARIABLES---------------------------------------------------------------------------------------
//filter
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
//favorites
const favoritesSection = document.querySelector('.js_favorites_section');
const favoritesResults = document.querySelector('.js_results_favorites');
//results
const resultsSection = document.querySelector('.js_results');
const resetBtn = document.querySelector('.js_reset_btn');
//global arrays
let favorites = [];
let series = [];

//FUNCTIONS---------------------------------------------------------------------------------------
//requests to the server API
function getFromAPI() {
  let url;
  if (input.value === '') {
    url = '//api.tvmaze.com/shows?page=1';
  } else {
    url = `//api.tvmaze.com/search/shows?q=${input.value}`;
  }
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw response;
      } else {
        return response.json();
      }
    })
    .then((all) => arrayConverter(all))
    .catch((err) => console.error(err));
}
//function conver array
function arrayConverter(all) {
  let Object;
  if (all.length > 10) {
    const newAll = all.slice(0, 11);
    series = newAll.map((serieEl) => {
      Object = { name: serieEl.name, id: serieEl.id, image: serieEl.image };
      return Object;
    });
  } else {
    series = all.map((serieEl) => {
      Object = {
        name: serieEl.show.name,
        id: serieEl.show.id,
        image: serieEl.show.image,
      };
      return Object;
    });
  }
  setInLocalStorage();
  console.log(series);
}
//set in LocalStorage
function setInLocalStorage() {
  if (input.value !== '') {
    const stringSeries = JSON.stringify(series);
    localStorage.setItem(`series${input.value}`, stringSeries);
  }
}
//LocalStorage CONTROL
function controlLocalStorage() {
  const localStorageSeries = localStorage.getItem(`series${input.value}`);
  const StoragedSeries = JSON.parse(localStorageSeries);
  if (StoragedSeries !== null) {
    series = StoragedSeries;
    console.log('Already in LocalStorage');
  } else {
    console.log('NOT in LocalStorage');
    getFromAPI();
  }
}
//for search buton Event
function handleGetSeries(ev) {
  ev.preventDefault();
  controlLocalStorage();
}

//LISTENERS---------------------------------------------------------------------------------------
controlLocalStorage();
searchBtn.addEventListener('click', handleGetSeries);
document
  .querySelector('js_form')
  .addEventListener('submit', (ev) => ev.preventDefault()); //para evitar que se genere un 'submit' por defecto al dar al intro, puesto que si solo hay un input y un button dentro de un form, este se envia automáticamente al darle al intro.
