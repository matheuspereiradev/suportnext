import { FaPaperclip, FaTrash } from "react-icons/fa";
import { useInteraction } from "../../../contexts/InteractionContext";
import { useToast } from "../../../contexts/ToastContext";
import { browserAPIRequest } from "../../../services/api";
import styles from "./send.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    sender: string
}



export function SendedChat({ id, text, file, sender, created_at }: ChatProps) {

    const {addToast} = useToast();
    const {refreshInteractions} = useInteraction();

    async function deleteChat(id:string){
        try{
            const res = await browserAPIRequest.delete(`/ticket/intaraction/${id}`);
            addToast({title:"Sucesso",description:"Mensagem excluida",type:"info"});
            refreshInteractions(res.data.idTicket)
        }catch(e){
            addToast({title:"Erro",description:"Erro ao excluir mensagem tente novamente",type:"error"})
        }
    }

    return (
        <div className={styles.rightMsg}>
            <div className={styles.msgBubble}>
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
                 <span className={styles.hour}>{created_at}</span>
            </div>
        </div>
    );

}