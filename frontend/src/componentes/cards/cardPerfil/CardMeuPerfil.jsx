import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {AiOutlineMail} from "react-icons/ai";
import {HiOutlineHashtag, HiOutlineLogout} from "react-icons/hi"
import { LuFilePen } from "react-icons/lu";
import ImagemUpload from "./imgPerfil";
import Modal from "../../layout/modais/modal";
import axios from "axios"
import alunos from "../../../dados/db.json"

function MeuPerfil(){

    const [showModal, setShowModal] = useState(false);

    /*const [alunos, setAlunos] = useState([]);

    useEffect(()=>{
        axios.get('http://localhost:8000/api/aluno/')
        .then(res => setAlunos/Array.isArray(res.data.results) ? res.data.results : res.data)
        .catch(err => console.log('Erro ao capturar os dados', err))
    })

    const alunoFiltrado = alunos.filter(aluno => aluno.n_processo === 2023003)
    */
    function handleClick() {
        console.log("Eu sou o BBV");
        setShowModal(true);
    }

    return(
        <motion.main  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez ---  h-screen
                transition={{ duration: 0.8 }}
            className="min-w-sm">
            <section className="relative">
                <article className="bg-[#F86417] h-32 relative rounded-t-2xl"></article>
                <ImagemUpload/>
            </section>

                <div className="w-full bg-white border border-black/17 rounded-b-2xl py-8 pt-14 px-4">
                    
                    <section className="flex flex-col gap-2">
                        <div className="flex flex-col">
                            <p>Celso Paulo Cundiati Huma</p>
                            <p className="text-[#000000]/57 py-1 text-sm">Estudante</p>
                        </div>
                        <div className="flex flex-col gap-2 py-1">
                            <span className="flex items-center gap-2"> 
                                <AiOutlineMail size={18} className="text-[#F97B17]"/> <p className="text-[#000000]/57 text-sm">celsocundiati@gmail.com</p>
                            </span>
                            <span className="flex items-center gap-2"> 
                                <HiOutlineHashtag size={18} className="text-[#F97B17]"/> <p className="text-[#000000]/57 text-sm">Matricula: 71284</p>
                            </span>
                        </div>
                        <div className="flex justify-between mx-auto gap-10 py-3">
                            <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
                                <label className="text-center">4</label> 
                                <label className="text-[#000000]/57 text-sm">Emprestado</label>
                            </div>
                            <div className="flex flex-col bg-[#F97B17]/10 text-[#F86417] font-medium py-3 px-6 rounded-lg">
                                <label className="text-center ">5</label>
                                <label className="text-[#000000]/57 text-sm">Reservado</label>
                            </div>
                        </div>
                        <div className=" space-y-3">
                            <button onClick={handleClick} className="w-full bg-[#F86417] text-white flex items-center py-3 justify-center rounded-lg cursor-pointer"><LuFilePen size={20} /><p>Editar Perfil</p></button>
                            <button className="w-full border border-[#000000]/30 flex items-center justify-center rounded-lg py-3 cursor-pointer"><HiOutlineLogout size={20}/><p>Sair</p></button>
                        </div>
                    </section>

                    {showModal && <Modal tipo="perfil" onClose={() => setShowModal(false)}/> }
                </div>
        </motion.main>
    );
}
export default MeuPerfil;