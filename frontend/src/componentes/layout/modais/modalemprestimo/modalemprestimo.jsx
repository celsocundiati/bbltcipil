import { HiOutlineXMark } from "react-icons/hi2";
import { useState, useEffect } from "react";
import axios from "axios";

function ModalEmprestimo({ emprestimo, onClose, onSave }) {

  const [formData, setFormData] = useState({
    aluno: "",
    livro: "",
    data_emprestimo: "",
    data_devolucao: ""
  });

  // Preenche os campos quando a modal abre em modo edição
  useEffect(() => {
    if (!emprestimo) return;

    setFormData({
      aluno: emprestimo.aluno ?? "",
      livro: emprestimo.livro ?? "",
      data_emprestimo: emprestimo.data_emprestimo ?? "",
      data_devolucao: emprestimo.data_devolucao ?? ""
    });
  }, [emprestimo]);

  // Handler universal
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

    try {
      const res = await axios.put(
        `http://localhost:8000/api/emprestimos/${emprestimo.id}/`,
        formData
      );

      onSave(res.data);
    } catch (error) {
      console.error("Erro ao atualizar empréstimo:", error);
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
              Atualize os dados do empréstimo selecionado
            </p>
          </article>

          {/* Formulário */}
          <form className="space-y-4" method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">

              {/* Estudante */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Estudante</label>
                <input
                  type="text"
                  name="aluno"
                  value={formData.aluno}
                  // onChange={handleChange}
                  required
                  placeholder="ID ou nome do estudante"
                  className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Livro */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Livro</label>
                <input
                  type="text"
                  name="livro"
                  value={formData.livro}
                  // onChange={handleChange}
                  required
                  placeholder="ISBN ou título do livro"
                  className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Data Empréstimo */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Data de Empréstimo</label>
                <input
                  type="date"
                  name="data_emprestimo"
                  value={formData.data_emprestimo}
                  // onChange={handleChange}
                  required
                  className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Data Devolução */}
              <div className="flex flex-col space-y-1">
                <label className="text-black/75 text-lg">Data de Devolução</label>
                <input
                  type="date"
                  name="data_devolucao"
                  value={formData.data_devolucao}
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
                  className="px-6 py-2 rounded-lg border border-black/10 hover:bg-red-500 hover:text-white transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
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
