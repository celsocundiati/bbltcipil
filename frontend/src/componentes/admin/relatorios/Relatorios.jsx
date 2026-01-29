import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import Grafic from "../../layout/grafics/Grafic";
import { rowsTableEstrato } from "../../layout/tables/utilitarios/Utils";
import Estrato from "./seccoes/Estrato";
import TituloGrafico from "./seccoes/titulografico";

function Relatorios()
{
    return(
        <main className=" mt-12 space-y-20">
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
                        {dataKey: "emprestimo"},{dataKey: "devoluicao", color:"#16a34a", with: 1},]} 
                    />
                </article>
                <article className="bg-white border border-black/10 rounded-lg p-8 space-y-12">
                    <TituloGrafico variant="bar"/>
                    <Grafic variant="bar" data={rowsTableEstrato} xkey="mes" barkey="multas" />
                </article>
            </section>
            <section>
                <Estrato/>
            </section>
        </main>
    );
}
export default Relatorios;