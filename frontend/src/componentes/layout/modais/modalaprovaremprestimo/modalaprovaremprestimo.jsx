import { HiOutlineXMark } from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";

function ModalAprovarEmprestimo({ reserva, onClose, onSave }) {

  const hoje = new Date()

  
    const dataMínimaPermitida = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    ).toISOString().split("T")[0];

  const [dataDevolucao, setDataDevolucao] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataDevolucao) {
      alert("Defina a data de devolução.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/emprestimos/",
        {
          reserva: reserva.id,
          data_devolucao: dataDevolucao
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
      } else {
        alert("Erro ao comunicar com o servidor.");
      }

      console.error(error);
    }
  };

  return (
    <section>
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
        <div className="w-1/2 bg-white shadow-xl rounded-2xl p-6 relative">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 hover:text-black"
          >
            <HiOutlineXMark size={28} />
          </button>

          {/* Cabeçalho */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Aprovar Empréstimo
            </h2>
            <p className="text-black/60">
              Confirme os dados e defina a data de devolução.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Estudante */}
            <div className="flex flex-col space-y-1">
              <label className="text-black/70">Estudante</label>
              <input
                type="text"
                value={reserva?.aluno_nome || ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed outline-none py-2 px-3 rounded-lg"
              />
            </div>

            {/* Livro */}
            <div className="flex flex-col space-y-1">
              <label className="text-black/70">Livro</label>
              <input
                type="text"
                value={reserva?.livro_nome || ""}
                readOnly
                className="bg-gray-100 cursor-not-allowed outline-none py-2 px-3 rounded-lg"
              />
            </div>

            {/* Data de Devolução */}
            <div className="flex flex-col space-y-1">
              <label className="text-black/70">Data de Devolução</label>
              <input
                type="date"
                value={dataDevolucao}
                min={dataMínimaPermitida}
                onChange={(e) => setDataDevolucao(e.target.value)}
                required
                className="outline-none py-2 px-3 rounded-lg border border-black/10 focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg border hover:bg-red-500 hover:text-white transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
              >
                Confirmar Empréstimo
              </button>
            </div>

          </form>

        </div>
      </div>
    </section>
  );
}

export default ModalAprovarEmprestimo;
