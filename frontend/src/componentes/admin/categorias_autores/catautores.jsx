import Tabs from "../../layout/tables/tabs/tabs";
import Table from "../../layout/tables/Table";
import HeaderOutle from "../../layout/outle/headerholte";

function CategoriasAutores()
{
    const tabs = [
        {label: "Categórias", content: <Table tipo="categorias" />},
        {label: "Autores", content: <Table tipo="autores" />}
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