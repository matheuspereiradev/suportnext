import { Error } from "@components/error";
import { useToast } from "@contexts/ToastContext";
import { LayoutCloseButton } from "@layouts/LayoutCloseButton";
import { browserAPIRequest, clientAPIRequest } from '@services/api';
import styles from "@styles/dev/sprints/cadastrar.module.scss";
import { format } from 'date-fns';
import { GetServerSideProps } from "next";
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect } from "react";
import { useForm } from 'react-hook-form';
import { Sprint } from "../dashboard";


type FormData = {
    name: string;
    startDate: string;
    expectedEndDate: string;
};

interface props {
    sprint: Sprint
}

export default function SprintEdit({ sprint }: props) {

    const { addToast } = useToast();
    const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>();
    const onSubmit = handleSubmit(async (data) => {
        if (data.expectedEndDate < data.startDate) {
            setError("expectedEndDate", {
                type: "manual",
                message: "data final não pode ser inferior a inicial!",
            });
            return;
        }

        const formatdata = {
            name: data.name,
            startDate: data.startDate + ' 00:00',
            expectedEndDate: data.expectedEndDate + ' 00:00'
        }

        try {
            await browserAPIRequest.put(`/sprint/${sprint.id}`, formatdata);
            addToast({ title: "Sucesso", description: "Sprint editada com sucesso", type: "success" })
            Router.push(`/dev/sprints`);
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao editar a sprint", type: "error" })
        }

    });

    useEffect(() => {
        setValue("name", sprint.name)
        setValue("expectedEndDate", String(sprint.expectedEndDate))
        setValue("startDate", String(sprint.startDate))
    })

    return (
        <LayoutCloseButton titleKey="Editar Sprint">
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Editar Sprint {sprint.id}</h1>
                    <br />
                </div>
                <div className={styles.content}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Nome:</label>
                        <Error message={errors.name?.message} /><br />
                        <input type="text" placeholder="Nome da sprint" {...register("name", { required: { value: true, message: "O campo nome deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo nome deve ter pelo menos 3 caracteres" }, maxLength: { value: 50, message: "O campo nome deve ter menos de 50 caracteres" } })} />

                        <label>Sprint prevista para o período de:</label><br />
                        <Error message={errors.startDate?.message} />
                        <Error message={errors.expectedEndDate?.message} /><br />
                        <div className={styles.value}>
                            <input type="date"
                                className={styles.dateField}
                                {...register("startDate", { required: { value: true, message: "Selecione a data inicial" } })}
                            /><span> e </span>
                            <input type="date"
                                {...register("expectedEndDate", { required: { value: true, message: "Selecione a data final" } })}
                                className={styles.dateField}
                            />
                        </div>

                        <div className={styles.buttonArea}>
                            <input type="submit" className={styles.buttonSave} value="Salvar sprint" ></input>
                        </div>

                    </form>
                </div>

            </main>

        </LayoutCloseButton>
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

    const id = ctx.params.id;

    const apiClient = clientAPIRequest(ctx)

    const { data } = await apiClient.get(`sprint/find/${id}`);

    const dataformated = {
        id: data.id,
        name: data.name,
        startDate: format(new Date(data.startDate), 'yyyy-MM-dd'),
        expectedEndDate: format(new Date(data.expectedEndDate), 'yyyy-MM-dd')
    }


    return {
        props: {
            sprint: dataformated
        }
    }
}
