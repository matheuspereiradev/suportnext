import Head from "next/head";
import { GetServerSideProps } from "next";
import { useAuth } from "../../contexts/AuthContext";
import styles from "../../styles/ticket/novo.module.scss";
import { parseCookies } from 'nookies';
import { browserAPIRequest, clientAPIRequest } from '../../services/api';
import { FaCheckCircle, FaSave } from "react-icons/fa";
import { useForm } from 'react-hook-form';
import { useState } from "react";
import { Error } from "../../components/error";
import Router from 'next/router'
import { useToast } from "../../contexts/ToastContext";
import { Company } from "../../interfaces/Ticket";
import { useCategory } from "../../contexts/CategoriesContext";


interface TicketNewPros {
    companies: Array<Company>
}

type FormData = {
    title: string;
    description: string;
    category: number;
    company: number;
};

export default function TicketNew({ companies }: TicketNewPros) {

    const { addToast } = useToast();
    const { categories } = useCategory();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const onSubmit = handleSubmit(async (data) => {
        try{
            const res = await browserAPIRequest.post('/ticket',data);
            addToast({title:"Sucesso",description:"Ticket cadastrado com sucesso",type:"success"})
            Router.push(`/ticket/${res.data.id}`);
        }catch(e){
            addToast({title:"Erro",description:"Erro ao cadastrar o ticket",type:"error"})
        }
        
    });

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
                        <label>Título:</label>
                        <Error message={errors.title?.message}/><br />
                        <input type="text" placeholder="Título" {...register("title", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                        <label >Descrição:</label>
                        <Error message={errors.description?.message}/><br/>
                        <textarea {...register("description", { required: { value: true, message: "O campo descrição deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo descrição deve ter pelo menos 3 caracteres" }, maxLength: { value: 1000, message: "O campo título deve ter no maximo 1000 caracteres" } })} maxLength={1000} rows={7} />
                        <label>Categoria:</label>
                        <Error message={errors.category?.message}/><br/>
                        <select {...register("category", { required: { value: true, message: "É necessário selecionar uma categoria" } })}>
                            {
                                categories && (
                                    categories.map(cat => {
                                        return (<option value={cat.id} key={cat.id}>{cat.name}</option>)
                                    })
                                )
                            }

                        </select><br />
                        <label>Empresa:</label>
                        <Error message={errors.company?.message}/><br/>
                        <select {...register("company", { required: { value: true, message: "É necessário selecionar uma empresa" } })}>
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
                            <input type="button" className={styles.buttonCancelTicket} value="X" onClick={()=>{Router.push('/ticket')}}/>
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

    return {
        props: {
            companies
        }
    }
}
