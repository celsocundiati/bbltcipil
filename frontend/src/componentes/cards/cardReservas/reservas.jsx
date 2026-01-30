// import livros from "../../../dados/db.json"
import {LuClock} from "react-icons/lu"
import {IoCalendarClearOutline} from "react-icons/io5"
import EstadoCard from "./estado/estado";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

function CardReservas({props}){


    const [reservas, setReservas] = useState([]);
    const [emprestimos, setEmprestimos] = useState([]);
    
    useEffect(() => {
      axios.get('http://localhost:8000/api/reservas/')
      .then(res => setReservas(Array.isArray(res.data.results) ? res.data.results : res.data))
      .catch(err => console.error('Erro ao capturar livros', err))
    }, []);
    
    useEffect(() => {
      axios.get('http://localhost:8000/api/emprestimos/')
      .then(res => setEmprestimos(Array.isArray(res.data.results) ? res.data.results : res.data))
      .catch(err => console.error('Erro ao capturar livros', err))
    }, []);

    const livrosReservado = reservas.filter(
        reserva => reserva.estado_label === "Reservado" || reserva.estado_label === "Pendente"
    );


    return(
        
        <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }}
            className="grid sm:1 lg:1 space-y-6 py-2 lg:py-20 px-5">
            {emprestimos.map(emprestimo =>(
                <div key={emprestimo.id} className="bg-white flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-10 hover:shadow rounded-lg cursor-pointer">
                    <div>
                        <img src={emprestimo.capa} alt="Imagem" className="rounded-t-lg lg:rounded-md w-full h-72 lg:w-36 lg:h-52" loading="lazy" />
                    </div>
    
                    <div className="flex flex-col gap-2 lg:gap-3">
                        <p className="text-lg "> {emprestimo.livro} </p>
                        <p className="text-black/57"> {emprestimo.autor} </p>
                        

                        <EstadoCard estado="Emprestado" label="Livro emprestado atualmente"/>

                        <div className="flex justify-between flex-col gap-2 lg:flex-row lg:gap-80">

                            <div className="text-black/57 flex gap-2" > 
                                <IoCalendarClearOutline size={25}/> 
                                <p className="">{emprestimo.data_emprestimo}</p>
                            </div>

                            <div className="text-black/57 flex gap-2" > 
                                <LuClock size={25}/> 
                                <p>{emprestimo.data_devolucao}</p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-10">
                            <button className="bg-[#F86417] text-[white] px-4 py-2 rounded-lg cursor-pointer">Ver Detalhes</button>
                            <button className="py-2 px-5 text-black/70 border border-black/17 rounded-lg cursor-pointer">Cancelar Reserva</button>
                        </div>
                
                    </div>

                </div>
            ))}
            
            {livrosReservado.map(reserva =>(
                <div key={reserva.id} className="bg-white flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-10 hover:shadow rounded-lg cursor-pointer">
                    <div>
                        <img src={reserva.capa} alt="Imagem" className="rounded-t-lg lg:rounded-md w-full h-72 lg:w-36 lg:h-52" loading="lazy" />
                    </div>
    
                    <div className="flex flex-col gap-2 lg:gap-3">
                        <p className="text-lg "> {reserva.livro} </p>
                        <p className="text-black/57"> {reserva.autor} </p>
                        

                        <EstadoCard estado={reserva.estado_label} label={reserva.informacao}/>

                        <div className="flex justify-between flex-col gap-2 lg:flex-row lg:gap-80">

                            <div className="text-black/57 flex gap-2" > 
                                <IoCalendarClearOutline size={25}/> 
                                <p className="">{reserva.data_reserva}</p>
                            </div>

                            <div className="text-black/57 flex gap-2" > 
                                <LuClock size={25}/> 
                                <p>Pendente</p>
                            </div>
                        </div>

                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-10">
                            <button className="bg-[#F86417] text-[white] px-4 py-2 rounded-lg cursor-pointer">Ver Detalhes</button>
                            <button className="py-2 px-5 text-black/70 border border-black/17 rounded-lg cursor-pointer">Cancelar Reserva</button>
                        </div>
                
                    </div>

                </div>
            ))}
            
        </motion.div>
    );
}
export default CardReservas;