import { FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";
import livros from "../../../dados/db.json";
import { section } from "framer-motion/client";
import { NavLink } from "react-router-dom";
import {LuBookOpen} from "react-icons/lu";
import {IoCalendarClearOutline} from "react-icons/io5";

const configuracoes = [
    {id: 1, titulo: "Alterar Senha", descricao: "Atualize sua senha de acesso"},
    {id: 2, titulo: "Notificações", descricao: "Gerencie suas preferência de notificações"},
    {id: 3, titulo: "Privacidade", descricao: "Configurações de privacidade de dados"},
]

function Configuracoes()
{

    const livrosReservado = livros.livros.filter(
        livro => livro.estado === "Reservado" || livro.estado === "Pendente"
    );

    const livrosEmprestado = livros.livros.filter(
        livro => livro.estado === "Emprestado"
    );
    
    const randomReservado = livrosReservado.length > 0
        ? livrosReservado[Math.floor(Math.random() * livrosReservado.length)]
        : null;
    
    const randomEmprestado = livrosEmprestado.length > 0
        ? livrosEmprestado[Math.floor(Math.random() * livrosEmprestado.length)]
        : null;

    

    return(
        <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }} 
            className="flex flex-col gap-4 w-full h-full">

            <section className="w-full h-full bg-white px-8 py-8 rounded-lg border border-black/8">
                <section className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 "><LuBookOpen size={20} className="text-[#F86417]"/> <h1 className="text-xl">Livros Emprestados</h1></div>
                    <NavLink to="/reservas" className="text-[#F86417] cursor-pointer">Ver todos</NavLink>
                </section>

                {randomEmprestado && (
                <section className="mt-5 space-y-16">
                    <article className="space-y-2 bg-black/3 hover:bg-black/6 cursor-pointer rounded px-4 py-2 flex gap-2">
                    <div>
                        <img
                        src={randomEmprestado.capa}
                        alt="Imagem"
                        className="rounded w-15 h-20"
                        loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-sm">{randomEmprestado.titulo}</h1>
                        <p className="text-black/57 text-sm">{randomEmprestado.autor}</p>

                        <div className="text-[#f97b17] flex gap-2 items-center">
                            <IoCalendarClearOutline size={18} />
                            <p className="text-sm">Devolução em dd/mm/aa</p>
                        </div>
                    </div>
                    </article>
                </section>
                )}
            </section>

            <section className="w-full h-full bg-white px-8 py-8 rounded-lg border border-black/8">
                <section className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2 ">
                        <IoCalendarClearOutline size={20} className="text-[#F86417]"/>
                        <h1 className="text-xl">Livros Reservados</h1>
                    </div>
                    <NavLink to="/reservas" className="text-[#F86417] cursor-pointer">Ver todas</NavLink>
                </section>

                
                {randomReservado && (
                <section className="mt-5 space-y-16">
                    <article className="space-y-2 bg-black/3 hover:bg-black/6 cursor-pointer rounded px-4 py-2 flex gap-2">
                    <div>
                        <img
                        src={randomReservado.capa}
                        alt="Imagem"
                        className="rounded w-15 h-20"
                        loading="lazy"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <h1 className="text-sm">{randomReservado.titulo}</h1>
                        <p className="text-black/57 text-sm">{randomReservado.autor}</p>

                        <div className="text-[#f97b17] flex gap-2 items-center">
                        <p className="text-sm bg-[#f97b17]/15 px-4 py-0.5 text-center rounded">Pendente</p>
                        </div>
                    </div>
                    </article>
                </section>
                )}
                
            </section>

            <section className="w-full h-full bg-white px-8 py-8 rounded-lg border border-black/8">
                <section className="flex items-center gap-2">
                    <FiSettings size={20} className="text-[#F86417]"/> <h1 className="text-xl">Configurações da Conta</h1>
                </section>

                {
                    configuracoes.map(conf => (
                        <section key={conf.id} className="mt-5 space-y-16">
                            <article className="space-y-2 bg-black/3 hover:bg-black/6 cursor-pointer rounded px-4 py-2">
                                <h1 className="text-lg">{conf.titulo}</h1>
                                <p className="text-black/70">{conf.descricao}</p>
                            </article>
                        </section>
                    ))
                }
            </section>
        </motion.main>
    );
}
export default Configuracoes;