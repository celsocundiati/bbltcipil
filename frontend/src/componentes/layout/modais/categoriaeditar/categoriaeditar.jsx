import { useEffect, useState } from "react";
import {HiOutlineXMark} from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

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

      api.get(`/admin/categorias/${categoria.id}/`)
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
      const response = await api.put(`/admin/categorias/${categoria.id}/`,
        formData
      );
      setModal({
          open: true,
          type: "success",
          message: "Categoria atualizada com sucesso!",
      });

      // Atualizar lista sem recarregar tudo
      setCategorias(prev =>
        prev.map(cat => (cat.id === categoria.id ? response.data : cat))
      );

    } catch (error) {
      if (error.response?.data) {
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
        <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
            <motion.div  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez 
                className="w-full text-start max-w-96 md:max-w-lg bg-white shadow-xl rounded-2xl p-6 relative"
            >
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
                <div className="py-6 text-center text-black/60 animate-pulse">A carregar...</div>
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
            </motion.div>
        </dialog>
        
        {modal.open && (
            <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez 
                className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                <div className="w-full text-start max-w-96 md:max-w-lg bg-white shadow-xl rounded-2xl p-6 relative">
                    <h3 className="text-lg  font-semibold mb-2">
                        {modal.type === "success" ? "Sucesso" : "Erro"}
                    </h3>
                    <p>{modal.message}</p>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
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
            </motion.div>
        )}
    </section>
  );
}

export default CategoriaEditar;
