import styles from "./style.module.scss";
import Link from 'next/link';
import { useState } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { ReceivedChat } from "./message/received";
import { SendedChat } from "./message/send";
import { useAuth } from "../../contexts/AuthContext";

interface Interaction {
    id: string,
    text: string,
    file: string,
    idTicket: number,
    isPrivate: boolean,
    created_at: Date,
    sender: User
}

interface User {
    id: string,
    name: string,
    surname: string,
    email: string,
    gender: string
}

interface InteractionProps {
    messages: Interaction[],
    description: string,
    openDate: Date
}

export function Chat({ messages, openDate, description }: InteractionProps) {
    const { user, isLogged } = useAuth()
    return (
        <div className={styles.chatContainer}>
            <div className={styles.description}>
                <p>{description}</p>
                <span className={styles.hour}>{openDate}</span>
                <hr />
            </div>

            <div className={styles.chat}>
                {messages.map(e => {
                    return (
                        <div key={e.id} className={styles.send}>
                            <ReceivedChat
                                text={e.text}
                                id={e.id}
                                created_at={e.created_at}
                                file={e.file} sender={`${e.sender.name} ${e.sender.surname} (${e.sender.email})`}
                            />
                        </div>
                    )


                }
                )}
            </div>
            <textarea/>
        </div>
    );

}