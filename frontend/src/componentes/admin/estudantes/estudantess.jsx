import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import TabAluno from "../../layout/tables/tabaluno/tabaluno";
import TabFuncionario from "../../layout/tables/tabfuncionario/tabfuncionario";
import Tabs from "../../layout/tables/tabs/tabs";
import { motion } from "framer-motion";

function Estudantes(){
    
    const tabs = [
        {label: "Alunos", content: <TabAluno />},
        {label: "Funcionários", content: <TabFuncionario />}
    ]

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
            className=" mt-12 space-y-10">
            <section>
                <HeaderOutle page="perfil"/>
            </section>
            <section>
                <RotulosOutle page="perfil" />
            </section>
            <section>
                <Tabs tabs={tabs}/>
            </section>
        </motion.main>
    );
}
export default Estudantes;