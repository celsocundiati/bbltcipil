import HeaderOutle from "../../layout/outle/headerholte";
import InputAdmin from "../../layout/admInput/input";
import Select from "../../tags/selects/selects";
import Table from "../../layout/tables/Table";
import TabelaLivros from "../../layout/tables/tablivros/tablivros";

function GestaoLivros(){

    return(
        <section>
            <main className="flex flex-col relative flex-wrap space-y-10">
            <section>
                <HeaderOutle page="gestaolivro"/>
            </section>
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl">
                <InputAdmin page="catalogo" type="text" placeholder="Busque por título, autor e categórias"/>
                <Select tipo="categoria" />
                <Select tipo="estado" />
            </section>

            <TabelaLivros/>
        </main>
        </section>
    );
}
export default GestaoLivros;