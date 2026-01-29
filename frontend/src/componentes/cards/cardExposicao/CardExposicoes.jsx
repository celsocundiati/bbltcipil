//import livros from "../../data/bd.json"
import {LuClock, LuStar} from "react-icons/lu"
import {IoCalendarClearOutline} from "react-icons/io5";
import { motion } from "framer-motion";

function CardExposicoes()
{
    return(
        <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }} 
            className="relative w-full overflow-hidden border border-black/17 rounded-md bg-white 
            hover:shadow-lg hover:scale-102 transition-transform duration-300">
            <div className="flex flex-col w-full">
                <div className="w-full">
                    <img src="https://res.cloudinary.com/degsmhalt/image/upload/v1765706369/livro_ye5lep.webp" 
                    alt="Imagem" className="w-full transition-transform
                    duration-300 hover:brightness-110 max-h-72" loading="lazy"/>
                    <span className="flex items-center top-5 left-8 absolute bg-blue-100 px-4 py-1 gap-1 rounded-2xl">
                        {/* <LuStar size={20} className="text-[#F97B17]"/> */}
                        <p className="text-[#f97b17] font-semibold">Destaque</p> 
                    </span>
                </div>
                <div className="flex flex-col gap-1 py-5 px-5">
                    {/* <span className=" text-blue-500 font-medium bg-blue-200 py-1 px-3 rounded-2xl max-w-36 text-center">Evento</span> */}
                    <h1 className="text-2xl">Semana Louca: desafios e exercícios</h1>
                    <p className="text-black/57">Seleção especial de livros de química, física, matemática, informática</p>
                    <div className="flex flex-col">
                        <div className="bg-branco-50 text-cinza-900 flex gap-2"> 
                            <IoCalendarClearOutline size={20}/> 
                            <p>06 de Junho de 2026</p>
                        </div>
                        <div className="text-black/85 flex gap-2" > 
                            <LuClock size={20}/> 
                            <p>Sala de exposição - 2º Andar</p>
                        </div>
                    </div>
                    <div className="flex gap-10 py-2">
                        <button className="text-white px-10 p-2 rounded-lg bg-[#F97B27] cursor-pointer hover:bg-[#F86417]">Participar</button>
                        <button className="cursor-pointer p-2 px-10 border border-black/30 rounded-lg hover:bg-black/30 hover:text-white">Ver Mais</button>
                    </div>

                </div>
            </div>


        </motion.div>
    );
}
export default CardExposicoes;