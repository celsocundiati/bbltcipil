import { useState } from "react";
import axios from "axios";
import { HiOutlineXMark } from "react-icons/hi2";

function ModalLivro({ onClose }) {
  // Estado do formulário (frontend-friendly)
    const [formData, setFormData] = useState({
        titulo: "",
        isbn: "",
        date: "",
        qtd: "",
        descricao: "",
        url: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

  // Atualiza os campos
    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value
        }));
    };

  // Envio para a API (com adaptação para o backend)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

    // 🔁 ADAPTER: frontend → backend
    const payload = {
        isbn: formData.isbn,
        titulo: formData.titulo,
        descricao: formData.descricao,
        quantidade: Number(formData.qtd),
        publicado_em: formData.date,
        capa_url: formData.url,
        autor: "Desconhecido",
        editora: "N/D",
        nPaginas: 1
    };

    try {
        const res = await axios.post("http://127.0.0.1:8000/api/admin/livros/", payload);
        console.log("Livro criado:", res.data.mensagem);

        // Reset do form
        setFormData({
            titulo: "",
            isbn: "",
            date: "",
            qtd: "",
            descricao: "",
            url: ""
        });

        onClose();
        } catch (err) {
        console.error(err);
        setError("Erro ao cadastrar o livro.");
        } finally {
        setLoading(false);
        }
    }


  return (
    <main>
      <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
        <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-black/50 hover:text-black"
          >
            <HiOutlineXMark size={32} />
          </button>

          <header className="mb-4">
            <h2 className="text-xl font-semibold">Adicionar Novo Livro</h2>
            <p className="text-black/60">
              Preencha os dados para registrar o livro
            </p>
          </header>

          <form method="post" onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Título"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                placeholder="Título do livro"
              />

              <Input
                label="ISBN"
                name="isbn"
                type="number"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="9780000000000"
              />

              <Input
                label="Ano de Publicação"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />

              <Input
                label="Quantidade"
                name="qtd"
                type="number"
                value={formData.qtd}
                onChange={handleChange}
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-black/70 mb-1">Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Descrição do livro"
                className="w-full h-24 rounded-md bg-black/5 border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <Input
              label="URL da Capa"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://imagem..."
            />

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border rounded-lg hover:bg-red-500 hover:text-white transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                {loading ? "Salvando..." : "Adicionar Livro"}
              </button>
            </div>
          </form>
        </div>
      </dialog>
     
    </main>
  );
}

/* 🔹 Componente reutilizável */
function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-black/70">{label}</label>
      <input
        {...props}
        required
        className="bg-black/5 rounded-md px-3 py-2 outline-none border border-black/10 focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

export default ModalLivro;
