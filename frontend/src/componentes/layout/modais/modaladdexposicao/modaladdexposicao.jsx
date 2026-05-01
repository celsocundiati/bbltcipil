import { useState } from "react";
import api from "../../../service/api/api";
import { motion } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";

function ModalAddExposicao({ onClose, onSuccess }) {

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

    const [modal, setModal] = useState({
        open: false,
        type: "success",
        message: "",
    });

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post(
                "/admin/exposicoes/",
                form
            );

            setModal({
                open: true,
                type: "success",
                message: "Exposição criada com sucesso!"
            });

            setForm({
                titulo: "",
                capa: "",
                descricao: "",
                local: "",
                capacidade_maxima: "",
                data_inicio: "",
                data_fim: "",
            });

            onSuccess?.(res.data);

        } catch (err) {
            const msg = err.response?.data
                ? Object.values(err.response.data).flat().join(" ")
                : "Erro ao criar exposição";

            setModal({
                open: true,
                type: "error",
                message: msg
            });

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <section className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

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
                        <h2 className="text-xl font-medium">Registar Exposições</h2>
                        <p className="text-lg">Registre exposições literárias</p>
                    </article>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Título */}
                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Título da exposição (ex: Feira do Livro 2026)"
                            className="w-full p-2 bg-black/5 rounded"
                        />

                        {/* Descrição */}
                        <textarea
                            name="descricao"
                            value={form.descricao}
                            onChange={handleChange}
                            placeholder="Descreve brevemente o objetivo da exposição..."
                            className="w-full p-2 bg-black/5 rounded"
                        />

                        {/* Local */}
                        <input
                            name="local"
                            value={form.local}
                            onChange={handleChange}
                            placeholder="Local da exposição (ex: IPIL - Sala Magna)"
                            className="w-full p-2 bg-black/5 rounded"
                        />

                        {/* Capacidade */}
                        <input
                            type="number"
                            name="capacidade_maxima"
                            value={form.capacidade_maxima}
                            onChange={handleChange}
                            placeholder="Número máximo de participantes"
                            className="w-full p-2 bg-black/5 rounded"
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
                                    className="w-full p-2 bg-black/5 rounded"
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
                                    className="w-full p-2 bg-black/5 rounded"
                                />
                            </div>

                        </div>

                        {/* Capa */}
                        <input
                            name="capa"
                            value={form.capa}
                            onChange={handleChange}
                            placeholder="URL da imagem de capa (ex: https://...)"
                            className="w-full p-2 bg-black/5 rounded"
                        />

                        {/* Ações */}
                        <div className="flex justify-end gap-3">

                            <button type="button" className="px-4 py-2 rounded bg-black/10 cursor-pointer" onClick={onClose}>
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
                            >
                                {loading ? "A guardar..." : "Guardar"}
                            </button>

                        </div>

                    </form>

                </motion.div>
            </section>

            {/* FEEDBACK PADRÃO ADMIN */}
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

export default ModalAddExposicao;

