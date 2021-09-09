'use strict';
const searchSection = document.querySelector('.js_search');
const favoritesSection = document.querySelector('.js_favorites_section');
const input = document.querySelector('.js_input');
const searchBtn = document.querySelector('.js_search_btn');
const resultsSection = document.querySelector('.js_results');
const resetBtn = document.querySelector('.js_reset_btn');
let favorites = [];
let movies = [];

//Filter
function isValidMovie(ev) {
  ev.preventDefault();
  movies.filter((dataEl) => dataEl.name.toLoweCase().inlcudes(input.value));
  paintMovies();
  return movies.name.toLoweCase().inlcudes(input.value);
}
input.addEventListener('keyup', isValidMovie);
searchBtn.addEventListener('click', isValidMovie);

//Favoritos
function handleMovie() {
  const selectedMovie = ev.currentTarget.id;
  const objetClicked = movies.find((movieEl) => {
    return movieEl.id === selectedMovie;
  }); //desconozco si funcionará-------------------------------------
  const favoritesFound = favorites.findIndex((fav) => {
    return fav.id === selectedMovie;
  }); //desconozco si funcionará-------------------------------------
  if (favoritesFound === -1) {
    favorites.push(objetClicked);
  } else {
    favorites.splice(favoritesFound, 1);
  }
  paintMovies(); // en Favoritos lugar: favoritesSection ----------------------------------
}

//Listener
function listenMovies() {
  const movies = document.querySelectorAll('.js_movies');
  for (const movie of movies) {
    movie.addEventListener('click', handleMovie);
  }
}

//isFavorite
function isFavorite() {
  const favoriteFound = favorites.find((fav) => {
    return fav.id === movies.id;
  });
  if (favoriteFound === undefined) {
    return false;
  } else {
    return true;
  }
}
//Pintar
function paintMovies() {
  let html = '';
  let favClass = '';
  for (const movieEl of movies) {
    let isValidClass;
    if (isValidMovie(movieEl)) {
      isValidClass = '';
    } else {
      isValidClass = 'movie--hidden';
    }
    const isFav = isFavorite(movieEl);
    if (isFav) {
      favClass = 'movie--favorite';
    } else {
      favClass = '';
    }
    html += `<li class="movies js_movies ${favClass} ${isValidClass}" id="${movie.id}">`;
    html += `<img class="movie__img" src"${movieEl.image}">`;
    html += `<h2>${movieEl.name}</h2>`;
    html += `</li>`;
  }
  resultsSection.innerHTML = html;
  listenMovies();
}

//Local Storage
function setInLocalStorage() {
  const stringMovies = JSON.stringify(movies);
  localStorage.setItem('movies', stringMovies);
}

//Get from API
function getFromApi() {
  fetch('https://api.tvmaze.com/search/shows?q=girls')
    .then((response) => response.json())
    .then((answer) => {
      movies = answer; //querría hacer -show pero da error -----------
      console.log(movies);
    });
  console.log(movies);
  paintMovies();
  setInLocalStorage();
}

//Confirmar si Local Storage esta lleno
function getLocalStorage() {
  debugger;
  const localStoragePalettes = localStorage.getItem('movies');
  if (localStoragePalettes === '[]') {
    getFromApi();
  } else {
    const arrayMovies = JSON.parse(localStoragePalettes);
    movies = arrayMovies;
    paintMovies();
  }
}
getLocalStorage();
