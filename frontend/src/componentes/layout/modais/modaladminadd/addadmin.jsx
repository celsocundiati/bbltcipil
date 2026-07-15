import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

function ModalAddAdmin({ onClose, onSuccess, showToast }) {

    const [form, setForm] = useState({
        username: "",
        grupo: "",
    });

    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function montarPayload() {
        return {
            username: form.username.trim(),
            grupos: [form.grupo],
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.username || !form.grupo) {
            showToast({
                type: "error",
                message: "Seleciona o utilizador e o grupo",
            });
            return;
        }

        setLoading(true);

        try {
            await api.post(
                "/admin/users/promote/",
                montarPayload()
            );

            showToast?.({
                type: "success",
                message: "Utilizador promovido com sucesso!",
            });

            setForm({
                username: "",
                grupo: "",
            });

            await onSuccess?.();

        } catch (err) {

            const data = err?.response?.data;

            let message = "Erro ao promover utilizador";

            if (data) {
                message = typeof data === "string"
                    ? data
                    : Object.values(data).flat().join(" ");
            }

            showToast({
                type: "error",
                message,
            });

        } finally {
            setLoading(false);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
            >

                {/* CLOSE */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-black/60 hover:text-black"
                >
                    <HiOutlineXMark size={28} />
                </button>

                {/* TITLE */}
                <h2 className="text-xl font-semibold mb-5">
                    Criar Administrador
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* USERNAME */}
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full px-3 py-2 border border-black/10 rounded-xl outline-none"
                    />

                    {/* GRUPO */}
                    <select
                        name="grupo"
                        value={form.grupo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-black/10 rounded-xl cursor-pointer outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Selecionar grupo</option>
                        <option value="issuperuser">Super User</option>
                        <option value="Admin">Admin</option>
                        <option value="Bibliotecario">Bibliotecário</option>
                    </select>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-black/10 rounded-xl hover:bg-black/5 cursor-pointer"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-green-500 cursor-pointer text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? "Criando..." : "Criar"}
                        </button>

                    </div>

                </form>

            </motion.div>

        </div>
    );
}

export default ModalAddAdmin;