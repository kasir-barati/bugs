import cities from 'cities-list';
import debounce from 'lodash.debounce';
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import { isStringEmpty } from '../../utils/is-string-empty.util';
import styles from './Search.module.css';

const citiesArray = Object.keys(cities);

export function LodashDebounceSearch() {
  const [filteredCities, setFilteredCities] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const debouncedCitiesFilter = useCallback(
    debounce((searchQuery: string) => {
      console.log('I will be called only once every 1500ms!');
      setFilteredCities(
        citiesArray.filter((city) => {
          return city
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        }),
      );
    }, 1500),
    [],
  );

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value;

    setCity(searchQuery);

    if (isStringEmpty(searchQuery)) {
      setFilteredCities([]);
      return;
    }

    debouncedCitiesFilter(searchQuery);
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
