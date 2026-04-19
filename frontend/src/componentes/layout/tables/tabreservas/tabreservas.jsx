import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import api from "../../../service/api/api";
import ModalAprovarEmprestimo from "../../modais/modalaprovaremprestimo/modalaprovaremprestimo";
import Permissao from "../../../auth/hooks/gerir/gerenciamento";

function TabelaReservas() {

    const [idDestacado, setIdDestacado] = useState(null);
    const [reservas, setReservas] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    // ==========================
    // 🔹 STATUS UI
    // ==========================
    const statusConf = {
        em_uso: { label: "Em uso", style: "bg-green-100 text-green-600 border-green-200" },
        reservado: { label: "Reservado", style: "bg-orange-100 text-orange-700 border-orange-200" },
        pendente: { label: "Pendente", style: "bg-yellow-100 text-yellow-800 border-yellow-200" },
        finalizada: { label: "Finalizada", style: "bg-gray-100 text-gray-700 border-gray-200" },
        expirada: { label: "Expirada", style: "bg-gray-100 text-gray-700 border-gray-200" },
        aprovada: { label: "Aprovada", style: "bg-blue-100 text-blue-600 border-blue-200" },
    };

    // ==========================
    // 🔹 BUSCAR RESERVAS (REFATORADO)
    // ==========================
    const fetchReservas = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (estadoFilter) params.estado = estadoFilter;

            const res = await api.get("admin/reservas/", { params });

            const data = Array.isArray(res.data.results)
                ? res.data.results
                : res.data;

            setReservas(data);

        } catch (err) {
            console.error("Erro ao buscar reservas", err);

            if (err.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    // ==========================
    // 🔥 USEEFFECT LIMPO
    // ==========================
    useEffect(() => {
        fetchReservas();
    }, [search, estadoFilter, navigate]);

    // ==========================
    // 🔹 PROMISE ACTIONS
    // ==========================
    const aprovarReserva = (id) =>
        api.post(`admin/reservas/${id}/aprovar/`);

    const finalizarReserva = (id) =>
        api.post(`admin/reservas/${id}/finalizar/`);

    // ==========================
    // 🔹 HANDLERS (AGORA CORRETOS)
    // ==========================
    const handleAprovar = async (id) => {
        try {
            await aprovarReserva(id);
            await fetchReservas(); // 🔥 REFRESH REAL DO BACKEND
        } catch (err) {
            console.error(err);
            alert("Erro ao aprovar reserva");
        }
    };

    const handleFinalizar = async (id) => {
        try {
            await finalizarReserva(id);
            await fetchReservas(); // 🔥 REFRESH REAL DO BACKEND
        } catch (err) {
            console.error(err);
            alert("Erro ao finalizar reserva");
        }
    };
    
    const handleEmprestar = (reserva) => {
        if (!podeEmprestar(reserva)) {
            alert("Usuário da reserva não tem perfil de funcionário.");
            return;
        }
        setReservaSelecionada(reserva);
    };

    // ==========================
    // 🔹 HASH SCROLL
    // ==========================
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace("#reserva-", "");
            setIdDestacado(id);

            setTimeout(() => {
                const el = document.getElementById(`reserva-${id}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300);
        }
    }, [location, reservas]);


    // ==========================
    // 🔹 VERIFICAÇÃO DE PERFIL DO USUÁRIO DA RESERVA
    // ==========================
    const podeEmprestar = (reserva) => {
        return reserva.estado === "reservado" && reserva.usuario_grupos?.includes("Funcionario");
    };

    const podeFinalizar = (reserva) => {
        return reserva.estado === "em_uso" && reserva.usuario_grupos?.includes("Funcionario");
    };

    // ==========================
    // 🔹 RENDERIZAÇÃO AÇÃO PRINCIPAL
    // ==========================
    const renderAcaoPrincipal = (reserva) => {
        return (
            <Permissao roles={["Admin", "Bibliotecario"]}>
                {(() => {
                    switch (reserva.estado) {
                        case "pendente":
                            return <span className="text-gray-500">—</span>;

                        case "reservado":
                            return (
                                <button
                                    onClick={() => handleAprovar(reserva.id)}
                                    className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                            bg-blue-100 text-blue-600 border border-blue-200
                                            hover:bg-blue-200 transition"
                                >
                                    Aprovar Uso
                                </button>
                            );

                        case "em_uso":
                            return podeFinalizar(reserva) ? (
                                <button
                                    onClick={() => handleFinalizar(reserva.id)}
                                    className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                            bg-green-100 text-green-600 border border-green-200
                                            hover:bg-green-200 transition"
                                >
                                    Finalizar
                                </button>
                            ) : <span className="text-gray-500">—</span>;

                        default:
                            return <span className="text-gray-500">—</span>;
                    }
                })()}
            </Permissao>
        );
    };

    // ==========================
    // 🔹 RENDER
    // ==========================
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
        >
            {/* 🔍 Filtros */}
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                <div className="w-full">
                    <div className="flex items-center bg-black/5 border rounded-xl relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition">
                        <button className="px-2 py-1.5"><FiSearch size={22} /></button>
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="Busque por livro, usuário, estado..."
                            className="flex-1 px-4 py-1.5 outline-none"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full md:w-64">
                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        className="w-full px-3 h-10 rounded-xl cursor-pointer border border-black/10 bg-white text-sm focus:ring-2 focus:ring-[#f97b17] outline-none"
                    >
                        <option value="">Todos os estados</option>
                        <option value="pendente">Pendente</option>
                        <option value="reservado">Reservado</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="finalizada">Finalizada</option>
                    </select>
                </div>
            </section>

            {/* 📊 Tabela */}
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <div className="py-5">
                    <h2 className="text-xl font-medium">Lista de Reservas</h2>
                    <span className="text-black/70">Total: {reservas.length}</span>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[25%] px-5 py-3 text-center">Livro</th>
                                <th className="w-[20%] px-5 py-3 text-center">Usuário</th>
                                <th className="px-5 py-3 text-center">Data</th>
                                <th className="px-5 py-3 text-center">Estado</th>
                                <th className="px-5 py-3 text-center">Retirada</th>
                                <th className="px-5 py-3 text-center">Emprestar</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                            {reservas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-red-700">
                                        Nenhuma reserva encontrada.
                                    </td>
                                </tr>
                            ) : (
                                [...reservas].sort((a, b) => b.id - a.id).map(reserva => {
                                    const config = statusConf[reserva.estado] || { label: reserva.estado, style: "bg-gray-100 text-gray-700 border-gray-200" };
                                    return (
                                        <tr key={reserva.id} id={`reserva-${reserva.id}`}
                                            className={`transition-colors ${idDestacado === String(reserva.id) ? "bg-[#f97b17]/20 text-black font-medium" : "hover:bg-gray-100"}`}
                                            onClick={() => setIdDestacado(null)}
                                        >
                                            <td className="px-5 py-4 text-center truncate">{reserva?.livro_nome}</td>
                                            <td className="px-5 py-4 text-center truncate">{reserva?.usuario_nome || "Nenhum"}</td>
                                            <td className="px-5 py-4 text-center">{reserva.data_formatada}</td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${config.style}`}>
                                                    {config.label}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-center">{renderAcaoPrincipal(reserva)}</td>
                                            <td className="px-5 py-4 text-center">
                                                {podeEmprestar(reserva) ? (
                                                    
                                                    <Permissao roles={["Admin", "Bibliotecario"]}>
                                                        <button
                                                            onClick={() => handleEmprestar(reserva)}
                                                            className="px-3 py-1 rounded-full text-sm font-medium
                                                                    bg-green-100 text-green-700 border border-green-200
                                                                    hover:bg-green-200 transition cursor-pointer"
                                                        >
                                                            Solicitar Empréstimo
                                                        </button>
                                                    </Permissao>
                                                    
                                                ) : <span className="text-gray-500">—</span>}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {reservaSelecionada && (
                    <ModalAprovarEmprestimo
                        reserva={reservaSelecionada}
                        onClose={() => setReservaSelecionada(null)}

                        onSave={async () => {
                            await fetchReservas(); // 🔥 sincroniza depois do empréstimo
                            setReservaSelecionada(null);
                        }}
                    />
                )}
            </section>
        </motion.main>
    );
}

export default TabelaReservas;