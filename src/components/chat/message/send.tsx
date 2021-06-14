import { FaEyeSlash, FaPaperclip, FaTrash } from "react-icons/fa";
import { useInteraction } from "@contexts/InteractionContext";
import { useToast } from "@contexts/ToastContext";
import { browserAPIRequest } from "@services/api";
import styles from "./send.module.scss";

interface ChatProps {
    id: string,
    text: string,
    file: string,
    created_at: Date,
    isPrivate:boolean
    sender: string
}

export function SendedChat({ id, text, file,isPrivate, sender, created_at }: ChatProps) {

    const {addToast} = useToast();
    const {removeInteraction} = useInteraction();

    async function deleteChat(id:string){
        try{
            const res = await browserAPIRequest.delete(`/ticket/intaraction/${id}`);
            addToast({title:"Sucesso",description:"Mensagem excluida",type:"info"});
            removeInteraction(res.data.id)
        }catch(e){
            addToast({title:"Erro",description:"Erro ao excluir mensagem tente novamente",type:"error"})
        }
    }

    return (
        <div className={styles.rightMsg}>
            <div className={styles.msgBubble} style={{backgroundColor:`#${(isPrivate)?('57B8FF'):('E1FFC7')}`}}>
                <span className={styles.autor}>{(isPrivate)&&(<FaEyeSlash/>)} {sender}</span>
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