import { useState } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import api from "../../../service/api/api";
import { motion } from "framer-motion";

function ModalAddAdmin({ onClose, onSuccess }) {

    const [form, setForm] = useState({
        username: "",
        grupo: "",
    });

    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const montarPayload = () => {
        return {
            username: form.username,
            grupos: [form.grupo]
        };
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.grupo) {
            alert("Seleciona utilizador e grupo");
            return;
        }

        setLoading(true);

        try {
            await api.post("/admin/users/promote/", {
                username: form.username,
                grupos: [form.grupo]
            });

            setModal({
                open: true,
                type: "success",
                message: "Utilizador promovido com sucesso!"
            });

            setForm({
                username: "",
                grupo: ""
            });

            onSuccess?.();

        } catch (err) {
            const msg =
                err.response?.data
                    ? Object.values(err.response.data).flat().join(" ")
                    : "Erro ao promover utilizador";

            setModal({
                open: true,
                type: "error",
                message: msg
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
                        Criar Administrador
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                            className="w-full px-3 py-2 border border-black/10 outline-none rounded-lg"
                        />

                        <select
                            name="grupo"
                            value={form.grupo}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-black/10 cursor-pointer outline-none rounded-lg"
                        >
                            <option value="">Selecionar grupo</option>
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
                                {loading ? "Criando..." : "Criar"}
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

export default ModalAddAdmin;


// import { useState } from "react";
// import { HiOutlineXMark } from "react-icons/hi2";
// import api from "../../../service/api/api";
// import { motion } from "framer-motion";

// function ModalAddAdmin({ onClose, onSuccess }) {

//     const [form, setForm] = useState({
//         username: "",
//         grupo: "",
//     });

//     const [loading, setLoading] = useState(false);
//     const [modal, setModal] = useState({
//         open: false,
//         type: "success",
//         message: "",
//     });

//     const handleChange = (e) => {
//         setForm({
//             ...form,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const montarPayload = () => {
//         return {
//             username: form.username,
//             grupos: [form.grupo]
//         };
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!form.username || !form.grupo) {
//             alert("Seleciona utilizador e grupo");
//             return;
//         }

//         setLoading(true);

//         try {
//             await api.post("/admin/users/", montarPayload());

//             setModal({
//                 open: true,
//                 type: "success",
//                 message: "Utilizador promovido com sucesso!"
//             });

//             setForm({
//                 username: "",
//                 grupo: ""
//             });

//             onSuccess?.();

//         } catch (err) {
//             const msg =
//                 err.response?.data
//                     ? Object.values(err.response.data).flat().join(" ")
//                     : "Erro ao promover utilizador";

//             setModal({
//                 open: true,
//                 type: "error",
//                 message: msg
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
//                     <button onClick={onClose} className="absolute top-3 right-3">
//                         <HiOutlineXMark size={28} />
//                     </button>

//                     <h2 className="text-xl font-semibold mb-4">
//                         Promover Utilizador
//                     </h2>

//                     <form onSubmit={handleSubmit} className="space-y-4">

//                         <input
//                             type="text"
//                             name="username"
//                             value={form.username}
//                             onChange={handleChange}
//                             placeholder="Username existente"
//                             required
//                             className="w-full px-3 py-2 border rounded-lg"
//                         />

//                         <select
//                             name="grupo"
//                             value={form.grupo}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border rounded-lg"
//                         >
//                             <option value="">Selecionar grupo</option>
//                             <option value="Admin">Admin</option>
//                             <option value="Bibliotecario">Bibliotecário</option>
//                         </select>

//                         <div className="flex justify-end gap-3">
//                             <button type="button" onClick={onClose}>
//                                 Cancelar
//                             </button>

//                             <button
//                                 type="submit"
//                                 disabled={loading}
//                                 className="bg-green-500 text-white px-4 py-2 rounded-lg"
//                             >
//                                 {loading ? "A promover..." : "Promover"}
//                             </button>
//                         </div>

//                     </form>
//                 </motion.div>
//             </div>

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
//                             className="mt-3 w-full bg-green-500 text-white py-2 rounded"
//                         >
//                             OK
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }

// export default ModalAddAdmin;

