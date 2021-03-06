import styles from "./style.module.scss";
import { FaExclamationCircle } from "react-icons/fa";

interface ErrorProperties{
    message:string
}

export function Error({message}:ErrorProperties) {
  return (
    <>
        {message && (<strong className={styles.error}><FaExclamationCircle/> {message}</strong>)}
    </>
  );

}