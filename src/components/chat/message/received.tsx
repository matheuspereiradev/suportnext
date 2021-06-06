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

    function deleteChat(id:string){
        console.log(id)
    }

    return (
        <div className={styles.chat} key={id}>
            <span className={styles.autor}>{sender}</span>
            <button className={styles.trash} onClick={()=>{deleteChat(id)}}><FaTrash /></button>
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
            <div className={styles.hourArea}>
            <span className={styles.hour}>{created_at}</span>
            </div>
        </div>
    );

}