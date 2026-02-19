
    import BtnAddAdmin from "../../btns01/btnaddmin";
import ModalAddCategoria from "../../modais/modaladdcategoria/modaladdcategoria";
import CategoriaEditar from "../../modais/categoriaeditar/categoriaeditar";
import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2 } from "react-icons/fi";
import { LuFilePen } from "react-icons/lu";
import { HiOutlineFolder } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";


function TabCategorias(){

    const [showModalCategoria, setShowModalCategoria] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [modal, setModal] = useState({
        open: false,
        type: null,
        categoria: null,
    });
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
    const navigate = useNavigate();

    function handleOpenEditModal(categoria) {
        setCategoriaSelecionada(categoria);
        setEditModalOpen(true);
    }

    function handleCloseEditModal() {
        setEditModalOpen(false);
        setCategoriaSelecionada(null);
    }

  useEffect(() => {
    const token = sessionStorage.getItem("access_token");

    // 🔐 Redireciona se não houver token
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8000/api/admin/categorias/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setCategorias(Array.isArray(res.data.results) ? res.data.results : res.data)
      )
      .catch((err) => {
        console.error("Erro na captura de Categorias", err);
        if (err.response?.status === 401) navigate("/login");
      });
  }, [navigate]);


    function handleClick(){
        setShowModalCategoria(true);
    }

    function openModal(type, categoria){
            setModal({open: true, type, categoria});
    }
    function closeModal(){
        setModal({open:false, type: null, categoria: null});
    }
    async function handleConfirm() {
        if(modal.type === "delete"){
            await axios.delete(`http://127.0.0.1:8000/api/admin/categorias/${modal.categoria.id}/`);
            setCategorias(prev => prev.filter(c => c.id !== modal.categoria.id));
            closeModal();
        }
        if(modal.type === "update"){
            setModal({
                open: true,
                type: "update",
                categoria: modal.categoria,
            });
        }
        
    }


    return(
        <section>
            <div>
                <BtnAddAdmin tipo="categoria" onClick={handleClick}/>
            </div>
            <div className="w-full bg-white rounded-2xl px-8 my-25 py-8">
                <table className="w-full table-fixed border-collapse bg-white shadow-md rounded-xl overflow-hidden">
                    <thead className="bg-black/5">
                        <tr>
                            <th className="w-[15%] px-5 py-3 text-center">Livro</th>
                            <th className="w-[25%] px-5 py-3 text-center">Descrição</th>
                            <th className="w-[15%] px-5 py-3 text-center">Nº de Livro</th>
                            <th className="w-[15%] px-5 py-3 text-center">Empréstimo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                        {Array.isArray(categorias) && categorias.length === 0 ?(
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-red-700">
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        ) : (Array.isArray(categorias) && categorias.map(categoria => (
                                <tr className="hover:bg-black/3" key={categoria.id}>
                                    <td className="flex items-center gap-5 px-5 py-4 truncate text-center text-black/85">
                                        <div className="flex items-center gap-5">
                                            <label className="text-[#F97B17] bg-[#F97B17]/10 p-2 rounded-xl"> <HiOutlineFolder size={30}/> </label>
                                            <label>{categoria.nome} </label>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {categoria.descricao} </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85"> {categoria.n_livros} </td>
                                    <td className="px-5 py-4 truncate text-center text-black/85">
                                        <div className="flex gap-2 items-center justify-center">
                                            <button  onClick={() => handleOpenEditModal(categoria)} className="cursor-pointer"> <LuFilePen size={30}/> </button>
                                            <button  onClick={() => openModal("delete", categoria)} className="cursor-pointer"> <FiTrash2 size={30} className="text-red-700"/> </button>
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
                            {modal.type === "delete" ? "Excluir categoria" : "Editar categoria"}
                        </h3>
                        <p>Tem certeza que deseja{" "}
                            {modal.type === "delete" ? " excluir " : " editar "} esta categoria ?
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

             {showModalCategoria && <ModalAddCategoria onClose={() => setShowModalCategoria(false)}/> }
             {editModalOpen && (
                <CategoriaEditar
                    categoria={categoriaSelecionada}
                    onClose={handleCloseEditModal}
                    setCategorias={setCategorias}
                />
             )}

        </section>
    );
}

export default TabCategorias;