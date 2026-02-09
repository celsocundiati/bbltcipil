import { useState, useEffect } from "react";
import axios from "axios";
import { LuFilePen } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import ModalReserva from "../../modais/modalreserva/modalreserva";


function TabelaReservas(){

    
    const [reservas, setReservas] = useState([]);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        emprestimo: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/reservas/")
        .then(res => setReservas(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de Empréstimos", err));
    }, []);

    function openModal(type, reserva){
            setModal({open: true, type, reserva});
    }
    function closeModal(){
        setModal({open:false, type: null, reserva: null});
    }
    async function handleConfirm() {
        if(modal.type === "delete"){
            await axios.delete(`http://127.0.0.1:8000/api/reservas/${modal.reservas.id}/`);
            setreservas(prev => prev.filter(item => item.id !== modal.reservas.id));
            closeModal();
        }
    }
    

    return(
        <main>
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Reservas</label>
                    <label className="text-black/70">Exibindo {reservas.length} de {reservas.length}</label>
                </section>
                <section className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[5%] px-5 py-3 text-center">ID</th>
                                <th className="w-[20%] px-5 py-3 text-center">Livro</th>
                                <th className="w-[20%] px-5 py-3 text-center">Estudante</th>
                                <th className="w-[15%] px-5 py-3 text-center">Data Reserva</th>
                                <th className="w-[10%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[10%] px-5 py-3 text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {reservas.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-red-700">
                                        Nenhum empréstimo encontrado.
                                    </td>
                                </tr>
                            ) : (
                                reservas.map((reserva, index) => (
                                    <tr 
                                        key={reserva.id || index} 
                                        className="hover:bg-black/3 transition-colors"
                                    >
                                        <td className="px-5 py-4 truncate text-center">{reserva.id}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.livro_nome}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.aluno_nome}</td>
                                        <td className="px-5 py-4 truncate text-center">{reserva.data_reserva}</td>
                                        <td className="px-5 py-4 truncate text-center">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                                                ${reserva.estado === "Ativo" 
                                                    ? "bg-green-100 text-green-700" 
                                                    : "bg-yellow-100 text-yellow-700"}`}>
                                                {reserva.estado}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 truncate text-center">
                                            <span className="flex gap-2">
                                                <button className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                                    bg-green-100 text-green-700`}>
                                                    Aprovar
                                                </button>

                                                <button className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer
                                                    bg-red-100 text-red-700`}>
                                                    Reprovar
                                                </button>
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </section>

                
            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir livro" : "Editar livro"}
                        </h3>
                        <p>Tem certeza que deseja{""}
                            {modal.type === "delete" ? "excluir" : "editar"} este livro ?
                        </p>
                        <div className="flex justify-end gap-3 mt-5">
                            <button onClick={closeModal} className="px-3 py-2 bg-cinza-700 rounded-lg hover:bg-red-700 hover:text-white">Cancelar</button>
                            <button onClick={handleConfirm} className="px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-laranja-500">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {reservaSelecionada && <ModalReserva onClose={() => setReservaSelecionada(false)}
                reserva={reservaSelecionada}
                onSave={(reservaActualizada) => {
                    setEmprestimos(prev =>
                    prev.map(e => e.id === reservaActualizada.id ? reservaActualizada : e)
                );
                    setreservaSelecionado(null);
                }}
            /> }

            </section>
        </main>
    )
}

export default TabelaReservas;