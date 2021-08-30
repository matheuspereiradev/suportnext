import styles from "@styles/dev/dashboard/index.module.scss";
import { DefaultLayout } from "@layouts/DefaultLayout"

export default function Dashboard() {

    const sprint = {
        "id": 2,
        "name": "SPRINT 001",
        "startDate": "2021-08-01T03:00:00.000Z",
        "expectedEndDate": "2021-09-01T03:00:00.000Z",
        "isOpen": false,
        "backlogs": [
            {
                "id": 2,
                "title": "Titulao",
                "description": "descriçãooooo",
                "isOpen": false,
                "created_at": "2021-08-28T23:17:32.000Z",
                "responsable": {
                    "id": "8ea39402-fffc-4cd9-9174-db7b22515267",
                    "name": "usuário",
                    "admin": true,
                    "email": "usr@mail.co",
                    "gender": "M",
                    "surname": "senha 123"
                },
                "tasks": [
                    [
                        {
                            "id": 4,
                            "title": "teste",
                            "description": "test",
                            "isBug": true,
                            "doPosition": 1,
                            "created_at": "2021-08-30T19:12:01.000Z",
                            "createdBy": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            },
                            "responsable": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            }
                        }
                    ],
                    [
                        {
                            "id": 3,
                            "title": "string",
                            "description": "string",
                            "isBug": true,
                            "doPosition": 2,
                            "created_at": "2021-08-29T03:18:14.000Z",
                            "createdBy": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            },
                            "responsable": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            }
                        },
                        {
                            "id": 2,
                            "title": "Titulao",
                            "description": "descriçãooooo",
                            "isBug": false,
                            "doPosition": 2,
                            "created_at": "2021-08-29T03:04:21.000Z",
                            "createdBy": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            },
                            "responsable": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            }
                        }
                    ]
                ]
            },
            {
                "id": 3,
                "title": "UC002 - AGUjjjA",
                "description": "fazer akkk agua",
                "isOpen": true,
                "created_at": "2021-08-29T04:04:35.000Z",
                "responsable": {
                    "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                    "name": "matheus",
                    "admin": true,
                    "email": "matheus@mail.com",
                    "gender": "M",
                    "surname": "lima"
                },
                "tasks": [
                    [
                        {
                            "id": 1,
                            "title": "do any thing here abaue abaua oi gatinho teste dimensional layout model. The flexbox layout even works when the size of the",
                            "description": "do it",
                            "isBug": false,
                            "doPosition": 1,
                            "created_at": "2021-08-29T02:35:55.000Z",
                            "createdBy": {
                                "id": "8ea39402-fffc-4cd9-9174-db7b22515267",
                                "name": "usuário",
                                "admin": true,
                                "email": "usr@mail.co",
                                "gender": "M",
                                "surname": "senha 123"
                            },
                            "responsable": {
                                "id": "0fbd9c9c-720d-42fe-9eb9-d9a08aff9b22",
                                "name": "matheus",
                                "admin": true,
                                "email": "matheus@mail.com",
                                "gender": "M",
                                "surname": "lima"
                            }
                        }
                    ]
                ]
            }
        ]
    };

    return (
        <DefaultLayout titleKey="tickets">
            <main className={styles.container}>
                <div>
                    <h1>Painel de sprints</h1>
                    <br />
                </div>
                <div className={styles.content}>
                    <div className={styles.details}>
                        <label>Sprint</label>
                        <select>
                            <option>a</option>
                            <option>b</option>
                        </select>
                        <button>Adicionar backlog</button>
                    </div>
                    <div className={styles.board}>
                        {
                            sprint.backlogs.map(backlog => {
                                return (
                                    <div className={styles.backlog}>
                                        <div className={styles.title}>
                                            <strong>BL{backlog.id}</strong> <span>{backlog.title}</span>
                                            <span className={styles.responsable}>{backlog.responsable.name}</span>
                                        </div>
                                        <div className={styles.body}>
                                            {
                                                backlog.tasks.map(columns => {
                                                    return (
                                                        <div className={styles.columns}>{
                                                            columns.map(task => {
                                                                return (
                                                                    <div className={styles.task}>
                                                                        <p>{task.title}</p>
                                                                        <span>{task.responsable.name.split(' ')[0]}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }</div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div>

                    </div>
                </div>
            </main>

        </DefaultLayout>
    )
}
