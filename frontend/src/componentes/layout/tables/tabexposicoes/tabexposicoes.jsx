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

function TabExposicoes()
{
    const { user } = useAuth();

    const [showModalExposicao, setShowModalExposicao] = useState(false);
    const [exposicoes, setExposicoes] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        exposicao: null,
    });
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

        const fetchExposicoes = async() => {
            try{
                const res = await api.get("/livros/gestao-exposicoes/");
                setCategorias(Array.isArray(res.data.results) ? res.data.results : res.data);
            }catch(err){
                console.error("Erro na captura de Categorias", err)
                if (err.response?.status === 401) navigate("/login");
            }
        }
        fetchExposicoes();
    }, [navigate]);


    function handleClick(){
        if (!podeGerir(user)) return;
        setShowModalExposicao(true);
    }

    function openModal(type, exposicao){
        if (!podeGerir(user)) return;
        setModal({open: true, type, exposicao});
    }
    function closeModal(){
        setModal({open:false, type: null, exposicao: null});
    }
    async function handleConfirm() {
        if (!podeGerir(user)) return;

        if(modal.type === "delete"){
            await api.delete(`/livros/gestao-exposicoes/${modal.exposicao.id}/`);
            setExposicoes(prev => prev.filter(e => e.id !== modal.exposicao.id));
            closeModal();
        }
        if(modal.type === "update"){
            setModal({
                open: true,
                type: "update",
                exposicao: modal.exposicao,
            });
        }
        
    }


    return(
        <motion.section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            >
            <div>
                {((podeGerir(user)) && <BtnAddAdmin tipo="exposicoes" onClick={handleClick}/>)}
            </div>
            <div 
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo   
            className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                    <thead className="bg-black/5">
                        <tr>
                            <th className="w-[15%] px-5 py-3 text-center">Livro(s)</th>
                            <th className="w-[25%] px-5 py-3 text-center">Descrição</th>
                            <th className="w-[15%] px-5 py-3 text-center">Local</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Ínico</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Fim</th>
                            {((podeGerir(user)) && <th className="w-[15%] px-5 py-3 text-center">Ações</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {Array.isArray(exposicoes) && exposicoes.length === 0 ?(
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-red-700">
                                    Nenhuma exposição encontrada.
                                </td>
                            </tr>
                        ) : (Array.isArray(exposicoes) && exposicoes.map(exposicao => (
                                <tr className="hover:bg-black/3" key={exposicao.id}>
                                    <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                        <div className="flex items-center gap-5">
                                            <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <HiOutlineFolder size={30}/> </label>
                                            <label>{exposicao.titulo} </label>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {exposicao.descricao} </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {exposicao.local} </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {exposicao.data_inicio} </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {exposicao.data_fim} </td>
                                    {((podeGerir(user)) && 
                                        <td className="px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button  onClick={() => handleOpenEditModal(exposicao)} className="cursor-pointer"> <LuFilePen size={30}/> </button>
                                                <button  onClick={() => openModal("delete", exposicao)} className="cursor-pointer"> <FiTrash2 size={30} className="text-red-700"/> </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                        )))}
                    </tbody>
                </table>
            </div>

            {modal.open && (
                <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                    whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                    viewport={{ once: true }}             // anima apenas uma vez
                    className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-96 md:min-w-lg bg-white shadow-xl rounded-2xl p-6 relative text-start">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir categoria" : "Editar categoria"}
                        </h3>
                        <p>Tem certeza que deseja{" "}
                            {modal.type === "delete" ? " excluir " : " editar "} esta exposição ?
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <button onClick={closeModal} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button onClick={handleConfirm}  type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">Confirmar</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {showModalExposicao && <ModalAddExposicao onClose={() => setShowModalExposicao(false)}/> }
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