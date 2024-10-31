import { lazy } from 'react';
import { fakeFetch } from '../../utils/faker.util';
import styles from './Billboard.module.css';

export const Billboard = lazy(async () => {
  const data = await fakeFetch(
    {
      advertiserName: 'Hazelcast',
      logo: '/logo.png',
      image: '/banner.png',
      header: 'Hazelcast covers all your stream processing needs.',
      aShortIntro:
        'Accelerate app development and deployment to realize your real-time potential.',
      cta: 'https://example.com',
    },
    4000,
  );

  return {
    default() {
      return (
        <div className={styles['billboard-border']}>
          <article className={styles.billboard}>
            <h2 className={styles.billboard__header}>
              <a href="#">{data.header}</a>
            </h2>
            <a
              href="#"
              className={styles['billboard__advertiser-name']}
            >
              <img src={data.logo} /> {data.advertiserName}
            </a>
            <img
              src={data.image}
              className={styles.billboard__banner}
            />
            <p className={styles.billboard__description}>
              {data.aShortIntro}
            </p>
            <a className={styles.billboard__cta} href={data.cta}>
              Learn more
            </a>
          </article>
        </div>
      );
    },
  };
});
