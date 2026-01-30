import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { LuClock } from "react-icons/lu";

function Estado({estado}){
    
    function estiloEstado(texto) {
        const status = texto.toLowerCase();

        const base = "absolute top-2 right-2 text-sm px-2 py-1 flex gap-1 items-center justify-center rounded-2xl shadow";

        if (status.includes("emprestado")) {
            return `${base} bg-red-100 text-[#EF4444]`;
        } else if (status.includes("reservado")) {
            return `${base} bg-orange-100 text-[#F97B17]`;
        } else if (status.includes("pendente")) {
            return `${base} bg-orange-100 text-[#F97B17]`;
        } else if (status.includes("indisponível")) {
            return `${base} bg-red-200 text-[#EF4455]`;
        } else {
            return `${base} bg-green-100 text-[#22C55E]`; // default estiloEstado(livro.estado)
        }
    }

    return(
        <span className={estiloEstado(estado)}>
            {estado === "Disponível" ? (
                    <FiCheckCircle size={20}/>
                ) : estado === "Reservado" ? (
                    <LuClock size={20}/>
                ) : estado === "Pendente" ? (
                    <LuClock size={20}/>
                ) : estado === "Emprestado" ? (
                    <FiXCircle size={20}/>
                ) : estado === "Indisponível" ? (
                    <FiXCircle size={20}/>
                ) : null
            } 
            <p>{estado}</p>
        </span>
    )


}

export default Estado;