import { GetServerSideProps } from "next";
import styles from "@styles/usuario/perfil.module.scss";
import { parseCookies } from 'nookies';
import { browserAPIRequest, clientAPIRequest } from '@services/api';
import { useForm } from 'react-hook-form';
import { Error } from "@components/error";
import Router from 'next/router'
import { useToast } from "@contexts/ToastContext";
import { DefaultLayout } from "@layouts/DefaultLayout";
import { useAuth } from "@contexts/AuthContext";
import { useEffect } from "react";
import { LayoutCloseButton } from "@layouts/LayoutCloseButton";

type FormData = {
    name: string;
    surname: string;
    gender: string;
    password: string;
    password2: string;
};

export default function Perfil() {

    const { user } = useAuth();
    const { addToast } = useToast();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
    const onSubmit = handleSubmit(async (data) => {
        try {
            const res = await browserAPIRequest.put('/user', data);
            addToast({ title: "Sucesso", description: "Perfil atualizado com suceso", type: "success" })
            Router.push(`/ticket/${res.data.id}`);
        } catch (e) {
            addToast({ title: "Erro", description: "Erro ao atualizar perfil", type: "error" })
        }

    });

    useEffect(() => {
        if (user) {
            setValue("name", user.name)
            setValue("surname", user.surname)
            setValue("gender", user.gender)
        }
    }, [user])

    return (
        <LayoutCloseButton titleKey="perfil">
            <main className={styles.container}>
                <div className={styles.header}>
                    <h1>Editar perfil</h1>
                    <hr />
                    <br />
                </div>
                <div className={styles.content}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label>Nome:</label>
                                <Error message={errors.name?.message} /><br />
                                <input type="text" placeholder="Nome" {...register("name", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Sobrenome:</label>
                                <Error message={errors.name?.message} /><br />
                                <input type="text" placeholder="Sobrenome" {...register("surname", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Email:</label>
                                <input type="text" placeholder="Email" value={user?.email} disabled={true}/>
                            </div>
                            <div className={styles.column}>
                                <label>Sexo:</label><br />
                                <select>
                                    <option value="F" selected={user?.gender === "F"}>Feminino</option>
                                    <option value="M" selected={user?.gender === "M"}>Masculino</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label>Senha:</label>
                                <Error message={errors.password?.message} /><br />
                                <input type="password" placeholder="Senha" {...register("password", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Repita sua senha:</label>
                                <Error message={errors.password2?.message} /><br />
                                <input type="password" placeholder="Repita sua senha" {...register("password2", { required: { value: true, message: "O campo título deve ter pelo menos 3 caracteres" }, minLength: { value: 3, message: "O campo título deve ter pelo menos 3 caracteres" }, maxLength: { value: 100, message: "O campo título deve ter menos de 100 caracteres" } })} />
                            </div>
                        </div>

                        <div className={styles.buttonArea}>
                            <input type="submit" className={styles.buttonSave} value="Salvar alterações" ></input>
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

    return {
        props: {}
    }
}
