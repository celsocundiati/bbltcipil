import { useEffect, useState } from "react";
import { obterIniciais } from "../utilitarios/Utils";
import { LuFilePen } from "react-icons/lu";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../../../service/api/api";
import ModalEditAdmin from "../../modais/modaladmineditar/editaradmin";
import { useAuth } from "../../../auth/userAuth/useauth"; 
import Permissao from "../../../auth/hooks/gerir/gerenciamento";

function TabAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [modal, setModal] = useState({ open: false, type: null, adm: null });
    const [editModalOpen, setEditModalOpen] = useState(false); // controle da modal de edição
    const [selectedAdm, setSelectedAdm] = useState(null);       // usuário selecionado para edição
    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");


    const { user } = useAuth(); // usa o logout do AuthContext


    const priv = user?.user || {};

    // ==========================
    // 🔥 BUSCAR DADOS
    // ==========================
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const params = {};
                if (search) params.search = search;
                if (estadoFilter) params.estado = estadoFilter;
                setLoading(true)
                const res = await api.get("admin/users/", { params });
                const data = Array.isArray(res.data.results) ? res.data.results : res.data;
                setAdmins(data);
            } catch (err) {
                console.error("Erro ao buscar admins:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, [search, estadoFilter]);

    // ==========================
    // 🔥 HELPERS
    // ==========================
    const getFuncao = (user) => {
        if (user.is_superuser) return "Superuser";
        if (user.grupos_display?.includes("Admin")) return "Admin";
        if (user.grupos_display?.includes("Bibliotecario")) return "Bibliotecário";
        return "—";
    };

    const getEstado = (user) => (user.is_active ? "Activo" : "Inactivo");

    function openModal(type, adm) {
        if (type === "update") {
            setSelectedAdm(adm);
            setEditModalOpen(true); // abre modal de edição
        } else {
            setModal({ open: true, type, adm });
        }
    }

    function closeModal() {
        setModal({ open: false, type: null, adm: null });
    }

    function closeEditModal() {
        setEditModalOpen(false);
        setSelectedAdm(null);
    }


    async function handleConfirm() {
        try {
            if (modal.type === "delete") {
                await api.delete(`/admin/users/${modal.adm.id}/`);

                // 🔥 Recarregar lista alinhada com backend
                const res = await api.get("admin/users/", {
                    params: { search, estado: estadoFilter },
                });

                const data = Array.isArray(res.data.results)
                    ? res.data.results
                    : res.data;

                setAdmins(data);
            }
        } catch (err) {
            console.error("Erro na ação:", err);
            alert("Erro ao executar ação.");
        } finally {
            closeModal();
        }
    }

    const handleUpdateSuccess = async () => {
        // Atualiza lista de admins após edição sem recarregar a página
        try {

            const res = await api.get("admin/users/", {
                params: { search, estado: estadoFilter },
            });
            const data = Array.isArray(res.data.results) ? res.data.results : res.data;
            console.log(res.data)
            setAdmins(data);
        } catch (err) {
            console.error("Erro ao atualizar lista de admins:", err);
        } finally {
            closeEditModal();
        }
    };
    

    // ==========================
    // 🔥 UI
    // ==========================
    return (
        <motion.main initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-10">

            {/* 🔍 FILTROS */}
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                <div className="w-full">
                    <div className="flex items-center bg-black/5 border rounded-xl focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6]">
                        <FiSearch className="ml-3" size={20} />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Buscar por nome, email ou username..." className="flex-1 px-4 py-2 outline-none bg-transparent"/>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-64">
                    <select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} className="w-full px-3 h-10 rounded-xl border border-black/10 bg-white text-sm focus:ring-2 focus:ring-[#f97b17] outline-none">
                        <option value="">Todos</option>
                        <option value="ativo">Activos</option>
                        <option value="inativo">Inactivos</option>
                    </select>
                </div>
            </section>

            {/* 📊 TABELA */}
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Administradores</label>
                    <label className="text-black/70">{loading ? "Carregando..." : `Total: ${admins.length}`}</label>
                </section>

                <section>
                    <table className="w-full table-fixed border-collapse bg-white shadow rounded-xl overflow-hidden">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[18%] px-5 py-3 text-center">Administrador</th>
                                <th className="w-[15%] px-5 py-3 text-center">Função</th>
                                <th className="w-[12%] px-5 py-3 text-center">Último login</th>
                                <th className="w-[10%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[15%] px-5 py-3 text-center">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                            {admins.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-red-700">Nenhum resultado encontrado.</td>
                                </tr>
                            ) : (
                                admins.map((adm) => (
                                    <tr key={adm.id} className="hover:bg-black/3 transition">
                                        <td className="px-5 py-4 truncate">
                                            <div className="flex items-center gap-3">
                                                <div className="min-w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold">
                                                    {obterIniciais(adm.first_name || adm.username)}
                                                </div>
                                                <div>
                                                    <p>{adm.first_name || adm.username}</p>
                                                    <p className="text-sm text-black/60 truncate">{adm.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 truncate text-center">
                                            <span className={`px-3 py-1 text-center rounded text-sm ${adm.is_superuser ? "bg-purple-500/10 text-purple-500" : "bg-blue-500/10 text-blue-500"}`}>
                                                {getFuncao(adm)}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 truncate text-center">{adm.last_login ? new Date(adm.last_login).toLocaleDateString() : "Nunca"}</td>

                                        <td className="px-5 py-4 truncate justify-center flex items-center text-center">
                                            <span className={`px-3 py-1 rounded text-sm ${adm.is_active ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                                                {getEstado(adm)}
                                            </span>
                                        </td>

                                        <Permissao roles={["Admin"]}>
                                            <td className="px-5 py-4 text-center">
                                                    <div className="flex gap-3 justify-center">
                                                        <button onClick={() => openModal("update", adm)} className="hover:text-black/70 cursor-pointer transition">
                                                            <LuFilePen size={25}/>
                                                        </button>
                                                        <button onClick={() => openModal("delete", adm)} className="text-red-500 hover:text-red-700 cursor-pointer transition">
                                                            <FiTrash2 size={25}/>
                                                        </button>
                                                    </div>
                                            </td>
                                        </Permissao>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>
            </section>

            {/* Modal de Delete */}
            {modal.open && (
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                        <h3 className="text-xl font-semibold mb-2">{modal.type === "delete" ? "Excluir usuário" : "Editar usuário"}</h3>
                        <p className="text-lg">Tem certeza que deseja {modal.type === "delete" ? "excluir" : "editar"} este usuário?</p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
                            <button onClick={handleConfirm} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Modal de Edição */}
            {editModalOpen && selectedAdm && (
                <ModalEditAdmin adm={selectedAdm} onClose={closeEditModal} onSuccess={handleUpdateSuccess} />
            )}

        </motion.main>
    );
}

export default TabAdmins;