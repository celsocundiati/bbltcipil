import BtnAddAdmin from "../../btns01/btnaddmin";
import ModalAddAutor from "../../modais/modaladdautor/modaladdautor";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { LuFilePen } from "react-icons/lu";
import {MdPersonOutline} from "react-icons/md"
import ModalEditarAutor from "../../modais/autoreditar/autoreditar";

function TabAutores(){

    const [showModalAutor, setShowModalAutor] = useState(false);
    const [editarAutor, setEditarAutor] = useState(false);
    const [autorSelecionado, setAutorSelecionado] = useState(false);
    const [autores, setAutores] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        autor: null,
    });

    useEffect(() => {
        axios.get("http://localhost:8000/api/autores/")
        .then(res => setAutores(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de Autores", err));
    }, []);


    
    function handleClick(){
        setShowModalAutor(true);
    }
    function clickEditar(autor){
        setAutorSelecionado(autor)
        setEditarAutor(true);
    }
    function openModal(type, autor){
        setModal({open: true, type, autor});
    }
    function closeModal(){
        setModal({open:false, type: null, autor: null});
    }
    async function handleConfirm() {
        if(modal.type === "delete"){
            await axios.delete(`http://127.0.0.1:8000/api/autores/${modal.autor.id}/`);
            setAutores(prev => prev.filter(a => a.id !== modal.autor.id));
            closeModal();
        }
        if(modal.type === "update"){
            setModal({
                open: true,
                type: "update",
                autor: modal.autor,
            });
        }
    }

    return(
        <section>
            <div>
                <BtnAddAdmin tipo="autor" onClick={handleClick}/>
            </div>
            <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                    <thead className="bg-black/5">
                        <tr>
                            <th className="w-[15%] px-5 py-3 text-center">Autor</th>
                            <th  className="w-[25%] px-5 py-3 text-center">Nacionalidade</th>
                            <th className="w-[15%] px-5 py-3 text-center">Nº de Livro</th>
                            <th className="w-[15%] px-5 py-3 text-center">Empréstimo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {Array.isArray(autores) && autores.length === 0 ?(
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-red-700">
                                    Nenhum autor encontrado.
                                </td>
                            </tr>
                        ) : (Array.isArray(autores) && autores.map(autor => (
                            <tr className="hover:bg-black/3" key={autor.id}>
                                <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                    <div className="flex items-center gap-5">
                                        <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <MdPersonOutline size={25}/> </label>
                                        <label>{autor.nome} </label>
                                    </div>
                                </td>
                                <td className="px-5 py-4 truncate text-center text-black/85"> {autor.nacionalidade} </td>
                                <td className="px-5 py-4 truncate text-center text-black/85"> {autor.total_obras} </td>
                                <td className="px-5 py-4 truncate text-center text-black/85">
                                    <div className="flex gap-2 items-center justify-center">
                                        <button onClick={() => clickEditar(autor)} className="cursor-pointer"> <LuFilePen size={30}/> </button>
                                        <button onClick={() => openModal("delete", autor)} className="cursor-pointer"> <FiTrash2 size={30} className="text-red-700"/> </button>
                                    </div>
                                </td>
                                            
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>


            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-left z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "delete" ? "Excluir autor" : "Editar autor"}
                        </h3>
                        <p>Tem certeza que deseja{""}
                            {modal.type === "delete" ? " excluir " : " editar "} este autor ?
                        </p>
                        <div className="flex justify-end gap-3 py-2 ">
                                <button onClick={closeModal} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button onClick={handleConfirm}  type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {showModalAutor && <ModalAddAutor onClose={() => setShowModalAutor(false)}/> }
            {editarAutor && <ModalEditarAutor
                form={autorSelecionado}
                setForm={setAutorSelecionado}
                onClose={() => setEditarAutor(false)}/> }
        </section>
    );
}

export default TabAutores;