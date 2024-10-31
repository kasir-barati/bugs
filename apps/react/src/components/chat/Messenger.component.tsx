import { useState } from 'react';
import { contacts } from '../../dummy-data/contacts.dummy-data';
import { Contact } from '../../types/contact.type';
import { ChatBox } from './ChatBox.component';
import { ContactList } from './ContactList.component';
import styles from './Messenger.module.css';

export function Messenger() {
  const [to, setTo] = useState(contacts[0]);

  function handleSelect(contact: Contact) {
    setTo(contact);
  }

  return (
    <article className={styles['messenger']}>
      <h2 className={styles.messenger__header}>Messenger app</h2>
      <form className={styles.messenger__form}>
        <ContactList
          contacts={contacts}
          onSelect={handleSelect}
          selectedContact={to}
        />
        <ChatBox key={to.email} contact={to} />
      </form>
    </article>
  );
}
