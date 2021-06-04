import Head from "next/head";
import { GetServerSideProps } from "next";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/novo.module.scss";
import { parseCookies } from 'nookies';
import { browserAPIRequest, clientAPIRequest } from '../../services/api';
import { FaCheckCircle, FaSave } from "react-icons/fa";
import { useForm } from 'react-hook-form';

interface Company {
    id: number,
    name: string,
}

interface Category {
    id: number,
    name: string,
}

interface TicketNewPros {
    companies: Array<Company>,
    categories: Array<Category>

}

type FormData = {
    title: string;
    description: string;
    category: number;
    company: number;
};

export default function TicketNew({ companies, categories }: TicketNewPros) {

    const { user } = useAuth();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    // const onSubmit = data => console.log(data);
    const onSubmit = handleSubmit(async (data) => {
        const api = await browserAPIRequest.post('/ticket',data);
        console.log(api)
    });
    console.log(errors);

    return (
        <>
            <Head>
                <title>WA Suporte - Tickets</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <meta name="copyright" content="WA" />
                <meta name="language" content="PT-BR" />
                <meta name="author" content="matheuspereiradev, matheuslima20111997@gmail.com" />
            </Head>
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Novo Ticket</h1>
                    <br />
                </div>
                <div className={styles.content}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label>Título:</label><br />
                        <input type="text" placeholder="Título" {...register("title", { required: true, min: 3, maxLength: 100 })} />
                        <label >Descrição:</label><br />
                        <textarea {...register("description", { required: true, min: 3, maxLength: 1000 })} maxLength={1000} rows={7} />
                        <label>Categoria:</label><br />
                        <select {...register("category", { required: true })}>
                            {
                                categories && (
                                    categories.map(cat => {
                                        return (<option value={cat.id} key={cat.id}>{cat.name}</option>)
                                    })
                                )
                            }

                        </select><br />
                        <label>Empresa:</label><br />
                        <select {...register("company", { required: true })}>
                            {
                                companies && (
                                    companies.map(com => {
                                        return (<option value={com.id} key={com.id}>{com.name}</option>)
                                    })
                                )

                            }
                        </select>
                        <div className={styles.buttonArea}>
                            <input type="submit" className={styles.buttonSaveTicket} value="Abrir ticket" ></input>
                        </div>

                    </form>
                </div>
            </main>

        </>
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

    const companyRequest = await apiClient.get('/company');

    const companies = companyRequest.data.map(company => {
        return {
            id: company.id,
            name: company.name
        }
    })

    const categoryRequest = await apiClient.get('/ticket/category');

    const categories = categoryRequest.data.map(category => {
        return {
            id: category.id,
            name: category.name
        }
    })




    return {
        props: {
            companies,
            categories
        }
    }
}
