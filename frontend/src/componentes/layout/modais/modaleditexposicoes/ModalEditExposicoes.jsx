
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

    async function handleUpdate(e) {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await api.put(`/admin/exposicoes/${exposicoes.id}/`, form);

            setExposicoes(prev =>
                prev.map(e => e.id === exposicoes.id ? res.data : e)
            );

            showToast({
                message: "Exposição atualizada com sucesso",
                type: "success",
            });

            onClose();

        } catch {
            showToast({
                message: "Erro ao atualizar exposição",
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
                    <h2 className="text-xl font-medium">
                        Editar Exposições
                    </h2>
                    <p className="text-lg">
                        Edite exposições literárias
                    </p>
                </article>

                {loading ? (
                    <div className="py-6 text-center text-black/60 animate-pulse">
                        A carregar...
                    </div>
                ) : (

                    <form onSubmit={handleUpdate} className="space-y-4">
                        
                            {/* Título */}
                            <input
                                name="titulo"
                                value={form.titulo}
                                onChange={handleChange}
                                placeholder="Título da exposição (ex: Feira do Livro 2026)"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* Descrição */}
                            <textarea
                                name="descricao"
                                value={form.descricao}
                                onChange={handleChange}
                                placeholder="Descreve brevemente o objetivo da exposição..."
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* Local */}
                            <input
                                name="local"
                                value={form.local}
                                onChange={handleChange}
                                placeholder="Local da exposição (ex: IPIL - Sala Magna)"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* Capacidade */}
                            <input
                                type="number"
                                name="capacidade_maxima"
                                value={form.capacidade_maxima}
                                onChange={handleChange}
                                placeholder="Número máximo de participantes"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* Datas organizadas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left text-black/70">
                                        Data de Início
                                    </label>
                                    <input
                                        type="date"
                                        name="data_inicio"
                                        value={form.data_inicio}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left text-black/70">
                                        Data de Término
                                    </label>
                                    <input
                                        type="date"
                                        name="data_fim"
                                        value={form.data_fim}
                                        onChange={handleChange}
                                        className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                                    />
                                </div>

                            </div>

                            {/* Capa */}
                            <input
                                name="capa"
                                value={form.capa}
                                onChange={handleChange}
                                placeholder="URL da imagem de capa (ex: https://...)"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />


                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full sm:w-auto border border-black/10 cursor-pointer text-black/70 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="w-full sm:w-auto bg-green-500 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
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
