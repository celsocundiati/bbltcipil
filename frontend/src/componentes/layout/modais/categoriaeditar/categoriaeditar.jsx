import { useEffect, useState } from "react";
import axios from "axios";
import {HiOutlineXMark} from "react-icons/hi2";

function CategoriaEditar({ categoria ,onClose, setCategorias }) {

  const [formData, setFormData] = useState({
    nome: "",
    descricao: ""
  });
    const [modal, setModal] = useState({
      open: false,
      type: "success", // "success" ou "error"
      message: "",
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(false);

  // 🔹 Buscar dados da categoria selecionada ao abrir
  useEffect(() => {
    if (categoria?.id) {
      setLoading(true);

      axios
        .get(`http://127.0.0.1:8000/api/categorias/${categoria.id}/`)
        .then(res => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(err => {
            if (err.response?.data) {
                const erros = Object.values(error.response.data)
                    .flat()
                    .join("\n");

                alert(erros);
                setErro(erros);
            }
        });
    }
  }, [categoria]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/categorias/${categoria.id}/`,
        formData
      );
      setModal({
          open: true,
          type: "success",
          message: "Categória atualizada com sucesso!",
      });

      // Atualizar lista sem recarregar tudo
      setCategorias(prev =>
        prev.map(cat => (cat.id === categoria.id ? response.data : cat))
      );

      onClose();

    } catch (error) {
      if (err.response?.data) {
        const erros = Object.values(error.response.data)
            .flat()
            .join("\n");

            setModal({
                open: true,
                type: "error",
                message: erros,
            });
        setErro(erros);
      }
    }
  }

  if (!categoria) return null;


  return (
    <section>
        <dialog className="fixed inset-0 z-50 bg-black/20 h-full w-full flex items-center justify-center rounded-xl border border-black/10">
            <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black"
                    >
                    <HiOutlineXMark size={35}/>
                </button>
                <article className="py-4 text-left">
                    <h2 className="text-xl font-medium">Atualizar Categoria</h2>
                    <p className="text-lg text-black/60">Atualize informações da categoria</p>
                </article>

                {loading ? (
                <div className="py-6 text-center text-black/60">A carregar...</div>
                ) : (
                <form onSubmit={handleUpdate} className="space-y-4">

                    <div className="grid grid-cols-1 gap-2">

                        <div className="flex flex-col gap-1">
                            <label className="text-black/75 text-lg text-left">Nome da Categoria:</label>
                            <input
                            type="text"
                            required
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Nome da categoria"
                            className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70 font-medium focus:ring-2 focus:ring-[#F97B17]"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-black/75 text-lg text-left">Descrição:</label>
                            <textarea
                            required
                            name="descricao"
                            value={formData.descricao}
                            onChange={handleChange}
                            placeholder="Breve descrição"
                            className="mt-1 w-full h-24 rounded-md border border-black/10 bg-black/5 outline-none px-3 py-2 text-black/70 font-medium focus:ring-2 focus:ring-[#F97B17]"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white text-black px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 text-lg rounded-lg cursor-pointer hover:opacity-90 transition-all duration-200"
                        >
                            Atualizar Categoria
                        </button>
                    </div>
                </form>
                )}
            </div>
        </dialog>
        
            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-left z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg  font-semibold mb-2">
                            {modal.type === "success" ? "Sucesso" : "Erro"}
                        </h3>
                        <p>{modal.message}</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    if (modal.type === "success") {
                                        setModal({ open: false });
                                        onClose()
                                    } else {
                                        setModal({ ...modal, open: false }); // apenas fecha no erro
                                    }
                                }}
                                className={`cursor-pointer px-6 py-2 rounded-lg border border-black/10 text-white transition ${
                                    modal.type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                {modal.type === "success" ? "Confirmado" : "Tente novamente"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </section>
  );
}

export default CategoriaEditar;
