import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import api from "../../../service/api/api";

export default function TabMultas() {
    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");
    const [multas, setMultas] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔄 Buscar multas
    const fetchMultas = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (estadoFilter) params.estado = estadoFilter;

            setLoading(true);
            const res = await api.get("/admin/multas/", { params });
            setMultas(res.data);
        } catch (err) {
            console.error("Erro ao buscar multas", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMultas();
    }, [search, estadoFilter]);

    // 💰 Marcar como pago
    const marcarPago = async (id) => {
        try {
            await api.post(`/admin/multas/${id}/pagar/`);
            fetchMultas(); // 🔄 atualiza lista
        } catch (err) {
            console.error("Erro ao pagar multa", err);
        }
    };

    // 🟦 Dispensar
    const dispensarMulta = async (id) => {
        try {
            await api.post(`/admin/multas/${id}/dispensar/`);
            fetchMultas();
        } catch (err) {
            console.error("Erro ao dispensar multa", err);
        }
    };

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
                            placeholder="Busque por usuário..."
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
                        <option value="">Todos os estados</option>
                        <option value="Pendente">Pendente</option>
                        <option value="Dispensado">Dispensado</option>
                        <option value="Pago">Pago</option>
                    </select>
                </div>

            </section>
            <div className="w-full bg-white rounded-2xl px-8 py-5 mb-10">

                <article className="py-5 flex flex-col">
                    <h1 className="text-xl">Lista de Multas</h1>
                    <p className="text-black/70">
                        {loading ? "Carregando..." : `Exibindo ${multas.length} multas`}
                    </p>
                </article>

                <section>
                    <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-black/5">
                            <tr className="transition">
                                <th className="w-[15%] px-5 py-3 text-left">Usuário</th>
                                <th className="w-[9%] px-5 py-3 text-left">Motivo</th>
                                <th className="w-[9%] px-5 py-3 text-left">Valor</th>
                                <th className="w-[10%] px-5 py-3 text-left">Data</th>
                                <th className="w-[11%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[20%] px-5 py-3 text-center">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                        {multas.length === 0 ? (
                            <tr>
                            <td colSpan={6} className="text-center py-10 text-black/50">
                                📭 Nenhuma multa encontrada.
                            </td>
                            </tr>
                        ) : (
                            multas.map((multa) => (
                            <tr key={multa.id} className="hover:bg-black/3 transition">
                                <td className="px-5 py-4 truncate">{multa.usuario_nome || multa.usuario}</td>
                                <td className="px-5 py-4 truncate">{multa.motivo}</td>
                                <td className="px-5 py-4 truncate">{multa.valor} Kz</td>
                                <td className="px-5 py-4 truncate">{new Date(multa.data_criacao).toLocaleDateString()}</td>
                                <td className="px-5 py-4 text-center">
                                    <span className={`px-4 py-1 rounded-2xl text-sm ${
                                    multa.estado === "Pendente"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : multa.estado === "Pago"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}>
                                    {multa.estado}
                                    </span>
                                </td>
                                <td className="px-5 py-4 flex space-x-2 justify-center">
                                    {multa.estado === "Pendente" ? (
                                    <>
                                        <button onClick={() => marcarPago(multa.id)} className="px-3 border cursor-pointer border-black/10 bg-black/5 hover:bg-green-600 hover:text-white rounded-2xl transition">
                                        Marcar Pago
                                        </button>
                                        <button onClick={() => dispensarMulta(multa.id)} className="px-3 border cursor-pointer border-black/10 hover:bg-blue-100 rounded-2xl transition">
                                        Dispensar 
                                        </button>
                                    </>
                                    ) : (
                                    <>
                                        <button className="px-3 border border-black/10 bg-black/5 rounded-2xl transition">
                                            —
                                        </button>
                                        <button className="px-3 border border-black/10 rounded-2xl transition">
                                            —
                                        </button>
                                    </>
                                    )}
                                </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </section>
            </div>
        </motion.section>
    );
}