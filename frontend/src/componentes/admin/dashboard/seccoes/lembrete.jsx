import {HiOutlineExclamationTriangle, HiOutlineBookOpen, HiOutlineClock} from "react-icons/hi2";
import { useState, useEffect } from "react";
import api from "../../../service/api/api";
import { useResumoGeral } from "../../../layout/tables/utilitarios/Utils";

function Lembrete(){
    
  const [logs, setLogs] = useState([]);
  const alertas = useResumoGeral();

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

  
    function logAlteracoes(alt) {
        if (!alt.alteracoes) {
            return <p>Nenhuma ação!</p>;
        }

        const lista = Object.entries(alt.alteracoes).map(([campo, valor]) => {
            // formato { antes, depois }
            if (
            typeof valor === "object" &&
            valor !== null &&
            ("antes" in valor || "depois" in valor)
            ) {
            return `${campo}: ${valor.antes ?? "-"} → ${valor.depois ?? "-"}`;
            }

            // formato simples
            return `${campo}: ${valor}`;
        });

        return (
            <div className="text-black/70 text-sm space-y-1">
            {lista.map((item, i) => (
                <p key={i}>{item}</p>
            ))}
            </div>
        );
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
                                    <h2>{log.acao} {log.modelo_nome}</h2>
                                </div>
                                <section className="px-5">
                                    {logAlteracoes(log)}
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

                {!alertas?.alertas ||
                (
                    !alertas.alertas.alerta_atrasos &&
                    !alertas.alertas.alerta_reservas &&
                    !alertas.alertas.alerta_multas &&
                    !alertas.alertas.inventario_proximo
                ) ? (
                    <p className="text-black/70 text-center">
                    Nenhum alerta encontrado
                    </p>
                ) : (
                    <div className="space-y-4">

                    {/* livros atrasados */}
                    {alertas.alertas.alerta_atrasos && (
                        <div className="w-full border border-red-500 bg-red-100 text-red-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                        <HiOutlineExclamationTriangle size={30} />
                        <span>
                            <p>
                            {alertas.alertas.livros_atrasados} livros com atrasos
                            </p>
                            <p>Requer contacto com os estudantes</p>
                        </span>
                        </div>
                    )}

                    {/* reservas */}
                    {alertas.alertas.alerta_reservas && (
                        <div className="w-full border border-yellow-500 bg-yellow-100 text-yellow-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                        <HiOutlineClock size={30} />
                        <span>
                            <p>
                            {alertas.alertas.reservas_pendentes} reservas pendentes
                            </p>
                            <p>Aguardando aprovação ou levantamento</p>
                        </span>
                        </div>
                    )}

                    {/* multas */}
                    {alertas.alertas.alerta_multas && (
                        <div className="w-full border border-red-500 bg-red-100 text-red-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                        <HiOutlineExclamationTriangle size={30} />
                        <span>
                            <p>
                            {alertas.alertas.multas_pendentes} multas pendentes
                            </p>
                            <p>Necessário acompanhamento</p>
                        </span>
                        </div>
                    )}

                    {/* inventário */}
                    {alertas.alertas.inventario_proximo && (
                        <div className="w-full border border-blue-500 bg-blue-100 text-blue-700 flex items-center p-1 h-20 gap-3 rounded-lg px-5">
                        <HiOutlineBookOpen size={30} />
                        <span>
                            <p>Inventário agendado</p>
                            <p>{alertas.alertas.inventario_proximo}</p>
                        </span>
                        </div>
                    )}

                    </div>
                )}
                </section>
        </main>
    );
}
export default Lembrete;