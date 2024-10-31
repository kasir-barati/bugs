import { useState, useEffect } from 'react';
import { LoadingSpinnerMoonCraters } from '../loading-spinner/LoadingSpinner.component';
import { Feed } from '../../types/post.type';
import { genFeeds } from '../../dummy-data/post.dummy-data';
import { fakeFetch } from '../../utils/faker.util';
import './InfiniteScrollbarFeed.component.css';

export function InfiniteScrollNews() {
  // initial state
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [page, setPage] = useState(0);

  async function fetchData() {
    setIsLoading(true);

    try {
      const data = await fakeFetch(genFeeds(50), 1000);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="feeds">
      <h2 className="feeds__header">Feed</h2>
      <ul className="feeds__list">
        {feeds.map((item) => (
          <li key={item.id}>
            <a href="#">{item.title}</a>
          </li>
        ))}
      </ul>
      {isLoading && (
        <LoadingSpinnerMoonCraters className="feeds__loading-spinner" />
      )}
    </section>
  );
}

// import throttle from 'lodash.throttle';
// import {
//   getHeightOfDocument,
//   getScrollTop,
// } from '../../utils/get-scrollbar.util';

// const MAXIMUM_FEED_COUNT = 50;
// export function InfiniteScrollFeed() {

//   async function loadPreviousItems() {
//     if (loading || page <= 1) {
//       return;
//     }

//     setFeeds((prevItems) =>
//       [...prevItems, ...data].slice(0, MAXIMUM_FEED_COUNT),
//     );
//     setPage((previousPage) => previousPage - 1);
//     setLoading(false);
//   }
//   async function loadNextItems() {
//     if (loading) {
//       return;
//     }

//     console.log(page);
//     const data = await fakeFetch(genFeeds(50, page), 1000);

//     setPage((previousPage) => previousPage + 1);
//     setLoading(false);
//     setFeeds((prevItems) =>
//       // Truncate the array to keep only the newly fetched feeds
//       [...prevItems, ...data].slice(-MAXIMUM_FEED_COUNT),
//     );
//   }

//   const throttledHandleScroll = throttle(() => {
//     if (isCloseToTheEndOfThePage()) {
//       console.log('EEEEEENNNNNNDDDDDDD');
//       loadNextItems();
//     } else if (isCloseToTheTopOfThePage()) {
//       console.log('TTTTTTTOOOOOOOPPPPP');
//       loadPreviousItems();
//     }
//   }, 500);

//   useEffect(() => {
//     window.addEventListener('scroll', throttledHandleScroll);

//     return () => {
//       window.removeEventListener('scroll', throttledHandleScroll);
//     };
//   }, []);
// }

// function isCloseToTheEndOfThePage() {
//   return (
//     getHeightOfDocument() + getScrollTop() >=
//     getHeightOfDocument() - 200
//   );
// }
// function isCloseToTheTopOfThePage() {
//   return getScrollTop() <= 200;
// }
