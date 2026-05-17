import { useEffect, useState } from "react";
import { obterIniciais } from "../utilitarios/Utils";
import { LuFilePen } from "react-icons/lu";
import { FiTrash2, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import api from "../../../service/api/api";
import ModalEditAdmin from "../../modais/modaladmineditar/editaradmin";
import { useAuth } from "../../../auth/userAuth/useauth";
import Permissao from "../../../auth/hooks/gerir/gerenciamento";
import Toast from "../../../usuario/stylenotificacao/toast";

function TabAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAdm, setSelectedAdm] = useState(null);

    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    const [toast, setToast] = useState(null);

    const { user } = useAuth();

    // ==========================
    // BUSCAR DADOS
    // ==========================
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const params = {};
                if (search) params.search = search;
                if (estadoFilter) params.user__is_active = estadoFilter;

                setLoading(true);

                const res = await api.get("admin/users/", { params });

                const data = Array.isArray(res.data.results)
                    ? res.data.results
                    : res.data;

                setAdmins(data);

            } catch (err) {
                setToast({
                    message: "Erro ao carregar utilizadores",
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchAdmins();
    }, [search, estadoFilter]);

    // ==========================
    // HELPERS
    // ==========================
    const getFuncao = (u) => {
        if (u.is_superuser) return "Superuser";
        if (u.grupos_display?.includes("Admin")) return "Admin";
        if (u.grupos_display?.includes("Bibliotecario")) return "Bibliotecário";
        return "—";
    };

    const getEstado = (u) => (u.is_active ? "Activo" : "Inactivo");

    // ==========================
    // PERMISSÃO SEGURA
    // ==========================
    function canManageUser(current, target) {
        const u = current?.user || current;

        const isSuperuser = u?.is_superuser;
        const isAdmin = u?.grupos_display?.includes("Admin");

        if (isSuperuser) return true;

        // Admin NÃO pode mexer em superusers
        if (isAdmin) {
            return !target?.is_superuser;
        }

        return false;
    }

    // ==========================
    // EDIT
    // ==========================
    function openEdit(adm) {
        if (!adm) return;

        if (!canManageUser(user, adm)) {
            return setToast({
                message: "Sem permissão para editar este utilizador",
                type: "error",
            });
        }

        setSelectedAdm(adm);
        setEditModalOpen(true);
    }

    function closeEditModal() {
        setEditModalOpen(false);
        setSelectedAdm(null);
    }

    async function handleUpdateSuccess() {
        try {
            const res = await api.get("admin/users/", {
                params: { search, estado: estadoFilter },
            });

            const data = Array.isArray(res.data.results)
                ? res.data.results
                : res.data;

            setAdmins(data);

            setToast({
                message: "Utilizador atualizado com sucesso",
                type: "success",
            });

        } catch (err) {
            setToast({
                message: "Erro ao atualizar lista",
                type: "error",
            });
        } finally {
            closeEditModal();
        }
    }

    // ==========================
    // DELETE
    // ==========================
    async function handleDelete(adm) {
        if (!adm) return;

        if (!canManageUser(user, adm)) {
            return setToast({
                message: "Sem permissão para eliminar este utilizador",
                type: "error",
            });
        }

        try {
            await api.delete(`/admin/users/${adm.id}/`);

            setAdmins(prev => prev.filter(a => a.id !== adm.id));

            setToast({
                message: "Utilizador eliminado com sucesso",
                type: "success",
            });

        } catch (err) {
            setToast({
                message: "Erro ao eliminar utilizador",
                type: "error",
            });
        }
    }

    // ==========================
    // UI (NÃO ALTERADO)
    // ==========================
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
        >

            {/* FILTROS */}
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">

                <div className="w-full">
                    <div className="flex items-center bg-black/5 border rounded-xl focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6]">
                        <FiSearch className="ml-3" size={20} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Buscar por nome, email ou username..."
                            className="flex-1 px-4 py-2 outline-none bg-transparent"
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-64">
                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        className="w-full px-3 h-10 rounded-xl border border-black/10 bg-white text-sm focus:ring-2 focus:ring-[#f97b17] outline-none"
                    >
                        <option value={null}>Todos</option>
                        <option value= {true}>Activos</option>
                        <option value={false}>Inactivos</option>
                    </select>
                </div>

            </section>

            {/* TABELA */}
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">

                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Administradores</label>
                    <label className="text-black/70">
                        {loading ? "Carregando..." : `Total: ${admins.length}`}
                    </label>
                </section>

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
                                <td colSpan={5} className="text-center py-4 text-red-700">
                                    Nenhum resultado encontrado.
                                </td>
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
                                                <p className="text-sm text-black/60 truncate">
                                                    {adm.email}
                                                </p>
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        {getFuncao(adm)}
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        {adm.last_login
                                            ? new Date(adm.last_login).toLocaleDateString()
                                            : "Nunca"}
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        {getEstado(adm)}
                                    </td>

                                    <Permissao roles={["Admin"]}>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex gap-3 justify-center">

                                                {canManageUser(user, adm) && (
                                                    <button className="cursor-pointer" onClick={() => openEdit(adm)}>
                                                        <LuFilePen size={25} />
                                                    </button>
                                                )}

                                                {canManageUser(user, adm) && (
                                                    <button
                                                        onClick={() => handleDelete(adm)}
                                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                                    >
                                                        <FiTrash2 size={25} />
                                                    </button>
                                                )}

                                            </div>
                                        </td>
                                    </Permissao>

                                </tr>
                            ))
                        )}

                    </tbody>

                </table>

            </section>

            {/* MODAL */}
            {editModalOpen && selectedAdm && (
                <ModalEditAdmin
                    adm={selectedAdm}
                    onClose={closeEditModal}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            {/* TOAST */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

        </motion.main>
    );
}

export default TabAdmins;


