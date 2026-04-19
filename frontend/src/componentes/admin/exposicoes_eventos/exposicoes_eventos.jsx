import Tabs from "../../layout/tables/tabs/tabs";
import { motion } from "framer-motion";
import TabExposicoes from "../../layout/tables/tabexposicoes/tabexposicoes";
import HeaderOutle from "../../layout/outle/headerholte";
import TabEventos from "../../layout/tables/tabeventos/tabeventos";

function ExposicoesEventos()
{
    const tabs = [
        {label: "Exposições", content: <TabExposicoes />},
        {label: "Eventos", content: <TabEventos />}
    ]

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className="mt-12 space-y-10">
            <section>
                <HeaderOutle page="exposicoeseventos" />
            </section>
            <section>
                <article className="flex text-center">
                    <Tabs tabs={tabs}/>
                </article>
            </section>
                

        </motion.main>
    );
}
export default ExposicoesEventos;