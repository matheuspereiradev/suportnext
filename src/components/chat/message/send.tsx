import styles from "./received.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    sender: string
}



export function SendedChat({id,text,file,sender,created_at}:ChatProps) {
  return (
    <div className={styles.chat}>
        {text}
    </div>
  );

}