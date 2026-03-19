import Tabs from "../../layout/tables/tabs/tabs";
import { motion } from "framer-motion";
import TabCategorias from "../../layout/tables/tabcategorias/tabcategorias";
import HeaderOutle from "../../layout/outle/headerholte";
import TabAutores from "../../layout/tables/tabautores/tabautores";

function CategoriasAutores()
{
    const tabs = [
        {label: "Categorias", content: <TabCategorias />},
        {label: "Autores", content: <TabAutores />}
    ]

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className="mt-12 space-y-10">
            <section>
                <HeaderOutle page="categoriasautores" />
            </section>
            <section>
                <article className="flex text-center">
                    <Tabs tabs={tabs}/>
                </article>
            </section>
                

        </motion.main>
    );
}
export default CategoriasAutores;