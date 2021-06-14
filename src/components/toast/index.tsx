import styles from "./style.module.scss";
import { Message } from "@contexts/ToastContext";
import {ToastContent} from './content'

interface MessageToast {
    messages: Message[]
}

export function Toast({ messages }: MessageToast) {

    return (
        <div className={styles.toastArea}>
            {
                messages?.map((message) => {
                    return (
                        <ToastContent key={message.id} message={message}/>
                    )
                })
            }
        </div>
    );

}