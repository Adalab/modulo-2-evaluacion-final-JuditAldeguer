'use strict';

//VARIABLES---------------------------------------------------------------------------------------
//filter
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
//favorites
const favoritesSection = document.querySelector('.js_favorites_section');
const favoritesResults = document.querySelector('.js_results_favorites');
const resetBtn = document.querySelector('.js_reset_btn');
//results
const resultsSection = document.querySelector('.js_results');
//global arrays / variables
let favorites = [];
let series = [];
let classFav;
let serieImage;

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
    .then(() => paintSeries())
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
  paintSeries();
}
//FAVORITES----------------
//handleFavorite
function handleFavorite(ev) {
  const selectedSerie = ev.currentTarget;
  console.log(selectedSerie);
  const seriesHTML = document.querySelectorAll('.series--container');
  for (const serieHtml of seriesHTML) {
    classFav;
    if (serieHtml.innerHTML === selectedSerie.innerHTML) {
      debugger;
      classFav = 'series--favorite';
      serieHtml.classList.toggle(classFav);
      // favorites.push(serieHtml);
      arrayFavUpdate(serieHtml); // función
      favoritesResults.innerHTML += serieHtml;
    } else {
      classFav = '';
    }
    paintFavorites();
  }
}
//PaintFavorites
function paintFavorites() {
  console.log(favorites);
  //favoritesResults.innerHTML += serieHtml;
}
//update Favorites array
function arrayFavUpdate(serieHtml) {
  for (let i = 0; i < series.length; i++) {
    const serie = series[i];
    if (serieHtml.classList.contains('series--favorite')) {
      favorites.push(serieHtml);
    } else {
    }
  }
}
//isFavorite
function isFavorite(serie) {
  for (const favorite of favorites) {
    if (favorite === serie) {
      classFav = 'series--favorite';
    } else {
      classFav = '';
    }
  }
  classFav = '';
}
//SERIES------------
//get image url
function getImageUrl(serie) {
  if (serie.image === null) {
    serieImage = `https://via.placeholder.com/210x295/7C7E29/ffff/?text=${serie.name}`;
  } else {
    serieImage = serie.image.medium;
  }
}
//paint series
function paintSeries() {
  let htmlText = '';
  for (const serie of series) {
    getImageUrl(serie);
    isFavorite(serie);
    htmlText += `
        <div class="series--container ${classFav}">
            <img src="${serieImage}" alt="${serie.name}" clas="img"></img>
            <h2>${serie.name}</h2>
        </div>`;
  }
  resultsSection.innerHTML = htmlText;
  favListener();
}
//for search buton Event
function handleGetSeries(ev) {
  ev.preventDefault();
  controlLocalStorage();
}
//Initial functions used on loading webpage ------------------------------------------------------
document.addEventListener('load', handleGetSeries);
document.addEventListener('load', paintFavorites);
document.addEventListener('load', favListener);

//LISTENERS---------------------------------------------------------------------------------------
searchBtn.addEventListener('click', handleGetSeries);
document
  .querySelector('.js_form')
  .addEventListener('submit', (ev) => ev.preventDefault()); //para evitar que se genere un 'submit' por defecto al dar al intro, puesto que si solo hay un input y un button dentro de un form, este se envia automáticamente al darle al intro.
function favListener() {
  const series = document.querySelectorAll('.series--container');
  for (const serie of series) {
    serie.addEventListener('click', handleFavorite);
  }
}
