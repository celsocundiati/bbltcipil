import {HiOutlineExclamationTriangle, HiOutlineBookOpen} from "react-icons/hi2";

function Lembrete(){


    const notificacao = [
        {id:1, titulo:"Registou empréstimos", desc01:"Livro: Cultura & Elegância - Estudante: Martine Ruth De Carvalho", desc02:"Cristiano De Carvalho - 12/01/2026 - 18:47"},
        {id:2, titulo:"Adicionou livro", desc01:"Livro: Fundamentos da Programação", desc02:"Cristiano De Carvalho - 12/01/2026 - 19:47"},
        {id:3, titulo:"Aplicou multa", desc01:"Estudante: Gabriel Daniel Tacanho", desc02:"Cristiano De Carvalho - 13/01/2026 - 13:40"},
        {id:4, titulo:"Aprovou reserva", desc01:"Livro: Fundamentos da Programação - Estudante: Alfredo Dos Santos Martins", desc02:"Cristiano De Carvalho - 14/01/2026 - 10:07"},
        {id:5, titulo:"Registou devolução", desc01:"Livro: TICs & IAs - Estudante: Celso Paulo Cundiati Huma", desc02:"Cristiano De Carvalho - 14/01/2026 - 14:00"}
    ]

    return(
        <main className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-15">
            <section className="bg-white border border-black/10 rounded-lg space-y-9 p-5">
                <article>
                    <h1 className="text-xl">Actividades Recentes</h1>
                    <p className="text-lg text-black/70">Últimas acções no sistema</p>
                </article>
                <section className="space-y-9">
                    {notificacao.map((notificacao) =>

                        <article className="rounded px-4 py-2" key={notificacao.id}>
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
            </section>

            <section className="bg-white border border-black/10 rounded-lg space-y-9 p-5">
                <article>
                    <h1 className=" text-xl">Alertas & Notificações</h1>
                    <p className="text-lg text-black/70">Requerem atenção</p>
                </article>
                <div className="w-full border border-red-500 bg-red-100 text-red-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                    <HiOutlineExclamationTriangle size={30} />
                    <span>
                        <p>10 livros com atrasos</p>
                        <p>Requerer contatos com os estudantes</p>
                    </span>
                </div>
                <div className="w-full border border-yellow-500 bg-yellow-100 text-yellow-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                    <HiOutlineExclamationTriangle size={30} />
                    <span>
                        <p>21 reservas pendentes</p>
                        <p>Aguardando aprovação</p>
                    </span>
                </div>
                <div className="w-full border border-blue-500 bg-blue-100 text-blue-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                    <HiOutlineBookOpen size={30} />
                    <span>
                        <p>Inventário agendado</p>
                        <p>Próxima segunda-feira, 23 Jan.</p>
                    </span>
                </div>
            </section>
        </main>
    );
}
export default Lembrete;