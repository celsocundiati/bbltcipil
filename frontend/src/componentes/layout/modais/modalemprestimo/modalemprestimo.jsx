import { HiOutlineXMark } from "react-icons/hi2";
import { useState, useEffect } from "react";
import axios from "axios";

function ModalEmprestimo({ emprestimo, onClose, onSave }) {

  // Apenas o que pode ser alterado
  const [formData, setFormData] = useState({
    data_devolucao: ""
  });

  // Preenche o formulário ao abrir a modal
  useEffect(() => {
    if (!emprestimo) return;

    setFormData({
      data_devolucao: emprestimo.data_devolucao ?? ""
    });
  }, [emprestimo]);

  // Handler controlado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submissão (UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regra básica: devolução não pode ser antes do empréstimo
    if (formData.data_devolucao < emprestimo.data_emprestimo) {
      alert("A data de devolução não pode ser anterior à data de empréstimo.");
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/emprestimos/${emprestimo.id}/`,
        {
          data_devolucao: formData.data_devolucao
        }
      );

      onSave(res.data);
      onClose();
    } catch (error) {
          if (error.response?.data) {
          const erros = Object.values(error.response.data)
              .flat()
              .join("\n");

          alert(erros);
          setErro(erros);
        } else {
            alert("Erro ao comunicar com o servidor");
        }

        console.error(err);

      } 
  };

  return (
    <section>
      <dialog className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center w-full h-full">
        <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative">

          {/* Botão fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 hover:text-black"
          >
            <HiOutlineXMark size={32} />
          </button>

          {/* Cabeçalho */}
          <article className="py-4">
            <h2 className="text-xl font-medium">
              Editar Empréstimo
            </h2>
            <p className="text-black/70">
              Atualize apenas os dados permitidos do empréstimo
            </p>
          </article>

          {/* Formulário */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">

              {/* Estudante (read-only) */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Estudante</label>
                <input
                  type="text"
                  value={emprestimo?.aluno_nome || ""}
                  readOnly
                  className="bg-black/5 cursor-not-allowed outline-none py-2 px-3 rounded-lg"
                />
              </div>

              {/* Livro (read-only) */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Livro</label>
                <input
                  type="text"
                  value={emprestimo?.livro_nome || ""}
                  readOnly
                  className="bg-black/5 cursor-not-allowed outline-none py-2 px-3 rounded-lg"
                />
              </div>

              {/* Data de Empréstimo (read-only) */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Data de Empréstimo</label>
                <input
                  type="date"
                  value={emprestimo?.data_emprestimo || ""}
                  readOnly
                  className="bg-black/5 cursor-not-allowed outline-none py-2 px-3 rounded-lg"
                />
              </div>

              {/* Data de Devolução (editável) */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Data de Devolução</label>
                <input
                  type="date"
                  name="data_devolucao"
                  value={formData.data_devolucao}
                  min={emprestimo?.data_emprestimo}
                  onChange={handleChange}
                  required
                  className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Ações */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg border border-black/10 hover:bg-red-500 hover:text-white transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>

            </div>
          </form>

        </div>
      </dialog>
    </section>
  );
}

export default ModalEmprestimo;
