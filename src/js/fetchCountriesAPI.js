const BASE_URL = 'https://restcountries.com/v3.1/name';

export default async function fetchCountries(name) {
  const response = await fetch(
    `${BASE_URL}/${name}?fields=name,capital,population,flags,languages`
  )
  if (!response.ok) {
    throw new Error(response.status);
  }
  return await response.json();
  }
