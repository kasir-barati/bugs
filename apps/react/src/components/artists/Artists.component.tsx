import { lazy, Suspense } from 'react';
import { artists as dummyData } from '../../dummy-data/artists.dummy-data';
import { fakeFetch } from '../../utils/faker.util';
import { LoadingSpinnerEclipsingMoon } from '../loading-spinner/LoadingSpinner.component';
import styles from './Artists.module.css';

export function Artists() {
  return (
    <section className={styles['artists-container']}>
      <h2 className={styles['artists-container__header']}>Artists</h2>
      <Suspense fallback={<LoadingSpinnerEclipsingMoon />}>
        <List />
      </Suspense>
    </section>
  );
}

const List = lazy(async () => {
  const artists = await fakeFetch(dummyData, 1000);

  return {
    default() {
      return (
        <ul className={styles['artists-list']}>
          {artists.map((artist) => (
            <li className={styles['artist']} key={artist.id}>
              <h3 className={styles['artist-name']}>{artist.name}</h3>
              <p className={styles['artist-bio']}>{artist.bio}</p>
              <p className={styles['artist-time-period']}>
                <time>{artist.dateOfBirth}</time>-
                <time>{artist.dateOfDeath}</time>
              </p>
              <p className={styles['artist-country']}>
                {artist.country}
              </p>
              <picture className={styles['artist-country-flag']}>
                <img src={getFlagSrc(artist.country)} />
              </picture>
            </li>
          ))}
        </ul>
      );
    },
  };
});

function getFlagSrc(country: string) {
  if (country.toLocaleLowerCase() === 'south korea') {
    return '/south-korea.png';
  }
  return `${country.toLocaleLowerCase()}.png`;
}
