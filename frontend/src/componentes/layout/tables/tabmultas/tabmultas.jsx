import { useEffect, useState } from "react";
import api from "../../../service/api/api";

export default function TabMultas() {
    const [multas, setMultas] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🔄 Buscar multas
    const fetchMultas = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin/multas/");
            setMultas(res.data);
        } catch (err) {
            console.error("Erro ao buscar multas", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMultas();
    }, []);

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
        <section>
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
                                <th className="w-[12%] px-5 py-3 text-left">Usuário</th>
                                <th className="w-[9%] px-5 py-3 text-left">Motivo</th>
                                <th className="w-[9%] px-5 py-3 text-left">Descrição</th>
                                <th className="w-[9%] px-5 py-3 text-left">Valor</th>
                                <th className="w-[10%] px-5 py-3 text-left">Data</th>
                                <th className="w-[11%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[20%] px-5 py-3 text-center">Acções</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                        {multas.length === 0 ? (
                            <tr>
                            <td colSpan={7} className="text-center py-10 text-black/50">
                                📭 Nenhuma multa encontrada.
                            </td>
                            </tr>
                        ) : (
                            multas.map((multa) => (
                            <tr key={multa.id} className="hover:bg-black/3 transition">
                                <td className="px-5 py-4 truncate">{multa.usuario_nome || multa.usuario}</td>
                                <td className="px-5 py-4 truncate">{multa.motivo}</td>
                                <td className="px-5 py-4 truncate">{multa.descricao}</td>
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
                                <td className="px-5 py-4 flex space-x-2">
                                    {multa.estado === "Pendente" && (
                                    <>
                                        <button onClick={() => marcarPago(multa.id)} className="px-3 border border-black/10 bg-black/5 hover:bg-green-600 hover:text-white rounded-2xl transition">
                                        Marcar Pago
                                        </button>
                                        <button onClick={() => dispensarMulta(multa.id)} className="px-3 border border-black/10 hover:bg-blue-100 rounded-2xl transition">
                                        Dispensar
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
        </section>
    );
}