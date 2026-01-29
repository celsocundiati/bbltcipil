import { LuSearch } from "react-icons/lu";
import { motion } from "framer-motion";

function Sessao01() {

    const texto_principal = "Bem-vindo à Biblioteca IPIL";
    const texto_base = "Explore nosso acervo digital e reserve seus livros favoritos com apenas alguns cliques.";

    return (
        <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className="pt-16"
        >
            <div className="flex flex-col justify-center items-start text-center gap-9 px-5 bg-[#F86417] h-80">
                <div className="flex flex-col justify-center items-start gap-2">
                    <h1 className="text-white text-3xl">{texto_principal}</h1>
                    <p className="text-white">{texto_base}</p>
                </div>
                <div className="flex justify-center items-center lg:w-2xl w-full relative">
                    <input
                        type="text"
                        name="pesquisaSess01"
                        placeholder="Buscar por título, autor ou categoria..."
                        className="p-2 text-xs bg-white w-full focus:outline-2 focus:outline-yellow-100 rounded-xl"
                    />
                    <button className="absolute right-0 bg-[#F86417] h-full cursor-pointer rounded-r-xl">
                        <LuSearch className="text-white size-7 p-1" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default Sessao01;