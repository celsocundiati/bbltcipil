import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import InputAdmin from "../../layout/admInput/input";
import Select from "../../tags/selects/selects";
import { motion } from "framer-motion";
import TabMultas from "../../layout/tables/tabmultas/tabmultas";

function Multas(){

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
            className="w-full grid grid-cols-1 space-y-20">
            <HeaderOutle page="multas"/>
            <RotulosOutle page="multas"/>
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                <InputAdmin type="text" placeholder="Busque por estudante ou estado..."/>
                <Select tipo="estadoemprestimo" />
            </section>
            <TabMultas/>
        </motion.main>
    );

}
export default Multas;