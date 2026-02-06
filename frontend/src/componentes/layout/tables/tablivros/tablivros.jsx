import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { LuFilePen } from "react-icons/lu";
import { FiEye, FiTrash2 } from "react-icons/fi";


function TabelaLivros(){

    const [livros, setLivros] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        livro: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/livros/")
        .then(res => setLivros(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de livros", err));
    }, []);

    function openModal(type, livro){
        setModal({open: true, type, livro});
    }
    function closeModal(){
        setModal({open:false, type: null, livro: null});
    }
    async function handleConfirm() {
        if(modal.type === "delete"){
            await axios.delete(`http://127.0.0.1:8000/api/livros/${modal.livro.id}/`);
            setLivros(prev => prev.filter(item => item.id !== modal.livro.id));
        }
        if(modal.type === "update"){
            window.location.href = `livros/${modal.livro.id}`;
        }
        closeModal();
    }
    
    return(
        <main>
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl">Lista de Livros</label>
                    <label className="text-black/70">Exibindo 8 de 8 livros</label>
                </section>

                <section>
                    <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                        <thead className="bg-black/5">
                            <tr>
                                <th className="w-[35%] px-5 py-3 text-left">Livro</th>
                                <th className="w-[15%] px-5 py-3 text-left">Autor</th>
                                <th className="w-[15%] px-5 py-3 text-left">Categoria</th>
                                <th className="w-[5%] px-5 py-3 text-left">Nº</th>
                                <th className="w-[10%] px-10 py-3 text-left">Ano</th>
                                <th className="w-[10%] px-5 py-3 text-left">Estado</th>
                                <th className="w-[15%] px-5 py-3 text-left">Ações</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-black/10">
                            {livros.map(livro => (
                                <tr key={livro.id} className="hover:bg-black/3 transition">
                                    <td className="px-5 py-4">
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

                                    <td className="px-5 py-4 truncate text-black/85">{livro.autor}</td>
                                    <td className="px-5 py-4 truncate text-black/85">{livro.categoria}</td>
                                    <td className="px-5 py-4 truncate text-black/85">{livro.n_paginas}</td>
                                    <td className="px-5 py-4 truncate text-black/85">{livro.publicado_em}</td>

                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium 
                                            ${livro.estado === "disponivel" 
                                                ? "bg-green-100 text-green-700" 
                                                : "bg-cinza-300 text-preto-500"}`}
                                        >
                                            {livro.estado}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex gap-3">
                                            <button className="hover:text-[#f97b17] transition">
                                                <FiEye size={20}/>
                                            </button>
                                            <button onClick={() => openModal("update", livro)} className="hover:text-[#f97b17] transition">
                                                <LuFilePen size={20}/>
                                            </button>
                                            <button onClick={() => openModal("delete", livro)} className="text-red-700 hover:text-red-900 transition">
                                                <FiTrash2 size={20}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </section>

            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-branco-100 rounded-lg p-6 w-full max-w-md">
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
        </main>
    )
}

export default TabelaLivros;