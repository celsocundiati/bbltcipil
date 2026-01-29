import {useParams} from "react-router-dom";
import { Link } from "react-router-dom";
import {livros} from "../../../../dados/db.json";
import { FiArrowLeft } from "react-icons/fi";
import {AiOutlineFileText, AiOutlineBook} from "react-icons/ai";
import {MdPersonOutline} from "react-icons/md";
import { LuBookOpen } from "react-icons/lu";
import {HiOutlineHashtag} from "react-icons/hi";
import {IoCalendarClearOutline} from "react-icons/io5";
import EstadoDetalhes from "./estadoDetalhes/estado";
import { motion } from "framer-motion";

function Detalhes(){

    const {id} = useParams();
    const livro = livros.find((livro) => livro.id === Number(id));
    if(!livro) return <p>Nenhum livro encontrado</p>

    function btnEstilo(texto) {
        const status = texto.toLowerCase();

        const base="h-14 rounded-xl"
        if (status.includes("disponível")) {
            return `${base} bg-[#F86417] rounded-sm p-1.5 text-white cursor-pointer`;
        } else {
            return `${base} bg-black/15 text-black/57`; // default estiloEstado(livro.estado) [auto_1fr]
        }
    }

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
                className="w-full h-full py-15 px-5 space-y-10">   
            <div className="flex items-center gap-3">
                <Link to="/catalogo" > <FiArrowLeft size={30}/> </Link>
                <h1 className="text-xl">Voltar ao Catálogo</h1>
            </div> 
            
            <section className="grid grid-cols-1 sm:grid-cols-[auto_1fr] w-full h-full gap-5">
                <motion.article initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
                    className="bg-white overflow-hidden rounded-2xl max-h-150 min-w-109 sm:max-w-109 border border-black/10">
                    <img src={livro.capa} alt="" className="h-96 w-full"/>
                    <div className="p-5 w-full flex flex-col gap-5 my-3">
                        <EstadoDetalhes estado={livro.estado} label={livro.label}/>
                        <button className={btnEstilo(livro.estado)}>
                            {livro.estado === "Disponível" ? "Reservar Livro" : livro.estado === "Emprestado" ? "Indisponível"
                               : livro.estado === "Pendente" ? "Aguardando Disponiblidade" : livro.estado === "Reservado" ? "Indisponível" :""                    
                            }
                        </button>
                    </div>
                </motion.article>
                <motion.article  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                    whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                    viewport={{ once: true }}             // anima apenas uma vez
                    transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
                        className="grid grid-rows space-y-10">
                    <div className="space-y-10 bg-white p-5 rounded-2xl border border-black/10">
                        <h1 className="text-2xl pt-4">{livro.titulo}</h1>
                        <div className="grid grid-cols-2">
                            <div className="grid grid-cols space-y-5">
                                <label className="flex items-center gap-3">
                                    <MdPersonOutline size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">Autor</p>
                                        <p> {livro.autor} </p>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <LuBookOpen size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">Categória</p>
                                        <p> {livro.categoria} </p>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <HiOutlineHashtag size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">ISBN</p>
                                        <p> {livro.isbn} </p>
                                    </span>
                                </label>
                            </div>
                            <div className="grid grid-cols space-y-5">
                                <label className="flex items-center gap-3">
                                    <IoCalendarClearOutline size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">Ano de publicação</p>
                                        <p> {livro.data_publicacao} </p>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <AiOutlineFileText size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">Páginas</p>
                                        <p> {livro.n_paginas} </p>
                                    </span>
                                </label>
                                <label className="flex items-center gap-3">
                                    <AiOutlineBook size={40} className="bg-[#F86417]/10 rounded-sm p-1.5 text-[#F86417] px-1"/>
                                    <span>
                                        <p className="text-base text-black/70">Editora</p>
                                        <p> {livro.editora} </p>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 bg-white p-5 rounded-2xl border border-black/10">
                        <h1 className="text-2xl">Descrição</h1>
                        <article>
                            <p className="text-black/70 text-base">{livro.descricao}</p>
                        </article>
                    </div> 
                    <div className="space-y-4 bg-white p-5 rounded-2xl border border-black/10">
                        <h1 className="text-2xl">Sumário</h1>
                        <article>
                            <ul className="text-black/70 text-base">
                                <li>{livro.sumario}</li>
                            </ul>
                        </article>
                    </div>
                </motion.article>
            </section>
        </motion.main>
    );
}
export default Detalhes;