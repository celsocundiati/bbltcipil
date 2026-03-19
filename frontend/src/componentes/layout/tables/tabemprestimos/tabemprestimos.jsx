// import { useState, useEffect } from "react";
// import {FiSearch} from "react-icons/fi";
// import { motion } from "framer-motion";
// import ModalEmprestimo from "../../modais/modalemprestimo/modalemprestimo";
// import {  useNavigate } from "react-router-dom";
// import api from "../../../service/api/api";

// function TabelaEmprestimos(){

//     const [emprestimos, setEmprestimos] = useState([]);
//     const [emprestimoSelecionado, setEmprestimoSelecionado] = useState(null);
//     const [modal, setModal] = useState({
//         open: false,
//         type: null,
//         emprestimo: null,
//     });
//     const navigate = useNavigate();
    
//     const [search, setSearch] = useState("");
//     const [estadoFilter, setEstadoFilter] = useState("");

        
//     const atualizarDevolucao = async (emprest, novoEstado) => {
//         try {
//             await api.patch(
//                 `/admin/emprestimos/${emprest.id}/`,
//                 { acoes: novoEstado }
//             );

//             setEmprestimos(prev =>
//                 prev.map(r =>
//                     r.id === emprest.id
//                         ? { ...r, acoes: novoEstado }
//                         : r
//                 )
//             );
//             closeModal();
//         } catch (error) {
//             console.error("Erro ao atualizar estado", error);
//             alert("Erro ao atualizar estado.");
//         }
//     };

//     useEffect(() => {

//         const fetchEmprestimos = async() => {
//             try{
//                 const params = {};
//                 if (search) params.search = search;
//                 if (estadoFilter) params.acoes = estadoFilter;
//                 const res = await api.get("/admin/emprestimos/", {params});
//                 setEmprestimos(Array.isArray(res.data.results) ? res.data.results : res.data);
//             }catch(err){
//                 console.error("Erro na captura de Empréstimos", err)
//                 if (err.response?.status === 401) navigate("/login");
//             }
//         }
        
//         fetchEmprestimos();

//     }, [navigate, search, estadoFilter]);

//     function openModal(type, emprestimo){
//         setModal({open: true, type, emprestimo});
//     }

//     function closeModal(){
//         setModal({open:false, type: null, emprestimo: null});
//     }
    
//     async function handleConfirm() {

//         if(modal.type === "delete"){
//             await api.delete(`/admin/emprestimos/${modal.emprestimo.id}/`);
//             setEmprestimos(prev => prev.filter(item => item.id !== modal.emprestimo.id));
//             closeModal();
//         }

//     }
    

//     return(
//         <motion.section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
//             whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
//             viewport={{ once: true }}             // anima apenas uma vez
//             className="space-y-10">
            
//             <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                
//                 <div className="w-full">
//                     <div className="flex items-center bg-black/5 border rounded-xl overflow-hiddenmax-w-md text-[#000000]/57
//                         relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition
//                     ">
//                         <button className="h-full rounded-l-lg px-2 py-1.5 hover:text-[#f97b17] transition cursor-pointer"> <FiSearch size={22}/> </button>
        
//                         <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" 
//                         placeholder="Busque por livro, usuário, e estado..." className="flex-1 px-4 py-1.5 outline-none"/>
//                     </div>
//                 </div>

//                 <div className="flex flex-col w-full md:w-64">

//                     <select
//                         value={estadoFilter}
//                         onChange={(e) => setEstadoFilter(e.target.value)}
//                         className="
//                         w-full
//                         px-3
//                         h-10
//                         rounded-xl cursor-pointer
//                         border border-black/10
//                         bg-white
//                         text-sm
//                         focus:ring-2 focus:ring-[#f97b17]
//                         outline-none
//                         "
//                     >
//                         <option value="">Todos os estados</option>
//                         <option value="ativo">Ativo</option>
//                         <option value="atrasado">Atrasado</option>
//                         <option value="devolvido">Devolvido</option>
//                     </select>

//                 </div>
//             </section>

//             <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
//                 <section className="py-5 flex flex-col">
//                     <label className="text-xl font-medium">Lista de Empréstimos</label>
//                     <label className="text-black/70">Exibindo {emprestimos.length} de {emprestimos.length}</label>
//                 </section>
//                 <section className="w-full rounded-xl overflow-hidden">
//                     <table className="table-auto w-full text-left bg-white shadow-md border border-black/10 rounded-xl">
//                         <thead className="bg-black/5 text-cinza-900">
//                             <tr>
//                                 <th className="py-2 px-5 text-center">Livro</th>
//                                 <th className="py-2 px-5 text-center">Usuário</th>
//                                 <th className="py-2 px-5 text-center">ID Reserva</th>
//                                 <th className="py-2 px-5 text-center">Data Empréstimo</th>
//                                 <th className="py-2 px-5 text-center">Data Vencimento</th>
//                                 <th className="py-2 px-5 text-center">Estado</th>
//                                 <th className="py-2 px-5 text-center">R. Devolução</th>
//                             </tr>
//                         </thead>

//                         <tbody className="divide-y divide-black/10">
//                             {emprestimos.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={8} className="text-center py-4 text-red-700">
//                                         Nenhum empréstimo encontrado.
//                                     </td>
//                                 </tr>
//                             ) : (
//                                 [...emprestimos]
//                                     .sort((a, b) => (b.id) - new Date(a.id)) // ordem decrescente
//                                     .map((emprest, index) => (
//                                     <tr 
//                                         key={emprest.id} 
//                                         className="hover:bg-black/3 transition-colors"
//                                     >
//                                         <td className="px-5 py-5 truncate text-center">{emprest.livro_nome}</td>
//                                         <td className="px-5 py-5 truncate text-center">{emprest.usuario_nome}</td>
//                                         <td className="px-5 py-5 truncate text-center">{emprest.reserva}</td>
//                                         <td className="px-5 py-5 truncate text-center">{emprest.data_emprestimo}</td>
//                                         <td className="px-5 py-5 truncate text-center">{emprest.data_devolucao}</td>
//                                         <td className="px-5 py-5 truncate text-center">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-medium
//                                                 ${emprest.acoes === "ativo" 
//                                                     ? "bg-green-100 text-green-700" 
//                                                     : emprest.acoes === "devolvido"
//                                                     ? "bg-gray-100 text-gray-700 border-gray-200" 
//                                                     : "bg-red-100 text-red-700"}`}>
//                                                 {emprest.acoes}
//                                             </span>
//                                         </td>

//                                         <td className="px-5 py-4 truncate text-black/85 text-center">
//                                             <button onClick={() => openModal("devolver", emprest)} className={`cursor-pointer inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${emprest.acoes !== "devolvido" ? 'bg-green-100 text-green-600 border-green-200' : 'text-gray-500'}`}>
//                                                 {emprest.acoes === "devolvido" ? " — " : "Devolver"}
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))
//                             )}
//                         </tbody>
//                     </table>
//                 </section>
//             </section>

//             {modal.open && (
//                 <motion.div  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
//                     whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
//                     viewport={{ once: true }}             // anima apenas uma vez
//                     className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
//                     <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
//                         <h3 className="text-lg font-semibold mb-2">
//                             {modal.type === "delete" ? "Excluir livro" : "Devolver Livro"}
//                         </h3>
//                         <p>Tem certeza que deseja{" "}
//                             {modal.type === "delete" ? "excluir" : "devolver"} este livro ?
//                         </p>
//                         {modal.type === "delete" ? (
//                             <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
//                                 <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
//                                 <button onClick={handleConfirm} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
//                             </div>
//                         ) : ( 
//                             <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
//                                 <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
//                                 <button onClick={() => atualizarDevolucao(modal.emprestimo, "devolvido")} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
//                             </div>
//                         ) }
//                     </div>
//                 </motion.div>
//             )}

//             {emprestimoSelecionado && <ModalEmprestimo onClose={() => setEmprestimoSelecionado(false)}
//                 emprestimo={emprestimoSelecionado}
//                 onSave={(emprestimoAtualizado) => {
//                     setEmprestimos(prev =>
//                     prev.map(e => e.id === emprestimoAtualizado.id ? emprestimoAtualizado : e)
//                 );
//                     setEmprestimoSelecionado(null);
//                 }}
//         /> }
//         </motion.section>
//     )
// }

// export default TabelaEmprestimos;







import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import ModalEmprestimo from "../../modais/modalemprestimo/modalemprestimo";
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

    async function handleConfirm() {
        if (modal.type === "delete") {
            await api.delete(`/admin/emprestimos/${modal.emprestimo.id}/`);

            setEmprestimos(prev =>
                prev.filter(item => item.id !== modal.emprestimo.id)
            );

            closeModal();
        }
    }

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
                        className="w-full h-10 px-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#f97b17]"
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