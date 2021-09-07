import styles from "@styles/dev/dashboard/index.module.scss";
import { DefaultLayout } from "@layouts/DefaultLayout"
import { browserAPIRequest, clientAPIRequest } from "@services/api";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable, DropResult, resetServerContext } from "react-beautiful-dnd";
import { FaBug, FaEye, FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import ReactModal from "react-modal";
import { useToast } from "@contexts/ToastContext";
import { useForm } from "react-hook-form";
import { Error } from "@components/error";
import { io, Socket } from "socket.io-client"

type FormTaskData = {
    id: number;
    idBacklog: number;
    title: string;
    description: string;
    isBug: boolean;
    idResponsable: string;
};

type FormBacklogData = {
    id: number;
    title: string;
    description: string;
    idResponsable: string;
    isOpen: boolean;
};

interface User {
    id: string,
    name: string,
    admin: boolean,
    email: string,
    gender: string,
    surname: string
}

interface Tasks {
    id: number,
    title: string,
    description: string,
    isBug: boolean,
    doPosition: number,
    created_at: Date,
    createdBy: User,
    responsable: User
}

interface Backlog {
    id: number,
    title: string,
    description: string,
    isOpen: boolean,
    created_at: Date,
    responsable: User,
    tasks: Array<Tasks[]>
}

export interface Sprint {
    id: number,
    name: string,
    startDate: Date,
    expectedEndDate: Date,
    isOpen: boolean,
    backlogs: Backlog[]
}
interface SprintList {
    id: number,
    name: string,
    startDate: Date,
    expectedEndDate: Date,
}

interface DashboardListPros {
    sprintProp: Sprint;
    sprintList: SprintList[];
    usersAdmin: User[];
}

export default function Dashboard({ sprintProp, sprintList, usersAdmin }: DashboardListPros) {

    const [sprint, setSprint] = useState<Sprint>(sprintProp);
    const [isOpenModalBacklog, setIsOpenModalBacklog] = useState(false);
    const [isOpenModalTask, setIsOpenModalTask] = useState(false);
    const { addToast } = useToast();
    const { register: registerTask, setValue: setTaskValue, getValues: getTaskValue, handleSubmit: handleSubmitTask, formState: { errors: errorsTask } } = useForm<FormTaskData>();
    const { register: registerBacklog, setValue: setBacklogValue, getValues: getBacklogValue, handleSubmit: handleSubmitBacklog, formState: { errors: errorsBacklog } } = useForm<FormBacklogData>();

    const socket = io('http://localhost:3030')
    socket.on('haveUpdate', () => {
        // findSprintDetails(String(sprint.id))
    })

    const onSubmitTaskForm = handleSubmitTask(async (data) => {

        if (data.id) {
            const dataFormatted = {
                title: data.title,
                description: data.description,
                idResponsable: data.idResponsable,
                isBug: data.isBug
            }
            try {
                const res = await browserAPIRequest.put(`/task/${data.id}`, dataFormatted);
                closeModalTasks();
                // addToast({ title: "Sucesso", description: "Ticket cadastrado com sucesso", type: "success" })
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao salvar task", type: "error" })
            }
        } else {
            const dataFormatted = {
                title: data.title,
                description: data.description,
                idResponsable: data.idResponsable,
                isBug: data.isBug,
                idBacklog: data.idBacklog
            }
            try {
                const res = await browserAPIRequest.post(`/task`, dataFormatted);
                closeModalTasks();
                // addToast({ title: "Sucesso", description: "Ticket cadastrado com sucesso", type: "success" })
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao salvar task", type: "error" })
            }

        }

    });
    const onSubmitBacklogForm = handleSubmitBacklog(async (data) => {


        if (data.id) {
            const dataFormatted = {
                title: data.title,
                description: data.description,
                idResponsable: data.idResponsable
            }
            try {
                await browserAPIRequest.put(`/backlog/${data.id}`, dataFormatted);
                closeModalBacklog();
                // addToast({ title: "Sucesso", description: "Ticket cadastrado com sucesso", type: "success" })
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao salvar backlog", type: "error" })
            }
        } else {
            const dataFormatted = {
                title: data.title,
                description: data.description,
                idSprint: sprint.id,
                idResponsable: data.idResponsable
            }
            try {
                await browserAPIRequest.post(`/backlog`, dataFormatted);
                addToast({ title: "Sucesso", description: "Backlog cadastrado com sucesso", type: "success" })
                closeModalBacklog();
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao salvar backlog", type: "error" })
            }

        }

    });

    function handleClickBacklogDetails(backlog: Backlog) {

        setIsOpenModalBacklog(true);
        if (backlog) {
            setBacklogValue("title", backlog.title)
            setBacklogValue("description", backlog.description)
            setBacklogValue("idResponsable", backlog.responsable.id)
            setBacklogValue("id", backlog.id)
        } else {
            setBacklogValue("title", "")
            setBacklogValue("description", "")
            setBacklogValue("idResponsable", usersAdmin[0].id)
            setBacklogValue("id", undefined)
        }

    }
    function handleClickTaskDetails(task: Tasks, idBacklog: number = undefined) {
        setIsOpenModalTask(true);
        if (task) {
            setTaskValue("title", task.title)
            setTaskValue("description", task.description)
            setTaskValue("isBug", task.isBug)
            setTaskValue("idResponsable", task.responsable.id)
            setTaskValue("id", task.id)
            setTaskValue("idBacklog", idBacklog)
        } else {
            setTaskValue("title", "")
            setTaskValue("description", "")
            setTaskValue("isBug", false)
            setTaskValue("idResponsable", usersAdmin[0].id)
            setTaskValue("id", undefined)
            setTaskValue("idBacklog", idBacklog)
        }
    }

    async function handleDeleteBacklog(id: number) {
        if (confirm(`deseja realmente excluir a o backlog ${id}?`)) {
            try {
                await browserAPIRequest.delete(`/backlog/${id}`);
                closeModalBacklog();
                addToast({ title: "Sucesso", description: "Backlog excluido com sucesso", type: "success" })
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao excluir backlog", type: "error" })
            }
        }
    }
    async function handleDeleteTask(id: number) {
        if (confirm(`deseja realmente excluir a task?`)) {
            try {
                await browserAPIRequest.delete(`/task/${id}`);
                closeModalTasks();
                // addToast({ title: "Sucesso", description: "Backlog excluido com sucesso", type: "success" })
            } catch (e) {
                addToast({ title: "Erro", description: "Erro ao excluir task", type: "error" })
            }
        }
    }

    function closeModalBacklog() {
        setIsOpenModalBacklog(false);
    }

    function closeModalTasks() {
        setIsOpenModalTask(false);
    }

    function handleOnDragEnd(result: DropResult, idBoard: number) {
        if (!result.destination) return;
        const { source, destination } = result;
        const usedLeagueBoardIndex = sprint.backlogs.findIndex(element => element.id === idBoard);
        const backlogs = JSON.parse(JSON.stringify(sprint.backlogs));
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = backlogs[usedLeagueBoardIndex].tasks[source.droppableId];
            const destColumn = backlogs[usedLeagueBoardIndex].tasks[destination.droppableId];
            const [removed] = sourceColumn.splice(source.index, 1);
            destColumn.splice(destination.index, 0, removed);
            // console.log(removed.id)
            try {
                browserAPIRequest.patch(`/task/move/${removed.id}`, { "position": Number(destination.droppableId) + 1 })
            } catch {
                addToast({ title: "Erro", description: "Erro ao salvar task", type: "error" })
            }

            setSprint(
                {
                    ...sprint,
                    backlogs
                }
            )
            socket.emit('changeInfo')
        } else {
            const column = backlogs[usedLeagueBoardIndex].tasks[source.droppableId];
            const [removed] = column.splice(source.index, 1);
            column.splice(destination.index, 0, removed);

            setSprint(
                {
                    ...sprint,
                    backlogs
                }
            )

        }
    }

    async function findSprintDetails(id: string) {
        console.log('aqui')
        const details = await browserAPIRequest.get(`/sprint/find/${id}`);
        setSprint(details.data)
    }

    return (
        <DefaultLayout titleKey="Painel de sprints">
            <main className={styles.container}>
                <div>
                    <h1>Painel de sprints</h1>
                    <br />
                </div>
                <div className={styles.content}>
                    <div className={styles.details}>
                        <label>Sprint</label><br />
                        <select defaultValue={sprint.id} className={styles.sprintList} onChange={(e) => { findSprintDetails(e.target.value) }}>
                            {
                                sprintList.map(e => {
                                    return (
                                        <option key={e.id} value={e.id}  >{`${e.id} - ${e.name} (${e.startDate}/${e.expectedEndDate})`}</option>
                                    )
                                }
                                )
                            }
                        </select>

                        <button className={styles.button} onClick={() => handleClickBacklogDetails(undefined)}>Adicionar backlog</button>
                    </div>
                    <div className={styles.board}>
                        {
                            sprint.backlogs.map((backlog, index) => {
                                return (
                                    <div className={styles.backlog} key={index}>
                                        <DragDropContext onDragEnd={result => handleOnDragEnd(result, backlog.id)}>
                                            <div className={styles.title}>
                                                <strong>BL{backlog.id}</strong> <span>{backlog.title}</span>
                                                <span className={styles.responsable}>{backlog.responsable.name}</span>
                                            </div>
                                            <div className={styles.buttons}>
                                                <button onClick={() => handleClickBacklogDetails(backlog)}><FaEye /> Detalhes</button>
                                                <button onClick={() => handleClickTaskDetails(undefined, backlog.id)}><FaPlus /> Task</button>
                                            </div>
                                            <div className={styles.body}>
                                                {
                                                    backlog.tasks.map((columns, index) => {
                                                        return (
                                                            <div className={styles.columns} key={index}>{
                                                                <Droppable droppableId={String(index)} key={String(index)}>
                                                                    {(provided, snapshot) => (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            style={{
                                                                                padding: 3,
                                                                                height: '100%',
                                                                                background: snapshot.isDraggingOver
                                                                                    ? "#eaf2fb"
                                                                                    : "white"
                                                                            }}
                                                                        >
                                                                            {
                                                                                columns.map((task, index) => {
                                                                                    return (
                                                                                        <Draggable
                                                                                            key={task.id}
                                                                                            draggableId={String(task.id)}
                                                                                            index={index}
                                                                                        >
                                                                                            {(provided, snapshot) => (
                                                                                                <div
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    className={styles.task}
                                                                                                    key={task.id}
                                                                                                    onClick={() => handleClickTaskDetails(task)}
                                                                                                >
                                                                                                    <p>{task.isBug && (<FaBug color="red" />)} {task.title}</p>
                                                                                                    <span>{task.responsable.name.split(' ')[0]}</span>
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    )
                                                                                })
                                                                            }
                                                                            {provided.placeholder}
                                                                        </div>

                                                                    )}
                                                                </Droppable>
                                                            }</div>
                                                        )
                                                    })
                                                }

                                            </div>
                                        </DragDropContext>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>


                <ReactModal
                    isOpen={isOpenModalTask}
                    contentLabel="modal backlogs"
                    ariaHideApp={false}
                    onRequestClose={closeModalTasks}
                    shouldCloseOnOverlayClick
                    style={{
                        content: { backgroundColor: '#f2f2f2', marginTop: '3rem' }
                    }}

                >
                    <div className={styles.modal}>
                        <button style={{ float: "right", border: "none", background: "none" }} onClick={closeModalTasks}><FaTimes /></button>
                        <form onSubmit={handleSubmitTask(onSubmitTaskForm)}>
                            <input type="hidden" {...registerTask("id")} />
                            <input type="hidden" {...registerTask("idBacklog")} />
                            <label>Título:</label>
                            <Error message={errorsTask.title?.message} /><br />
                            <input type="text" placeholder="Título" {...registerTask("title", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            <label >Descrição:</label>
                            <Error message={errorsTask.description?.message} />
                            <textarea {...registerTask("description", { required: { value: true, message: "O campo descrição deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo descrição deve ter pelo menos 3 caracteres" }, maxLength: { value: 1000, message: "O campo título deve ter no maximo 1000 caracteres" } })} maxLength={1000} rows={7} />
                            <input type="checkbox" placeholder="Bug" {...registerTask("isBug", {})} />
                            <label>Bug</label><br />
                            <label>Responsável:</label>
                            <Error message={errorsTask.idResponsable?.message} /><br />
                            <select {...registerTask("idResponsable", { required: { value: true, message: "É necessário selecionar um responsável" } })}>
                                {
                                    usersAdmin && (
                                        usersAdmin.map(usr => {
                                            return (<option value={usr.id} key={usr.id}>{`${usr.name} ${usr.surname}`}</option>)
                                        })
                                    )
                                }

                            </select><br />

                            <div className={styles.bottomArea}>
                                {
                                    (getTaskValue("id")) && (
                                        <button className={styles.buttonRed} onClick={() => handleDeleteTask(getTaskValue("id"))} type="button"><FaTrash /></button>
                                    )
                                }
                                <input type="submit" className={styles.button} value="Salvar" ></input>
                            </div>


                        </form>

                    </div>
                </ReactModal>
                <ReactModal
                    isOpen={isOpenModalBacklog}
                    contentLabel="Backlog modal"
                    ariaHideApp={false}
                    onRequestClose={closeModalBacklog}
                    shouldCloseOnOverlayClick
                    style={{
                        content: { backgroundColor: '#f2f2f2', marginTop: '3rem' }
                    }}

                >
                    <div className={styles.modal}>
                        <button style={{ float: "right", border: "none", background: "none" }} onClick={closeModalBacklog}><FaTimes /></button>
                        <form onSubmit={handleSubmitBacklog(onSubmitBacklogForm)}>
                            <input type="hidden" {...registerBacklog("id")} />
                            <label>Título:</label>
                            <Error message={errorsBacklog.title?.message} /><br />
                            <input type="text" placeholder="Título" {...registerBacklog("title", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            <label >Descrição:</label>
                            <Error message={errorsBacklog.description?.message} />
                            <textarea {...registerBacklog("description", { required: { value: true, message: "O campo descrição deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo descrição deve ter pelo menos 3 caracteres" }, maxLength: { value: 1000, message: "O campo título deve ter no maximo 1000 caracteres" } })} maxLength={1000} rows={7} />
                            <label>Responsável:</label>
                            <Error message={errorsBacklog.idResponsable?.message} /><br />
                            <select {...registerBacklog("idResponsable", { required: { value: true, message: "É necessário selecionar um responsável" } })}>
                                {
                                    usersAdmin && (
                                        usersAdmin.map(usr => {
                                            return (<option value={usr.id} key={usr.id}>{`${usr.name} ${usr.surname}`}</option>)
                                        })
                                    )
                                }

                            </select><br />

                            <div className={styles.bottomArea}>
                                {
                                    (getBacklogValue("id")) && (
                                        <button className={styles.buttonRed} onClick={() => handleDeleteBacklog(getBacklogValue("id"))} type="button"><FaTrash /></button>
                                    )
                                }
                                {
                                    // (getBacklogValue("isOpen")) ?? (
                                    //     <button className={styles.buttonRed} onClick={() => handleDeleteBacklog(getBacklogValue("id"))} type="button"><FaTrash /></button>
                                    //     ):(

                                    //         <button className={styles.buttonRed} onClick={() => handleDeleteBacklog(getBacklogValue("id"))} type="button"><FaTrash /></button>
                                    // )
                                }
                                <input type="submit" className={styles.button} value="Salvar" ></input>
                            </div>

                        </form>

                    </div>
                </ReactModal>
            </main >

        </DefaultLayout >
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    resetServerContext()
    const { ['suportewatoken']: token } = parseCookies(ctx);

    if (!token) {
        return {
            redirect: {
                destination: '/login',
                permanent: false
            }
        }
    }

    const apiClient = clientAPIRequest(ctx)

    const sprints = await apiClient.get('/sprint/open');
    const users = await apiClient.get('/user/admin');
    const sprintInicial = await apiClient.get(`/sprint/find/${sprints.data[0].id}`);

    const sprintListFormatted = sprints.data.map(sp => {
        return {
            id: sp.id,
            name: sp.name,
            startDate: format(parseISO(sp.startDate), 'dd MMM yyyy', { locale: ptBR }),
            expectedEndDate: format(parseISO(sp.expectedEndDate), 'dd MMM yyyy', { locale: ptBR }),

        }

    })

    return {
        props: {
            sprintProp: sprintInicial.data,
            sprintList: sprintListFormatted,
            usersAdmin: users.data
        }
    }
}

