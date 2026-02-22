import {HiOutlineXMark} from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";

function ModalAddCategoria({onClose}){

    const [categoria, setCategoria] = useState({
        nome: "",
        descricao: "",
    });
    const [modal, setModal] = useState({
        open: false,
        type: "success", // "success" ou "error"
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    const handleChange = (e) => {
        setCategoria({
          ...categoria,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);
    
        try {
          await axios.post("http://127.0.0.1:8000/api/admin/categorias/", categoria);
          setModal({
            open: true,
            type: "success",
            message: "Categoria registrada com sucesso!",
        });
        
        setCategoria("");
        } catch (err) {
            if (err.response?.data) {
                const erros = Object.values(err.response.data)
                    .flat()
                    .join("\n");

                setModal({
                    open: true,
                    type: "error",
                    message: erros,
                });
                setErro(erros);
            } else {
                alert("Erro ao comunicar com o servidor");
            }

            console.error(err);
        } finally {
          setLoading(false);
        }
      };


    return(
        <section>
            <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                        <HiOutlineXMark size={35}/>
                    </button>
                    <article className="py-4 text-left">
                        <h2 className="text-xl font-medium">
                            Adicionar Categória
                        </h2>
                        <p className="text-lg">
                            Cadastrar nova categória de livros
                        </p>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">Nome da Categória:</label>
                                <input type="text" required name="nome" id="nome" value={categoria.nome} onChange={handleChange} placeholder="Nome da categória do livro" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">
                                    Descrição
                                </label>
                                <textarea placeholder="Breve descrição do livro..." required name="descricao" value={categoria.descricao} onChange={handleChange}
                                className="mt-1 w-full h-24 rounded-md border border-black/10 bg-black/5 outline-none px-3 py-2 text-black/70  font-medium focus:ring-2 focus:ring-green-500" />
                            </div>
                        </div>
                        
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto border border-black/10 text-black/70 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                            >
                                Adicionar Categória
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {modal.open && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                        <h3 className="text-lg  font-semibold mb-2">
                            {modal.type === "success" ? "Sucesso" : "Erro"}
                        </h3>
                        <p>{modal.message}</p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="submit"
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

export default ModalAddCategoria;