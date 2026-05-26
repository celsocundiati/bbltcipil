import { useState } from "react";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

function ModalAddEvento({ onClose, showToast }) {

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

    // =========================
    // HANDLE CHANGE
    // =========================
    function handleChange(e) {
        setForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    // =========================
    // ERROR FORMATTER (DRF READY)
    // =========================
    const formatError = (error) => {
        const data = error?.response?.data;

        if (!data) return "Erro de comunicação com o servidor";

        if (typeof data === "string") return data;

        return Object.values(data)
            .flat()
            .join(" ");
    };

    // =========================
    // VALIDATIONS
    // =========================
    const validate = () => {

        if (!form.titulo?.trim())
            return "Título obrigatório";

        if (form.titulo.length < 5)
            return "Título muito curto";

        if (!form.descricao?.trim())
            return "Descrição obrigatória";

        if (!form.local?.trim())
            return "Local obrigatório";

        if (Number(form.capacidade_maxima) <= 0)
            return "Capacidade inválida";

        if (!form.data_inicio)
            return "Data de início obrigatória";

        if (form.data_inicio < hoje)
            return "Data de início não pode ser no passado";

        if (form.data_fim && form.data_fim < form.data_inicio)
            return "Data final inválida";

        if (form.capa && !/^https?:\/\/.+/.test(form.capa))
            return "URL da capa inválida";

        return null;
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const erro = validate();

        if (erro) {
            showToast({ message: erro, type: "error" });
            return;
        }

        setLoading(true);

        try {

            await api.post("/admin/eventos/", form);

            setForm({
                titulo: "",
                capa: "",
                descricao: "",
                local: "",
                capacidade_maxima: "",
                data_inicio: "",
                data_fim: "",
            });

            showToast({
                message: "Evento criado com sucesso",
                type: "success",
            });

            onClose();

        } catch (error) {

            showToast({
                message: formatError(error),
                type: "error",
            });

        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative"
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black"
                >
                    <HiOutlineXMark size={35} />
                </button>

                <article className="py-4 text-left">
                    <h2 className="text-xl font-medium">Criar Evento</h2>
                    <p className="text-lg">Registo de eventos escolares</p>
                </article>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        placeholder="Título do evento"
                        className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                    />

                    <textarea
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        placeholder="Descrição"
                        className="w-full h-24 p-2 bg-black/5 rounded outline-none border border-black/5"
                    />

                    <input
                        name="local"
                        value={form.local}
                        onChange={handleChange}
                        placeholder="Local"
                        className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                    />

                    <input
                        type="number"
                        min={1}
                        name="capacidade_maxima"
                        value={form.capacidade_maxima}
                        onChange={handleChange}
                        placeholder="Capacidade"
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
                        placeholder="URL da capa"
                        className="w-full p-2 bg-black/5 rounded outline-none border border-black/5 focus:ring-2 focus:ring-green-500"
                    />

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-black/10 cursor-pointer hover:bg-red-500 hover:text-white transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-green-600 transition"
                        >
                            {loading ? "Registando..." : "Registar"}
                        </button>

                    </div>

                </form>

            </motion.div>

        </section>
    );
}

export default ModalAddEvento;