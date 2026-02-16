import TabNotificacoes from "../tables/tabnotificacoes/TabNotificacoes";

function Notificacoes(){
    return(
        <main className="mt-30">
            <h1 className="text-2xl font-medium">Notificações</h1>
            <section>
                <TabNotificacoes/>
            </section>
        </main>
    );
}
export default Notificacoes;