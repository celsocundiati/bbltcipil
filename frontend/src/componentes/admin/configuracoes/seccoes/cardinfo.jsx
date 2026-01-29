import HeaderCardInfo from "./headcard";
import { FiPhone } from "react-icons/fi";
import {AiOutlineMail} from "react-icons/ai";

function CardInfo()
{
    return(
        <main className="w-full grid grid-cols-1 space-y-10">
            <section className="w-full h-64 border border-black/10 rounded-lg">
                <HeaderCardInfo tipo="emprestimos"/>
                <article className="grid grid-cols-2 gap-10 p-5">
                    <div>
                        <h3 className="font-semibold text-lg">Dias Padrão de Empréstimos</h3>
                        <input type="number" required value={14} className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"/>
                        <p className="text-black/70 text-lg">Número de dias para a devolução</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Limites de Livros por Estudante</h3>
                        <input type="number" required value={3} className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"/>
                        <p className="text-black/70 text-lg">Máximo de livros simultâneos </p>
                    </div>
                </article>
            </section>

            <section className="w-full h-64 border border-black/10 rounded-lg">
                <HeaderCardInfo tipo="multas"/>
                <article className="grid grid-cols-3 gap-10 p-5">
                    <div>
                        <h3 className="font-semibold text-lg">Multas por Dias (kz)</h3>
                        <input type="number" required value={500} className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"/>
                        <p className="text-black/70 text-lg">Por dia de atraso</p>
                    </div>
                    <div className="">
                        <h3 className="font-semibold text-lg">Multas por Danos (kz)</h3>
                        <input type="number" required value={1500} className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"/>
                        <p className="text-black/70 text-lg">Por livro danificado </p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">Por livro perdido (kz)</h3>
                        <input type="number" required value={5000} className="w-full h-10 px-5 py-2 my-2 outline-none bg-black/3 border border-black/5 rounded-2xl"/>
                        <p className="text-black/70 text-lg">Número de dias para a devolução</p>
                    </div>
                </article>
            </section>

            <section className="w-full h-64 border border-black/10 rounded-lg">
                <HeaderCardInfo tipo="horarios"/>
                <article className="grid grid-cols-2 gap-10 p-5">
                    <div>
                        <h3 className="font-semibold text-lg">Dias de Semana</h3>
                        <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl">
                            08:00h - 16:00h
                        </div>
                    </div>
                    <div >
                        <h3 className="font-semibold text-lg">Fins de Semana</h3>
                        <div className="w-full h-10 px-5 py-2 bg-black/3 border border-black/5 rounded-2xl">
                            08:00h - 12:00h
                        </div>
                    </div>
                </article>
            </section>

            <section className="w-full h-64 border border-black/10 rounded-lg">
                <HeaderCardInfo tipo="dados"/>
                <article className="grid grid-cols-2 gap-10 p-5">
                    <div>
                        <h3 className="font-semibold text-lg">Email</h3>
                        <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
                            <AiOutlineMail size={25}/>
                            <input type="email" required value="bibliotecaipil@gmail.com" className="w-full h-10 px-5 py-2 outline-none"/>
                        </div>
                    </div>
                    <div >
                        <h3 className="font-semibold text-lg">Telefone</h3>
                        <div className="w-full flex items-center gap-2 h-10 px-5 py-2 my-2 bg-black/3 border border-black/5 rounded-2xl">
                            <FiPhone size={25}/>
                            <input type="number" required value={+244974107262} className="w-full full px-5 py-2 outline-none"/>
                        </div>
                    </div>
                </article>
            </section>

            <article className="w-full flex justify-end items-center gap-10 pb-15">
                <button type="button" className="border-black/15 border hover:bg-black/2 bg-white py-2 px-4 rounded-xl text-black cursor-pointer">Cancelar Alterações</button>
                <button type="submit" className="bg-[#F97B17] hover:bg-[#F86417] py-2 px-4 rounded-xl text-white cursor-pointer">Guardar Alterações</button>
            </article>
        </main>
    );
}
export default CardInfo;