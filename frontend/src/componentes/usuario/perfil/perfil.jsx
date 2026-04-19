import Configuracoes from "../cards/cardPerfil/CardConfiguracoes";
import MeuPerfil from "../cards/cardPerfil/CardMeuPerfil";
import Cabecalho from "../casa/cabecalho/cabecalho";


function Perfil() {
    return(
        <div>
            <section>
                <Cabecalho/>
            </section>
            <section className="flex flex-col gap-4 sm:flex-row py-46 px-4">
                <MeuPerfil/>
                
                <Configuracoes/>

            </section>
        </div>
    )
}

export default Perfil;