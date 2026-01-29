import {HiOutlineBookOpen, HiOutlineCurrencyDollar} from "react-icons/hi2"
import {LuClock} from "react-icons/lu"
import {AiOutlineMail} from "react-icons/ai";


function HeaderCardInfo({tipo})
{
    return(
        <section>
            {tipo === "emprestimos" ?(
                <article className="flex items-center gap-4 p-5">
                    <div className="bg-[#F97B17]/5 text-[#F97B17] px-2 py-2 rounded-xl">
                        <HiOutlineBookOpen size={40}/>
                    </div>
                    <div>
                        <h2 className="text-xl mb-1">Regras de Empréstimos</h2>
                        <p className="text-black/70 text-lg">Definir limites e prazos</p>
                    </div>
                </article>
            ) : tipo === "multas" ?(
                <article className="flex items-center gap-4 p-5">
                    <div className="bg-green-500/5 text-green-500 px-2 py-2 rounded-xl">
                        <HiOutlineCurrencyDollar size={40}/>
                    </div>
                    <div>
                        <h2 className="text-xl">Configurações de multas</h2>
                        <p className="text-black/70 text-lg">Valores em kwanzas</p>
                    </div>
                </article>
            ) : tipo === "horarios" ?(
                <article className="flex items-center gap-4 p-5">
                    <div className="bg-purple-500/5 text-purple-500 px-2 py-2 rounded-xl">
                        <LuClock size={40}/>
                    </div>
                    <div>
                        <h2 className="text-xl">Horário de Funcionamento</h2>
                        <p className="text-black/70 text-lg">Horários de aberturas e encerramentos</p>
                    </div>
                </article>
            ) : tipo === "dados" ?(
                <article className="flex items-center gap-4 p-5">
                    <div className="bg-blue-500/5 text-blue-500 px-2 py-2 rounded-xl">
                        <AiOutlineMail size={40}/>
                    </div>
                    <div>
                        <h2 className="text-xl">Informações de Contactos</h2>
                        <p className="text-black/70 text-lg">Email e telefone da biblioteca</p>
                    </div>
                </article>
            ) : (
                null
            )}
        </section>
    );
}
export default HeaderCardInfo;