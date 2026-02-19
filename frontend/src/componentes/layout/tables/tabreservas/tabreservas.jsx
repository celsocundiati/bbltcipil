import { useState, useEffect } from "react";
import axios from "axios";
import ModalAprovarEmprestimo from "../../modais/modalaprovaremprestimo/modalaprovaremprestimo";
import { useLocation } from "react-router-dom";

function TabelaReservas() {

    const { hash } = useLocation();
    const [idDestacado, setIdDestacado] = useState(null);

    useEffect(() => {
        if (hash) {
        const id = hash.replace('#reserva-', '');
        setIdDestacado(id);

        // 1. Rolar até o elemento
        const elemento = document.getElementById(`reserva-${id}`);
        if (elemento) {
            elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 2. Timer para remover o destaque após 1 minuto (60000ms)
        const timer = setTimeout(() => {
            setIdDestacado(null);
        }, 60000);

        return () => clearTimeout(timer); // Limpa o timer se o componente desmontar
        }
    }, [hash]);

    const statusConf = {
        aprovada: {
            label: "Aprovada",
            style: "bg-green-100 text-green-600 border-green-200",
        },
        reservado: {
            label: "Reservado",
            style: "bg-blue-100 text-blue-600 border-blue-200",
        },
        pendente: {
            label: "Pendente",
            style: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
        finalizada: {
            label: "Finalizada",
            style: "bg-gray-100 text-gray-700 border-gray-200",
        },
        cancelado: {
            label: "Cancelado",
            style: "bg-red-100 text-red-600 border-red-200",
        },
    };

    const [reservas, setReservas] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8000/api/admin/reservas/")
            .then(res => {
                const data = Array.isArray(res.data.results)
                    ? res.data.results
                    : res.data;
                setReservas(data);
            })
            .catch(err => console.error("Erro ao buscar reservas", err));
    }, []);

    const atualizarEstado = async (reserva, novoEstado) => {
        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/admin/reservas/${reserva.id}/`,
                { estado: novoEstado }
            );

            setReservas(prev =>
                prev.map(r =>
                    r.id === reserva.id
                        ? { ...r, estado: novoEstado }
                        : r
                )
            );
        } catch (error) {
            console.error("Erro ao atualizar estado", error);
            alert("Erro ao atualizar estado.");
        }
    };

    const handleEmprestar = (reserva) => {
        if (reserva.estado !== "reservado") {
            alert("A reserva precisa estar como 'reservado'.");
            return;
        }
        setReservaSelecionada(reserva);
    };

    const renderAcaoPrincipal = (reserva) => {
        switch (reserva.estado) {
            case "pendente":
                return (
                    <button
                        onClick={() => atualizarEstado(reserva, "reservado")}
                        className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                        bg-blue-100 text-blue-700 border border-blue-200
                        hover:bg-blue-200 transition-colors"
                    >
                        Aprovar
                    </button>
                );

            case "reservado":
                return (
                    <button
                        onClick={() => atualizarEstado(reserva, "pendente")}
                        className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                        bg-red-100 text-red-600 border border-red-200
                        hover:bg-red-200 transition-colors"
                    >
                        Cancelar
                    </button>
                );

            default:
                return (
                    <span className="text-gray-500 font-medium">
                        —
                    </span>
                );
        }
    };

    return (
        <main>
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">

                <section className="py-5 flex flex-col">
                    <h2 className="text-xl font-semibold">Lista de Reservas</h2>
                    <span className="text-black/70">
                        Total: {reservas.length}
                    </span>
                </section>

                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="px-5 py-3 text-center">ID</th>
                                <th className="px-5 py-3 text-center">Livro</th>
                                <th className="px-5 py-3 text-center">Estudante</th>
                                <th className="px-5 py-3 text-center">Data</th>
                                <th className="px-5 py-3 text-center">Estado</th>
                                <th className="px-5 py-3 text-center">Ação</th>
                                <th className="px-5 py-3 text-center">Emprestar</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {reservas.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-red-700">
                                        Nenhum reserva encontrada.
                                    </td>
                                </tr>
                            ) : (
                                [...reservas]
                                .sort((a, b) => (b.id) - (a.id)) // ordem decrescente
                                .map((reserva) => {
                                    const config = statusConf[reserva.estado] || {
                                    label: reserva.estado,
                                    style: "bg-gray-100 text-gray-700 border-gray-200",
                                    };

                                return (
                                    <tr key={`reserva-${reserva.id}`} id={`reserva-${reserva.id}`}
                                     className={`hover:bg-black/5 transition-colors ${
                                        idDestacado === String(reserva.id) 
                                            ? 'bg-[#f97b17]/25 text-black font-medium' 
                                            : 'hover:bg-gray-100'
                                        }`} onClick={() => setIdDestacado(null)}>
                                        <td className="px-5 py-4 text-center">{reserva.id}</td>
                                        <td className="px-5 py-4 text-center">{reserva.livro_nome}</td>
                                        <td className="px-5 py-4 text-center">{reserva.aluno_nome}</td>
                                        <td className="px-5 py-4 text-center">{reserva.data_formatada}</td>

                                        <td className="px-5 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.style}`}>
                                            {config.label}
                                        </span>
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                        {renderAcaoPrincipal(reserva)}
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                        {reserva.estado === "reservado" ? (
                                            <button
                                            onClick={() => handleEmprestar(reserva)}
                                            className="px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                                        bg-green-100 text-green-700 border border-green-200
                                                        hover:bg-green-200 transition-colors"
                                            >
                                            Emprestar
                                            </button>
                                        ) : reserva.estado === "pendente" ? (
                                            <span className="text-yellow-600 font-medium">Aguardando</span>
                                        ) : (
                                            <span className="text-gray-500 font-medium">—</span>
                                        )}
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>

                    </table>
                </section>

                {reservaSelecionada && (
                    <ModalAprovarEmprestimo
                        reserva={reservaSelecionada}
                        onClose={() => setReservaSelecionada(null)}
                        onSave={(emprestimoCriado) => {
                            // Atualiza apenas o status da reserva para "finalizada"
                            setReservas(prev =>
                                prev.map(r =>
                                    r.id === emprestimoCriado.reserva_id
                                        ? { ...r, estado: "finalizada" }
                                        : r
                                )
                            );
                            setReservaSelecionada(null);
                        }}
                    />
                )}

            </section>
        </main>
    );
}

export default TabelaReservas;
