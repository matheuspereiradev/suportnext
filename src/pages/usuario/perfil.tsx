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

    const { register, handleSubmit, setValue, setError,getValues, formState: { errors } } = useForm<FormData>();
    const onSubmit = handleSubmit(async ({gender,name,password,password2,surname}) => {
        
        if (password !== password2) {
            setError("password2", {
                type: "manual",
                message: "Senhas não correspondem!",
            });
            return;
        }

        try {
            const data = {
                password,password2,name,gender,surname
            }
            await browserAPIRequest.put('/user', data);
            addToast({ title: "Sucesso", description: "Perfil atualizado com suceso", type: "success" })
            Router.push(`/ticket`);
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
                                <input type="text" placeholder="Nome" {...register("name", { required: { value: true, message: "O campo nome é obrigatório" }, minLength: { value: 4, message: "O campo nome deve ter pelo menos 4 caracteres" }, maxLength: { value: 30, message: "O campo nome deve ter menos de 30 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Sobrenome:</label>
                                <Error message={errors.surname?.message} /><br />
                                <input type="text" placeholder="Sobrenome" {...register("surname", { required: { value: true, message: "O campo sobrenome é obrigatório" }, minLength: { value: 4, message: "O campo sobrenome deve ter pelo menos 4 caracteres" }, maxLength: { value: 30, message: "O campo sobrenome deve ter menos de 30 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Email:</label>
                                <input type="text" placeholder="Email" value={user?.email} disabled={true} />
                            </div>
                            <div className={styles.column}>
                                <label>Sexo:</label><br />
                                <select {...register("gender")}>
                                    <option value="F" selected={true}>Feminino</option>
                                    <option value="M" >Masculino</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.column}>
                                <label>Senha:</label>
                                <Error message={errors.password?.message} /><br />
                                <input type="password" placeholder="Senha" {...register("password", { required: { value: true, message: "O campo senha é obrigatório" }, minLength: { value: 8, message: "O campo senha deve ter pelo menos 8 caracteres" }, maxLength: { value: 15, message: "O campo senha deve ter menos de 15 caracteres" } })} />
                            </div>
                            <div className={styles.column}>
                                <label>Repita sua senha:</label>
                                <Error message={errors.password2?.message} /><br />
                                <input type="password" placeholder="Repita sua senha" {...register("password2", { required: { value: true, message: "O campo de repita sua senha é obrigatório" }})} />
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
