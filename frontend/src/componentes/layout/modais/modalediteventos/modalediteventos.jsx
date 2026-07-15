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
    const [saving, setSaving] = useState(false);
    const hoje = new Date().toISOString().split("T")[0];

    // =============================
    // LOAD EVENTO
    // =============================
    useEffect(() => {
        if (!evento?.id) return;

        setLoading(true);

        api.get(`/admin/eventos/${evento.id}/`)
            .then(res => {
                setForm(res.data);
            })
            .catch(err => {
                const msg = formatBackendError(err);
                showToast({ message: msg, type: "error" });
            })
            .finally(() => setLoading(false));

    }, [evento]);

    // =============================
    // HANDLE CHANGE
    // =============================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // =============================
    // BACKEND ERROR HANDLER
    // =============================
    const formatBackendError = (err) => {
        const data = err?.response?.data;

        if (!data) return "Erro de comunicação com o servidor";

        if (typeof data === "string") return data;

        return Object.entries(data)
            .map(([field, messages]) => {
                if (Array.isArray(messages)) {
                    return `${field}: ${messages.join(" ")}`;
                }
                return `${field}: ${messages}`;
            })
            .join(" | ");
    };

    // =============================
    // FRONT VALIDATION (leve)
    // =============================
    const validate = () => {

        if (!form.titulo?.trim()) return "Título obrigatório";
        if (!form.descricao?.trim()) return "Descrição obrigatória";
        if (!form.local?.trim()) return "Local obrigatório";

        if (Number(form.capacidade_maxima) <= 0)
            return "Capacidade deve ser maior que 0";

        if (new Date(form.data_fim) < new Date(form.data_inicio))
            return "Data final não pode ser menor que a inicial";

        return null;
    };

    // =============================
    // UPDATE
    // =============================
    async function handleUpdate(e) {
        e.preventDefault();

        const erro = validate();
        if (erro) {
            showToast({ message: erro, type: "error" });
            return;
        }

        setSaving(true);

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
            showToast({
                message: formatBackendError(error),
                type: "error",
            });

        } finally {
            setSaving(false);
        }
    }

    if (!evento) return null;


    return (
        <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative"
            >

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black/50 hover:text-black cursor-pointer"
                >
                    <HiOutlineXMark size={35} />
                </button>

                <article className="py-4 text-left">
                    <h2 className="text-xl font-medium">Editar Evento</h2>
                    <p className="text-lg">Actualizar eventos escolares</p>
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
                            placeholder="Título"
                        />

                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            placeholder="Descrição"
                        />

                        <input
                            name="local"
                            value={form.local}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            placeholder="Local"
                        />

                        <input
                            type="number"
                            name="capacidade_maxima"
                            value={form.capacidade_maxima}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            placeholder="Capacidade"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                            <input
                                type="date"
                                name="data_inicio"
                                value={form.data_inicio}
                                onChange={handleChange}
                                min={hoje}
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            />

                            <input
                                type="date"
                                name="data_fim"
                                value={form.data_fim}
                                onChange={handleChange}
                                min={form.data_inicio}
                                className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            />

                        </div>

                        <input
                            name="capa"
                            value={form.capa}
                            onChange={handleChange}
                            className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                            placeholder="URL da capa"
                        />

                        <div className="flex justify-end gap-3 pt-3">

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 bg-black/10 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                className="px-4 py-2 bg-green-500 text-white rounded-xl cursor-pointer hover:bg-green-600 disabled:opacity-50"
                            >
                                {saving ? "A atualizar..." : "Atualizar"}
                            </button>

                        </div>

                    </form>

                )}

            </motion.div>

        </section>
    );
}

export default ModalEditEventos;