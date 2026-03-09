import { useState, useEffect } from "react";
import { LuFilePen } from "react-icons/lu";
// import { FiTrash2 } from "react-icons/fi";
import ModalEmprestimo from "../../modais/modalemprestimo/modalemprestimo";
import { data, useNavigate } from "react-router-dom";
import api from "../../../service/api/api";

function TabelaEmprestimos(){

    const [emprestimos, setEmprestimos] = useState([]);
    const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        emprestimo: null,
    });
    const navigate = useNavigate();

        
    const atualizarDevolucao = async (emprest, novoEstado) => {
        try {
            await api.patch(
                `/admin/emprestimos/${emprest.id}/`,
                { acoes: novoEstado }
            );

            setEmprestimos(prev =>
                prev.map(r =>
                    r.id === emprest.id
                        ? { ...r, acoes: novoEstado }
                        : r
                )
            );
            closeModal();
        } catch (error) {
            console.error("Erro ao atualizar estado", error);
            alert("Erro ao atualizar estado.");
        }
    };

    useEffect(() => {

        const fetchEmprestimos = async() => {
            try{
                const res = await api.get("/admin/emprestimos/");
                setEmprestimos(Array.isArray(res.data.results) ? res.data.results : res.data);
            }catch(err){
                console.error("Erro na captura de Empréstimos", err)
                if (err.response?.status === 401) navigate("/login");
            }
        }
        fetchEmprestimos();
    }, [navigate]);

    function openModal(type, emprestimo){
        setModal({open: true, type, emprestimo});
    }
    function closeModal(){
        setModal({open:false, type: null, emprestimo: null});
    }
    
    async function handleConfirm() {
        if(modal.type === "delete"){
            await api.delete(`/admin/emprestimos/${modal.emprestimo.id}/`);
            setEmprestimos(prev => prev.filter(item => item.id !== modal.emprestimo.id));
            closeModal();
        }
    }
    

    return(
        <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
            <section className="py-5 flex flex-col">
                <label className="text-xl font-medium">Lista de Empréstimos</label>
                <label className="text-black/70">Exibindo {emprestimos.length} de {emprestimos.length}</label>
            </section>
            <section className="w-full rounded-xl overflow-hidden">
                <table className="table-auto w-full text-left bg-white shadow-md border border-black/10 rounded-xl">
                    <thead className="bg-black/5 text-cinza-900">
                        <tr>
                            <th className="py-2 px-5 text-center">ID</th>
                            <th className="py-2 px-5 text-center">Livro</th>
                            <th className="py-2 px-5 text-center">Usuário</th>
                            <th className="py-2 px-5 text-center">ID Reserva</th>
                            <th className="py-2 px-5 text-center">Data Empréstimo</th>
                            <th className="py-2 px-5 text-center">Data Vencimento</th>
                            <th className="py-2 px-5 text-center">Estado</th>
                            <th className="py-2 px-5 text-center">Ações</th>
                            <th className="py-2 px-5 text-center">R. Devolução</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-black/10">
                        {emprestimos.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-4 text-red-700">
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
                                    <td className="px-5 py-5 truncate text-center">{emprest.usuario_nome}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.reserva}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.data_emprestimo}</td>
                                    <td className="px-5 py-5 truncate text-center">{emprest.data_devolucao}</td>
                                    <td className="px-5 py-5 truncate text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${emprest.acoes === "ativo" 
                                                ? "bg-green-100 text-green-700" 
                                                : emprest.acoes === "devolvido"
                                                ? "bg-gray-100 text-gray-700 border-gray-200" 
                                                : "bg-red-100 text-red-700"}`}>
                                            {emprest.acoes}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">
                                        <div className="flex gap-3 justify-center">
                                            {emprest.acoes === "devolvido" ? (
                                                <span className="text-sm font-medium"> — </span>
                                            ) : (
                                                <>
                                                <button
                                                    onClick={() => setEmprestimoSelecionado(emprest)}
                                                    className="hover:text-black/70 cursor-pointer transition"
                                                >
                                                    <LuFilePen size={25} />
                                                </button>

                                                {/* <button
                                                    onClick={() => openModal("delete", emprest)}
                                                    className="text-red-500 hover:text-red-700 cursor-pointer transition"
                                                >
                                                    <FiTrash2 size={25} />
                                                </button> */}
                                                </>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">
                                        <button onClick={() => openModal("devolver", emprest)} className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${emprest.acoes !== "devolvido" ? 'bg-green-100 text-green-600 border-green-200' : 'text-gray-500'}`}>
                                            {emprest.acoes === "devolvido" ? " — " : "Devolver"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            {modal.open && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir livro" : "Devolver Livro"}
                        </h3>
                        <p>Tem certeza que deseja{" "}
                            {modal.type === "delete" ? "excluir" : "devolver"} este livro ?
                        </p>
                        {modal.type === "delete" ? (
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
                                <button onClick={handleConfirm} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
                            </div>
                        ) : ( 
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
                                <button onClick={() => atualizarDevolucao(modal.emprestimo, "devolvido")} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
                            </div>
                        ) }
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