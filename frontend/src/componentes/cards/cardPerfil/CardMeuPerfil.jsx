import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AiOutlineMail } from "react-icons/ai";
import { HiOutlineHashtag, HiOutlineLogout } from "react-icons/hi";
import { LuFilePen } from "react-icons/lu";
import ImagemUpload from "./imgPerfil";
import Modal from "../../layout/modais/modal";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ModalEditarPerfil from "../../layout/modais/modaleditarperfil/modalperfilaluno";

function MeuPerfil() {

    const [showModal, setShowModal] = useState(false);
    const [dados, setDados] = useState(null);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("access_token");

    useEffect(() => {
        axios.get("http://localhost:8000/api/accounts/me/", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(res => setDados(res.data))
        .catch(err => {
            console.log("Erro ao buscar perfil", err);
            if (err.response?.status === 401) {
                navigate("/login");
            }
        });
    }, [navigate, token]);

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8000/api/accounts/logout/", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log("Erro no logout");
        }

        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("refresh_token");
        navigate("/login");
    };

    if (!dados) {
        return <div className="p-10 text-center">Carregando perfil...</div>;
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="min-w-sm"
        >
            <section className="relative">
                <article className="bg-[#F86417] h-32 rounded-t-2xl"></article>
                <ImagemUpload />
            </section>

            <div className="w-full bg-white border border-black/17 rounded-b-2xl py-8 pt-14 px-4">

                <section className="flex flex-col gap-2">

                    <div className="flex flex-col">
                        <p className="font-medium text-lg">{dados.aluno.nome_completo}</p>
                        <p className="text-[#000000]/57 py-1 text-sm">
                            {dados.aluno?.curso || "Sem curso definido"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 py-1">

                        <span className="flex items-center gap-2">
                            <AiOutlineMail size={18} className="text-[#F97B17]" />
                            <p className="text-[#000000]/57 text-sm">
                                {dados.email}
                            </p>
                        </span>

                        <span className="flex items-center gap-2">
                            <HiOutlineHashtag size={18} className="text-[#F97B17]" />
                            <p className="text-[#000000]/57 text-sm">
                                Nº Processo: {dados.aluno?.n_processo || "N/A"}
                            </p>
                        </span>

                    </div>

                    <div className="flex justify-between mx-auto gap-10 py-3">

                        <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
                            <label className="text-center">
                                {dados.aluno?.n_reservas}
                            </label>
                            <label className="text-[#000000]/57 text-sm">
                                Reservado
                            </label>
                        </div>

                        <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
                            <label className="text-center">
                                {dados.aluno?.n_emprestimos}
                            </label>
                            <label className="text-[#000000]/57 text-sm">
                                Emprestado
                            </label>
                        </div>

                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full bg-[#F86417] text-white flex items-center py-3 justify-center rounded-lg cursor-pointer"
                        >
                            <LuFilePen size={20} />
                            <p>Editar Perfil</p>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full border border-[#000000]/30 flex items-center justify-center rounded-lg py-3 cursor-pointer"
                        >
                            <HiOutlineLogout size={20} />
                            <p>Sair</p>
                        </button>
                    </div>

                </section>

                {/* {showModal && (
                    <Modal tipo="perfil" onClose={() => setShowModal(false)} />
                )} */}

                {showModal && (
                    <ModalEditarPerfil form={dados.aluno} onClose={() => setShowModal(false)} />
                )}

                {/* {showModal && (
                    <ModalEditarPerfil form={dados.n_processo} onClose={() => setShowModal(false)}/>
                )} */}

            </div>
        </motion.main>
    );
}

export default MeuPerfil;
