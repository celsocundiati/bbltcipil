import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import TitleGrafic from "./seccoes/titulografico";
import { useDataAcervo, useDataReserva } from "../../layout/tables/utilitarios/Utils";
import Grafic from "../../layout/grafics/Grafic";
import Lembrete from "./seccoes/lembrete";
import { motion } from "framer-motion";

function Dashboard(){

    const dataReserva = useDataReserva();
    const dataAcervo = useDataAcervo();

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className="space-y-10">
            <section>
                <HeaderOutle page="dashboard"/>
            </section>
            <section>
                <RotulosOutle page="dashboard"/>
            </section>
            <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TitleGrafic variant="line"/>
                    <Grafic variant="line" data={dataReserva} xkey="mes" lines={[
                        {dataKey: "emprestimos"},{dataKey: "devolucoes", color:"#16a34a", with: 1},]} 
                    />
                </article>
                <article className="bg-branco-100 border border-black/10 rounded-lg p-8 space-y-12">
                    <TitleGrafic variant="bar"/>
                    <Grafic variant="bar" data={dataAcervo} xkey="categoria" barkey="total" />
                </article>
            </section>
            <section>
                <Lembrete/>
            </section>
        </motion.main>
    );
}
export default Dashboard;