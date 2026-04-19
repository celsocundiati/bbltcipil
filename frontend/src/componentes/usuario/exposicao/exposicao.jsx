import Cabecalho from "../casa/cabecalho/cabecalho";
import { motion } from "framer-motion";
import { BsStars } from "react-icons/bs";
import CardExposicoes from "../cards/cardExposicao/CardExposicoes";
import CardExposicoesMaster from "../cards/cardExposicao/Cardexposicaomaster";
import CardExposicoesEvento from "../cards/cardExposicao/CardExposicoesEvento";
import Footer from "../casa/footer/footer";

function Exposicao() {
    return (
        <div>
            <Cabecalho/>
            <motion.section  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }} 
                className="pt-18">
                <article className="bg-linear-to-l from-[#F97B17] to-[#F86417] py-16 px-5 flex flex-col gap-3 text-white">
                    <div className="flex items-center gap-3"> 
                        <BsStars size={40}/> 
                        <h1 className="text-4xl [#F86417] font-medium">Exposições e Novidades</h1>
                    </div>
                    <p className="text-xl text-white/80">Descubra eventos literários, novos livros e coleções especiais</p>
                </article>          
            </motion.section>

            <section className="grid grid-rows-[auto_auto] grid-cols-1 gap-4 py-10 px-5">
                <article className="col-span-1">
                    <CardExposicoesMaster/>
                </article>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-10 px-5">
                <div>
                    <CardExposicoes/>
                </div>
                <div>
                    <CardExposicoesEvento/>
                </div>
            </section>

            <section>
                <Footer/>
            </section>

        </div>
    )
}

export default Exposicao;