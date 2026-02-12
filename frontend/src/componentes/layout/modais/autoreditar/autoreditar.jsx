import { useState, useEffect } from "react";
import axios from "axios";
import {HiOutlineXMark} from "react-icons/hi2";

function ModalEditarAutor({ onClose, form, setForm }){

    const [autor, setAutor] = useState({
        nome: "",
        nacionalidade: "",
    });
    const [modal, setModal] = useState({
        open: false,
    });

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/autores/${form?.id}/`)
        .then(res => setAutor(res.data))
        .catch(err => console.error('Erro ao buscar os dados pelo ID', err));
      }, [form]);

    const handleChange = (e) => {
        setAutor({
            ...autor,
            [e.target.name]: e.target.value,
        });
        };
  
        const handleSubmit = async (e) => {
            e.preventDefault();
            setLoading(true);
            setErro(null);
        
        try {
            await axios.put(`http://127.0.0.1:8000/api/autores/${form?.id}/`, form);
            setModal({open: true});
        
            setForm({
                nome: "",
                nacionalidade: "",
            });
        } catch (err) {
            if (err.response?.data) {
            const erros = Object.values(error.response.data)
                .flat()
                .join("\n");

            alert(erros);
            setErro(erros);
            }
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
                            Adicionar Autor
                        </h2>
                        <p className="text-lg">
                            Cadastrar novao autor
                        </p>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-2">
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">Nome do Autor:</label>
                                <input type="text" required name="nome" id="nome" value={autor.nome} onChange={handleChange} placeholder="Nome do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-black/75 text-lg text-left">Nacionalidade:</label>
                                <input type="text" required name="nacionalidade" id="nacionalidade" value={autor.nacionalidade} onChange={handleChange} placeholder="Nacionalidade proveniente do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={onClose} type="button" className="bg-white text-black px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                Salvar Alterações
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
                        <p>Autor registrado com sucesso!</p>
                        <div className="flex justify-end gap-3 mt-2">
                            <button onClick={closeModal} className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">Confirmado</button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
}

export default ModalEditarAutor;