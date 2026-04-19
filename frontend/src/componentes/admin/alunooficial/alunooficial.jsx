import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import InputAdmin from "../../layout/admInput/input";
import Select from "../../tags/selects/selects";
import TabALunosOficiais from "../../layout/tables/tabalunooficial/tabalunooficial";

function AlunosOficais()
{
    return(
        <main className=" mt-12 space-y-10">
            <section>
                <HeaderOutle page="alunosoficiais"/>
            </section>
            <section>
                <RotulosOutle page="estudantes" />
            </section>
            <section className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl flex-col md:flex-row">
                <InputAdmin page="catalogo" type="text" placeholder="Busque por estudante, curso..."/>
                <Select tipo="todos" />
                <Select tipo="cursos" />
            </section>
            <section>
                <TabALunosOficiais />
            </section>
        </main>
    );
}
export default AlunosOficais;