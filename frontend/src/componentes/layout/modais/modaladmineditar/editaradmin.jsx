// import { useState, useEffect } from "react";
// import { HiOutlineXMark } from "react-icons/hi2";
// import api from "../../../service/api/api";
// import { motion } from "framer-motion";
// import Permissao from "../../../auth/hooks/gerir/gerenciamento";

// function ModalEditAdmin({ onClose, onSuccess, adm }) {
//     const [form, setForm] = useState({
//         username: "",
//         grupo: "Admin",
//     });

//     const [loading, setLoading] = useState(false);
//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     useEffect(() => {
//         if (adm) {
//             let grupoAtual = "Admin"; // default
//             if (adm.is_superuser) {
//                 grupoAtual = "issuperuser";
//             } else if (adm.grupos_display?.includes("Bibliotecario")) {
//                 grupoAtual = "Bibliotecario";
//             } else if (adm.grupos_display?.includes("Admin")) {
//                 grupoAtual = "Admin";
//             }

//             setForm({
//                 username: adm.username,
//                 grupo: grupoAtual,
//             });
//         }
//     }, [adm]);

//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value,
//         });
//     };

//     // 🔥 Payload para backend
//     const montarPayload = () => {
//         return {
//             username: form.username, // 🔥 OBRIGATÓRIO
//             grupos: form.grupo === "issuperuser" ? [] : [form.grupo],
//         };
//     };

//     const getTipoUsuario = () => {
//         if (form.grupo === "issuperuser") return "Superusuário";
//         if (form.grupo === "Admin") return "Administrador";
//         if (form.grupo === "Bibliotecario") return "Bibliotecário";
//         return "Usuário";
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             const payload = montarPayload();

//             await api.patch(`/admin/users/promote/`, payload);

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: `${getTipoUsuario()} atualizado com sucesso!`,
//             });

//             if (onSuccess) onSuccess();
//         } catch (err) {
//             const msg = err.response?.data
//                 ? Object.values(err.response.data).flat().join(" ")
//                 : "Erro ao atualizar usuário";

//             setModal({
//                 open: true,
//                 type: "error",
//                 message: msg,
//             });
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white p-6 rounded-2xl w-full max-w-md relative"
//                 >
//                     <button onClick={onClose} className="absolute top-3 right-3 cursor-pointer">
//                         <HiOutlineXMark size={28} />
//                     </button>

//                     <h2 className="text-xl font-semibold mb-4">
//                         Editar Administrador
//                     </h2>

//                     <form onSubmit={handleSubmit} className="space-y-4">
//                         <input
//                             type="text"
//                             name="username"
//                             value={form.username}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-black/10 outline-none rounded-lg bg-gray-100"
//                         />

//                         <select
//                             name="grupo"
//                             value={form.grupo}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-black/10 cursor-pointer outline-none rounded-lg"
//                         >
//                             <Permissao>
//                                 <option value="issuperuser">Super User</option>
//                             </Permissao>
//                             <option value="Admin">Admin</option>
//                             <option value="Bibliotecario">Bibliotecário</option>
//                         </select>

//                         <div className="flex justify-end gap-3">
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 border border-black/10 cursor-pointer rounded-lg"
//                             >
//                                 Cancelar
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded-lg"
//                             >
//                                 {loading ? "Atualizando..." : "Atualizar"}
//                             </button>
//                         </div>
//                     </form>
//                 </motion.div>
//             </div>

//             {/* 🔥 Feedback */}
//             {modal.open && (
//                 <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//                     <div className="bg-white p-5 rounded-lg w-80">
//                         <h3 className="font-semibold">
//                             {modal.type === "success" ? "Sucesso" : "Erro"}
//                         </h3>
//                         <p>{modal.message}</p>

//                         <button
//                             onClick={() => {
//                                 setModal({ open: false });
//                                 if (modal.type === "success") onClose();
//                             }}
//                             className="mt-3 w-full bg-green-500 text-white py-2 rounded cursor-pointer"
//                         >
//                             OK
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default ModalEditAdmin;







// import { useState, useEffect } from "react";
// import { HiOutlineXMark } from "react-icons/hi2";
// import api from "../../../service/api/api";
// import { motion } from "framer-motion";
// import { useAuth } from "../../../auth/userAuth/useauth";

// function ModalEditAdmin({ onClose, onSuccess, adm }) {

//     const { user } = useAuth();

//     const [form, setForm] = useState({
//         username: "",
//         grupo: "Admin",
//     });

//     const [loading, setLoading] = useState(false);

//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     // ==========================
//     // USER LOGADO
//     // ==========================
//     const currentUser = user?.user || user;

//     const isSuperuser =
//         currentUser?.is_superuser === true;

//     // ==========================
//     // INIT
//     // ==========================
//     useEffect(() => {

//         if (adm) {

//             let grupoAtual = "Admin";

//             if (adm.is_superuser) {
//                 grupoAtual = "issuperuser";

//             } else if (
//                 adm.grupos_display?.includes("Bibliotecario")
//             ) {
//                 grupoAtual = "Bibliotecario";

//             } else if (
//                 adm.grupos_display?.includes("Admin")
//             ) {
//                 grupoAtual = "Admin";
//             }

//             setForm({
//                 username: adm.username,
//                 grupo: grupoAtual,
//             });
//         }

//     }, [adm]);

//     // ==========================
//     // CHANGE
//     // ==========================
//     function handleChange(e) {

//         setForm((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     }

//     // ==========================
//     // PAYLOAD
//     // ==========================
//     function montarPayload() {

//         return {
//             username: form.username,

//             grupos:
//                 form.grupo === "issuperuser"
//                     ? ["Superuser"]
//                     : [form.grupo],
//         };
//     }

//     // ==========================
//     // LABEL
//     // ==========================
//     function getTipoUsuario() {

//         if (form.grupo === "issuperuser") {
//             return "Superusuário";
//         }

//         if (form.grupo === "Admin") {
//             return "Administrador";
//         }

//         if (form.grupo === "Bibliotecario") {
//             return "Bibliotecário";
//         }

//         return "Usuário";
//     }

//     // ==========================
//     // SUBMIT
//     // ==========================
//     async function handleSubmit(e) {

//         e.preventDefault();

//         setLoading(true);

//         try {

//             const payload = montarPayload();

//             await api.patch(
//                 "/admin/users/promote/",
//                 payload
//             );

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: `${getTipoUsuario()} atualizado com sucesso!`,
//             });

//             if (onSuccess) {
//                 onSuccess();
//             }

//         } catch (err) {

//             const msg =
//                 err.response?.data
//                     ? Object.values(err.response.data)
//                         .flat()
//                         .join(" ")
//                     : "Erro ao atualizar usuário";

//             setModal({
//                 open: true,
//                 type: "error",
//                 message: msg,
//             });

//         } finally {

//             setLoading(false);
//         }
//     }

//     return (
//         <>
//             <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-white p-6 rounded-2xl w-full max-w-md relative"
//                 >

//                     {/* CLOSE */}
//                     <button
//                         onClick={onClose}
//                         className="absolute top-3 right-3 cursor-pointer"
//                     >
//                         <HiOutlineXMark size={28} />
//                     </button>

//                     {/* TITLE */}
//                     <h2 className="text-xl font-semibold mb-4">
//                         Editar Administrador
//                     </h2>

//                     {/* FORM */}
//                     <form
//                         onSubmit={handleSubmit}
//                         className="space-y-4"
//                     >

//                         {/* USERNAME */}
//                         <input
//                             type="text"
//                             name="username"
//                             value={form.username}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-black/10 outline-none rounded-lg bg-gray-100"
//                         />

//                         {/* GRUPO */}
//                         <select
//                             name="grupo"
//                             value={form.grupo}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-black/10 cursor-pointer outline-none rounded-lg"
//                         >

//                             {/* SUPERUSER */}
//                             {isSuperuser && (
//                                 <option value="issuperuser">
//                                     Super User
//                                 </option>
//                             )}

//                             <option value="Admin">
//                                 Admin
//                             </option>

//                             <option value="Bibliotecario">
//                                 Bibliotecário
//                             </option>

//                         </select>

//                         {/* ACTIONS */}
//                         <div className="flex justify-end gap-3">

//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="px-4 py-2 border border-black/10 cursor-pointer rounded-lg"
//                             >
//                                 Cancelar
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-green-500 text-white cursor-pointer px-4 py-2 rounded-lg disabled:opacity-50"
//                             >
//                                 {loading
//                                     ? "Atualizando..."
//                                     : "Atualizar"}
//                             </button>

//                         </div>

//                     </form>

//                 </motion.div>

//             </div>

//             {/* FEEDBACK */}
//             {modal.open && (

//                 <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-60">

//                     <div className="bg-white p-5 rounded-lg w-80">

//                         <h3 className="font-semibold">

//                             {modal.type === "success"
//                                 ? "Sucesso"
//                                 : "Erro"}

//                         </h3>

//                         <p className="mt-2">
//                             {modal.message}
//                         </p>

//                         <button
//                             onClick={() => {

//                                 setModal({
//                                     open: false,
//                                     type: "success",
//                                     message: "",
//                                 });

//                                 if (modal.type === "success") {
//                                     onClose();
//                                 }
//                             }}
//                             className="mt-4 w-full bg-green-500 text-white py-2 rounded cursor-pointer"
//                         >
//                             OK
//                         </button>

//                     </div>

//                 </div>
//             )}
//         </>
//     );
// }

// export default ModalEditAdmin;






import { useState, useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { motion } from "framer-motion";
import api from "../../../service/api/api";
import { useAuth } from "../../../auth/userAuth/useauth";

function ModalEditAdmin({ onClose, onSuccess, adm }) {

    const { user } = useAuth();

    // ==========================
    // USER LOGADO
    // ==========================
    const currentUser = user?.user || user;

    const isCurrentSuperuser =
        currentUser?.is_superuser === true;

    // ==========================
    // STATES
    // ==========================
    const [form, setForm] = useState({
        username: "",
        grupo: "Admin",
    });

    const [loading, setLoading] = useState(false);

    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    // ==========================
    // INIT
    // ==========================
    useEffect(() => {

        if (!adm) return;

        let grupoAtual = "Admin";

        if (adm.is_superuser) {

            grupoAtual = "issuperuser";

        } else if (
            adm.grupos_display?.includes("Bibliotecario")
        ) {

            grupoAtual = "Bibliotecario";

        } else if (
            adm.grupos_display?.includes("Admin")
        ) {

            grupoAtual = "Admin";
        }

        setForm({
            username: adm.username,
            grupo: grupoAtual,
        });

    }, [adm]);

    // ==========================
    // CHANGE
    // ==========================
    function handleChange(e) {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    // ==========================
    // LABEL USER
    // ==========================
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

    // ==========================
    // PAYLOAD
    // ==========================
    function montarPayload() {

        // SUPERUSER
        if (form.grupo === "issuperuser") {

            return {
                username: form.username,
                is_superuser: true,
                grupos: [],
            };
        }

        // ADMIN / BIBLIOTECARIO
        return {
            username: form.username,
            is_superuser: false,
            grupos: [form.grupo],
        };
    }

    // ==========================
    // SUBMIT
    // ==========================
    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        try {

            const payload = montarPayload();

            await api.patch(
                "/admin/users/promote/",
                payload
            );

            setModal({
                open: true,
                type: "success",
                message: `${getTipoUsuario()} atualizado com sucesso!`,
            });

            if (onSuccess) {
                onSuccess();
            }

        } catch (err) {

            const responseData =
                err?.response?.data;

            let errorMessage =
                "Erro ao atualizar utilizador";

            if (responseData) {

                if (typeof responseData === "string") {

                    errorMessage = responseData;

                } else {

                    errorMessage = Object.values(responseData)
                        .flat()
                        .join(" ");
                }
            }

            setModal({
                open: true,
                type: "error",
                message: errorMessage,
            });

        } finally {

            setLoading(false);
        }
    }

    return (
        <>
            {/* OVERLAY */}
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

                {/* MODAL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 relative"
                >

                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 cursor-pointer text-black/70 hover:text-black transition"
                    >
                        <HiOutlineXMark size={28} />
                    </button>

                    {/* TITLE */}
                    <h2 className="text-xl font-semibold mb-5">
                        Editar Administrador
                    </h2>

                    {/* FORM */}
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >

                        {/* USERNAME */}
                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-black/70">
                                Username
                            </label>

                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                readOnly
                                className="w-full px-3 py-2 rounded-xl border border-black/10 bg-gray-100 outline-none"
                            />

                        </div>

                        {/* FUNÇÃO */}
                        <div className="flex flex-col gap-1">

                            <label className="text-sm text-black/70">
                                Função
                            </label>

                            <select
                                name="grupo"
                                value={form.grupo}
                                onChange={handleChange}
                                className="w-full px-3 py-2 rounded-xl border border-black/10 outline-none cursor-pointer focus:ring-2 focus:ring-[#f97b17]"
                            >

                                {/* SUPERUSER */}
                                {isCurrentSuperuser && (
                                    <option value="issuperuser">
                                        Super User
                                    </option>
                                )}

                                <option value="Admin">
                                    Admin
                                </option>

                                <option value="Bibliotecario">
                                    Bibliotecário
                                </option>

                            </select>

                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3 pt-2">

                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl border border-black/10 hover:bg-black/5 transition cursor-pointer"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white transition cursor-pointer disabled:opacity-50"
                            >
                                {loading
                                    ? "Atualizando..."
                                    : "Atualizar"}
                            </button>

                        </div>

                    </form>

                </motion.div>

            </div>

            {/* FEEDBACK */}
            {modal.open && (

                <div className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4">

                    <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5">

                        <h3 className="text-lg font-semibold">

                            {modal.type === "success"
                                ? "Sucesso"
                                : "Erro"}

                        </h3>

                        <p className="mt-2 text-black/70">
                            {modal.message}
                        </p>

                        <button
                            onClick={() => {

                                const modalType =
                                    modal.type;

                                setModal({
                                    open: false,
                                    type: "success",
                                    message: "",
                                });

                                if (modalType === "success") {
                                    onClose();
                                }
                            }}
                            className="mt-5 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl transition cursor-pointer"
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