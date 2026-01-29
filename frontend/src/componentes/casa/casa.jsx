import Cabecalho from "./cabecalho/cabecalho";
import Footer from "./footer/footer";
import Sessao01 from "./sessao01/sessao01";
import Sessao02 from "./sessao02/sessao02";
import Sessao03 from "./sessao03/sessao03";
import Sessao04 from "./sessao04/sessao04";

function Casa() {

    return(
        <div className="overflow-hidden">
            <Cabecalho/>
            <Sessao01/>
            <Sessao02/>
            <Sessao03 props={"popular"}/>
            <Sessao04/>
            <Footer/>
        </div>
    )

}

export default Casa;