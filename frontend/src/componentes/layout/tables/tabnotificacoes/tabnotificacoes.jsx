import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function TabNotificacoes(){

    const [reservas, setReservas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:8000/api/reservas/")
            .then(res => {
                const data = Array.isArray(res.data.results)
                    ? res.data.results
                    : res.data;
                setReservas(data);
            })
            .catch(err => console.error("Erro ao buscar reservas", err));
    }, []);

    const handleRedirect = (id) => {
        navigate(`/admin/acervo#reserva-${id}`); 
    };

    return (
        <main>
            <section className="w-full h-full grid grid-cols-1 md:grid-cols-1 gap-5 mb-15">
                <section className="mb-5">
                    <span className="text-black/70">
                        Total: {reservas.length}
                    </span>
                </section>

                <section className="w-full">
                    <div className="w-full grid grid-cols-1 gap-5">
                        {reservas.length === 0 ? (
                            <div className="text-center py-4 text-red-700 bg-white border border-black/10 rounded-lg p-5">
                                Nenhuma reserva encontrada.
                            </div>
                        ) : (
                            [...reservas]
                                .sort((a, b) => b.id - a.id)
                                .map((reserva) => (
                                    <div 
                                        key={`reserva-${reserva.id}`} 
                                        onClick={() => handleRedirect(reserva.id)} 
                                        className="w-full bg-white border border-black/10 rounded-lg p-5 hover:bg-black/5 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2.5 h-2.5 bg-[#F97B17] rounded-full"></div>
                                            <span className="text-lg">Reserva solicitada</span>
                                        </div>
                                        
                                        <div className="px-5">
                                            <p className="text-black/70">{reserva.aluno_nome} - {reserva.livro_nome}</p>
                                            <div className="flex flex-col text-black/70">
                                                <span className="text-lg">{reserva?.data_formatada} - {reserva?.hora_formatada}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </section>
                
            </section>
        </main>
    );
}
export default TabNotificacoes;