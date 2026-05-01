import { FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { LuClock } from "react-icons/lu";
import { motion } from "framer-motion";
import CardLivro from "../../cards/cardsLivross/cardsLivrosHome/livro";
import { Link } from "react-router-dom";

function Sessao04() {

  return (
    // Livros Populares
// Os mais procurados pelos estudantes
    <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
        whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
        viewport={{ once: true }}             // anima apenas uma vez
        transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
        className=" px-5 py-9">

        <div className="pb-6 flex items-center justify-between w-full">
            <div>
                <h4 className="text-2xl">Adicionados Recentemente</h4>
                <p className="text-black/57 cursor-pointer">Novidades no acervo</p>
            </div>

            <Link to="/exposicao" className="flex items-center text-[#f97b17] cursor-pointer">
                <h4>Ver exposições</h4>
                <FiArrowRight/>
            </Link>
        </div>

        <CardLivro props="recente"/>
      
    </motion.div>
  );
}

export default Sessao04;