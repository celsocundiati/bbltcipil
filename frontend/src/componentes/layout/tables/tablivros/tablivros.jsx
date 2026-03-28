import { useState, useEffect } from "react";
import { LuFilePen } from "react-icons/lu";
import { FiTrash2 } from "react-icons/fi";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import {FiSearch} from "react-icons/fi";

function TabelaLivros(){

    const [livros, setLivros] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [modal, setModal] = useState({
        open: false,
        type: null,
        livro: null,
    });

    const [search, setSearch] = useState("");
    const [estadoFilter, setEstadoFilter] = useState("");

    
    const fetchLivros = async() => {
        try{
            const params = {};
            if (search) params.search = search;
            if (estadoFilter) params.estado = estadoFilter;
            
            const [livroRes, categoriasRes] = await Promise.all([
                api.get("/admin/livros/", { params }),
                api.get(`/admin/categorias/`)
            ]);
            setLivros(Array.isArray(livroRes.data.results) ? livroRes.data.results : livroRes.data)

            setCategorias(
                Array.isArray(categoriasRes.data.results)
                    ? categoriasRes.data.results
                    : categoriasRes.data
            );
        }catch(err){
            console.error("Erro ao carregar livros.", err)
        }
    }

    useEffect(() => {

        fetchLivros();

    }, [search, estadoFilter]);

    function openModal(type, livro){
        setModal({open: true, type, livro});
    }
    function closeModal(){
        setModal({open:false, type: null, livro: null});
    }

    async function handleConfirm() {
        if(modal.type === "delete"){
            await api.delete(`/admin/livros/${modal.livro.id}/`);
            setLivros(prev => prev.filter(item => item.id !== modal.livro.id));
        }
        if(modal.type === "update"){
            window.location.href = `livros/${modal.livro.id}`;
        }
        closeModal();
    }
    
    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            className="space-y-10"
        >
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                
                <div className="w-full">
                    <div className="flex items-center bg-black/5 border rounded-xl overflow-hiddenmax-w-md text-[#000000]/57
                        relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition
                    ">
                        <button className="h-full rounded-l-lg px-2 py-1.5 hover:text-[#f97b17] transition cursor-pointer"> <FiSearch size={22}/> </button>
        
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" 
                        placeholder="Busque por título, isbn, estado e categoria" className="flex-1 px-4 py-1.5 outline-none"/>
                    </div>
                </div>

                <div className="flex flex-col w-full md:w-64">

                    <select
                        value={estadoFilter}
                        onChange={(e) => setEstadoFilter(e.target.value)}
                        className="
                        w-full
                        px-3
                        h-10
                        rounded-xl cursor-pointer
                        border border-black/10
                        bg-white
                        text-sm
                        focus:ring-2 focus:ring-[#f97b17]
                        outline-none
                        "
                    >
                        <option value="">Todos os estados</option>
                        <option value="Disponível">Disponível</option>
                        <option value="Indisponível">Indisponível</option>
                    </select>
                    
                </div>
            </section>
            
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl font-medium">Lista de Livros</label>
                    <label className="text-black/70">Exibindo 8 de 8 livros</label>
                </section>

                <section>
                    <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[35%] px-5 py-3 text-center">Livro</th>
                                <th className="w-[15%] px-5 py-3 text-center">Autor</th>
                                <th className="w-[15%] px-5 py-3 text-center">Categoria</th>
                                <th className="w-[14%] px-5 py-3 text-center">Nº Páginas</th>
                                <th className="w-[10%] px-5 py-3 text-center">Ano</th>
                                <th className="w-[10%] px-5 py-3 text-center">Quantidade</th>
                                <th className="w-[10%] px-5 py-3 text-center">Editora</th>
                                <th className="w-[10%] px-5 py-3 text-center">Descrição</th>
                                <th className="w-[10%] px-5 py-3 text-center">Sumário</th>
                                <th className="w-[15%] px-5 py-3 text-center">Estado</th>
                                <th className="w-[15%] px-5 py-3 text-center">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                        
                            {livros.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="text-center py-4 text-red-700">
                                        Nenhum livro encontrado.
                                    </td>
                                </tr>
                            ) : (livros.map(livro => (
                                <tr key={livro.id} className="hover:bg-black/3 transition">
                                    <td className="px-5 py-4 truncate text-black/85">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={livro.capa} 
                                                alt={livro.titulo}
                                                className="w-14 h-20 object-cover rounded-md shrink-0"
                                            />
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-medium line-clamp-2">
                                                    {livro.titulo}
                                                </span>
                                                <span className="text-black/70 text-sm truncate">
                                                    ISBN – {livro.isbn}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.autor_nome}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.categoria_nome}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.n_paginas}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.publicado_em}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.quantidade}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.editora}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.descricao}</td>
                                    <td className="px-5 py-4 truncate text-black/85 text-center">{livro.sumario}</td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                            ${livro.estado === "disponivel" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-cinza-300 text-preto-500"}`}
                                        >
                                            {livro.estado}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 truncate text-black/85 text-center">
                                        <div className="flex gap-3 justify-center">
                                            <button onClick={() => openModal("update", livro)} className="hover:text-black/70 cursor-pointer transition">
                                                <LuFilePen size={25}/>
                                            </button>
                                            <button onClick={() => openModal("delete", livro)} className="text-red-500 hover:text-red-700 cursor-pointer transition">
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
            </section>

            {modal.open && (
                <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                    whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                    viewport={{ once: true }}             // anima apenas uma vez
                    className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                        <h3 className="text-xl font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir livro" : "Editar livro"}
                        </h3>
                        <p className="text-lg">Tem certeza que deseja{" "}
                            {modal.type === "delete" ? "excluir" : "editar"} este livro ?
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button onClick={closeModal} className="px-3 py-2 bg-black/10 rounded-lg hover:bg-red-500 hover:text-white cursor-pointer">Cancelar</button>
                            <button onClick={handleConfirm} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 cursor-pointer">Confirmar</button>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.main>
    )
}

export default TabelaLivros;


