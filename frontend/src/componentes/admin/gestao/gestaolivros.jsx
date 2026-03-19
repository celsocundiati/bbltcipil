import HeaderOutle from "../../layout/outle/headerholte";
import { motion } from "framer-motion";
import TabelaLivros from "../../layout/tables/tablivros/tablivros";

function GestaoLivros(){

    return(
        <motion.section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
            >
            <main className="flex flex-col relative flex-wrap space-y-10">
                <section>
                    <HeaderOutle page="gestaolivro"/>
                </section>

                <TabelaLivros/>
            </main>
        </motion.section>
    );
}
export default GestaoLivros;