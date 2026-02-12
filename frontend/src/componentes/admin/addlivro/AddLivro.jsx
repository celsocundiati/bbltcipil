import { useState, useEffect } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaBook} from "react-icons/fa";

function AddLivro(){
    
    const navigate = useNavigate();
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    
    const hoje = new Date();

    const dataMaximaPermitida = new Date(
        hoje.getFullYear(),
        hoje.getMonth(),
        hoje.getDate()
    ).toISOString().split("T")[0];

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
            n_paginas: 1,
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
                n_paginas: 1,
                publicado_em: "",
                quantidade: 1,
            });
        } catch (err) {
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


    return(
        <main className="w-full h-full py-12">
            <section className="my-12 flex items-center justify-center w-full mx-auto md:w-3/4 border border-black/10 rounded-xl shadow">
            
                <div className="bg-white rounded-xl p-6 w-full h-full relative">
                    <article className="my-9">
                        <button className="absolute top-12 right-4 text-[#F97B17]" >
                            <FaBook size={35}/>
                        </button>
                        <h2 className="text-2xl font-medium">
                            Adicionar Novo Livro
                        </h2>
                        <p className="text-black/70 text-xl">
                            Preencha os detalhes do livro para adicionar ao catálogo
                        </p>
                    </article>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="titulo">Título*</label>
                                <input type="text" name="titulo" required placeholder="Título do livro" value={form.titulo} onChange={handleChange} 
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="isbn">ISBN*</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    id="isbn"
                                    value={form.isbn}
                                    required
                                    placeholder="623043741349"
                                    minLength={10}
                                    maxLength={13}
                                    inputMode="numeric"
                                    pattern="[0-9]{10,13}"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 13) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg">Autor*</label>
                                <select name="autor" required value={form.autor} onChange={handleChange} className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer">
                                    <option value="">Selecione o Autor</option>
                                    {Array.isArray(autores) && autores.map(aut => (
                                        <option key={aut.id} value={aut.id}>{aut.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="publicado_em">Ano de publicação*</label>
                                <input type="date" name="publicado_em"
                                    max={dataMaximaPermitida} required placeholder="2000-01-01"
                                    value={form.publicado_em} onChange={handleChange} 
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg">Categória*</label>
                                <select name="categoria" required value={form.categoria} onChange={handleChange} className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer">
                                    <option value="">Selecione a Categoria</option>
                                    {Array.isArray(categorias) && categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="editora">Editora*</label>
                                <input type="text" name="editora" required placeholder="Carvalhais" value={form.editora} onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="nPaginas">Nº de páginas*</label>
                                <input
                                    type="text"
                                    name="n_paginas"
                                    id="n_paginas"
                                    value={form.n_paginas}
                                    required
                                    placeholder="530"
                                    minLength={1}
                                    maxLength={5}
                                    inputMode="numeric"
                                    pattern="[0-9]{1,10000}"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 5) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-black/75 text-lg" htmlFor="quantidade">Quantidade*</label>
                                <input type="number" min={1} name="quantidade" required placeholder="05" value={form.quantidade}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value >= 1) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg">
                                Descrição*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." required name="descricao" value={form.descricao} onChange={handleChange}
                                className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg">
                                Sumário*
                            </label>
                            <textarea placeholder="Breve descrição do livro..." required name="sumario" value={form.sumario} onChange={handleChange}
                                className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-black/75 text-lg" htmlFor="capa">URL da capa</label>
                            <input type="text" name="capa" required placeholder="htpps://google.com/image.jpeg" value={form.capa} onChange={handleChange}
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
export default AddLivro;