import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';

import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  card: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
  e.preventDefault();
  const countryName = e.target.value.trim();
  clear();
  if (!countryName) {
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      console.log(countries);
      if (countries.length > 10) {
        Notiflix.Notify.info(
          `Too many matches found. Please enter a more specific name.`
        );
      } else if (countries.length === 1) {
        clear();
        renderCountry(countries);
      } else if (countries.length >= 2 && countries.length <= 10) {
        clear();
        renderCountries(countries);
      }
    })
    .catch(error => onError());
}

function renderCountry(countries) {
  const markup = countries
    .map(({ name, capital, population, flags, languages }) => {
      const language = Object.values(languages).join(', ');
      return `<ul><li class="country-card">
    <img class="flag-card-img" src="${flags.svg}" width="50" height="40" alt="flag" />
    <h1 class="card-name"> ${name.official}</h1></li>
    <li class="card-text"><p><b>Capital:</b> ${capital}</p></li>
    <li class="card-text"><p><b>Population:</b> ${population}</p></li>
    <li class="card-text"><p><b>Languages:</b> ${language}</p></li></ul>
  `;
    })
    .join('');
  refs.card.insertAdjacentHTML('beforeend', markup);
}

function renderCountries(countries) {
  const markupList = countries
    .map(({ flags, name }) => {
      return `<li class="country-item">
  <img class="flag-img" src="${flags.svg}" width="30" height="20" alt="flag" />
  <p class="country-name"> <b>${name.official}</b></p>
</li>`;
    })
    .join('');
  refs.list.insertAdjacentHTML('beforeend', markupList);
}

function clear() {
  refs.card.innerHTML = '';
  refs.list.innerHTML = '';
}

function onError(error) {
  Notiflix.Notify.failure(`❌ Oops, there is no country with that name`);
}
