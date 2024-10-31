import cities from 'cities-list';
import { ChangeEvent, MouseEvent, useState } from 'react';
import { isStringEmpty } from '../../utils/is-string-empty.util';
import styles from './Search.module.css';

const citiesArray = Object.keys(cities);

export function NormalSearch() {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [city, setCity] = useState('');

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value;

    setCity(searchQuery);

    if (isStringEmpty(searchQuery)) {
      setFilteredCities([]);
      return;
    }

    // FIXME: Problem child is the following setter call!
    setFilteredCities(
      citiesArray.filter((city) =>
        city.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    );
  }
  function handleClick(e: MouseEvent<HTMLDataListElement>) {
    if (e.target instanceof HTMLOptionElement) {
      setCity(e.target.value);
      setFilteredCities([]);
    }
  }

  return (
    <section className={styles.search}>
      <h1 className={styles.search__header}>Find your city</h1>
      <form>
        <span className={styles['ltr-linear-border']}>
          <input
            id="search"
            type="search"
            name="search"
            className={styles.field}
            list=""
            value={city}
            placeholder="City name..."
            onChange={handleChange}
            autoFocus
            autoComplete="off"
          />
        </span>
        <datalist
          className={styles['filtered-cities']}
          id="filteredCities"
          onClick={handleClick}
        >
          {filteredCities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </datalist>
      </form>
    </section>
  );
}
