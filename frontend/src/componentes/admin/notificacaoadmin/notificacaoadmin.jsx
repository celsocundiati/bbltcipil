import { useState, useEffect } from "react";
import axios from "axios";
import { HiCheckCircle, HiPencil, HiTrash, HiShieldCheck } from "react-icons/hi2";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Componente para badges de ação
function Badge({ acao }) {
  let color, icon;

  switch (acao) {
    case "create":
      color = "bg-blue-100 text-blue-700";
      icon = <HiCheckCircle size={18} />;
      break;
    case "update":
      color = "bg-yellow-100 text-yellow-700";
      icon = <HiPencil size={18} />;
      break;
    case "delete":
      color = "bg-red-100 text-red-700";
      icon = <HiTrash size={18} />;
      break;
    case "approve":
      color = "bg-green-100 text-green-700";
      icon = <HiShieldCheck size={18} />;
      break;
    default:
      color = "bg-gray-100 text-gray-700";
      icon = null;
  }

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${color}`}>
      {icon} {acao}
    </span>
  );
}

// Componente principal Audit Log
export default function AdminAuditLog() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [acaoFilter, setAcaoFilter] = useState("");
  const [modeloFilter, setModeloFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (acaoFilter) params.acao = acaoFilter;
      if (modeloFilter) params.modelo = modeloFilter;

      const token = sessionStorage.getItem("access_token");

      const response = await axios.get("http://127.0.0.1:8000/api/admin/auditlog/", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(Array.isArray(response.data.results) 
      ? response.data.results 
      : Array.isArray(response.data) 
        ? response.data 
        : []);
    } catch (err) {
      console.error("Erro ao buscar logs de auditoria", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [search, acaoFilter, modeloFilter]);

  // Exportação para PDF
  const exportPDF = () => {
    const doc = new jsPDF("p", "pt");
    const tableColumn = ["Usuário", "Ação", "Modelo", "Objeto ID", "Alterações", "Data"];
    const tableRows = [];

    logs.forEach((log) => {
      const alteracoesFormatadas = JSON.stringify(log.alteracoes, null, 2);
      tableRows.push([log.usuario_nome, log.acao, log.modelo, log.objeto_id, alteracoesFormatadas, new Date(log.criado_em).toLocaleString()]);
    });

    doc.text("Audit Log - Sistema", 40, 30);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 50,
      styles: { fontSize: 8, cellWidth: "wrap" },
      columnStyles: { 4: { cellWidth: 150 } } // Alterações podem ser longas
    });

    doc.save(`AuditLog_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Auditoria do Sistema</h1>

      <button
        onClick={exportPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-4"
      >
        Exportar PDF
      </button>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisar por usuário ou modelo"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 flex-1"
        />
        <select
          value={acaoFilter}
          onChange={(e) => setAcaoFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Todas ações</option>
          <option value="create">Criou</option>
          <option value="update">Atualizou</option>
          <option value="delete">Removeu</option>
          <option value="approve">Aprovou</option>
        </select>
        <select
          value={modeloFilter}
          onChange={(e) => setModeloFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="">Todos modelos</option>
          <option value="Livro">Livro</option>
          <option value="Reserva">Reserva</option>
          <option value="Emprestimo">Empréstimo</option>
          <option value="LoginAdmin">Login Admin</option>
        </select>
      </div>

      {/* Tabela de logs */}
      <div className="overflow-x-auto">
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="min-w-full border border-gray-200 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Usuário</th>
                <th className="px-4 py-2 text-left">Ação</th>
                <th className="px-4 py-2 text-left">Modelo</th>
                <th className="px-4 py-2 text-left">Objeto ID</th>
                <th className="px-4 py-2 text-left">Alterações</th>
                <th className="px-4 py-2 text-left">Data</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">Nenhum log encontrado</td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log.id || index} className="border-t border-gray-200">
                    <td className="px-4 py-2">{log.usuario_nome}</td>
                    <td className="px-4 py-2"><Badge acao={log.acao} /></td>
                    <td className="px-4 py-2">{log.modelo}</td>
                    <td className="px-4 py-2">{log.objeto_id}</td>
                    <td className="px-4 py-2">
                      <pre className="text-xs bg-gray-50 p-2 rounded max-h-32 overflow-auto">
                        {JSON.stringify(log.alteracoes, null, 2)}
                      </pre>
                    </td>
                    <td className="px-4 py-2">{new Date(log.criado_em).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}