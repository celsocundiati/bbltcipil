import { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import api from "../../../service/api/api";
import { useAuth } from "../../../auth/userAuth/useauth";

function ModalEditAdmin({ onClose, onSuccess, adm, showToast }) {

    const { user } = useAuth();

    const currentUser = user?.user || user;
    const isCurrentSuperuser = currentUser?.is_superuser === true;

    const [form, setForm] = useState({
        username: "",
        grupo: "Admin",
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!adm) return;

        let grupoAtual = "Admin";

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
    }, [adm]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }

    function montarPayload() {
        if (form.grupo === "issuperuser") {
            return {
                username: form.username,
                is_superuser: true,
                grupos: [],
            };
        }

        return {
            username: form.username,
            is_superuser: false,
            grupos: [form.grupo],
        };
    }

    function getTipoUsuario() {
        switch (form.grupo) {
            case "issuperuser":
                return "Superusuário";
            case "Admin":
                return "Administrador";
            case "Bibliotecario":
                return "Bibliotecário";
            default:
                return "Usuário";
        }
    }

    // async function handleSubmit(e) {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const payload = montarPayload();

    //         await api.patch("/admin/users/promote/", payload);

    //         showToast({
    //             type: "success",
    //             message: `${getTipoUsuario()} atualizado com sucesso!`,
    //         });

    //         onSuccess?.();
    //         onClose();

    //     } catch (err) {

    //         const data = err?.response?.data;

    //         let message = "Erro ao atualizar utilizador";

    //         if (data) {
    //             message = typeof data === "string"
    //                 ? data
    //                 : Object.values(data).flat().join(" ");
    //         }

    //         showToast({
    //             type: "error",
    //             message,
    //         });

    //     } finally {
    //         setLoading(false);
    //     }
    // }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = montarPayload();

            await api.patch("/admin/users/promote/", payload);

            showToast?.({
                type: "success",
                message: `${getTipoUsuario()} atualizado com sucesso!`,
            });

            // Atualiza a lista no componente pai
            await onSuccess?.();

        } catch (err) {

            const data = err?.response?.data;

            let message = "Erro ao atualizar utilizador";

            if (data) {
                message = typeof data === "string"
                    ? data
                    : Object.values(data).flat().join(" ");
            }

            showToast?.({
                type: "error",
                message,
            });

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
            >

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 cursor-pointer text-black/60 hover:text-black"
                >
                    <HiOutlineXMark size={28} />
                </button>

                <h2 className="text-xl font-semibold mb-5">
                    Editar Administrador
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* USERNAME */}
                    <div>
                        <label className="text-sm text-black/60">Username</label>
                        <input
                            type="text"
                            value={form.username}
                            readOnly
                            className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-100 border border-black/10"
                        />
                    </div>

                    {/* GRUPO */}
                    <div>
                        <label className="text-sm text-black/60">Função</label>

                        <select
                            name="grupo"
                            value={form.grupo}
                            onChange={handleChange}
                            className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"
                        >

                            {isCurrentSuperuser && (
                                <option value="issuperuser">
                                    Super User
                                </option>
                            )}

                            <option value="Admin">Admin</option>
                            <option value="Bibliotecario">Bibliotecário</option>

                        </select>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-3 pt-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl cursor-pointer border border-black/10 hover:bg-black/5"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded-xl cursor-pointer bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? "Atualizando..." : "Atualizar"}
                        </button>

                    </div>

                </form>

            </motion.div>

        </div>
    );
}

export default ModalEditAdmin;