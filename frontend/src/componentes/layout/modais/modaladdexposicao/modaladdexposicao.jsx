import { useState } from "react";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

function ModalAddExposicao({ onClose, showToast, setExposicoes }) {

    const [form, setForm] = useState({
        titulo: "",
        capa: "",
        descricao: "",
        local: "",
        capacidade_maxima: "",
        data_inicio: "",
        data_fim: "",
    });

    const [loading, setLoading] = useState(false);

    const hoje = new Date().toISOString().split("T")[0];

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const validarTitulo = (titulo) => {
        titulo = titulo.trim();

        if (titulo.length < 5 || titulo.length > 100) {
            return "Título deve ter entre 5 e 100 caracteres.";
        }

        if (/^(.)\1+$/.test(titulo.toLowerCase())) {
            return "Título inválido.";
        }

        return null;
    };

    const validarDescricao = (descricao) => {
        descricao = descricao.trim();

        if (descricao.length < 10 || descricao.length > 500) {
            return "Descrição deve ter entre 10 e 500 caracteres.";
        }

        return null;
    };

    const validarLocal = (local) => {
        local = local.trim();

        if (local.length < 3 || local.length > 100) {
            return "Local inválido.";
        }

        return null;
    };

    const validarCapacidade = (capacidade) => {
        const num = Number(capacidade);

        if (!num || num <= 0) {
            return "Capacidade deve ser maior que zero.";
        }

        return null;
    };

    const validarDatas = (inicio, fim) => {
        if (new Date(fim) < new Date(inicio)) {
            return "A data final não pode ser menor que a inicial.";
        }

        return null;
    };

    const validarURL = (url) => {
        try {
            new URL(url);
            return null;
        } catch {
            return "URL da capa inválida.";
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        const erro =
            validarTitulo(form.titulo) ||
            validarDescricao(form.descricao) ||
            validarLocal(form.local) ||
            validarCapacidade(form.capacidade_maxima) ||
            validarDatas(form.data_inicio, form.data_fim) ||
            validarURL(form.capa);

        if (erro) {
            showToast({
                message: erro,
                type: "error"
            });

            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/admin/exposicoes/", form);

            setExposicoes(prev => [res.data, ...prev]);

            showToast({
                message: "Exposição criada com sucesso",
                type: "success",
            });

            onClose();

        } catch (err) {
            const msg = err.response?.data
                ? Object.values(err.response.data).flat().join(" ")
                : "Erro ao criar exposição";

            showToast({
                message: msg,
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    }

    return (

         <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl outline-none-2xl p-6 relative"
                >

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black"
                    >
                        <HiOutlineXMark size={35} />
                    </button>

                    <article className="py-4 text-left">
                        <h2 className="text-xl font-medium">Registar Exposições</h2>
                        <p className="text-lg">Registre exposições literárias</p>
                    </article>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Título */}
                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Título da exposição (ex: Feira do Livro 2026)"
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        {/* Descrição */}
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Descreve brevemente o objetivo da exposição..."
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        {/* Local */}
                        <input
                            name="local"
                            value={form.local}
                            onChange={handleChange}
                            placeholder="Local da exposição (ex: IPIL - Sala Magna)"
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        {/* Capacidade */}
                        <input
                            type="number"
                            min={1}
                            name="capacidade_maxima"
                            value={form.capacidade_maxima}
                            onChange={handleChange}
                            placeholder="Número máximo de participantes"
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        {/* Datas organizadas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-left text-black/70">
                                    Data de Início
                                </label>
                                <input
                                    type="date"
                                    min={hoje}
                                    name="data_inicio"
                                    value={form.data_inicio}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm text-left text-black/70">
                                    Data de Término
                                </label>
                                <input
                                    type="date"
                                    name="data_fim"
                                    min={form.data_inicio}
                                    value={form.data_fim}
                                    onChange={handleChange}
                                    className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                        </div>

                        {/* Capa */}
                        <input
                            type="url"
                            name="capa"
                            value={form.capa}
                            onChange={handleChange}
                            placeholder="URL da imagem de capa (ex: https://...)"
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        {/* Ações */}
                        <div className="flex justify-end gap-3">

                            <button type="button" className="px-4 py-2 rounded-xl outline-none bg-black/10 cursor-pointer" onClick={onClose}>
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-xl outline-none cursor-pointer"
                            >
                                {loading ? "A guardar..." : "Guardar"}
                            </button>

                        </div>

                    </form>

                </motion.div>
            </section>
    );
}

export default ModalAddExposicao;

