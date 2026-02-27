import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import axios from "axios";

function ModalEditarPerfil({ form, onClose }) {
  const hoje = new Date();
  const idadeMinima = 14;

  const dataMaximaPermitida = new Date(
    hoje.getFullYear() - idadeMinima,
    hoje.getMonth(),
    hoje.getDate()
  ).toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    n_processo: "",
    curso: "",
    classe: "",
    data_nascimento: "",
    telefone: "",
  });

  const [modal, setModal] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  // Buscar dados do aluno
    useEffect(() => {
        if (!form.n_processo) return;

        setLoading(true);

        axios
            .get(`http://127.0.0.1:8000/api/alunos/${form?.n_processo}/`)
            .then((res) => {
            setFormData(res.data);
            })
            .catch((error) => {
            const erros = error.response?.data
                ? Object.values(error.response.data).flat().join("\n")
                : "Erro ao buscar dados.";
            setModal({ open: true, type: "error", message: erros });
            })
            .finally(() => setLoading(false));
    }, [form?.n_processo]);

    function handleChange(e) {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    }

    async function handleUpdate(e) {
        e.preventDefault();

        try {
            await axios.patch(
                `http://127.0.0.1:8000/api/alunos/${form.n_processo}/`,
                formData
            );

            setModal({
                open: true,
                type: "success",
                message: "Perfil atualizado com sucesso!",
            });

        } catch (error) {
        const erros = error.response?.data
            ? Object.values(error.response.data).flat().join("\t")
            : "Erro ao atualizar.";

        setModal({
            open: true,
            type: "error",
            message: erros,
        });
        }
    }

  if (loading) return null;

  return (
    <main>
      <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
        <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 text-black/50 hover:text-black"
          >
            <HiOutlineXMark size={28} />
          </button>

          <h2 className="text-xl font-semibold mb-4">
            Editar Perfil do Estudante
          </h2>

          <form className="space-y-4" onSubmit={handleUpdate}>
            <div className="grid grid-cols-2 gap-4">

              <select
                name="classe"
                value={formData.classe}
                onChange={handleChange}
                required
                className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                <option value="">Classe</option>
                <option value="10">10ª Classe</option>
                <option value="11">11ª Classe</option>
                <option value="12">12ª Classe</option>
                <option value="13">13ª Classe</option>
              </select>

              <input
                type="text"
                name="curso"
                value={formData.curso}
                onChange={handleChange}
                placeholder="Curso"
                className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                placeholder="Telefone"
                className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <input
                type="date"
                name="data_nascimento"
                value={formData.data_nascimento}
                onChange={handleChange}
                max={dataMaximaPermitida}
                className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
              />

            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-black/10 rounded-lg hover:bg-red-500 hover:text-white transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {modal.open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
          <div className="w-full max-w-lg md:max-w-96 bg-white shadow-xl rounded-2xl p-6 relative">
            <h3 className="font-semibold mb-2">
              {modal.type === "success" ? "Sucesso" : "Erro"}
            </h3>
            <p className="whitespace-pre-line">{modal.message}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setModal({ ...modal, open: false });
                  if (modal.type === "success") onClose();
                }}
                className={`px-6 py-2 text-white rounded-lg cursor-pointer ${
                  modal.type === "success"
                    ? "bg-green-500 hover:bg-green-600 "
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ModalEditarPerfil;