import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../service/api/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
        }
      };

      fetchLogs();

  }, [search, acaoFilter, modeloFilter, periodoDias]);

  // 📄 EXPORTAR PDF
  const exportPDF = () => {
    if (!logs || logs.length === 0) {
      alert("Sem dados para exportar neste período.");
      return;
    }

    const doc = new jsPDF();
    const dataAtual = new Date().toLocaleString();
    const totalLogs = logs.length;
    const filtros = `Pesquisa: ${search || "—"}\nAção: ${acaoFilter || "—"}\nModelo: ${modeloFilter || "—"}\nPeríodo: últimos ${periodoDias} dias`;

    // 🔹 Cabeçalho
    doc.setFontSize(16);
    doc.text("BIBLIOTECA IPIL", 14, 15);
    doc.setFontSize(10);
    doc.text("Relatório de Auditoria do Sistema", 14, 22);
    doc.setFontSize(9);
    doc.text(`Gerado em: ${dataAtual}`, 14, 28);

    doc.setFontSize(10);
    doc.text(`Total de Registos: ${totalLogs}`, 14, 38);
    doc.setFontSize(9);
    doc.text("Filtros Aplicados:", 14, 45);
    doc.text(filtros, 14, 50);

    // 🔹 Tabela
    const tableColumn = ["Usuário", "Ação", "Modelo", "ID", "Resumo", "Data"];
    const tableRows = logs.map((log) => {
      const resumo =
        typeof log.alteracoes === "object"
          ? Object.values(log.alteracoes).join(" - ")
          : "—";

      return [
        log.usuario_nome || "—",
        log.acao || "—",
        log.modelo || "—",
        log.objeto_id || "—",
        resumo,
        new Date(log.criado_em).toLocaleString(),
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [249, 123, 23] },
      columnStyles: { 4: { cellWidth: 70 } },
    });

    // 🔹 Rodapé
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

    doc.save(`AuditLog_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // 📊 FORMATAR ALTERAÇÕES
  function logAlteracoes(modelo, alt) {
    const mensagens = {
      Emprestimo: (
        <p className="text-black/70 truncate w-[95%]">
          {[alt.alteracoes?.nome, alt.alteracoes?.livro, alt.alteracoes?.estado].join(" - ")}
        </p>
      ),
      Reserva: (
        <p className="text-black/70 truncate w-[95%]">
          {[alt.alteracoes?.nome, alt.alteracoes?.livro, alt.alteracoes?.estado].join(" - ")}
        </p>
      ),
      Livro: (
        <p className="text-black/70 truncate w-[95%]">
          {[alt.alteracoes?.titulo, alt.alteracoes?.autor].join(" - ")}
        </p>
      ),
      User: (
        <p className="text-black/70 truncate w-[95%]">
          {[alt.alteracoes?.tipo, alt.alteracoes?.identificacao].join(" - ")}
        </p>
      ),
      Categoria: (
        <p className="text-black/70 truncate w-[95%]">
          {[alt.alteracoes?.categoria, alt.alteracoes?.descricao].join(" - ")}
        </p>
      ),
      Autor: (
        <p className="text-black/70">
          {[alt.alteracoes?.autor, alt.alteracoes?.nacionalidade].join(" - ")}
        </p>
      ),
    };

    return mensagens[modelo] || (
      <p className="text-black/70 truncate w-[95%]">Nenhuma ação!</p>
    );
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
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-xl animate-pulse">Carregando dados...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="p-6 mt-30"
    >
      <main className="w-full grid gap-5">
        <section className="bg-white border border-black/10 rounded-lg p-5 space-y-6">
          <div>
            <h1 className="text-xl">Auditoria do Sistema</h1>
            <p className="text-black/70">Últimas ações no sistema</p>
          </div>

          {/* EXPORT PDF */}
          <button
            onClick={exportPDF}
            className="bg-[#F97B17] text-white px-4 py-2 rounded-xl cursor-pointer"
          >
            Exportar PDF
          </button>

          {/* FILTROS */}
          <div className="flex flex-wrap gap-3">
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
          </div>

          {/* LISTA DE LOGS */}
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p>Nenhum log encontrado</p>
            ) : (
              logs.map((log) => (
                <article
                  key={log.id}
                  className={`p-4 rounded cursor-pointer ${bg(log.acao)}`}
                >
                  <Link to={getRedirectPath(log)}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#F97B17] rounded-full"></div>
                      <h2>{log.acao} {log.modelo}</h2>
                    </div>

                    <div className="pl-5">
                      {logAlteracoes(log.modelo, log)}
                      <p className="text-sm text-black/70">
                        {log.usuario_nome} - {new Date(log.criado_em).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

