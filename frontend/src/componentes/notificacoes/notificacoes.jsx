import ListaNotificacoes from "../layout/tables/tabnotificacoes/TabNotificacoes";

function Notificacoes(){
    return(
        <section className="mt-30">
            <h1 className="text-2xl font-medium">Notificações</h1>
            <section>
                <ListaNotificacoes/>
            </section>
        </section>
    );
}
export default Notificacoes;