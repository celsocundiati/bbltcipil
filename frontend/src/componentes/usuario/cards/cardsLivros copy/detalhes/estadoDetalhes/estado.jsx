import { FiCheckCircle, FiXCircle} from "react-icons/fi";
import { LuClock } from "react-icons/lu";

function EstadoDetalhes({estado, label}){
    
    function estiloEstado(texto) {
        const status = texto.toLowerCase();

        const base = "flex justify-start items-center gap-2 py-2 px-5 rounded-lg border w-full lg:max-w-full";

        if (status.includes("emprestado")) {
            return `${base} bg-red-100 text-[#EF4444] border-[#EF4444]/30`;
        } else if (status.includes("indisponível")) {
            return `${base} bg-red-200 text-[#EF4455] border-[#EF4444]/30`;
        } else if (status.includes("pendente")) {
            return `${base} bg-[#f97b27]/10 text-[#F97B17] border-[#F97B17]/30`;
        } else if (status.includes("reservado")) {
            return `${base} bg-[#f97b27]/10 text-[#F97B17] border-[#F97B17]/30`;
        } else {
            return `${base} bg-green-100 text-[#22C55E] border-[#22C55E]/30`; // default estiloEstado(livro.estado)
        }
    }

    return(
        <span className={estiloEstado(estado)}>
            {estado === "Reservado" ? (
                    <FiCheckCircle size={25}/>
                ) : estado === "Pendente" ? (
                    <LuClock size={25}/>
                ) : estado === "Emprestado" ? (
                    <FiXCircle size={25}/>
                ) : estado === "Indisponível" ? (
                    <FiXCircle size={25}/>
                ) : estado === "Disponível" ? (
                    <FiCheckCircle size={25}/>
                ) : null
            } 

            <span className="flex flex-col justify-center items-start">
                <p> {estado} </p>
                <p> {label} </p>
            </span>
        </span>

        
    )


}

export default EstadoDetalhes;