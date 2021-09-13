"use strict";const input=document.querySelector(".js_input"),searchBtn=document.querySelector(".js_search_btn"),favoritesResults=document.querySelector(".js_results_favorites"),resetBtn=document.querySelector(".js_reset_btn"),resultsSection=document.querySelector(".js_results");let classFav,serieImage,favoriteImage,favorites=[],series=[];function getFromAPI(){let e;e=""===input.value?"//api.tvmaze.com/shows?page=1":"//api.tvmaze.com/search/shows?q="+input.value,fetch(e).then(e=>{if(e.ok)return e.json();throw e}).then(e=>arrayConverter(e)).then(()=>paintSeries()).catch(e=>console.error(e))}function arrayConverter(e){let t;if(e.length>10){const n=e.slice(0,11);series=n.map(e=>(t={name:e.name,id:e.id,image:e.image},t))}else series=e.map(e=>(t={name:e.show.name,id:e.show.id,image:e.show.image},t));setInLocalStorage(),console.log(series)}function setInLocalStorage(){if(""!==input.value){const e=JSON.stringify(series);localStorage.setItem("series"+input.value,e)}if(0!==favorites.length){const e=JSON.stringify(favorites);localStorage.setItem("fav",e)}}function controlLocalStorage(){const e=localStorage.getItem("series"+input.value),t=JSON.parse(e);null!==t?(series=t,console.log("SERIES already in LocalStorage")):(console.log("SERIES NOT in LocalStorage"),getFromAPI()),paintSeries(),favoritesControl()}function favoritesControl(){const e=localStorage.getItem("fav");if(null!==e){const t=JSON.parse(e);favorites=t,console.log("FAVORITES already in LocalStorage"),console.log(favorites),paintFavorites()}else console.log("FAVORITES NOT in LocalStorage")}function handleFavorite(e){const t=parseInt(e.currentTarget.id),n=e.currentTarget,a=document.querySelectorAll(".series--container");for(const e of series)if(e.id===t){classFav="series--favorite",arrayFavUpdate(t);for(const e of a)e.innerHTML===n.innerHTML&&e.classList.toggle(classFav)}else classFav="";paintFavorites()}function arrayFavUpdate(e){const t=series.find(t=>t.id===e),n=favorites.findIndex(t=>t.id===e);-1===n?favorites.push(t):favorites.splice(n,1)}function paintFavorites(){let e="";if(0!==favorites.length)for(const t of favorites)getImageUrlFav(t),e+=`\n      <li class="favorites--container series--favorite" id="${t.id}">\n          <button class="favorites--Xbutton js__Xbutton">X</button>\n          <img src="${favoriteImage}" alt="${t.name}" class="favorites--img"></img>\n          <h4 class="favorites--title">${t.name}</h4>\n      </li>`;favoritesResults.innerHTML=e,setInLocalStorage()}function isFavorite(e){if(0!==favorites.length){const t=favorites.findIndex(t=>t.id===e.id);classFav=-1!==t?"series--favorite":""}}function getImageUrlFav(e){favoriteImage=null===e.image?"https://via.placeholder.com/210x295/7C7E29/ffff/?text="+e.name:e.image.medium}function handleResetFavorites(e){e.preventDefault(),favorites=[],localStorage.removeItem("fav"),paintFavorites(),paintSeries()}function handleXButtonFavorites(e){e.preventDefault();const t=e.currentTarget,n=parseInt(t.parentElement.id),a=favorites.findIndex(e=>e.id===n);-1!==a&&favorites.splice(a,1),paintFavorites(),paintSeries()}function getImageUrl(e){serieImage=null===e.image?"https://via.placeholder.com/210x295/7C7E29/ffff/?text="+e.name:e.image.medium}function paintSeries(){let e="<h3>Search result</h3>";for(const t of series)getImageUrl(t),isFavorite(t),e+=`\n        <div class="series--container ${classFav}" id="${t.id}">\n            <img src="${serieImage}" alt="${t.name}" class="img"></img>\n            <h2>${t.name}</h2>\n        </div>`;resultsSection.innerHTML=e,favListener()}function handleGetSeries(e){e.preventDefault(),controlLocalStorage()}function Initial(){favoritesControl(),favListener(),xBtnfavListener()}function favListener(){const e=document.querySelectorAll(".series--container");for(const t of e)t.addEventListener("click",handleFavorite)}function xBtnfavListener(){const e=document.querySelectorAll(".js__Xbutton");for(const t of e)t.addEventListener("click",handleXButtonFavorites)}favoritesControl(),favListener(),xBtnfavListener(),document.addEventListener("load",Initial),searchBtn.addEventListener("click",handleGetSeries),document.querySelector(".js_form").addEventListener("submit",e=>e.preventDefault()),resetBtn.addEventListener("click",handleResetFavorites);