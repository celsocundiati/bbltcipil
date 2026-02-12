import Tabs from "../../layout/tables/tabs/tabs";
import Table from "../../layout/tables/Table";
import TabCategorias from "../../layout/tables/tabcategorias/tabcategorias";
import HeaderOutle from "../../layout/outle/headerholte";
import TabAutores from "../../layout/tables/tabautores/tabautores";

function CategoriasAutores()
{
    const tabs = [
        {label: "Categórias", content: <TabCategorias />},
        {label: "Autores", content: <TabAutores />}
    ]
    return(
        <main className="mt-12 space-y-10">
            <section>
                <HeaderOutle page="categoriasautores" />
            </section>
            <section>
                <article className="flex text-center">
                    <Tabs tabs={tabs}/>
                </article>
            </section>
                

        </main>
    );
}
export default CategoriasAutores;