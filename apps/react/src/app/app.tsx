import styles from './app.module.css';

export function App() {
  return (
    <>
      {/* <Artists /> */}
      {/* <Messenger /> */}
      {/* <Timer /> */}
      {/* <Faq /> */}
      {/* <Post /> */}
      {/* <NormalSearch /> */}
      {/* <DebouncingSearch /> */}
      {/* <LodashDebounceSearch /> */}
      {/* <Stopwatch /> */}
      {/* <TaskManager /> */}
      {/* <TaskManager /> */}
      {/* <WordCloud words={words} /> */}
      {/* <InfiniteScrollFeed /> */}
      <section
        className={styles.btn}
        onClickCapture={() => {
          console.log('onClickCapture section');
        }}
      >
        <button
          onClick={(e) => {
            console.log('onClick button #1');
            e.stopPropagation();
          }}
        >
          <code>onClickCapture</code> VS <code>onClick</code>
        </button>
      </section>
    </>
  );
}

export default App;
