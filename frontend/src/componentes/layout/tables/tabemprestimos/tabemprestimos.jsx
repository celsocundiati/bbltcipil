import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../../service/api/api";

function TabelaEmprestimos() {

    const [emprestimos, setEmprestimos] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        emprestimo: null,
    });

    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [idDestacado, setIdDestacado] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    // 🔹 Buscar empréstimos
    useEffect(() => {
        const fetchEmprestimos = async () => {
            try {
                const params = {};
                if (search) params.search = search;
                if (estadoFilter) params.acoes = estadoFilter;

                const res = await api.get("/admin/emprestimos/", { params });

                setEmprestimos(
                    Array.isArray(res.data.results)
                        ? res.data.results
                        : res.data
                );

            } catch (err) {
                console.error("Erro ao buscar empréstimos", err);
                if (err.response?.status === 401) navigate("/login");
            }
        };

        fetchEmprestimos();
    }, [search, estadoFilter, navigate]);

    // 🔹 Destacar via hash (#reserva-10)
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#emprestimo-", "");
            setIdDestacado(id);

            setTimeout(() => {
                const el = document.getElementById(`emprestimo-${id}`);
                if (el) {
                    el.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 300);
        }
    }, [location, emprestimos]);

    // 🔹 Atualizar devolução
    const atualizarDevolucao = async (emprest, novoEstado) => {
        try {
            await api.patch(`/admin/emprestimos/${emprest.id}/`, {
                acoes: novoEstado,
            });

            setEmprestimos(prev =>
                prev.map(e =>
                    e.id === emprest.id ? { ...e, acoes: novoEstado } : e
                )
            );

            closeModal();

        } catch (error) {
            console.error("Erro ao atualizar estado", error);
            alert("Erro ao atualizar estado.");
        }
    };

    function openModal(type, emprestimo) {
        setModal({ open: true, type, emprestimo });
    }

    function closeModal() {
        setModal({ open: false, type: null, emprestimo: null });
    }

    // async function handleConfirm() {
    //     if (modal.type === "delete") {
    //         await api.delete(`/admin/emprestimos/${modal.emprestimo.id}/`);

    //         setEmprestimos(prev =>
    //             prev.filter(item => item.id !== modal.emprestimo.id)
    //         );

    //         closeModal();
    //     }
    // }

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
        >

            {/* 🔍 Filtros */}
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">

                <div className="w-full">
                    <div className="flex items-center bg-black/5 border rounded-xl relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition">

                        <button className="px-2 py-1.5">
                            <FiSearch size={22} />
                        </button>

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Busque por livro, usuário, estado..."
                            className="flex-1 px-4 py-1.5 outline-none"
                        />
                    </div>
                </div>

                <div className="w-full md:w-64">
                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#f97b17] outline-none cursor-pointer"
                    >
                        <option value="">Todos</option>
                        <option value="ativo">Ativo</option>
                        <option value="atrasado">Atrasado</option>
                        <option value="devolvido">Devolvido</option>
                    </select>
                </div>

            </section>

            {/* 📊 Tabela */}
            <section className="w-full bg-white rounded-2xl px-8 py-5">
                <h2 className="text-xl font-medium mb-4">
                    Lista de Empréstimos ({emprestimos.length})
                </h2>

                <table className="w-full border rounded-xl overflow-hidden">
                    <thead className="bg-black/5">
                        <tr>
                            <th className="py-2 text-center">Livro</th>
                            <th className="py-2 text-center">Usuário</th>
                            <th className="py-2 text-center">Reserva</th>
                            <th className="py-2 text-center">Empréstimo</th>
                            <th className="py-2 text-center">Devolução</th>
                            <th className="py-2 text-center">Estado</th>
                            <th className="py-2 text-center">Ação</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10">
                        {emprestimos.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-red-600">
                                    Nenhum empréstimo encontrado.
                                </td>
                            </tr>
                        ) : (
                            [...emprestimos]
                                .sort((a, b) => b.id - a.id)
                                .map((e) => (
                                    <tr
                                        key={e.id}
                                        id={`reserva-${e.id}`}
                                        className={`${
                                            idDestacado === String(e.id)
                                                ? "bg-[#f97b17]/20"
                                                : "hover:bg-gray-100"
                                        }`}
                                    >
                                        <td className="text-center py-4">{e.livro_nome}</td>
                                        <td className="text-center">{e.usuario_nome}</td>
                                        <td className="text-center">{e.reserva}</td>
                                        <td className="text-center">{e.data_emprestimo}</td>
                                        <td className="text-center">{e.data_devolucao}</td>

                                        <td className="text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm ${
                                                e.acoes === "ativo"
                                                    ? "bg-green-100 text-green-700"
                                                    : e.acoes === "devolvido"
                                                    ? "bg-gray-200 text-gray-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}>
                                                {e.acoes}
                                            </span>
                                        </td>

                                        <td className="text-center">
                                            <button
                                                onClick={(ev) => {
                                                    ev.stopPropagation();
                                                    openModal("devolver", e);
                                                }}
                                                className="px-3 py-1 bg-green-100 text-green-600 rounded-full cursor-pointer"
                                            >
                                                {e.acoes === "devolvido" ? "—" : "Devolver"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </section>

            {/* 🔥 Modal */}
            {modal.open && (
                <div className="fixed inset-0 z-50 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">

                        <h3 className="text-lg font-semibold mb-2">
                            Confirmar ação
                        </h3>

                        <p>Deseja devolver este livro?</p>

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={closeModal} className="px-3 py-2 bg-gray-200 rounded cursor-pointer">
                                Cancelar
                            </button>

                            <button
                                onClick={() =>
                                    atualizarDevolucao(modal.emprestimo, "devolvido")
                                }
                                className="px-3 py-2 bg-green-500 text-white rounded cursor-pointer"
                            >
                                Confirmar
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </motion.section>
    );
}

export default TabelaEmprestimos;