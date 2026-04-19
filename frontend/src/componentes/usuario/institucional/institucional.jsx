import { motion } from "framer-motion";
import Cabecalho from "../casa/cabecalho/cabecalho";
import { Link } from "react-router-dom";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2"; 
import Seccao1 from "./seccoes/seccao1";
import Seccao2 from "./seccoes/seccao2";
import Seccao3 from "./seccoes/seccao3";

function Institucional() {
    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gray-100 min-h-screen"
        >
            <Cabecalho />

            {/* CONTAINER PRINCIPAL */}
            <section className="py-24 md:pt-32 pt-36 px-4 md:px-10">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

                    <h1 className="text-2xl sm:text-3xl md:text-4xl  text-center sm:text-left">
                        Institucional
                    </h1>

                    <Link 
                        to="/assistente"
                        className="self-center sm:self-auto text-[#F86417] 
                                   bg-white shadow-md border border-gray-200 
                                   rounded-full p-2 hover:scale-105 transition"
                    >
                        <HiOutlineQuestionMarkCircle size={28} />
                    </Link>

                </div>

                {/* CONTEÚDO */}
                <div className="space-y-5 max-w-6xl mx-auto">

                    <Seccao1 />
                    <Seccao2 />
                    <Seccao3 />

                </div>

            </section>
        </motion.main>
    );
}

export default Institucional;