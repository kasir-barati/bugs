import { useState, useEffect, useRef } from 'react';
import { LoadingSpinnerMoonCraters } from '../loading-spinner/LoadingSpinner.component';
import { GetFeedsResponse } from '../../types/post.type';
import { isEndOfThePage } from '../../utils/get-scrollbar.util';
import './InfiniteScrollFeed.module.css';

const MAXIMUM_FEED_COUNT = 45;
const FEED_FETCH_LIMIT = 15;

export function InfiniteScrollFeed() {
  const [getFeedsResponses, setGetFeedsResponses] = useState<
    GetFeedsResponse[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  /*
    BAD state structure: page is really intertwined with feeds, thus separating it caused me a lot of distress on scrolling up!
    const [page, setPage] = useState(0);

    setPage((previousPage) => {
      if (previousPage === 1 && feeds.length === MAXIMUM_FEED_COUNT) {
        return MAXIMUM_FEED_COUNT / FEED_FETCH_LIMIT
        }
        return previousPage + 1;
    });
    setPage(
      (previousPage) =>
        previousPage - MAXIMUM_FEED_COUNT / FEED_FETCH_LIMIT,
    );
    This is not the only issue with page. It spread throughout the entire component. Thus we will store it in feeds
  */
  const feedsListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      setIsLoading(true);

      // Here you can pass to the real API your desired page number like this: ex.com/api/feeds?page=1
      const response = await fetch<GetFeedsResponse>();

      if (!ignore) {
        setGetFeedsResponses([response]);
        setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
      setGetFeedsResponses([]);
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    // These functions will be called too many times since whenever user scroll they'll be invoked! Thus we could memoizing them with useCallback.
    // But you know that your app should work without it too. Which in this case it won't.
    // It works kinda, but it's gonna be super glitchy! Jumping from page 5 to 2. And sending dozens of requests in case of a real AJAX call to your poor backend.
    async function updateFeeds() {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      console.log('I am fetching NEW feeds');

      /*
        Here you can pass to the real API your desired page number like this: 
        const page = getFeedsResponses.map(response => response.page).pop()! + 1;
        const url = `ex.com/api/feeds?page=${page}`
      */
      const response = await fetch<GetFeedsResponse>();

      setGetFeedsResponses((previousGetFeedsResponses) =>
        [...previousGetFeedsResponses, response].slice(
          -(MAXIMUM_FEED_COUNT / FEED_FETCH_LIMIT),
        ),
      );
      setIsLoading(false);
    }

    async function fetchPreviousData() {
      if (isLoading) {
        return;
      }

      setIsLoading(true);

      console.log('I am fetching OLD feeds');

      /* 
        Given that:
        - MAXIMUM_FEED_COUNT = 45
        - FEED_FETCH_LIMIT = 15
        This means that the feeds can hold up to 3 pages worth of data at a time (45 / 15 = 3 pages):
        - Since MAXIMUM_FEED_COUNT is 45, the oldest page is already removed once user load beyond that. 
        - On scroll up we need to fetch feeds NOT before the current page, but before the earliest page in the feeds state.
      */
      /*
        Here you can pass to the real API your desired page number like this: 

        You do not need to worry about negative page number since out canWeFetch will safe guard this function.
        
        const page = getFeedsResponses.map(response => response.page).shift()! - 1;
        const url = `ex.com/api/feeds?page=${page}`
      */
      const response = await fetch<GetFeedsResponse>();

      setGetFeedsResponses((previousGetFeedsResponses) =>
        [response, ...previousGetFeedsResponses].slice(
          0,
          MAXIMUM_FEED_COUNT / FEED_FETCH_LIMIT,
        ),
      );
      setIsLoading(false);

      feedsListRef.current?.children
        .item(FEED_FETCH_LIMIT)
        ?.scrollIntoView({
          behavior: 'smooth',
        });
    }

    async function handleScroll() {
      if (isLoading) {
        return;
      }

      if (isEndOfThePage()) {
        updateFeeds();
        return;
      }

      if (
        canWeFetch(getFeedsResponses[0].page) &&
        isAtTheTopOfThe(feedsListRef.current)
      ) {
        fetchPreviousData();
        return;
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

  return (
    <section className="feeds">
      <h2 className="feeds__header">Feed</h2>
      {isLoading && isAtTheTopOfThe(feedsListRef.current) && (
        <LoadingSpinnerMoonCraters className="feeds__loading-spinner" />
      )}
      <ul className="feeds__list" ref={feedsListRef} id="test">
        {getFeedsResponses.map(({ data: feeds }) => {
          return feeds.map((feed) => (
            <li key={feed.id}>
              <a href="#">{feed.title}</a>
            </li>
          ));
        })}
      </ul>
      {isLoading && isEndOfThePage() && (
        <LoadingSpinnerMoonCraters className="feeds__loading-spinner" />
      )}
      <p className="states">
        Pages:{' '}
        {getFeedsResponses
          .map((response) => response.page)
          .join(', ')}
        , isLoading: {String(isLoading)}
      </p>
    </section>
  );
}

function isAtTheTopOfThe(element: HTMLUListElement | null) {
  return element && element.getBoundingClientRect().top >= 0;
}
function canWeFetch(page: number) {
  return page * FEED_FETCH_LIMIT > MAXIMUM_FEED_COUNT;
}

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
