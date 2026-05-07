import { useEffect, useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

function ModalEditEventos({ evento, onClose, setEventos, showToast }) {

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

    // 🔹 Load evento
    useEffect(() => {
        if (evento?.id) {
            setLoading(true);

            api.get(`/admin/eventos/${evento.id}/`)
                .then(res => {
                    setForm(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    const erros = err.response?.data
                        ? Object.values(err.response.data).flat().join(" ")
                        : "Erro ao carregar evento";

                    showToast({
                        message: erros,
                        type: "error",
                    });

                    setLoading(false);
                });
        }
    }, [evento]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    async function handleUpdate(e) {
        e.preventDefault();

        setLoading(true);

        try {
            const response = await api.put(
                `/admin/eventos/${evento.id}/`,
                form
            );

            setEventos(prev =>
                prev.map(ev =>
                    ev.id === evento.id ? response.data : ev
                )
            );

            showToast({
                message: "Evento atualizado com sucesso!",
                type: "success",
            });

            onClose();

        } catch (error) {
            const erros = error.response?.data
                ? Object.values(error.response.data).flat().join(" ")
                : "Erro ao atualizar evento";

            showToast({
                message: erros,
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    }

    if (!evento) return null;

    return (
        <>
            {/* MODAL EDIT */}
            <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative"
                >

                    {/* FECHAR */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black"
                    >
                        <HiOutlineXMark size={35} />
                    </button>

                    {/* HEADER */}
                    <article className="py-4 text-left">
                        <h2 className="text-xl font-medium">
                            Editar Evento
                        </h2>
                        <p className="text-lg">
                            Atualize os dados do evento
                        </p>
                    </article>

                    {/* FORM */}
                    {loading ? (
                        <div className="py-6 text-center text-black/60 animate-pulse">
                            A carregar...
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="space-y-4">

                            {/* TÍTULO */}
                            <input
                                type="text"
                                required
                                name="titulo"
                                value={form.titulo}
                                onChange={handleChange}
                                placeholder="Título do evento"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* DESCRIÇÃO */}
                            <textarea
                                required
                                name="descricao"
                                value={form.descricao}
                                onChange={handleChange}
                                placeholder="Breve descrição do evento..."
                                className="w-full h-24 p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* LOCAL */}
                            <input
                                type="text"
                                required
                                name="local"
                                value={form.local}
                                onChange={handleChange}
                                placeholder="Local do evento"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* CAPACIDADE */}
                            <input
                                type="number"
                                required
                                name="capacidade_maxima"
                                value={form.capacidade_maxima}
                                onChange={handleChange}
                                placeholder="Capacidade máxima"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* DATAS */}
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

                            {/* CAPA */}
                            <input
                                type="text"
                                name="capa"
                                required
                                value={form.capa}
                                onChange={handleChange}
                                placeholder="URL da capa"
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5"
                            />

                            {/* BOTÕES */}
                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded bg-black/10 cursor-pointer hover:bg-red-500 hover:text-white transition"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition"
                                >
                                    {loading ? "Atualizando..." : "Atualizar"}
                                </button>

                            </div>

                        </form>
                    )}

                </motion.div>

            </section>
        </>
    );
}

export default ModalEditEventos;