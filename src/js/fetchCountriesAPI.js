const BASE_URL = 'https://restcountries.com/v3.1/name';

export default function fetchCountries(name) {
    return fetch(
      `${BASE_URL}/${name}?fields=name,capital,population,flags,languages`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
  }
