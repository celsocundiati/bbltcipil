import {HiOutlineExclamationTriangle, HiOutlineBookOpen, HiOutlineClock} from "react-icons/hi2";
import { useState, useEffect } from "react";
import api from "../../../service/api/api";
import { useDataStates } from "../../../layout/tables/utilitarios/Utils";

function Lembrete(){
    
  const [logs, setLogs] = useState([]);
  const alertas = useDataStates();

  const fetchLogs = async () => {
    try {

      const response = await api.get("admin/auditlog/");

      setLogs(Array.isArray(response.data.results) 
      ? response.data.results
      : Array.isArray(response.data.slice(0, 6)) 
        ? response.data.slice(0, 6)
        : []);
    } catch (err) {
      console.error("Erro ao buscar logs de auditoria", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  function logAlteracoes(modelo, alt){

    const mensagens = {
        "Emprestimo" : (
            <p className="text-black/70 truncate w-[95%]">{[alt.alteracoes?.nome, alt.alteracoes?.livro, alt.alteracoes?.estado].join(' - ')}</p>
        ),
        "Reserva" : (
            <p className="text-black/70 truncate w-[95%]">{[alt.alteracoes?.nome, alt.alteracoes?.livro, alt.alteracoes?.estado].join(' - ')}</p>
        ),
        "User" : (
            <p className="text-black/70 truncate w-[95%]">{[alt.alteracoes?.tipo, alt.alteracoes?.identificacao].join(' - ')}</p>
        ),
        "Categoria" : (
            <p className="text-black/70 truncate w-[95%]">{[alt.alteracoes?.categoria, alt.alteracoes?.descricao].join(' - ')}</p>
        ),
        "Autor" : (
            <p className="text-black/70">{[alt.alteracoes?.autor, alt.alteracoes?.nacionalidade].join(' - ')}</p>
        ),
    };

    return mensagens[modelo] || <p className="text-black/70 truncate w-[95%]">Nenhuma ação!</p>;
  }

    return(
        <main className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-15">
            <section className="bg-white border border-black/10 rounded-lg space-y-9 p-5">
                <article>
                    <h1 className="text-xl">Actividades Recentes</h1>
                    <p className="text-lg text-black/70">Últimas acções no sistema</p>
                </article>
                <section className="space-y-9">
                    {logs.length === 0 ? (
                        <p className="text-black/70">Nenhum log encontrado</p>
                    ) : (
                        logs.map((log) => (

                            <article className="rounded px-4 py-2" key={log.id}>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 bg-[#F97B17] rounded-full"></div>
                                    <h2>{log.acao} {log.modelo}</h2>
                                </div>
                                <section className="px-5">
                                    {logAlteracoes(log.modelo, log )}
                                    <p className="text-black/70">{log.usuario_nome} - {new Date(log.criado_em).toLocaleString()}</p>
                                </section>
                            </article>
                        ))
                    )}
                </section>
            </section>
            
            <section className="bg-white border border-black/10 rounded-lg space-y-9 p-5">
                <article>
                    <h1 className="text-xl">Alertas & Notificações</h1>
                    <p className="text-lg text-black/70">Requerem atenção</p>
                </article>

                {/* Verifica se os alertas estão carregados e se todos são zero */}
                {!alertas?.alertas ||
                (alertas.alertas.livros_atrasados === 0 &&
                alertas.alertas.reservas_pendentes === 0) ? (
                    <p className="text-black/70 text-center">Nenhuma alerta encontrada</p>
                ) : (
                    <>
                        {/* Livros atrasados */}
                        {alertas.alertas.livros_atrasados > 5 && (
                            <div className="w-full border border-red-500 bg-red-100 text-red-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                                <HiOutlineExclamationTriangle size={30} />
                                <span>
                                    <p>{alertas.alertas.livros_atrasados} livros com atrasos</p>
                                    <p>Requerer contatos com os estudantes</p>
                                </span>
                            </div>
                        )}

                        {/* Reservas pendentes */}
                        {alertas.alertas.reservas_pendentes > 5 && (
                            <div className="w-full border border-yellow-500 bg-yellow-100 text-yellow-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                                <HiOutlineClock size={30} />
                                <span>
                                    <p>{alertas.alertas.reservas_pendentes} reservas pendentes</p>
                                    <p>Aguardando aprovação</p>
                                </span>
                            </div>
                        )}

                        {/* Inventário próximo */}
                        {alertas.alertas.inventario_proximo && (
                            <div className="w-full border border-blue-500 bg-blue-100 text-blue-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                                <HiOutlineBookOpen size={30} />
                                <span>
                                    <p>Inventário agendado</p>
                                    <p>{alertas.alertas.inventario_proximo}</p>
                                </span>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
export default Lembrete;