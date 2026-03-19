import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import Grafic from "../../layout/grafics/Grafic";
import { useEstatisticasMensais } from "../../layout/tables/utilitarios/Utils";
import TituloGrafico from "./seccoes/titulografico";
import { motion } from "framer-motion";
import TabRelatorios from "../../layout/tables/tabrelatorios/tabrelatorio";


function Relatorios(){

    const rowsTableEstrato = useEstatisticasMensais();

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className=" mt-12 space-y-20">
            <section>
                <HeaderOutle page="relatorios"/>
            </section>
            <section>
                <RotulosOutle page="relatorios"/>
            </section>
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TituloGrafico variant="line"/>
                    <Grafic variant="line" data={rowsTableEstrato} xkey="mes" lines={[
                        {dataKey: "emprestimos"},{dataKey: "devoluicoes", color:"#16a34a", with: 1},]} 
                    />
                </article>
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TituloGrafico variant="bar"/>
                    <Grafic variant="bar" data={rowsTableEstrato} xkey="mes" barkey="multas" />
                </article>
            </section>
            <section className="w-full grid grid-cols-1 border border-black/10 rounded-lg">
                <TabRelatorios/>
            </section>
        </motion.main>
    );
}
export default Relatorios;