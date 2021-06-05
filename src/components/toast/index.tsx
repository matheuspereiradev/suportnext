import styles from "./style.module.scss";
import { FaTimes } from "react-icons/fa";
import { Message, useToast } from "../../contexts/ToastContext";

interface MessageToast {
    messages: Message[]
}

export function Toast({ messages }: MessageToast) {

    const {removeToast} = useToast()
    return (
        <div className={styles.toastArea}>
            {
                messages?.map((message) => {
                    return (
                        <div className={styles.toast} key={message.id} style={{background:`var(--${message.type})`}}>
                            <div className={styles.container}>
                                <p className={styles.title}>{message.title}</p>
                                <p className={styles.message}>{message.description}</p>
                            </div>
                            <button onClick={()=>removeToast(message.id)}><FaTimes /></button>
                        </div>
                    )
                })
            }

        </div>
    );

}