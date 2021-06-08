import { FaEyeSlash, FaLowVision, FaPaperclip, FaTrash } from "react-icons/fa";
import styles from "./received.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    isPrivate:boolean
    sender: string
}



export function ReceivedChat({ id, text, file, sender,isPrivate, created_at }: ChatProps) {

    return (

        <div className={styles.leftMsg} key={id}>
                <div className={styles.msgBubble} style={{backgroundColor:`#${(isPrivate)?('57B8FF'):('e2e0e0')}`}}>
                <span className={styles.autor}>{(isPrivate)&&(<FaEyeSlash/>)} {sender}</span>
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
                <span className={styles.hour}>{created_at}</span>
            </div>
        </div>
    );

}