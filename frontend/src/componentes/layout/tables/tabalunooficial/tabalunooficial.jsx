import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../service/api/api";
import { obterIniciais } from "../utilitarios/Utils";

function TabALunosOficiais() {
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();

    useEffect(() => {

        const fetchAlunos = async() => {
            try{
                const res = await api.get("/admin/alunosoficiais/");
                setAlunos(Array.isArray(res.data.results) ? res.data.results : res.data);
            }catch(err){
                console.error("Erro na captura de Alunos.", err)
                if (err.response?.status === 401) navigate("/login");
            }
        }
        fetchAlunos();
    }, [navigate]);

  const totalAlunos = alunos.length;
    
    return(
        <main>
            <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                <section className="py-5 flex flex-col">
                    <label className="text-xl font-medium">Lista de ALunos Oficiais do IPIL</label>
                    <label className="text-black/70">Exibindo {totalAlunos}</label>
                </section>
                    <section className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full table-fixed border-collapse">
                            <thead className="bg-black/5">
                                <tr>
                                    <th className="w-[25%] px-5 py-3 text-center">Estudante</th>
                                    <th className="w-[17%] px-5 py-3 text-center">Nº Processo</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Nº Bilhete</th>
                                    <th className="w-[15%] px-5 py-3 text-center">Curso</th>
                                    <th className="w-[10%] px-5 py-3 text-center">Classe</th>
                                    <th className="w-[17%] px-5 py-3 text-center">Nascimento</th>
                                    <th className="w-[17%] px-5 py-3 text-center">Idade</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-black/10">
                            {Array.isArray(alunos) && alunos.length === 0 ?(
                                <tr>
                                    <td colSpan={9} className="text-center py-4 text-red-700">
                                        Nenhum aluno encontrado.
                                    </td>
                                </tr>
                            ) : (
                            Array.isArray(alunos) && alunos.map(aluno => (
                                    <tr key={aluno.id} className="hover:bg-black/3 transition">
                                        <td className="px-5 py-4 truncate">
                                            <div className="flex items-center justify-left gap-3">
                                                <div className="w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold shrink-0">
                                                    {obterIniciais(aluno.nome_completo)}
                                                </div>

                                                <div className="overflow-hidden">
                                                    <p className="font-medium truncate">
                                                        {aluno.nome_completo}
                                                    </p>
                                                    <p className="text-sm text-cinza-900 truncate">
                                                        {aluno?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4 truncate text-center">{aluno.n_processo}</td>
                                        <td className="px-5 py-4 truncate text-center">{aluno.n_bilhete}</td>
                                        <td className="px-5 py-4 truncate text-center">{aluno.curso}</td>
                                        <td className="px-5 py-4 truncate text-center">{aluno.classe}</td>
                                        <td className="px-5 py-4 truncate text-center">{aluno.data_nascimento}</td>
                                        <td className="px-5 py-4 truncate text-center">{aluno.idade}</td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </section>
                </section>
        </main>
    );
}
export default TabALunosOficiais;