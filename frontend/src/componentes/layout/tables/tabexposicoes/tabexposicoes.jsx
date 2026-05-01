import BtnAddAdmin from "../../btns01/btnaddmin";
import ModalAddExposicao from "../../modais/modaladdexposicao/modaladdexposicao";
import ModalEditExposicoes from "../../modais/modaleditexposicoes/ModalEditExposicoes";
import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { LuFilePen } from "react-icons/lu";
import { HiOutlineFolder } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { podeGerir } from "../../../auth/podegerir/permissao";
import { useAuth } from "../../../auth/userAuth/useauth";

function TabExposicoes() {
    const { user } = useAuth();

    const [showModalExposicao, setShowModalExposicao] = useState(false);
    const [exposicoes, setExposicoes] = useState([]);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [exposicaoSelecionada, setExposicaoSelecionada] = useState(null);

    const navigate = useNavigate();

    function handleOpenEditModal(exposicao) {
        if (!podeGerir(user)) return;
        setExposicaoSelecionada(exposicao);
        setEditModalOpen(true);
    }

    function handleCloseEditModal() {
        setEditModalOpen(false);
        setExposicaoSelecionada(null);
    }

    useEffect(() => {
        const fetchExposicoes = async () => {
            try {
                const res = await api.get("/admin/exposicoes/");
                setExposicoes(Array.isArray(res.data.results) ? res.data.results : res.data);
            } catch (err) {
                console.error("Erro ao carregar exposições", err);
                if (err.response?.status === 401) navigate("/login");
            }
        };

        fetchExposicoes();
    }, [navigate]);

    function handleClick() {
        if (!podeGerir(user)) return;
        setShowModalExposicao(true);
    }

    async function handleDelete(id) {
        if (!podeGerir(user)) return;

        try {
            await api.delete(`/admin/exposicoes/${id}/`);

            setExposicoes(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            console.error("Erro ao eliminar exposição", err);
        }
    }
    
    // 🔥 FORMATADOR DE DATA (UX MELHOR)
    function formatarData(data) {
        if (!data) return "";
        return new Date(data).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }


    return (
        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>

            <div>
                {podeGerir(user) && (
                    <BtnAddAdmin tipo="exposicoes" onClick={handleClick} />
                )}
            </div>

            <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">

                    <thead className="bg-black/5">
                        <tr>
                            <th className="w-[25%] px-5 py-3 text-center">Livro(s)</th>
                            <th className="w-[25%] px-5 py-3 text-center">Descrição</th>
                            <th className="w-[15%] px-5 py-3 text-center">Local</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Início</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Fim</th>
                            {podeGerir(user) && (
                                <th className="w-[15%] px-5 py-3 text-center">Ações</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10">
                        {exposicoes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-red-700">
                                    Nenhuma exposição encontrada.
                                </td>
                            </tr>
                        ) : (
                            exposicoes.map(exposicao => (
                                <tr key={exposicao.id} className="hover:bg-black/3">
                                    <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                        <div className="flex items-center gap-5">
                                            <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <HiOutlineFolder size={30}/> </label>
                                            <label>{exposicao.titulo}</label>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-center">{exposicao.descricao}</td>
                                    <td className="px-5 py-4 text-center">{exposicao.local}</td>
                                    <td className="px-5 py-4 text-center">{formatarData(exposicao.data_inicio)}</td>
                                    <td className="px-5 py-4 text-center">{formatarData(exposicao.data_fim)}</td>

                                    {podeGerir(user) && (
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => handleOpenEditModal(exposicao)}>
                                                    <LuFilePen size={25} className=" cursor-pointer" />
                                                </button>

                                                <button onClick={() => handleDelete(exposicao.id)}>
                                                    <FiTrash2 size={25} className="text-red-700 cursor-pointer" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            </div>

            {showModalExposicao && (
                <ModalAddExposicao onClose={() => setShowModalExposicao(false)} />
            )}

            {editModalOpen && (
                <ModalEditExposicoes
                    exposicoes={exposicaoSelecionada}
                    onClose={handleCloseEditModal}
                    setExposicoes={setExposicoes}
                />
            )}

        </motion.section>
    );
}

export default TabExposicoes;


