import styles from "./style.module.scss";
import Link from 'next/link';

import { useEffect } from "react";
import { ReceivedChat } from "./message/received";
import { SendedChat } from "./message/send";
import { useAuth } from "../../contexts/AuthContext";
import { browserAPIRequest, clientAPIRequest } from "../../services/api";
import { useForm } from 'react-hook-form';
import { useToast } from "../../contexts/ToastContext";
import { useInteraction } from "../../contexts/InteractionContext";
import { FiSend } from "react-icons/fi";

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
    openDate: Date,
    ticket: string
}

interface SendMessageProps {
    message: string,
    file: string,
    status: number
}

export function Chat({ messages, openDate, description, ticket }: InteractionProps) {

    const { interactions, refreshInteractions, setInteractions } = useInteraction();
    const { user } = useAuth();
    const { addToast } = useToast();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = {
                text: data.message,
                file: "",
                ticket: ticket,
            }
            await browserAPIRequest.post('/ticket/intaraction', formData);
            addToast({ title: "Sucesso", description: "Mensagem enviada", type: "success" });
            refreshInteractions(Number(ticket))
            setValue("message", "")
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao enviar mensagem tente novamente", type: "error" })
        }

    });

    useEffect(() => {
        setInteractions(messages);
    }, [])


    return (
        <>
            <section className={styles.chat}>
                <div className={styles.msger}>
                    <div className={styles.description}>
                        <p>{description}</p>
                    </div>
                    <div className={styles.msgerChat}>
                        {
                            user && (
                                interactions && (
                                    interactions.map(ev => {
                                        if (user.id === ev.sender.id) {
                                            return (
                                                <SendedChat
                                                    text={ev.text}
                                                    sender={`${ev.sender.name} ${ev.sender.surname} (${ev.sender.email})`}
                                                    id={ev.id}
                                                    file={ev.file}
                                                    created_at={ev.created_at}
                                                    key={ev.id}
                                                />
                                            )
                                        } else {
                                            return (
                                                <ReceivedChat
                                                    text={ev.text}
                                                    sender={`${ev.sender.name} ${ev.sender.surname} (${ev.sender.email})`}
                                                    id={ev.id}
                                                    file={ev.file}
                                                    created_at={ev.created_at}
                                                    key={ev.id}
                                                />
                                            )
                                        }
                                    })
                                )
                            )
                        }
                    </div>
                    <form className={styles.inputTextArea} onSubmit={handleSubmit(onSubmit)}>
                        <textarea className={styles.msgInput} placeholder="Digite sua mensagem..." maxLength={1000} {...register("message", { required: { value: true, message: "É necessário preencher a mensagem" } })} />
                        { 
                            (user?.admin) && (
                                <div className={styles.privateSwitch}>
                                    <label className={styles.legend}>Privado?</label>
                                    <label className={styles.switch}>
                                        <input type="checkbox" {...register("isPrivate", {})} />
                                        <span className={styles.slider}></span>
                                    </label>
                                </div>
                            )
                        }

                        <button type="submit" className={styles.msgSendButton}>Enviar</button>
                    </form>
                </div>
            </section>
        </>
    );

}