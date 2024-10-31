import { Fragment } from 'react/jsx-runtime';
import { LatestPost as LatestPostType } from '../../types/post.type';
import styles from './LatestPost.module.css';

interface LatestPostProps {
  latestPost: LatestPostType;
}

export function LatestPost({
  latestPost,
}: Readonly<LatestPostProps>) {
  return (
    <a className={styles['latest-post']} href={latestPost.href}>
      <p className={styles['latest-post__title']}>
        {latestPost.title}
      </p>
      <p className={styles['latest-post__tags']}>
        {latestPost.tags.map((tag) => (
          <Fragment key={tag}>
            <span>#</span>
            {tag}{' '}
          </Fragment>
        ))}
      </p>
    </a>
  );
}
