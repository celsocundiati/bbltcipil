
function LogsAdmins(){

    const notificacao = [
        {id:1, titulo:"Registou empréstimos", desc01:"Livro: Cultura & Elegância - Estudante: Martine Ruth De Carvalho", desc02:"Cristiano De Carvalho - 12/01/2026 - 18:47"},
        {id:2, titulo:"Adicionou livro", desc01:"Livro: Fundamentos da Programação", desc02:"Cristiano De Carvalho - 12/01/2026 - 19:47"},
        {id:3, titulo:"Aplicou multa", desc01:"Estudante: Gabriel Daniel Tacanho", desc02:"Cristiano De Carvalho - 13/01/2026 - 13:40"},
        {id:4, titulo:"Aprovou reserva", desc01:"Livro: Fundamentos da Programação - Estudante: Alfredo Dos Santos Martins", desc02:"Cristiano De Carvalho - 14/01/2026 - 10:07"},
        {id:5, titulo:"Registou devolução", desc01:"Livro: TICs & IAs - Estudante: Celso Paulo Cundiati Huma", desc02:"Cristiano De Carvalho - 14/01/2026 - 14:00"}
    ]

    return(
        <main className="bg-white border border-black/10 px-5 py-5 rounded-lg">
            <section className="py-5 flex flex-col">
                <label className="text-xl">Logs de Actividades</label>
                <label className="text-black/70">Últimas acções dos administradores</label>
            </section>

            <section className="space-y-9">
                {notificacao.map((notificacao) =>

                    <article className="bg-black/4 rounded px-4 py-2" key={notificacao.id}>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-[#F97B17] rounded-full"></div>
                            <h2>{notificacao.titulo}</h2>
                        </div>
                        <section className="px-5">
                            <p className="text-black/70">{notificacao.desc01}</p>
                            <p className="text-black/70">{notificacao.desc02}</p>
                        </section>
                    </article>

                )}
            </section>
        </main>
    );
}
export default LogsAdmins;