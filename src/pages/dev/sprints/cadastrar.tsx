import { Error } from "@components/error";
import { useCategory } from "@contexts/CategoriesContext";
import { useToast } from "@contexts/ToastContext";
import { Company } from "@interfaces/Ticket";
import { LayoutCloseButton } from "@layouts/LayoutCloseButton";
import { browserAPIRequest, clientAPIRequest } from '@services/api';
import styles from "@styles/dev/sprints/cadastrar.module.scss";
import { GetServerSideProps } from "next";
import Router from 'next/router';
import { parseCookies } from 'nookies';
import { useForm } from 'react-hook-form';


type FormData = {
    name: string;
    startDate: string;
    expectedEndDate: string;
};

export default function SprintNew() {

    const { addToast } = useToast();
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>();
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
            const res = await browserAPIRequest.post('/sprint', formatdata);
            addToast({ title: "Sucesso", description: "Sprint cadastrada com sucesso", type: "success" })
            Router.push(`/dev/sprints`);
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao cadastrar a sprint", type: "error" })
        }

    });

    return (
        <LayoutCloseButton titleKey="Nova Sprint">
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Nova Sprint</h1>
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

    // const apiClient = clientAPIRequest(ctx)

    // const companyRequest = await apiClient.get('/company');

    // const companies = companyRequest.data.map(company => {
    //     return {
    //         id: company.id,
    //         name: company.name
    //     }
    // })

    return {
        props: {
            // companies
        }
    }
}
