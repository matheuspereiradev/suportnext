import styles from "./style.module.scss";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { ReceivedChat } from "./message/received";
import { SendedChat } from "./message/send";
import { useAuth } from "@contexts/AuthContext";
import { browserAPIRequest } from "@services/api";
import { useForm } from 'react-hook-form';
import { useToast } from "@contexts/ToastContext";
import { useInteraction } from "@contexts/InteractionContext";
import { MdSend } from "react-icons/md";
import { FaPaperclip } from "react-icons/fa";

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
    const [file, setFile] = useState<File>()

    const audioRef = useRef<HTMLAudioElement>(null)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();


    const onSubmit = handleSubmit(async (data) => {
        try {
            const formData = new FormData();
            formData.append('text', data.message)
            formData.append('ticket', ticket)
            formData.append('isPrivate', data.isPrivate)
            formData.append('file', file)

            await browserAPIRequest.post('/ticket/intaraction', formData);
            addToast({ title: "Sucesso", description: "Mensagem enviada", type: "success" });
            refreshInteractions(Number(ticket))
            setValue("message", "")
            audioRef.current.play()
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao enviar mensagem tente novamente", type: "error" })
        }

    });

    function handleFiles(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files[0]) {
            return;
        }

        setFile(event.target.files[0])
    }

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
                                                    isPrivate={ev.isPrivate}
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
                                                    isPrivate={ev.isPrivate}
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

                        <div className={styles.clip}>
                            <span>
                                <FaPaperclip />
                            </span>
                            <input type="file" name="file" id="file" className={styles.upload} onChange={handleFiles} placeholder="Upload File" />
                        </div>
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
                        <audio
                            src="/sendMessage.mp3"
                            ref={audioRef}
                        />
                        <div className={styles.send}>
                            <button type="submit" className={styles.msgSendButton}><MdSend /></button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );

}