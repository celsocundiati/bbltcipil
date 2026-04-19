import { FaSchool } from "react-icons/fa";
import LogoIPIL from "../../../../assets/ipil.jpg";

function Seccao1() {
    return (
        <section className="bg-[#f9fafc] p-4 sm:p-6 md:p-8 shadow-sm mb-6 rounded-2xl">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-3 mb-4 text-center sm:text-left">
                <img 
                    src={LogoIPIL} 
                    alt="logo do IPIL" 
                    className="w-12 h-12 sm:w-14 sm:h-14 object-cover"
                />
                <h2 className="text-xl sm:text-2xl">
                    Sobre a Escola
                </h2>
            </div>

            {/* CONTEÚDO */}
            <article className="flex flex-col md:flex-row items-center gap-6 bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition">

                {/* TEXTO */}
                <div className="w-full md:w-[70%] text-center md:text-left">
                    
                    <h3 className="text-lg sm:text-xl text-gray-800 mb-2">
                        Instituto Politécnico Industrial de Luanda
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">
                        Uma instituição de ensino dedicada ao crescimento académico e pessoal de seus estudantes
                    </p>

                    {/* MISSÃO */}
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-[#F86417]"></div>
                        <span className="text-gray-600 text-sm sm:text-base">
                            <strong className="font-semibold pr-2">Missão:</strong>
                            Proporcionar uma educação de qualidade incentivando o conhecimento e cidadania
                        </span>
                    </div>

                    {/* BIBLIOTECA */}
                    <div className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-2 rounded-full bg-[#F86417]"></div>
                        <span className="text-gray-600 text-sm sm:text-base">
                            <strong className="font-semibold pr-2">Biblioteca:</strong>
                            Um recurso essencial que apoia os estudantes fornecendo acesso inteligente a livros e materiais didáticos e educacionais
                        </span>
                    </div>
                </div>

                {/* IMAGEM */}
                <div className="w-full md:w-auto flex justify-center">
                    <img 
                        src={LogoIPIL} 
                        alt="logo do IPIL" 
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 object-cover rounded-md"
                    />
                </div>

            </article>
        </section>
    );
}

export default Seccao1;