import { Contact } from '../../types/contact.type';
import styles from './ContactList.module.css';

interface ContactListProps {
  selectedContact: Contact;
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
}

export function ContactList({
  contacts,
  onSelect,
  selectedContact,
}: Readonly<ContactListProps>) {
  const listOfContacts = contacts.map((contact) => {
    const checked = selectedContact.id === contact.id;

    return (
      <li key={contact.id}>
        <label htmlFor={contact.id}>{contact.name}</label>
        <input
          type="radio"
          id={contact.id}
          name="contact"
          value={contact.email}
          // You cannot conditionally add checked to the input. If you do that you'll get an error in your console, read more here: https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable.
          // {...(someCondition && {checked: true})}

          // Another funny bug is when I was using checked={checked} ReactJS was not updating my DOM when I was choosing a new contact. But this attribute seems to work just fine.
          defaultChecked={checked}
          onChange={() => onSelect(contact)}
        />
      </li>
    );
  });

  return (
    <fieldset className={styles.contacts}>
      <legend>Contacts</legend>
      <ul>{listOfContacts}</ul>
    </fieldset>
  );
}
