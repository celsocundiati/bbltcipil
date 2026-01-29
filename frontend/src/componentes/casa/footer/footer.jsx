import { Link } from "react-router-dom";
import {AiOutlineMail} from "react-icons/ai";
import {LuClock} from "react-icons/lu"
import {  FiMapPin, FiPhone } from "react-icons/fi";
import footerImage from "../../../assets/footer01.png"
import { motion } from "framer-motion";

function Footer()
{
    return(

        <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }} 
            className="flex flex-col gap-16 mt-16">

            <div className="w-full flex flex-col justify-center items-center px-5">
                <h4 className="text-3xl font-medium">Biblioteca IPIL</h4>
                <p className="text-[#000000]/57 text-center">Plataforma digital para gestão e consulta do acervo bibliográfico</p>
            </div>

            <div className="px-5 bg-[#000000]/70 text-branco-100 h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ps-10 pt-10 pb-10 space-y-5">
                <div className="space-y-5">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="bg-[#f97b17] p-2 rounded-xl"><img src={footerImage} alt="IPIL" className="w-16 h-14 rounded-xs object-cover"/></div>
                        <h1 className="text-2xl text-white/85">Biblioteca IPIL</h1>
                    </div>
                    <div>
                        <p className="text-white/70">
                            A Biblioteca IPIL é um espaço acadêmico, dedicado à promoção do conhecimento e da investigação,
                            oferecendo um vasto acervo de recursos bibliográficos para apoiar a comunidade comunicativa
                        </p>
                    </div>
    
                </div>

                <div className="space-y-5  md:ms-20">
                    <h1 className="text-2xl text-white/85">Navegação Rápida</h1>
                    <div className="flex flex-col space-y-4">
                        <Link to="/" className="text-white/70">Home</Link>
                        <Link to="/catalogo" className="text-white/70">Catálogo</Link>
                        <Link to="/reservas" className="text-white/70">Reservas</Link>
                        <Link to="/exposicoes" className="text-white/70">Exposições</Link>
                        <Link to="/institucional" className="text-white/70">Institucional</Link>
                    </div>
                </div>

                <div className="space-y-5">
                    <h1 className="text-2xl text-white/85">Contactos</h1>
                    <div>
                        <label className="flex items-center gap-2">
                            <AiOutlineMail size={25} className="text-[#f97b17]"/>
                            <span>
                                <p className="text-lg text-white/70">Email:</p>
                            </span>
                        </label>
                        <p className="text-sm ms-9 text-white/57">biblioteca@ipil.ao</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <FiPhone size={25} className="text-[#f97b17]"/>
                            <span>
                                <p className="text-lg text-white/70">Telefone:</p>
                            </span>
                        </label>
                        <p className="text-sm ms-9 text-white/57">974107262</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-white/85">
                            <FiMapPin size={25} className="text-[#f97b17]"/>
                            <span>
                                <p className="text-lg text-white/70">Localização:</p>
                            </span>
                        </label>    
                        <p className="text-sm ms-9 text-white/57">Instituto Politécnico Industrial de Luanda</p>
                    </div>
                    <div>
                        <label className="flex items-center gap-2">
                            <LuClock size={25} className="text-[#f97b17]"/>
                            <span>
                                <p className="text-lg text-white/70">Horário de Atendimento:</p>
                            </span>
                        </label>
                        <p className="text-sm ms-9 text-white/57">Segunda à Sexta: 08h00 - 18h00 <br />
                                Sábado: 08h00 - 13h00
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
export default Footer;