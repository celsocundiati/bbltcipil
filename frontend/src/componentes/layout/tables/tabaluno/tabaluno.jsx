import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { obterIniciais } from "../utilitarios/Utils";

function TabAluno() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();

  const fetchPerfis = async () => {
    const token = sessionStorage.getItem("access_token");
    if (!token) return navigate("/login");

    try {
      const res = await axios.get("http://localhost:8000/api/admin/perfil/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 🔹 Filtra apenas perfis do tipo Aluno
      const perfisAlunos = (Array.isArray(res.data.results) ? res.data.results : res.data)
        .filter((perfil) => perfil.tipo === "aluno");
      setAlunos(perfisAlunos);
    } catch (err) {
      console.error("Erro ao carregar perfis", err);
      setErro("Não foi possível carregar os alunos.");
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfis();
  }, []);

  const totalAlunos = alunos.length;

  return (
    <main className="p-5">
      <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
        <section className="py-5 flex flex-col">
          <label className="text-xl font-medium">Lista de Alunos</label>
          <label className="text-black/70">Exibindo {totalAlunos}</label>
        </section>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando alunos...</div>
        ) : erro ? (
          <div className="text-center py-10 text-red-600">{erro}</div>
        ) : (
          <section className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-black/5">
                <tr>
                  <th className="w-[20%] px-5 py-3 text-center">Nome</th>
                  <th className="w-[8%] px-5 py-3 text-center">Nº Processo</th>
                  <th className="w-[12%] px-5 py-3 text-center">Curso</th>
                  <th className="w-[5%] px-5 py-3 text-center">Classe</th>
                  <th className="w-[9%] px-5 py-3 text-center">Estado</th>
                  <th className="w-[11%] px-5 py-3 text-center">Telefone</th>
                  <th className="w-[8%] px-5 py-3 text-center">Reservas</th>
                  <th className="w-[8%] px-5 py-3 text-center">Empréstimos</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10">
                {alunos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-red-700">
                      Nenhum aluno encontrado.
                    </td>
                  </tr>
                ) : (
                  alunos.map((perfil) => {
                    const aluno = perfil.dados_oficiais;
                    return (
                      <tr key={aluno?.n_processo} className="hover:bg-black/3 transition">
                        <td className="px-5 py-4 truncate">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold shrink-0">
                              {obterIniciais(aluno?.nome_completo)}
                            </div>
                            <div className="overflow-hidden">
                              <p className="font-medium truncate">{aluno?.nome_completo}</p>
                              <p className="text-sm text-cinza-900 truncate">{perfil.user?.email || "Nothing"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 truncate text-center">{aluno?.n_processo}</td>
                        <td className="px-5 py-4 truncate text-center">{aluno?.curso}</td>
                        <td className="px-5 py-4 truncate text-center">{aluno?.classe}</td>
                        <td className="px-5 py-4 truncate text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              perfil?.estado === "Ativo"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {perfil?.estado}
                          </span>
                        </td>
                        <td className="px-5 py-4 truncate text-center">{perfil?.telefone}</td>
                        <td className="px-5 py-4 truncate text-center">
                          <span className="px-3 py-1 rounded-lg text-yellow-700 border border-yellow-700 text-sm">
                            {perfil?.n_reservas} livros
                          </span>
                        </td>
                        <td className="px-5 py-4 truncate text-center">
                          <span className="px-3 py-1 rounded-lg text-yellow-700 border border-yellow-700 text-sm">
                            {perfil?.n_emprestimos} livros
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        )}
      </section>
    </main>
  );
}

export default TabAluno;

