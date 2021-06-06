import { FaPaperclip, FaTrash } from "react-icons/fa";
import styles from "./received.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    sender: string
}



export function ReceivedChat({ id, text, file, sender, created_at }: ChatProps) {

    function deleteChat(id: string) {
        console.log(id)
    }

    return (

        <div className={styles.leftMsg}>
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