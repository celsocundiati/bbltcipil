import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";

function ModalMultas({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    emprestimo: "",
    motivo: ""
  });

  const [emprestimos, setEmprestimos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEmprestimos, setLoadingEmprestimos] = useState(false);

  // 🔹 Buscar empréstimos disponíveis
  useEffect(() => {
    const fetchEmprestimos = async () => {
      try {
        setLoadingEmprestimos(true);
        const res = await api.get("/admin/multas/emprestimos_disponiveis/");
        setEmprestimos(res.data);
      } catch (err) {
        console.error("Erro ao buscar empréstimos", err);
      } finally {
        setLoadingEmprestimos(false);
      }
    };

    fetchEmprestimos();
  }, []);

  // 🔹 Submeter
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emprestimo || !formData.motivo) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      await api.post("/admin/multas/", formData);

    //   onSuccess(); // 🔥 atualiza tabela
      onClose();

    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Resposta do backend:", err.response?.data);
      alert("Erro ao criar multa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <dialog className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center w-full h-full">
        <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 hover:text-black"
          >
            <HiOutlineXMark size={32} />
          </button>

          {/* Cabeçalho */}
          <article className="py-4">
            <h2 className="text-xl font-medium">Aplicar Multa</h2>
            <p className="text-black/70">
              O sistema calcula automaticamente o valor com base nas regras.
            </p>
          </article>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* 🔥 DROPDOWN INTELIGENTE */}
            <div>
              <label className="text-black/75 text-lg">Empréstimo</label>

              {loadingEmprestimos ? (
                <p className="text-sm text-black/50">Carregando empréstimos...</p>
              ) : (
                <select
                  value={formData.emprestimo}
                  onChange={(e) =>
                    setFormData({ ...formData, emprestimo: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#f97b17] outline-none cursor-pointer"
                  required
                >
                  <option value="">Selecione um empréstimo</option>

                  {emprestimos.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.usuario} — {e.livro} ({e.estado})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* 🔹 Motivo */}
            <div>
              <label className="text-black/75 text-lg">Motivo</label>
              <select
                value={formData.motivo}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-black/10 focus:ring-2 focus:ring-[#f97b17] outline-none cursor-pointer"
                required
              >
                <option value="">Selecione</option>
                <option value="Atraso">Atraso</option>
                <option value="Dano">Dano</option>
                <option value="Perda">Perda</option>
              </select>
            </div>

            {/* 🔹 Feedback visual */}
            <div className="text-sm text-black/50">
              💡 O valor da multa será definido automaticamente pelo sistema.
            </div>

            {/* Ações */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border border-black/10 hover:bg-red-500 hover:text-white transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                {loading ? "Salvando..." : "Aplicar Multa"}
              </button>
            </div>

          </form>
        </div>
      </dialog>
    </section>
  );
}

export default ModalMultas;
