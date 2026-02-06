import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import InputAdmin from "../../layout/admInput/input";
import Select from "../../tags/selects/selects";
import Table from "../../layout/tables/Table";
import TabelaEmprestimos from "../../layout/tables/tabemprestimos/tabemprestimos";

function Emprestimos()
{
    return(
        <main className="mt-12 space-y-10">
            <section>
                <HeaderOutle page="emprestimos" />
            </section>
            <section>
                <RotulosOutle page="emprestimos" />
            </section>
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl">
                <InputAdmin page="catalogo" type="text" placeholder="Pesquisar empréstimos..."/>
                <Select tipo="todos" />
                {/* <Select tipo="cursos" /> */}
            </section>
            <section>
                <TabelaEmprestimos/>
            </section>
        </main>
    );
}
export default Emprestimos;