import { FiArrowRight} from "react-icons/fi";
import { motion } from "framer-motion";
import CardLivro from "../../cards/cardsLivros/livro";


function Sessao03() {
  return (
    // Livros Populares
// Os mais procurados pelos estudantes
    <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className=" px-5 py-9">

      <div className="pb-6 flex items-center justify-between">
          <div>
            <h4 className="text-2xl">Livros Populares</h4>
            <p className="text-black/57">Os mais procurados pelos estudantes</p>
          </div>

          <div className="flex items-center text-[#f97b17] cursor-pointer">
            <h4 >Ver todos</h4>
            <FiArrowRight/>
          </div>
      </div>
      
      <CardLivro props="popular"/>
    </motion.div>
  );
}

export default Sessao03;