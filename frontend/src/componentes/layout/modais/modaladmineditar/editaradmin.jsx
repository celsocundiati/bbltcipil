import { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

function ModalEditAdmin({ onClose, onSuccess, adm }) {
    const [form, setForm] = useState({
        grupo: "Admin",
    });

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    useEffect(() => {
        if (adm) {
            let grupoAtual = "Admin"; // default
            if (adm.is_superuser) {
                grupoAtual = "issuperuser";
            } else if (adm.grupos_display?.includes("Bibliotecario")) {
                grupoAtual = "Bibliotecario";
            } else if (adm.grupos_display?.includes("Admin")) {
                grupoAtual = "Admin";
            }

            setForm({
                username: adm.username,
                grupo: grupoAtual,
            });
        }
    }, [adm]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // 🔥 Payload para backend
    const montarPayload = () => {
        if (form.grupo === "issuperuser") {
            return {
                is_superuser: true,
                grupos: [],
            };
        }
        return {
            is_superuser: false,
            grupos: [form.grupo],
        };
    };

    const getTipoUsuario = () => {
        if (form.grupo === "issuperuser") return "Superusuário";
        if (form.grupo === "Admin") return "Administrador";
        if (form.grupo === "Bibliotecario") return "Bibliotecário";
        return "Usuário";
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = montarPayload();

            await api.patch(`/admin/users/promote/`, payload);

            setModal({
                open: true,
                type: "success",
                message: `${getTipoUsuario()} atualizado com sucesso!`,
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            const msg = err.response?.data
                ? Object.values(err.response.data).flat().join(" ")
                : "Erro ao atualizar usuário";

            setModal({
                open: true,
                type: "error",
                message: msg,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl w-full max-w-md relative"
                >
                    <button onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
                        <HiOutlineXMark size={28} />
                    </button>

                    <h2 className="text-xl font-semibold mb-4">
                        Editar Administrador
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="username"
                            value={adm.username}
                            className="w-full px-3 py-2 border border-black/10 outline-none rounded-lg bg-gray-100 cursor-not-allowed"
                        />

                        <select
                            name="grupo"
                            value={form.grupo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-black/10 cursor-pointer outline-none rounded-lg"
                        >
                            <option value="issuperuser">Super User</option>
                            <option value="Admin">Admin</option>
                            <option value="Bibliotecario">Bibliotecário</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-black/10 cursor-pointer rounded-lg"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded-lg"
                            >
                                {loading ? "Atualizando..." : "Atualizar"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            {/* 🔥 Feedback */}
            {modal.open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white p-5 rounded-lg w-80">
                        <h3 className="font-semibold">
                            {modal.type === "success" ? "Sucesso" : "Erro"}
                        </h3>
                        <p>{modal.message}</p>

                        <button
                            onClick={() => {
                                setModal({ open: false });
                                if (modal.type === "success") onClose();
                            }}
                            className="mt-3 w-full bg-green-500 text-white py-2 rounded cursor-pointer"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ModalEditAdmin;