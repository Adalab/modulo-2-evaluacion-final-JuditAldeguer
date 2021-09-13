'use strict';

//VARIABLES---------------------------------------------------------------------------------------
//filter
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
//favorites
const favoritesResults = document.querySelector('.js_results_favorites');
const resetBtn = document.querySelector('.js_reset_btn');
//results
const resultsSection = document.querySelector('.js_results');
//global arrays / variables
let favorites = [];
let series = [];
let classFav;
let serieImage;
let favoriteImage;

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
//function conver array from API
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
}
//set in LocalStorage
function setInLocalStorage() {
  if (input.value !== '') {
    const stringSeries = JSON.stringify(series);
    localStorage.setItem(`series${input.value}`, stringSeries);
  }
  if (favorites.length !== 0) {
    const stringFavorites = JSON.stringify(favorites);
    localStorage.setItem('fav', stringFavorites);
  }
}
//LocalStorage CONTROL
function controlLocalStorage() {
  const localStorageSeries = localStorage.getItem(`series${input.value}`);
  const StoragedSeries = JSON.parse(localStorageSeries);
  if (StoragedSeries !== null) {
    series = StoragedSeries;
    console.log('SERIES already in LocalStorage');
  } else {
    console.log('SERIES NOT in LocalStorage');
    getFromAPI();
  }
  paintSeries();
  favoritesControl();
}
//control Favorites
function favoritesControl() {
  const localStorageFavorites = localStorage.getItem('fav');
  if (localStorageFavorites !== null) {
    const StoragedFavorites = JSON.parse(localStorageFavorites);
    favorites = StoragedFavorites;
    console.log('FAVORITES already in LocalStorage');
    paintFavorites();
  } else {
    console.log('FAVORITES NOT in LocalStorage');
  }
  paintFavorites;
}
//FAVORITES----------------
//handleFavorite
function handleFavorite(ev) {
  const selectedSerie = parseInt(ev.currentTarget.id);
  const selectedSerieHTML = ev.currentTarget;
  const seriesHTML = document.querySelectorAll('.series--container');
  for (const serie of series) {
    classFav;
    if (serie.id === selectedSerie) {
      classFav = 'series--favorite';
      arrayFavUpdate(selectedSerie);
      for (const serieHtml of seriesHTML) {
        if (serieHtml.innerHTML === selectedSerieHTML.innerHTML) {
          serieHtml.classList.toggle(classFav);
        }
      }
    } else {
      classFav = '';
    }
  }
  paintFavorites();
}

//update Favorites array
function arrayFavUpdate(selectedSerie) {
  const objetClicked = series.find((serie) => {
    return serie.id === selectedSerie;
  });
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === selectedSerie;
  });
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
  } else {
    favorites.splice(favoritesFound, 1);
  }
}
//PaintFavorites
function paintFavorites() {
  let favHtml = '';
  if (favorites.length !== 0) {
    for (const favorite of favorites) {
      getImageUrlFav(favorite);
      favHtml += `
      <li class="favorites--container series--favorite" id="${favorite.id}">
          <button class="favorites--Xbutton js__Xbutton">X</button>
          <div class="favorites--container__div">
            <img src="${favoriteImage}" alt="${favorite.name}" class="favorites--img"></img>
            <h4 class="favorites--title">${favorite.name}</h4>
          </div>
      </li>`;
    }
  }
  favoritesResults.innerHTML = favHtml;
  setInLocalStorage();
  xBtnfavListener();
}
//isFavorite
function isFavorite(serie) {
  if (favorites.length !== 0) {
    const Found = favorites.findIndex((favorite) => favorite.id === serie.id);
    if (Found !== -1) {
      classFav = 'series--favorite';
    } else {
      classFav = '';
    }
  }
}
//get Fav image url
function getImageUrlFav(favorite) {
  if (favorite.image === null) {
    favoriteImage = `https://via.placeholder.com/210x295/7C7E29/ffff/?text=${favorite.name}`;
  } else {
    favoriteImage = favorite.image.medium;
  }
}
//Fav reset
function handleResetFavorites(ev) {
  ev.preventDefault();
  favorites = [];
  localStorage.removeItem('fav');
  paintFavorites();
  paintSeries();
}
//Fav Button X
function handleXButtonFavorites(ev) {
  ev.preventDefault();
  const selectedXButton = ev.currentTarget;
  const selectedFavorite = parseInt(selectedXButton.parentElement.id);
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === selectedFavorite;
  });
  if (favoritesFound !== -1) {
    favorites.splice(favoritesFound, 1);
  }
  paintFavorites();
  paintSeries();
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
  let htmlText = '<h3>Search result</h3>';
  for (const serie of series) {
    getImageUrl(serie);
    isFavorite(serie);
    htmlText += `
        <div class="series--container ${classFav}" id="${serie.id}">
            <img src="${serieImage}" alt="${serie.name}" class="img"></img>
            <h2 class="series--h2">${serie.name}</h2>
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
window.addEventListener('load', favoritesControl);

//LISTENERS---------------------------------------------------------------------------------------
searchBtn.addEventListener('click', handleGetSeries);
document
  .querySelector('.js_form')
  .addEventListener('submit', (ev) => ev.preventDefault()); //para evitar que se genere un 'submit' por defecto al dar al intro, puesto que si solo hay un input y un button dentro de un form, este se envia automáticamente al darle al intro.
function favListener() {
  const seriesHTML = document.querySelectorAll('.series--container');
  for (const serieHTML of seriesHTML) {
    serieHTML.addEventListener('click', handleFavorite);
  }
}
resetBtn.addEventListener('click', handleResetFavorites);
function xBtnfavListener() {
  const xBtns = document.querySelectorAll('.js__Xbutton');
  for (const xBtn of xBtns) {
    xBtn.addEventListener('click', handleXButtonFavorites);
  }
}
