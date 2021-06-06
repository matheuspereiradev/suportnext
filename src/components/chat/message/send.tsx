import { FaPaperclip, FaTrash } from "react-icons/fa";
import styles from "./send.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    sender: string
}



export function SendedChat({ id, text, file, sender, created_at }: ChatProps) {

    return (
        <div className={styles.rightMsg}>
            <div className={styles.msgBubble}>
                <span className={styles.autor}>{sender}</span>
                <p>{text}</p>
                {
                    file && (
                        <>
                            <a href={file} target="_blank">
                                <button className={styles.anexo}><FaPaperclip /> Ver anexo</button>
                            </a><br />
                        </>
                    )
                }
                 <span className={styles.hour}>{`data${created_at}`}</span>
            </div>
        </div>
    );

}