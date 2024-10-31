import { useEffect, useState } from 'react';
import { User } from '../../types/user.type';
import styles from './UserInfo.module.css';

interface UserInfoProps {
  userInfo: Promise<User>;
}

export function UserInfo({
  userInfo: data,
}: Readonly<UserInfoProps>) {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    data.then(setUser);
  }, [data]);

  if (!user) {
    return;
  }

  return (
    <article className={styles['user-info']}>
      <div
        className={styles['user-info__banner']}
        style={{ backgroundColor: user.bannerColor }}
      ></div>
      <h2 className={styles['user-info__name']}>{user.name}</h2>
      <img
        src={user.avatar}
        className={styles['user-info__avatar']}
      />
      <p className={styles['user-info__bio']}>{user.bio}</p>
      <dl className={styles['user-info__meta']}>
        {user.location && (
          <>
            <dt>Location</dt>
            <dd>{user.location}</dd>
          </>
        )}
        {user.education && (
          <>
            <dt>Education</dt>
            <dd>{user.education}</dd>
          </>
        )}
        {user.pronounce && (
          <>
            <dt>Pronounce</dt>
            <dd>{user.pronounce}</dd>
          </>
        )}
        {user.work && (
          <>
            <dt>Work</dt>
            <dd>{user.work}</dd>
          </>
        )}
        <>
          <dt>Joined</dt>
          <dd>{user.joinedAt}</dd>
        </>
      </dl>
    </article>
  );
}
