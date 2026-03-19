import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import TabelaEmprestimos from "../../layout/tables/tabemprestimos/tabemprestimos";
import { motion } from "framer-motion";

function Emprestimos(){
    
    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
            className="mt-12 space-y-10">
            <section>
                <HeaderOutle page="emprestimos" />
            </section>
            <section>
                <RotulosOutle page="emprestimos" />
            </section>
            <section>
                <TabelaEmprestimos/>
            </section>
        </motion.main>
    );
}
export default Emprestimos;