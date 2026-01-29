import HeaderOutle from "../../layout/outle/headerholte";
import CardInfo from "./seccoes/CardInfo";

function Configuracoesadmin()
{
    return(
        <main className=" mt-12 space-y-10">
            <section>
                <HeaderOutle page="configuracoes"/>
            </section>
            <section>
                <CardInfo/>
            </section>
        </main>
    );
}
export default Configuracoesadmin;