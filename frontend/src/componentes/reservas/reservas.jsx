import { div } from "framer-motion/client";
import Cabecalho from "../casa/cabecalho/cabecalho";
import Welcome from "../catalogo/seccoes/Welcome";

import Footer from "../casa/footer/footer";
import { motion } from "framer-motion";
import CardReservas from "../cards/cardReservas/reservas";

function Reservas(){
    return(
        <div>
            <Cabecalho/>
            <Welcome titulo="Minhas Reservas" paragrafo="Gerencie suas reservas e empréstimos"/>
            <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                    whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                    viewport={{ once: true }}             // anima apenas uma vez
                className=" px-5">
                <p className="flex items-center gap-2 text-xl">Reservas Ativas <div className="bg-green-400 w-3 h-3 rounded-full"></div></p>
            </motion.div>
            <CardReservas/>
            <Footer/>
        </div>
    )
}

export default Reservas;