import { useState, useEffect } from "react";
import axios from "axios";
import { LuFilePen } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import ModalEmprestimo from "../../modais/modalemprestimo/modalemprestimo";

function TabelaEmprestimos(){
    
    const [emprestimos, setEmprestimos] = useState([]);
    const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        emprestimo: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/emprestimos/")
        .then(res => setEmprestimos(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de Empréstimos", err));
    }, []);

    function openModal(type, emprestimo){
            setModal({open: true, type, emprestimo});
    }
    function closeModal(){
        setModal({open:false, type: null, emprestimo: null});
    }
    async function handleConfirm() {
        if(modal.type === "delete"){
            await axios.delete(`http://127.0.0.1:8000/api/emprestimos/${modal.emprestimo.id}/`);
            setEmprestimos(prev => prev.filter(item => item.id !== modal.emprestimo.id));
            closeModal();
        }
    }
    

    return(
        <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
            <section className="py-5 flex flex-col">
                <label className="text-xl">Lista de Empréstimos</label>
                <label className="text-black/70">Exibindo {emprestimos.length} de {emprestimos.length}</label>
            </section>
            <section className="w-full rounded-xl overflow-hidden">
                <table className="table-auto w-full text-left bg-white shadow-md border border-black/10 rounded-xl">
                    <thead className="bg-black/5 text-cinza-900">
                        <tr>
                            <th className="py-2 px-5 text-center">ID</th>
                            <th className="py-2 px-5 text-center">Livro</th>
                            <th className="py-2 px-5 text-center">Estudante</th>
                            <th className="py-2 px-5 text-center">ID Reserva</th>
                            <th className="py-2 px-5 text-center">Data Empréstimo</th>
                            <th className="py-2 px-5 text-center">Data Vencimento</th>
                            <th className="py-2 px-5 text-center">Estado</th>
                            <th className="py-2 px-5 text-center">Ações</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10">
                        {emprestimos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-4 text-red-700">
                                    Nenhum empréstimo encontrado.
                                </td>
                            </tr>
                        ) : (
                            [...emprestimos]
                                .sort((a, b) => (b.id) - new Date(a.id)) // ordem decrescente
                                .map((emprest, index) => (
                                <tr 
                                    key={emprest.id} 
                                    className="hover:bg-black/3 transition-colors"
                                >
                                    <td className="px-5 py-5 truncate text-center">{emprest.id}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.livro_nome}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.aluno_nome}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.reserva}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.data_emprestimo}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.data_devolucao}</td>
                                    <td className="px-5 py-5 truncate text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${emprest.acoes === "ativo" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-red-100 text-red-700"}`}>
                                            {emprest.acoes}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">
                                        <div className="flex gap-3 justify-center">
                                            {/* <button className="hover:text-[#f97b17] transition">
                                                <FiEye size={20}/>
                                            </button> */}
                                            <button onClick={() => setEmprestimoSelecionado(emprest)} className="hover:text-black/70 cursor-pointer transition">
                                                <LuFilePen size={25}/>
                                            </button>
                                            <button onClick={() => openModal("delete", emprest)} className="text-red-500 hover:text-red-700 cursor-pointer transition">
                                                <FiTrash2 size={25}/>
                                            </button>
                                        </div>
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
                        <p>Tem certeza que deseja{" "}
                            {modal.type === "delete" ? "excluir" : "editar"} este livro ?
                        </p>
                        <div className="flex justify-end gap-3 mt-5">
                            <button onClick={closeModal} className="px-3 py-2 bg-cinza-700 rounded-lg hover:bg-red-700 hover:text-white">Cancelar</button>
                            <button onClick={handleConfirm} className="px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-laranja-500">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {emprestimoSelecionado && <ModalEmprestimo onClose={() => setEmprestimoSelecionado(false)}
                emprestimo={emprestimoSelecionado}
                onSave={(emprestimoAtualizado) => {
                    setEmprestimos(prev =>
                    prev.map(e => e.id === emprestimoAtualizado.id ? emprestimoAtualizado : e)
                );
                    setEmprestimoSelecionado(null);
                }}
        /> }
        </section>
    )
}

export default TabelaEmprestimos;