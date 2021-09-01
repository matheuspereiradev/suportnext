import styles from "@styles/dev/dashboard/index.module.scss";
import { DefaultLayout } from "@layouts/DefaultLayout"
import { browserAPIRequest, clientAPIRequest } from "@services/api";
import { parseCookies } from "nookies";
import { GetServerSideProps } from "next";
import { format, parseISO } from 'date-fns';
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { FaEye, FaPlus } from "react-icons/fa";

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

interface Sprint {
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
}

export default function Dashboard({ sprintProp, sprintList }: DashboardListPros) {

    const [sprint, setSprint] = useState<Sprint>(sprintProp);

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

            setSprint(
                {
                    ...sprint,
                    backlogs
                }
            )

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

    async function findSprintDetails(id: number) {
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
                        <select className={styles.sprintList} defaultValue={sprint.id} onChange={() => findSprintDetails}>
                            {
                                sprintList.map(
                                    sp => <option key={sp.id} value={sp.id}>{`${sp.id} - ${sp.name} (${sp.startDate}/${sp.expectedEndDate})`}</option>
                                )
                            }
                        </select>
                        <button className={styles.button}>Adicionar backlog</button>
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
                                                <button><FaEye /> Detalhes</button>
                                                <button><FaPlus /> Task</button>
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
                                                                                                >
                                                                                                    <p>{task.title}</p>
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
            </main >

        </DefaultLayout >
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

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
            sprintList: sprintListFormatted
        }
    }
}

