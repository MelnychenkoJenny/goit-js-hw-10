import '../css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from '/node_modules/notiflix/build/notiflix-notify-aio';
import fetchCountriesAPI from '../js/fetchCountriesAPI';

const DEBOUNCE_DELAY = 300;

const searchCountryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfoContainer = document.querySelector('.country-info');
const btnClear = document.querySelector('.js-btn-clear');

searchCountryInput.addEventListener(
  'input',
  debounce(onSearchCountryInput, DEBOUNCE_DELAY)
);

function onSearchCountryInput(e) {
  const searchCountry = e.target.value.trim();

  if (searchCountry === '') {
    clearMarkUp();
    return;
  }

  fetchCountriesAPI(searchCountry)
    .then(data => {
      clearMarkUp();
      chooseMarkUp(data);
    })
    .catch(() => {
      setTimeout(()=>searchCountryInput.value='', 1100)
      clearMarkUp()
      Notify.failure('На жаль, країни з такою назвою немає.')});
}

function chooseMarkUp(data) {
  if (data.length >= 10) {
    return Notify.info(
      'Знайдено забагато збігів. Будь ласка, введіть більш конкретну назву країни.'
    );
  } else if (data.length >= 2 && data.length < 10) {
    createCountryMarkUp(data, makeCountryListElementMarkUp, countryList);
  } else {
    createCountryMarkUp(
      data,
      makeCountryCardElementMarkUp,
      countryInfoContainer
    );
  }
}

function createCountryMarkUp(data, fct, container) {
  const markUp = data.map(fct);
  container.innerHTML = markUp.join('');
  countryList.addEventListener('click', e => {
    if (e.target.nodeName !== 'P' && e.target.nodeName !== 'IMG') {
      return;
    }

    const clickMarkUP = data
      .filter(
        el =>
          el.name.official === e.target.textContent ||
          el.flags.png === e.target.src
      )
      .map(makeCountryCardElementMarkUp)
      .join('');
    countryInfoContainer.innerHTML = clickMarkUP;
    countryList.innerHTML = '';
    searchCountryInput.value = '';
  });
}

function makeCountryListElementMarkUp({ flags, name }) {
  return `<li class="country-list__item">
  <img class="country-list__img" src="${flags.png}" alt="${flags.alt}" width="50" height="30"></img>
  <p class="country-list__name">${name.official}</p>
</li>`;
}

function makeCountryCardElementMarkUp({
  flags,
  name,
  capital,
  population,
  languages,
}) {
  return `<img class="country-info__img" src="${flags.png}" alt="${
    flags.alt
  } width="400" height="150">
<h2 class="country-info__title">${name.official}</h2>
<ul class="country-list--info">
<li>
<p class="country-list__item-name"><b>Capital: </b>${capital}</p></li>
<li>
<p class="country-list__item-name"><b>Population: </b>${population}</p></li>
<li>
<p class="country-list__item-name"><b>Languages: </b>${Object.values(
    languages
  ).join(', ')}</p></li>
</ul>`;
}

function clearMarkUp() {
  countryList.innerHTML = '';
  countryInfoContainer.innerHTML = '';
}

btnClear.addEventListener('click', onClearInputBtnClick);

function onClearInputBtnClick() {
  searchCountryInput.value = '';
  clearMarkUp();
}
