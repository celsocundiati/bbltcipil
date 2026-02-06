import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaBook} from "react-icons/fa";

function AddLivro(){
    
    const navigate = useNavigate();
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [form, setForm] = useState({
    isbn: "",
    capa: "",
    titulo: "",
    autor: "",
    categoria: "",
    descricao: "",
    sumario: "",
    editora: "",
    nPaginas: 1,
    publicado_em: "",
    quantidade: 1,
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [modal, setModal] = useState({
        open: false,
    });

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
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const cancel = async (e) => {
        setForm({
            isbn: "",
            capa: "",
            titulo: "",
            autor: "",
            categoria: "",
            descricao: "",
            sumario: "",
            editora: "",
            nPaginas: 1,
            publicado_em: "",
            quantidade: 1,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        try {
            await axios.post("http://127.0.0.1:8000/api/livros/", form);
            setModal({open: true});
            
            /*alert("Livro registado com sucesso!");
            navigate("/admin/gestao")*/

            setForm({
                isbn: "",
                capa: "",
                titulo: "",
                autor: "",
                categoria: "",
                descricao: "",
                sumario: "",
                editora: "",
                nPaginas: 1,
                publicado_em: "",
                quantidade: 1,
            });
        } catch (err) {
            alert("Erro ao registar Livro!");
            setErro("Erro ao registar livro");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    function closeModal(){
        setModal({open:false});
        navigate("/admin/gestao");
    }


    return(
        <main className="w-full h-full mt-12 ">
            <section className="mb-12">
                <article>
                    <h1 className="text-2xl">Cadastro de Livros</h1>
                    <p className="text-cinza-900 pt-2">Cadastre novos livros e aumento o acervo disponível da biblioteca</p>
                </article>
            </section>
            <section className="flex items-center justify-center w-full mx-auto md:w-3/4 border border-cinza-500 rounded-xl py-10">
                <div className="w-full px-6 relative">
                    <button className="absolute top-4 right-4 text-laranja-500" >
                        <FaBook size={35}/>
                    </button>
                    <h2 className="text-lg font-semibold">
                        Adicionar Novo Livro
                    </h2>
                    <p className="text-sm mb-6">
                        Preencha os detalhes do livro para adicionar ao catálogo
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="titulo">Título*</label>
                                <input type="text" name="titulo" id="titulo" placeholder="Título do livro" value={form.titulo} onChange={handleChange} 
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="isbn">ISBN*</label>
                                <input type="text" name="isbn" id="isbn" placeholder="978-0-00-00000-0" value={form.isbn} onChange={handleChange}
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                            <div className="flex flex-col">
                                <label>Autor*</label>
                                <select name="autor" value={form.autor} onChange={handleChange} className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 focus:outline-none focus:ring-2 focus:ring-laranja-400">
                                    <option value="">Selecione o Autor</option>
                                    {Array.isArray(autores) && autores.map(aut => (
                                        <option key={aut.id} value={aut.id}>{aut.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="publicado_em">Ano de publicação*</label>
                                <input type="date" name="publicado_em" placeholder="2000-01-01" value={form.publicado_em} onChange={handleChange} 
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                            <div className="flex flex-col">
                                <label>Categória*</label>
                                <select name="categoria" value={form.categoria} onChange={handleChange} className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 focus:outline-none focus:ring-2 focus:ring-laranja-400">
                                    <option value="">Selecione a Categoria</option>
                                    {Array.isArray(categorias) && categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="editora">Editora*</label>
                                <input type="text" name="editora" id="editora" placeholder="Carvalhais" value={form.editora} onChange={handleChange}
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="nPaginas">Nº de páginas*</label>
                                <input type="number" name="nPaginas" id="nPaginas" placeholder="05" value={form.nPaginas} onChange={handleChange}
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="quantidade">Quantidade*</label>
                                <input type="number" name="quantidade" id="quantidade" placeholder="05" value={form.quantidade} onChange={handleChange}
                                className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-preto-500" >
                                Descrição*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." name="descricao" value={form.descricao} onChange={handleChange}
                            className="mt-1 w-full h-24 rounded-md border border-cinza-300 bg-cinza-100 px-3 py-2 text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400" />
                        </div>
                        <div className="flex flex-col">
                            <label className="text-preto-500" >
                                Sumário*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." name="sumario" value={form.sumario} onChange={handleChange}
                            className="mt-1 w-full h-24 rounded-md border border-cinza-300 bg-cinza-100 px-3 py-2 text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400" />
                        </div>
                        <div className="flex flex-col">
                            <label htmlFor="capa">URL da capa</label>
                            <input type="text" name="capa" id="imagem" placeholder="htpps://..." value={form.capa} onChange={handleChange}
                            className="bg-cinza-100 py-2 px-2 rounded-lg text-preto-500 font-bold focus:outline-none focus:ring-2 focus:ring-laranja-400"/>
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={cancel} className="bg-branco-100 text-preto-300 px-8 py-2 rounded-lg border border-cinza-700 hover:text-branco-100 hover:bg-red-700 transition-all duration-200">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-laranja-500 hover:bg-green-900 transition-all duration-200 text-branco-100 px-5 py-2 rounded-lg font-medium">
                                Adicionar Livro
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {modal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg  font-semibold mb-2">
                        Sucesso
                    </h3>
                    <p>Livro registrado com sucesso
                    </p>
                    <div className="flex justify-end gap-3 mt-2">
                        <button onClick={closeModal} className="px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-laranja-500">Confirmado</button>
                    </div>
                </div>
            </div>
        )}
        </main>
    );
}
export default AddLivro;