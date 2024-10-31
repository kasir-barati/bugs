import { lazy, Suspense, useEffect, useState } from 'react';
import { PostMetadata } from '../../types/post.type';
import { fakeFetch } from '../../utils/faker.util';
import { LoadingSpinnerFullMoon } from '../loading-spinner/LoadingSpinner.component';
import { Menu } from './Menu.component';
import styles from './Post.module.css';
import { Sidebar } from './Sidebar.component';

export function Post() {
  const [postMetadata, setPostMetadata] = useState<PostMetadata>();

  useEffect(() => {
    fakeFetch(
      { commentsCount: 12, bookmarkCount: 43, reactionsCount: 12 },
      500,
    ).then(setPostMetadata);
  }, []);

  return (
    <div className={styles.post}>
      <Menu postMetadata={postMetadata} />
      <Suspense
        fallback={
          <LoadingSpinnerFullMoon style={{ justifySelf: 'center' }} />
        }
      >
        <PostContent />
      </Suspense>
      <Sidebar />
    </div>
  );
}

const PostContent = lazy(async () => {
  const data = await fakeFetch({ markdown: '# hi' }, 1000);

  return {
    default() {
      return <main className="">{data.markdown}</main>;
    },
  };
});
