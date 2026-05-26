import { useEffect, useState } from "react";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

function ModalEditExposicoes({ exposicoes, onClose, setExposicoes, showToast }) {

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
    const [saving, setSaving] = useState(false);

    const hoje = new Date().toISOString().split("T")[0];

    useEffect(() => {
        if (exposicoes?.id) {
            setLoading(true);

            api.get(`/admin/exposicoes/${exposicoes.id}/`)
                .then(res => {
                    setForm(res.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                    showToast({
                        message: "Erro ao carregar dados",
                        type: "error",
                    });
                });
        }
    }, [exposicoes]);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    // ---------------- VALIDACOES ----------------

    const validarTitulo = (titulo) => {
        titulo = titulo.trim();

        if (titulo.length < 5 || titulo.length > 100)
            return "Título deve ter entre 5 e 100 caracteres.";

        if (/^(.)\1+$/.test(titulo.toLowerCase()))
            return "Título inválido.";

        return null;
    };

    const validarDescricao = (descricao) => {
        descricao = descricao.trim();

        if (descricao.length < 10 || descricao.length > 500)
            return "Descrição deve ter entre 10 e 500 caracteres.";

        return null;
    };

    const validarLocal = (local) => {
        local = local.trim();

        if (local.length < 3 || local.length > 100)
            return "Local inválido.";

        return null;
    };

    const validarCapacidade = (capacidade) => {
        const num = Number(capacidade);

        if (!num || num <= 0)
            return "Capacidade deve ser maior que zero.";

        return null;
    };

    const validarDatas = (inicio, fim) => {
        if (new Date(fim) < new Date(inicio))
            return "A data final não pode ser menor que a inicial.";

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

    // ---------------- UPDATE ----------------

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);

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

            setSaving(false);
            return;
        }

        try {
            const res = await api.put(
                `/admin/exposicoes/${exposicoes.id}/`,
                form
            );

            setExposicoes(prev =>
                prev.map(e =>
                    e.id === exposicoes.id ? res.data : e
                )
            );

            showToast({
                message: "Exposição atualizada com sucesso",
                type: "success",
            });

            onClose();

        } catch (err) {
            const msg = err.response?.data
                ? Object.values(err.response.data).flat().join(" ")
                : "Erro ao atualizar exposição";

            showToast({
                message: msg,
                type: "error",
            });

        } finally {
            setSaving(false);
        }
    }

    if (!exposicoes) return null;

    return (
        <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative"
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black"
                >
                    <HiOutlineXMark size={35} />
                </button>

                <article className="py-4 text-left">
                    <h2 className="text-xl font-medium">Editar Exposições</h2>
                    <p className="text-lg">Edite exposições literárias</p>
                </article>

                {loading ? (
                    <div className="py-6 text-center text-black/60 animate-pulse">
                        A carregar...
                    </div>
                ) : (

                    <form onSubmit={handleUpdate} className="space-y-4">

                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        <input
                            name="local"
                            value={form.local}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        <input
                            type="number"
                            min={1}
                            name="capacidade_maxima"
                            value={form.capacidade_maxima}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <input
                                type="date"
                                name="data_inicio"
                                min={hoje}
                                value={form.data_inicio}
                                onChange={handleChange}
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            />

                            <input
                                type="date"
                                name="data_fim"
                                min={form.data_inicio || hoje}
                                value={form.data_fim}
                                onChange={handleChange}
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            />

                        </div>

                        <input
                            type="url"
                            name="capa"
                            value={form.capa}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                        />

                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">

                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto border border-black/10 cursor-pointer text-black/70 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-green-500 cursor-pointer text-white px-6 py-2 rounded-xl hover:bg-green-600 transition"
                            >
                                {saving ? "A atualizar..." : "Atualizar"}
                            </button>

                        </div>

                    </form>
                )}

            </motion.div>
        </dialog>
    );
}

export default ModalEditExposicoes;