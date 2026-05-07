// import { LuSearch } from "react-icons/lu";
// import { motion } from "framer-motion";

// function Sessao01() {

//     const texto_principal = "Bem-vindo à Biblioteca IPIL";
//     const texto_base = "Explore nosso acervo digital e reserve seus livros favoritos com apenas alguns cliques.";

//     return (
//         <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
//             whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
//             viewport={{ once: true }}             // anima apenas uma vez
//             transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
//             className="pt-16"
//         >
//             <div className="flex flex-col justify-center items-start text-center gap-9 px-5 bg-[#F86417] h-80">
//                 <div className="flex flex-col justify-center items-start gap-2">
//                     <h1 className="text-white text-3xl">{texto_principal}</h1>
//                     <p className="text-white">{texto_base}</p>
//                 </div>
//             </div>
//         </motion.div>
//     )
// }

// export default Sessao01;




import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import img1 from "../../../../assets/sessao01.jpeg";
import img2 from "../../../../assets/sessao02.jpeg";
import img3 from "../../../../assets/sessao04.jpeg";

function Sessao01() {

  const slides = [
    {
      imagem: img1,
      titulo: "Bem-vindo à Biblioteca IPIL",
      descricao: "Explore nosso acervo digital e reserve livros com facilidade."
    },
    {
      imagem: img2,
      titulo: "Conhecimento ao seu alcance",
      descricao: "Descubra novas obras e amplie seu aprendizado."
    },
    {
      imagem: img3,
      titulo: "Sistema moderno e eficiente",
      descricao: "Gerencie suas reservas de forma simples e rápida."
    }
  ];

  const [index, setIndex] = useState(0);

  // troca automática
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-130 overflow-hidden">

      {/* IMAGENS */}
      <AnimatePresence>
        <motion.img
          key={index}
          src={slides[index].imagem}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
        //   className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* CONTEÚDO */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">

        <motion.h1
          key={slides[index].titulo}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white text-3xl md:text-5xl font-bold mb-4"
        >
          {slides[index].titulo}
        </motion.h1>

        <motion.p
          key={slides[index].descricao}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-gray-200 max-w-xl"
        >
          {slides[index].descricao}
        </motion.p>

      </div>

    </section>
  );
}

export default Sessao01;