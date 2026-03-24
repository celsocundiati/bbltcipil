import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

function ModalAprovarEmprestimo({ reserva, onClose, onSave }) {
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/emprestimos/", {
        reserva: reserva.id
      });

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
    <section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
      whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
      viewport={{ once: true }}             // anima apenas uma vez
    >
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
        <motion.div  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
          whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
          viewport={{ once: true }}             // anima apenas uma vez
          className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">

          {/* Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 hover:text-black cursor-pointer"
          >
            <HiOutlineXMark size={28} />
          </button>

          {/* Cabeçalho */}
          <div className="mb-6">
            <h2 className="text-xl font-medium">
              Aprovar Empréstimo
            </h2>
            <p className="text-black/60">
              Confira os dados e confirme o empréstimo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Estudante */}
            <div className="flex flex-col space-y-1">
              <label className="text-black/70">Nome</label>
              <input
                type="text"
                value={reserva?.usuario_nome || ""}
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
            
            {/* Botões */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                  <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto border cursor-pointer border-black/10 text-black/70 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                  >
                      Cancelar
                  </button>

                  <button
                      type="submit"
                      className="w-full sm:w-auto cursor-pointer bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                      Confirmar empréstimo
                  </button>
              </div>

          </form>

        </motion.div>
      </div>
    </section>
  );
}

export default ModalAprovarEmprestimo;
