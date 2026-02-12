import {HiOutlineXMark} from "react-icons/hi2";
import { useState } from "react";
import axios from "axios";

function ModalAddCategoria({onClose}){

    const [categoria, setCategoria] = useState({
        nome: "",
        decsricao: "",
    });
    const [modal, setModal] = useState({
        open: false,
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
          await axios.post("http://127.0.0.1:8000/api/categorias/", categoria);
          setModal({open: true});
        
        setCategoria("");
        } catch (err) {
          alert("Erro ao criar Categoria");
          setErro("Erro ao criar Categoria");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

    function closeModal(){
        setModal({open:false});
        onClose()
    }

    return(
        <section>
            <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
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
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={onClose} type="button" className="bg-white text-black px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                Adicionar Livro
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-left z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <h3 className="text-lg  font-semibold mb-2">
                            Sucesso
                        </h3>
                        <p>Categoria criada com sucesso!</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeModal} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Confirmado</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ModalAddCategoria;