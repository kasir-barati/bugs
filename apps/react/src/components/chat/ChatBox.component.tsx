import { ChangeEvent, useState } from 'react';
import { Contact } from '../../types/contact.type';
import styles from './ChatBox.module.css';

interface ChatBoxProps {
  contact: Contact;
}

export function ChatBox({ contact }: Readonly<ChatBoxProps>) {
  const [message, setMessage] = useState<string>();
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
  }
  function handleClick() {
    if (!message || message?.trim()?.length <= 0) {
      throw 'trying to send empty message!';
    }

    alert('Sending message...');
  }

  return (
    <p className={styles['chat-box']}>
      <textarea
        value={message}
        placeholder={`Chat to ${contact.name}`}
        onChange={handleChange}
        name="message"
      ></textarea>
      <button type="button" onClick={handleClick}>
        Send to {contact.email}
      </button>
    </p>
  );
}
