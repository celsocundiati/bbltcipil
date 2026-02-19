import { Link } from "react-router-dom";
import { LuClock } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import EstadoCard from "./estado/estado";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

// 🔥 Axios configurado
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
});

// 🔐 Interceptor para adicionar token automaticamente
api.interceptors.request.use(config => {
    const token = sessionStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function CardReservas() {

    const [reservas, setReservas] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);

    // 📌 Buscar Reservas
    useEffect(() => {
        api.get("reservas/")
            .then(res =>
                setReservas(
                    Array.isArray(res.data.results)
                        ? res.data.results
                        : res.data
                )
            )
            .catch(err => console.error("Erro ao capturar reservas", err));
    }, []);

    // 📌 Buscar Empréstimos
    useEffect(() => {
        api.get("emprestimos/")
            .then(res =>
                setEmprestimos(
                    Array.isArray(res.data.results)
                        ? res.data.results
                        : res.data
                )
            )
            .catch(err => console.error("Erro ao capturar empréstimos", err));
    }, []);

    // 📌 Filtrar reservas
    const livrosReservado = reservas.filter(
        reserva =>
            reserva.estado_label === "Reservado" ||
            reserva.estado_label === "Pendente"
    );

    // 📌 Filtrar empréstimos
    const livrosEmprestimo = emprestimos.filter(
        emprestimo =>
            emprestimo.acoes === "ativo" ||
            emprestimo.acoes === "atrasado"
    );

    // 🗑 Cancelar Reserva
    const handleDeletarReserva = async (reserva) => {
        try {
            await api.delete(`reservas/${reserva.id}/`);

            // 🔥 Remove da tela imediatamente
            setReservas(prev =>
                prev.filter(r => r.id !== reserva.id)
            );

        } catch (error) {
            if (error.response) {
                console.error("Erro do backend:", error.response.data);
                alert("Erro: " + JSON.stringify(error.response.data));
            } else {
                console.error("Erro desconhecido:", error);
                alert("Erro ao cancelar a reserva.");
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid sm:1 lg:1 space-y-6 py-2 lg:py-20 px-5"
        >

            {/* 📚 EMPRÉSTIMOS */}
            {livrosEmprestimo.map(emprestimo => (
                <div
                    key={emprestimo.id}
                    className="bg-white flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-10 hover:shadow rounded-lg cursor-pointer"
                >
                    <div>
                        <img
                            src={emprestimo.capa}
                            alt="Imagem"
                            className="rounded-t-lg lg:rounded-md w-full h-72 lg:w-36 lg:h-52"
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col gap-2 lg:gap-3">
                        <p className="text-lg">{emprestimo.livro_nome}</p>
                        <p className="text-black/57">{emprestimo.autor_nome}</p>

                        <EstadoCard
                            estado="Emprestado"
                            label="Livro emprestado atualmente"
                        />

                        <div className="flex justify-between flex-col gap-2 lg:flex-row lg:gap-80">
                            <div className="text-black/57 flex gap-2">
                                <IoCalendarClearOutline size={25} />
                                <p>{emprestimo.data_emprestimo}</p>
                            </div>

                            <div className="text-black/57 flex gap-2">
                                <LuClock size={25} />
                                <p>{emprestimo.data_devolucao}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-10">
                            <Link
                                to={`/detalhes/${emprestimo.livro_id}`}
                                className="bg-[#F86417] text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Ver Detalhes
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* 📚 RESERVAS */}
            {livrosReservado.map(reserva => (
                <div
                    key={reserva.id}
                    className="bg-white flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-10 hover:shadow rounded-lg cursor-pointer"
                >
                    <div>
                        <img
                            src={reserva.capa}
                            alt="Imagem"
                            className="rounded-t-lg lg:rounded-md w-full h-72 lg:w-36 lg:h-52"
                            loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col gap-2 lg:gap-3">
                        <p className="text-lg">{reserva.livro_nome}</p>
                        <p className="text-black/57">{reserva.autor_nome}</p>

                        <EstadoCard
                            estado={reserva.estado_label}
                            label={reserva.informacao}
                        />

                        <div className="flex justify-between flex-col gap-2 lg:flex-row lg:gap-80">
                            <div className="text-black/57 flex gap-2">
                                <IoCalendarClearOutline size={25} />
                                <p>{reserva.data_formatada}</p>
                            </div>

                            <div className="text-black/57 flex gap-2">
                                <LuClock size={25} />
                                <p>Pendente</p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-10">
                            <Link
                                to={`/detalhes/${reserva.livro_id}`}
                                className="bg-[#F86417] text-white px-4 py-2 rounded-lg cursor-pointer"
                            >
                                Ver Detalhes
                            </Link>

                            <button
                                onClick={() => handleDeletarReserva(reserva)}
                                className="py-2 px-5 text-black/70 border border-black/17 rounded-lg cursor-pointer"
                            >
                                Cancelar Reserva
                            </button>
                        </div>
                    </div>
                </div>
            ))}

        </motion.div>
    );
}

export default CardReservas;
