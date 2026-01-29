import { LuClock, LuStar } from "react-icons/lu";
import { HiOutlineTrendingUp } from "react-icons/hi";
import { motion } from "framer-motion";


const cards = [
  {
    id: 1,
    icon: HiOutlineTrendingUp,
    valor: 6,
    label: "Livros Disponíveis",
  },
  {
    id: 2,
    icon: LuClock,
    valor: 2,
    label: "Minhas Reservas",
  },
  {
    id: 3,
    icon: LuStar,
    valor: 8,
    label: "Total no Acervo",
  },
];


function Sessao02() {
  return (
    <motion.section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-5 py-16">
      {cards.map((item) => {
        const Icon = item.icon;

        return (
          // flex flex-wrap w-full justify-between items-center p-4 h-60 gap-5 ---  lg:grid-cols-4 w-80
                <div key={item.id} className="flex gap-2 p-5 rounded-lg bg-white border border-[#000000]/20">
                    <button className="bg-[#f97b17]/20 p-3 rounded-lg">
                    <Icon size={35} className="text-[#f97b17]"/>
                    </button>

                    <span>
                    <p className="text-2xl">{item.valor}</p>
                    <p className="text-lg text-[#000000]/57">{item.label}</p>
                    </span>
                </div>
        );
      })}
    </motion.section>
  );
}

export default Sessao02;