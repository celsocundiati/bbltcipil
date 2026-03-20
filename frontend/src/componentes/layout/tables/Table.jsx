import { admins, multas } from "../../../dados/db.json";
import { obterIniciais } from "./utilitarios/Utils";



function Table({tipo}){

    const totalM = multas.length;

    return(
        <main>
            {tipo === "admins" ?(
                <section className="w-full bg-white rounded-2xl px-8 py-5 mb-10">
                    <section className="py-5 flex flex-col">
                        <label className="text-xl">Lista de Administradores</label>
                        <label className="text-black/70">Exibindo 8 de 8 livros</label>
                    </section>

                    <section>
                            <table className="w-full table-fixed border-collapse bg-white shadow rounded-xl overflow-hidden">
                                <thead className="bg-black/5">
                                    <tr className="flex gap-10 bg-black/3 transition">
                                        <th className="w-[15%] px-5 py-3 text-left">Administrador</th>
                                        <th className="w-[14%] px-5 py-3 text-left">NIF</th>
                                        <th className="w-[11%] px-5 py-3 text-left">Função</th>
                                        <th className="w-[13%] px-5 py-3 text-left">Último login</th>
                                        <th className="w-[15%] px-5 py-3 text-left">Estado</th>
                                        <th className="w-[5%] px-5 py-3 text-left">Acções</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/10">
                                    {admins.map(adm => (
                                        <tr className="w-full grid grid-cols-6  hover:bg-black/3 transition" key={adm.id}>
                                            <td className="px-5 py-4 truncate text-black/85">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-[#f97b17] text-white flex items-center justify-center font-bold shrink-0">
                                                        {obterIniciais(adm.nome)}
                                                    </div>

                                                    <div className="overflow-hidden">
                                                        <p className="font-medium truncate">
                                                            {adm.nome}
                                                        </p>
                                                        <p className="text-sm text-cinza-900 truncate">
                                                            nome@gmail.com
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td className="px-5 py-4 truncate text-black/85"> {adm.nome} </td> */}
                                            <td className="px-5 py-4 truncate text-black/85"> {adm.nif} </td>
                                            <td className="px-5 py-4 truncate text-black/85 "> <button className={`text-center py-1 px-3 rounded ${adm.funcao === 'Super Admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>{adm.funcao} </button></td>
                                            <td className="px-5 py-4 truncate text-black/85"> 09/01/2026 </td>
                                            <td className="px-5 py-4 truncate text-black/85"> {adm.estado} </td>
                                            <td className="px-5 py-4 truncate text-black/85"> 
                                                <button className="px-3 py-2 border border-black/10 bg-cinza-100">Editar</button>
                                            </td>
                                            
                                        </tr>
                                    ))}
                                </tbody>
                        </table>
                    </section>
                </section>
            ) : (
                null
            )}
        </main>
    );
}
export default Table;