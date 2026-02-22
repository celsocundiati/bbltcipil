import { useState } from "react";
import axios from "axios";
import {HiOutlineXMark} from "react-icons/hi2";

function ModalAddAutor({onClose}){

    const [form, setForm] = useState({
        nome: "",
        nacionalidade: "",
    });
    const [modal, setModal] = useState({
        open: false,
        type: "success", // "success" ou "error"
        message: "",
    });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setErro(null);
  
      try {
        await axios.post("http://127.0.0.1:8000/api/admin/autores/", form);
        setModal({
            open: true,
            type: "success",
            message: "Autor registrado com sucesso!",
        });
      
      setForm({
        nome: "",
        nacionalidade: "",
        });
      } catch (err) {
            if (err.response?.data) {
                const erros = Object.values(err.response.data)
                    .flat()
                    .join(" ");

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
                            Adicionar Autor
                        </h2>
                        <p className="text-lg">
                            Cadastrar novo autor
                        </p>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">Nome do Autor:</label>
                                <input type="text" required name="nome" id="nome" ue={form.nome} onChange={handleChange} p placeholder="Nome do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">Nacionalidade:</label>
                                <input type="text" required name="nacionalidade" id="nacionalidade" ue={form.nacionalidade} onChange={handleChange} p placeholder="Nacionalidade proveniente do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                Adicionar Autor
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-left z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
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
                </div>
            )}
        </section>
    );
}

export default ModalAddAutor;