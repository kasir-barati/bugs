import classNames from 'classnames';
import { useState } from 'react';
import { faqs } from '../../dummy-data/faqs.dummy-data';
import { Faq as FaqType } from '../../types/faq.type';
import styles from './Faq.module.css';

interface QuestionAndAnswerProps {
  onClick: (id: string) => void;
  faq: Readonly<FaqType>;
  openFaqId?: string;
}

function QuestionAndAnswer({
  onClick,
  faq,
  openFaqId,
}: QuestionAndAnswerProps) {
  function handleClick() {
    onClick(faq.id);
  }

  return (
    <article className={styles['faq__q-and-a']}>
      <h3
        role="button"
        className={classNames(styles['faq__q-and-a__header'], {
          [styles['faq__q-and-a__open']]: openFaqId === faq.id,
        })}
        onClick={handleClick}
      >
        {faq.question}
      </h3>
      {openFaqId === faq.id && <p>{faq.answer}</p>}
    </article>
  );
}

export function Faq() {
  const [openFaqId, setOpenFaqId] = useState<string>();

  function handleClick(id: string) {
    if (id === openFaqId) {
      setOpenFaqId(undefined);
      return;
    }

    setOpenFaqId(id);
  }

  return (
    <section className={styles.faq}>
      <h2>FAQ</h2>
      {faqs.map((faq) => {
        return (
          <QuestionAndAnswer
            faq={faq}
            onClick={handleClick}
            openFaqId={openFaqId}
            key={faq.id}
          />
        );
      })}
    </section>
  );
}
