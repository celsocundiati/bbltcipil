import InputGroup from "../../tags/inputs/InputGroup";
import Selects from "../../tags/selects/selects";
import { FiFilter, FiChevronDown, FiChevronUp  } from "react-icons/fi";
import { useState } from "react";

function Filtragem(){

    const [mostrarFiltro, setMostrarFiltros] = useState(true)

    return(
        <div className="px-5">
            <section className="py-10 px-5 bg-white rounded-xl border border-[#000000]/15">  
                <div className="mb-5">
                    <form action="">
                        <InputGroup type="text" placeholder="Busca por título, autor ou categória" />
                    </form>
                </div>

                <div>
                    <button onClick={() => setMostrarFiltros(prev => !prev)}
                        className="flex text-[#f97b17] text-sm ms-2 items-center overflow-hidden transition-all duration-300">
                        
                        <FiFilter size={22} />
                        <span className="text-base cursor-pointer">
                            {mostrarFiltro ? "Ocultar filtros" : "Mostrar filtros"}
                        </span>
                        {mostrarFiltro ? <FiChevronUp /> : <FiChevronDown />}

                    </button>

                    {mostrarFiltro && (
                        <>
                            <hr className="text-[#000000]/17 my-3" />

                            <div className="flex justify-between gap-5 pt-5 flex-col lg:flex-row">
                                <Selects tipo="categoria" lbl="Categoria"/>
                                <Selects tipo="todos" lbl="Todos"/>
                            </div>
                        </>
                    )}
                    
                </div>
            </section>
        </div>
    );
}
export default Filtragem;