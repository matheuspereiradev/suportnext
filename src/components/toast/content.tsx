import styles from "./style.module.scss";
import { Message, useToast } from "../../contexts/ToastContext";
import { FaTimes } from "react-icons/fa";
import { useEffect } from "react";

interface MessageContent {
    message: Message
}

export function ToastContent({ message }: MessageContent) {

    const { removeToast } = useToast();

    useEffect(() => { 
        setTimeout(()=>{removeToast(message.id)},5000)
    }, [])

    return (
        <div className={styles.toast} style={{ background: `var(--${message.type})` }}>
            <div className={styles.container}>
                <p className={styles.title}>{message.title}</p>
                <p className={styles.message}>{message.description}</p>
            </div>
            <button onClick={() => removeToast(message.id)}><FaTimes /></button>
        </div>
    );

}