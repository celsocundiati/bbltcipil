import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import InputAdmin from "../../layout/admInput/input";
import Select from "../../tags/selects/selects";
import Table from "../../layout/tables/Table";

function Multas(){

    return(
        <main className="w-full grid grid-cols-1 space-y-20">
            <HeaderOutle page="multas"/>
            <RotulosOutle page="multas"/>
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                <InputAdmin type="text" placeholder="Busque por estudante ou estado..."/>
                <Select tipo="estadoemprestimo" />
            </section>
            <Table tipo="multas"/>
        </main>
    );

}
export default Multas;