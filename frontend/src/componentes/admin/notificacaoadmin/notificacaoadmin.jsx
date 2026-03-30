import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../service/api/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Loading from "../../layout/motion/motion";

export default function AdminAuditLog() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [acaoFilter, setAcaoFilter] = useState("");
  const [modeloFilter, setModeloFilter] = useState("");
  const [periodoDias, setPeriodoDias] = useState(7);
  const [loading, setLoading] = useState(true);

  // 🔥 CONFIG ESCALÁVEL DE ROTAS
  const redirectConfig = {
    Reserva: { path: "/admin/acervo", anchor: (id) => `reserva-${id}` },
    Emprestimo: { path: "/admin/emprestimos", anchor: (id) => `emprestimo-${id}` },
  };

  // 🔥 FUNÇÃO DE REDIRECIONAMENTO DINÂMICO
  function getRedirectPath(log) {
    const config = redirectConfig[log.modelo];
    if (!config) return "#";
    return `${config.path}#${config.anchor(log.objeto_id)}`;
  }

    useEffect(() => {
      const fetchLogs = async () => {
        setLoading(true);
        try {
          const params = {};
          if (search) params.search = search;
          if (acaoFilter) params.acao = acaoFilter;
          if (modeloFilter) params.modelo = modeloFilter;
          if (periodoDias) params.days = periodoDias;

          const response = await api.get("admin/auditlog/", { params });
          setLogs(
            Array.isArray(response.data.results)
              ? response.data.results
              : Array.isArray(response.data)
              ? response.data
              : []
          );
        } catch (err) {
          console.error("Erro ao buscar logs de auditoria", err);
        } finally {
          setLoading(false)
        }
      };

      fetchLogs();

  }, [search, acaoFilter, modeloFilter, periodoDias]);

  const exportPDF = async () => {
    setLoading(true);

    try {
      // 🔥 buscar TODOS os logs com filtros (sem paginação)
      const params = {};
      if (search) params.search = search;
      if (acaoFilter) params.acao = acaoFilter;
      if (modeloFilter) params.modelo = modeloFilter;
      if (periodoDias) params.days = periodoDias;

      // ⚠️ força retorno grande (backend deve permitir)
      params.page_size = 1000;

      const response = await api.get("admin/auditlog/", { params });

      const data = Array.isArray(response.data.results)
        ? response.data.results
        : response.data;

      if (!data || data.length === 0) {
        alert("Sem dados para exportar neste período.");
        return;
      }

      // 🔥 ordenar por data (mais recente primeiro)
      data.sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));

      const doc = new jsPDF();
      const dataAtual = new Date().toLocaleString();

      // 🔥 métricas rápidas
      const totalLogs = data.length;
      const totalCriacoes = data.filter(l => l.acao === "Criou").length;
      const totalAtualizacoes = data.filter(l => l.acao === "Atualizou").length;
      const totalRemocoes = data.filter(l => l.acao === "Removeu").length;

      const filtros = `Pesquisa: ${search || "—"}\nAção: ${acaoFilter || "—"}\nModelo: ${modeloFilter || "—"}\nPeríodo: últimos ${periodoDias} dias`;

      // 🔹 HEADER
      doc.setFontSize(16);
      doc.text("BIBLIOTECA IPIL", 14, 15);

      doc.setFontSize(10);
      doc.text("Relatório de Auditoria do Sistema", 14, 22);

      doc.setFontSize(9);
      doc.text(`Gerado em: ${dataAtual}`, 14, 28);

      doc.setFontSize(10);
      doc.text(`Total de Registos: ${totalLogs}`, 14, 38);

      doc.setFontSize(9);
      doc.text(`Criações: ${totalCriacoes} | Atualizações: ${totalAtualizacoes} | Remoções: ${totalRemocoes}`, 14, 45);

      doc.text("Filtros Aplicados:", 14, 52);
      doc.text(filtros, 14, 57);

      // 🔹 TABELA
      const tableColumn = ["Usuário", "Ação", "Modelo", "ID", "Resumo", "Data"];

      const tableRows = data.map((log) => {
        const resumo = log.alteracoes && typeof log.alteracoes === "object"
        ? Object.entries(log.alteracoes || {}).map(([k, v]) => `${k}: ${v}`).join(" | ") || "—"
        : "—";

        return [
          log.usuario_nome || "Sistema",
          log.acao || "—",
          log.modelo_nome || "—", // 🔥 corrigido
          log.objeto_id || "—",
          resumo,
          new Date(log.criado_em).toLocaleString(),
        ];
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 70,
        styles: {
          fontSize: 7,
          cellPadding: 3,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [249, 123, 23],
        },
        columnStyles: {
          4: { cellWidth: 80 }, // resumo maior
        },
      });

      // 🔹 RODAPÉ
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Página ${i} de ${pageCount}`,
          doc.internal.pageSize.width - 40,
          doc.internal.pageSize.height - 10
        );
      }

      // 🔥 nome inteligente
      const nome = `Audit_${acaoFilter || "all"}_${modeloFilter || "all"}_${periodoDias}d`;
      doc.save(`${nome}.pdf`);

    } catch (err) {
      console.error("Erro ao exportar PDF", err);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false);
    }
  };

  const truncate = (text, maxLength = 100) => {
    if (!text) return "—";
    return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
  };
  
  function logAlteracoes(log) {
    if (!log.alteracoes || Object.keys(log.alteracoes).length === 0) return "Nenhuma ação!";

    return Object.entries(log.alteracoes).map(([k, v], idx) => (
      <span className="w-2/3" key={idx}>
        {truncate(`${k}: ${v}`, 80)} <br />
      </span>
    ));
  }



  // 🎨 CORES POR AÇÃO
  function bg(acao) {
    switch (acao) {
      case "Criou":
      case "Adicionou":
        return "bg-blue-100 text-blue-700";
      case "Atualizou":
        return "bg-yellow-100 text-yellow-700";
      case "Removeu":
      case "Cancelou":
        return "bg-red-100 text-red-700";
      case "Aprovou":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Loading message=""/>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="p-6 mt-30"
    >
      <main className="w-full grid gap-5">
        <section className="bg-white border border-black/10 rounded-lg p-5 space-y-6">
          <section>
            <h1 className="text-xl">Auditoria do Sistema</h1>
            <p className="text-black/70">Últimas ações no sistema</p>
          </section>

          {/* EXPORT PDF */}
          <button
            onClick={exportPDF}
            className="bg-[#F97B17] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            Exportar PDF
          </button>

          {/* FILTROS */}
          <section className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Pesquisar pelo nome completo ou nome de usuário..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-black/10 outline-none focus-within:ring-2 focus-within:ring-[#F97B17] rounded-xl px-3 py-2 flex-1"
            />

            <select
              value={acaoFilter}
              onChange={(e) => setAcaoFilter(e.target.value)}
              className="border border-black/10 cursor-pointer focus-within:ring-2 focus-within:ring-[#F97B17] rounded-xl px-3 py-2 outline-none"
            >
              <option value="">Todas ações</option>
              <option value="Criou">Criou</option>
              <option value="Adicionou">Adicionou</option>
              <option value="Atualizou">Atualizou</option>
              <option value="Aprovou">Aprovou</option>
              <option value="Finalizou">Finalizou</option>
              <option value="Removeu">Removeu</option>
            </select>

            <select
              value={modeloFilter}
              onChange={(e) => setModeloFilter(e.target.value)}
              className="border border-black/10 cursor-pointer focus-within:ring-2 focus-within:ring-[#F97B17] rounded-xl px-3 py-2 outline-none"
            >
              <option value="">Todos modelos</option>
              <option value="Livro">Livro</option>
              <option value="Reserva">Reserva</option>
              <option value="Emprestimo">Empréstimo</option>
            </select>

            <select
              value={periodoDias}
              onChange={(e) => setPeriodoDias(Number(e.target.value))}
              className="border border-black/10 cursor-pointer focus-within:ring-2 focus-within:ring-[#F97B17] rounded-xl px-3 py-2 outline-none"
            >
              <option value={7}>Últimos 7 dias</option>
              <option value={15}>Últimos 15 dias</option>
              <option value={30}>Últimos 30 dias</option>
              <option value={60}>Últimos 60 dias</option>
            </select>
          </section>

          {/* LISTA DE LOGS */}
          <section className="space-y-4">
            {logs.length === 0 ? (
              <p>Nenhum log encontrado</p>
            ) : (
              logs.map((log) => (
                <article
                  key={log.id}
                  className={`p-4 rounded cursor-pointer ${bg(log.acao)}`}
                >
                  <Link to={getRedirectPath(log)}>
                    <section className="flex items-center gap-2">
                      <section className="w-2 h-2 bg-[#F97B17] rounded-full"></section>
                      <h2>{log.acao} {log.modelo_nome || "—"}</h2>
                    </section>

                    <section className="pl-5">
                      {logAlteracoes(log)}
                      <p className="text-sm text-black/70">
                        {log.usuario_nome || "SYSTEM"} - {new Date(log.criado_em).toLocaleString()}
                      </p>
                    </section>
                  </Link>
                </article>
              ))
            )}
          </section>
        </section>
      </main>
    </motion.section>
  );
}

