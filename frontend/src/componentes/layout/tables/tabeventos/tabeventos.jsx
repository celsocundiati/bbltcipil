import BtnAddAdmin from "../../btns01/btnaddmin";
import ModalAddEvento from "../../modais/modaladdevento/modaladdevento";
import ModalEditEventos from "../../modais/modalediteventos/modalediteventos";
import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { LuFilePen } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { podeGerir } from "../../../auth/podegerir/permissao";
import { useAuth } from "../../../auth/userAuth/useauth";

function TabEventos() {
    const { user } = useAuth();

    const [showModalEvento, setShowModalEvento] = useState(false);
    const [eventos, setEventos] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        evento: null,
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [eventoSelecionada, setEventoSelecionada] = useState(null);
    const navigate = useNavigate();

    // 🔥 FORMATADOR DE DATA (UX MELHOR)
    function formatarData(data) {
        if (!data) return "";
        return new Date(data).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    }

    function handleOpenEditModal(evento) {
        if (!podeGerir(user)) return;
        setEventoSelecionada(evento);
        setEditModalOpen(true);
    }

    function handleCloseEditModal() {
        setEditModalOpen(false);
        setEventoSelecionada(null);
    }

    // 🔥 FETCH CORRIGIDO
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const res = await api.get("/admin/eventos/");

                const data = Array.isArray(res.data.results)
                    ? res.data.results
                    : res.data;

                setEventos(data);

            } catch (err) {
                console.error("Erro ao buscar eventos", err);
            }
        };

        fetchEventos();
    }, [navigate]);

    function handleClick() {
        if (!podeGerir(user)) return;
        setShowModalEvento(true);
    }

    function openModal(type, evento) {
        if (!podeGerir(user)) return;
        setModal({ open: true, type, evento });
    }

    function closeModal() {
        setModal({ open: false, type: null, evento: null });
    }

    async function handleConfirm() {
        if (!podeGerir(user)) return;

        if (modal.type === "delete") {
            try {
                await api.delete(`/admin/eventos/${modal.evento.id}/`);
                setEventos(prev => prev.filter(e => e.id !== modal.evento.id));
            } catch (err) {
                console.error("Erro ao eliminar evento", err);
            }
            closeModal();
        }

        if (modal.type === "update") {
            setModal({
                open: true,
                type: "update",
                evento: modal.evento,
            });
        }
    }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div>
                {(podeGerir(user)) && (
                    <BtnAddAdmin tipo="eventos" onClick={handleClick} />
                )}
            </div>

            <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                    <thead className="bg-black/5">
                        <tr>
                            <th className="w-[15%] px-5 py-3 text-center">Evento</th>
                            <th className="w-[25%] px-5 py-3 text-center">Descrição</th>
                            <th className="w-[15%] px-5 py-3 text-center">Local</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Início</th>
                            <th className="w-[15%] px-5 py-3 text-center">Data Fim</th>
                            {(podeGerir(user)) && (
                                <th className="w-[15%] px-5 py-3 text-center">Ações</th>
                            )}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10">
                        {Array.isArray(eventos) && eventos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-red-700">
                                    Nenhum evento encontrado.
                                </td>
                            </tr>
                        ) : (
                            Array.isArray(eventos) &&
                            eventos.map(ev => (
                                <tr className="hover:bg-black/3" key={ev.id}>
                                    <td className="px-5 py-4 truncate text-black/85">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={ev.capa}
                                                alt={ev.titulo}
                                                className="w-14 h-20 object-cover rounded-md shrink-0"
                                            />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-medium line-clamp-2">
                                                    {ev.titulo}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 truncate text-center text-black/85">
                                        {ev.descricao}
                                    </td>

                                    <td className="px-5 py-4 truncate text-center text-black/85">
                                        {ev.local}
                                    </td>

                                    <td className="px-5 py-4 truncate text-center text-black/85">
                                        {formatarData(ev.data_inicio)}
                                    </td>

                                    <td className="px-5 py-4 truncate text-center text-black/85">
                                        {formatarData(ev.data_fim)}
                                    </td>

                                    {(podeGerir(user)) && (
                                        <td className="px-5 py-4 truncate text-center text-black/85">
                                            <div className="flex gap-2 items-center justify-center">
                                                <button
                                                    onClick={() => handleOpenEditModal(ev)}
                                                    className="cursor-pointer"
                                                >
                                                    <LuFilePen size={30} />
                                                </button>

                                                <button
                                                    onClick={() => openModal("delete", ev)}
                                                    className="cursor-pointer"
                                                >
                                                    <FiTrash2 size={30} className="text-red-700" />
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

            {modal.open && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4"
                >
                    <div className="w-full max-w-96 md:min-w-lg bg-white shadow-xl rounded-2xl p-6 relative text-start">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir evento" : "Editar evento"}
                        </h3>

                        <p>
                            Tem certeza que deseja{" "}
                            {modal.type === "delete" ? "excluir" : "editar"} este evento?
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                onClick={closeModal}
                                type="button"
                                className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={handleConfirm}
                                type="submit"
                                className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {showModalEvento && (
                <ModalAddEvento onClose={() => setShowModalEvento(false)} />
            )}

            {editModalOpen && (
                <ModalEditEventos
                    evento={eventoSelecionada}
                    onClose={handleCloseEditModal}
                    setEventos={setEventos}
                />
            )}
        </motion.section>
    );
}

export default TabEventos;


