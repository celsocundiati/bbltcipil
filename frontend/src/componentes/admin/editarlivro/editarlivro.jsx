import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBook } from "react-icons/fa";
import api from "../../service/api/api";
import { motion } from "framer-motion";


function EditarLivro() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [livro, setLivro] = useState(null);
    const [autores, setAutores] = useState([]);
    const [categorias, setCategorias] = useState([]);

    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [erro, setErro] = useState(null);

    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const hoje = new Date();
    const dataMaximaPermitida = hoje.toISOString().split("T")[0];

    useEffect(() => {

        const fetchDados = async() =>  {
            try {
                setLoadingPage(true);

                const [livroRes, autoresRes, categoriasRes] = await Promise.all([
                    api.get(`/admin/livros/${id}/`),
                    api.get(`/admin/autores/`),
                    api.get(`/admin/categorias/`)
                ]);

                setLivro(livroRes.data);

                setAutores(
                    Array.isArray(autoresRes.data.results)
                        ? autoresRes.data.results
                        : autoresRes.data
                );

                setCategorias(
                    Array.isArray(categoriasRes.data.results)
                        ? categoriasRes.data.results
                        : categoriasRes.data
                );

            } catch (error) {
                console.error(error);
                setErro("Erro ao carregar dados.");
            } finally {
                setLoadingPage(false);
            }
        }

        fetchDados();

    }, [id]);

    // =============================
    // HANDLE CHANGE
    // =============================
    const handleChange = (e) => {
        setLivro({
            ...livro,
            [e.target.name]: e.target.value,
        });
    };

    // =============================
    // SUBMIT
    // =============================
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoadingSubmit(true);
        setErro(null);

        try {

            await api.put(
                `/admin/livros/${id}/`,
                livro
            );

            setModal({
                open: true,
                type: "success",
                message: "Livro atualizado com sucesso!"
            });

        } catch (err) {

            if (err.response?.data) {
                const erros = Object.values(err.response.data)
                    .flat()
                    .join("\n");

                setModal({
                    open: true,
                    type: "error",
                    message: erros
                });

                setErro(erros);

            } else {
                setModal({
                    open: true,
                    type: "error",
                    message: "Erro ao comunicar com o servidor."
                });
            }

        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loadingPage) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-xl animate-pulse text-center">Carregando dados...</p>
            </div>
        );
    }

    if (!livro) return null;

    const baseinput = "bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500"

    // =============================
    // JSX
    // =============================
    return (
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo 
            className="w-full h-full py-12">
            <section className="my-12 flex items-center justify-center w-full mx-auto md:w-3/4 border border-black/10 rounded-xl shadow">

                <div className="bg-white rounded-xl p-6 w-full relative">

                    <article className="my-9">
                        <button className="absolute top-12 right-4 text-[#F97B17]">
                            <FaBook size={35} />
                        </button>

                        <h2 className="text-2xl font-medium">
                            Editando o livro
                            <span className="text-[#F97B17] font-bold ml-2">
                                {livro?.titulo}
                            </span>
                        </h2>

                        <p className="text-black/70 text-xl">
                            Atualize os detalhes do livro
                        </p>
                    </article>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-2 gap-4">

                            <div className="flex flex-col">
                                <label>Título*</label>
                                <input
                                    type="text"
                                    name="titulo"
                                    value={livro.titulo || ""}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>ISBN*</label>
                                <input
                                    type="text"
                                    name="isbn"
                                    value={livro.isbn || ""}
                                    onChange={handleChange}
                                    required
                                    maxLength={13}
                                    className={baseinput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Autor*</label>
                                <select
                                    name="autor"
                                    value={livro.autor || ""}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                >
                                    <option value="">Selecione</option>
                                    {autores.map(aut => (
                                        <option key={aut.id} value={aut.id}>
                                            {aut.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label>Categoria*</label>
                                <select
                                    name="categoria"
                                    value={livro.categoria || ""}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                >
                                    <option value="">Selecione</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label>Data de publicação*</label>
                                <input
                                    type="date"
                                    name="data_publicacao"
                                    value={livro.publicado_em || ""}
                                    max={dataMaximaPermitida}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Editora*</label>
                                <input
                                    type="text"
                                    name="editora"
                                    value={livro.editora || ""}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Nº páginas*</label>
                                <input
                                    type="number"
                                    name="n_paginas"
                                    value={livro.n_paginas || ""}
                                    min={1}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label>Quantidade*</label>
                                <input
                                    type="number"
                                    name="quantidade"
                                    value={livro.quantidade || ""}
                                    min={1}
                                    onChange={handleChange}
                                    required
                                    className={baseinput}
                                />
                            </div>

                        </div>

                        <div className="flex flex-col">
                            <label>Descrição*</label>
                            <textarea
                                name="descricao"
                                value={livro.descricao || ""}
                                onChange={handleChange}
                                required
                                className={baseinput}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label>Sumário*</label>
                            <textarea
                                name="sumario"
                                value={livro.sumario || ""}
                                onChange={handleChange}
                                required
                                className={baseinput}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label>URL da capa*</label>
                            <input
                                type="text"
                                name="capa"
                                value={livro.capa || ""}
                                onChange={handleChange}
                                required
                                className={baseinput}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">

                            <button
                                type="button"
                                onClick={() => navigate("/admin/gestao")}
                                className="px-6 py-2 border border-black/10 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loadingSubmit}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg focus:ring-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                            >
                                {loadingSubmit ? "Salvando..." : "Atualizar Livro"}
                            </button>

                        </div>

                    </form>
                </div>
            </section>

            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-55">
                    <div className="bg-white p-6 rounded-lg focus:ring-2 focus:ring-green-500 w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">
                            {modal.type === "success" ? "Sucesso" : "Erro"}
                        </h3>
                        <p className="whitespace-pre-line">{modal.message}</p>
                        <div className="flex justify-end mt-4">
                            <button
                                onClick={() =>
                                    modal.type === "success"
                                        ? navigate("/admin/gestao")
                                        : setModal({ ...modal, open: false })
                                }
                                className={`px-6 py-2 text-white rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer ${
                                    modal.type === "success"
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                }`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </motion.main>
    );
}

export default EditarLivro;