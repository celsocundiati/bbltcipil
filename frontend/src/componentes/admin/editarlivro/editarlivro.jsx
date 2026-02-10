import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {FaBook} from "react-icons/fa";

function EditarLivro()
{
    const navigate = useNavigate();
    const {id} = useParams();
    const [livro, setLivro] = useState(null);
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [modal, setModal] = useState({
        open: false,
    });

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/livros/${id}/`)
        .then(res => setLivro(res.data))
        .catch(err => console.error('Erro ao buscar os dados pelo ID', err));
    }, [id]);

    useEffect(() => {
        axios.get("http://localhost:8000/api/autores/")
        .then(res => setAutores(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de Autores", err));
    }, []);
  
    useEffect(() => {
        axios.get("http://localhost:8000/api/categorias/")
        .then(res => setCategorias(Array.isArray(res.data.results) ? res.data.results : res.data))
        .catch(err => console.error("Erro na captura de categorias", err));
    }, []);

    const handleChange = (e) => {
    setLivro({
      ...livro,
      [e.target.name]: e.target.value,
    });
    };

    const cancel = async (e) => {
    setLivro({
        isbn: "",
        capa: "",
        titulo: "",
        autor: "",
        categoria: "",
        sumario: "",
        editora: "",
        nPaginas: 1,
        data_publicacao: "",
        quantidade: 1,
      });
    }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    try {
      await axios.put(`http://127.0.0.1:8000/api/livros/${id}/`, livro);
      setModal({open: true});

        setLivro({
            isbn: "",
            imagem: "",
            titulo: "",
            autor: "",
            categoria: "",
            sumario: "",
            editora: "",
            nPaginas: 1,
            data_publicacao: "",
            quantidade: 1,
        });
        } catch (err) {
            // alert("Erro ao atualizar o Livro!");
            // setErro("Erro ao atualizar o livro");
            // console.error(err);

                if (err.response?.data) {
                    const erros = Object.values(err.response.data)
                        .flat()
                        .join("\n");

                    alert(erros);
                    setErro(erros);
                } else {
                    alert("Erro ao comunicar com o servidor");
                }

                console.error(err);

        } finally {
        setLoading(false);
        }
    };

    function closeModal(){
        setModal({open:false});
        navigate("/admin/gestao");
   }

    if(!livro) return <p>Carregando...</p>

    return(
        <main className="w-full h-full py-12">
            <section className="my-12 flex items-center justify-center w-full mx-auto md:w-3/4 border border-black/10 rounded-xl shadow">
            
                <div className="bg-white rounded-xl p-6 w-full h-full relative">
                    <article className="my-9">
                        <button className="absolute top-12 right-4 text-[#F97B17]" >
                            <FaBook size={35}/>
                        </button>
                        <h2 className="text-2xl font-medium">
                            Editando o livro <span className="text-[#F97B17] font-bold">{livro.titulo}</span> 
                        </h2>
                        <p className="text-black/70 text-xl">
                            Atualize os detalhes do livro para adicionar ao catálogo
                        </p>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="titulo">Título*</label>
                                <input type="text" name="titulo" required placeholder="Título do livro" value={livro.titulo} onChange={handleChange} 
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="isbn">ISBN*</label>
                                <input type="text" name="isbn" required placeholder="978-0-00-00000-0" value={livro.isbn} onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg">Autor*</label>
                                <select name="autor" required value={livro.autor} onChange={handleChange} className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer">
                                    <option value="">Selecione o Autor</option>
                                    {Array.isArray(autores) && autores.map(aut => (
                                        <option key={aut.id} value={aut.id}>{aut.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="publicado_em">Ano de publicação*</label>
                                <input type="date" name="publicado_em" required placeholder="2000-01-01" value={livro.publicado_em} onChange={handleChange} 
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg">Categória*</label>
                                <select name="categoria" required value={livro.categoria} onChange={handleChange} className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer">
                                    <option value="">Selecione a Categoria</option>
                                    {Array.isArray(categorias) && categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="editora">Editora*</label>
                                <input type="text" name="editora" required placeholder="Carvalhais" value={livro.editora} onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="nPaginas">Nº de páginas*</label>
                                <input type="number" min={0} name="n_paginas" required placeholder="05" value={livro.n_paginas} onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="quantidade">Quantidade*</label>
                                <input type="number" name="quantidade" required placeholder="05" value={livro.quantidade} onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg">
                                Descrição*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." required name="descricao" value={livro.descricao} onChange={handleChange}
                                className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg">
                                Sumário*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." required name="sumario" value={livro.sumario} onChange={handleChange}
                                className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg" htmlFor="capa">URL da capa</label>
                            <input type="text" name="capa" required placeholder="htpps://..." value={livro.capa} onChange={handleChange}
                                className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={cancel}
                                className="cursor-pointer px-6 py-2 rounded-lg border border-black/10 hover:bg-red-500 hover:text-white transition">
                                Cancelar
                            </button>
                            <button type="submit" 
                                className="cursor-pointer px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                                Adicionar Livro
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {modal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg font-semibold mb-2">
                        Sucesso
                    </h3>
                    <p>Livro registrado com sucesso
                    </p>
                    <div className="flex justify-end gap-3 mt-2">
                        <button type="button" onClick={closeModal} 
                            className="cursor-pointer px-6 py-2 rounded-lg border border-black/10 bg-green-500 text-white hover:bg-green-600 transition"
                            >Confirmado</button>
                    </div>
                </div>
            </div>
        )}
        </main>
    );
}
export default EditarLivro;