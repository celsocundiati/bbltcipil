import { useState } from "react";
import axios from "axios";
import {HiOutlineXMark} from "react-icons/hi2";

function ModalAlunoOficial({onClose}){

    const hoje = new Date();
    const idadeMinima = 14;
    const token = sessionStorage.getItem("access_token");


    const dataMaximaPermitida = new Date(
        hoje.getFullYear() - idadeMinima,
        hoje.getMonth(),
        hoje.getDate()
    ).toISOString().split("T")[0];

    const [form, setForm] = useState({
        n_processo: 0,
        n_bilhete: 0,
        nome_completo: "",
        data_nascimento: "",
        classe: 10,
        curso: "",
    });
        
    const [modal, setModal] = useState({
        open: false,
        type: "success", // "success" ou "error"
        message: "",
    });
        const [loading, setLoading] = useState(false);
        const [erro, setErro] = useState(null);

        const handleChange = (e) => {
        setForm({
        ...form,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);


        try {
            // 🔐 Redireciona se não houver token
            if (!token) {
            navigate("/login");
            return;
        }
            await axios.post("http://127.0.0.1:8000/api/admin/alunosoficiais/", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setModal({
                open: true,
                type: "success",
                message: "Estudante registrado com sucesso!",
            });
            
            setForm({
                n_processo: 0,
                n_bilhete: 0,
                nome_completo: "",
                data_nascimento: "",
                classe: 10,
                curso: "",
            });
        } catch (err) {
                if (err.response?.data) {
                    const erros = Object.values(err.response.data)
                        .flat()
                        .join("\n");

                    setModal({
                        open: true,
                        type: "error",
                        message: erros,
                    });
                    setErro(erros);
                } else {
                    alert("Erro ao comunicar com o servidor");
                }

                if (err.response?.status === 401) navigate("/login");

                console.error(err);

        } finally {
            setLoading(false);
        }
    };

    function closeModal(){
        setModal({open:false});
        onClose()
    }


    return(
        <main>
            <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                    <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                        <HiOutlineXMark size={35}/>
                    </button>
                    <article className="py-4">
                        <h2 className="text-xl font-medium">
                            Registar Estudante
                        </h2>
                        <p className="text-lg">
                            Cadastrar estudantes para o banco de dados do acervo escolar
                        </p>
                    </article>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Nome:</label>
                                <input type="text" required pe="text" name="nome_completo" value={form.nome} onChange={handleChange}  placeholder="Celso Cristiano Gabriel Domilde" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Nº Proc:</label>
                                <input
                                    type="text"
                                    name="n_processo"
                                    id="n_processo"
                                    value={form.n_processo}
                                    required
                                    placeholder="100123"
                                    minLength={4}
                                    maxLength={6}
                                    inputMode="numeric"
                                    pattern="[0-9]{4,6}"
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value) && value.length <= 6) {
                                            handleChange(e);
                                        }
                                    }}
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Nº Bilhete:</label>
                                <input
                                    type="text"
                                    name="n_bilhete"
                                    id="n_bilhete"
                                    value={form.n_bilhete}
                                    required
                                    placeholder="00**21***LA**8"
                                    onChange={handleChange}
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Classe:</label>
                                <select
                                    name="classe"
                                    id="classe"
                                    value={form.classe}
                                    onChange={handleChange}
                                    required
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="">Selecionar classe</option>
                                    <option value="10">10ª Classe</option>
                                    <option value="11">11ª Classe</option>
                                    <option value="12">12ª Classe</option>
                                    <option value="13">13ª Classe</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Curso:</label>
                                <input type="text" required name="curso" id="curso" value={form.curso} onChange={handleChange} placeholder="Gestão de Sistemas Informáticos" 
                                className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500 cursor-pointer"/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Data de Nascimento:</label>
                                <input
                                    type="date"
                                    name="data_nascimento"
                                    id="data_nascimento"
                                    value={form.data_nascimento}
                                    onChange={handleChange}
                                    required
                                    max={dataMaximaPermitida}
                                    className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 py-4">
                            <button onClick={onClose} type="submit" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                Cancelar
                            </button>
                            <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>

            {modal.open && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center text-left z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                    <h3 className="text-lg  font-semibold mb-2">
                        {modal.type === "success" ? "Sucesso" : "Erro"}
                    </h3>
                    <p>{modal.message}</p>
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={() => {
                                if (modal.type === "success") {
                                    setModal({ open: false });
                                    onClose()
                                } else {
                                    setModal({ ...modal, open: false }); // apenas fecha no erro
                                }
                            }}
                            className={`cursor-pointer px-6 py-2 rounded-lg border border-black/10 text-white transition ${
                                modal.type === "success" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                            }`}
                        >
                            {modal.type === "success" ? "Confirmado" : "Tente novamente"}
                        </button>
                    </div>
                </div>
            </div>
        )}

        </main>
    );
}
export default ModalAlunoOficial;