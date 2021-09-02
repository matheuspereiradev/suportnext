
import styles from "./style.module.scss";
import Route from 'next/router'
import { FaCircle, FaPenAlt, FaPencilAlt, FaTrashAlt } from "react-icons/fa";

interface Sprint {
    id: number,
    name: string,
    isOpen: boolean,
    startDate: Date,
    expectedEndDate: Date,
    deleteFunction: (id: number) => Promise<void>
}

export function SprintItem({ id, expectedEndDate, isOpen, name, startDate, deleteFunction }: Sprint) {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.firstLine}>
                        <span>{startDate}</span><strong>-</strong>
                        <span> {expectedEndDate}</span><strong>|</strong>
                        {(isOpen) ? <span> <FaCircle color={'#2FCD70'} /> Aberta </span> : <span> <FaCircle color={'#CDCDCD'} /> Fechada </span>}
                    </div>
                    <div className={styles.title}>
                        <strong>#{id}</strong><span> - {name}</span>
                    </div>
                </div>

                <div className={styles.buttonContent}>
                    <button onClick={() => Route.push(`/dev/sprints/${id}`)} className={styles.edit}><FaPencilAlt /></button>
                    <button className={styles.delete} onClick={() => { deleteFunction(id) }}><FaTrashAlt /></button>
                </div>
            </div>
        </>

    );

}