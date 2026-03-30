import { motion } from "framer-motion";

export default function Loading({ message = "Carregando dados..." }) {
  return (
    <div className="fixed inset-0 bg-black/5 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
      {/* 🔹 Bolinhas animadas */}
      <motion.div 
        className="flex space-x-2"
        initial="hidden"
        animate="visible"
      >
        {[0,1,2].map((i) => (
          <motion.span
            key={i}
            className="w-4 h-4 bg-[#F97B17] rounded-full"
            variants={{
              hidden: { y: 0, opacity: 0.5 },
              visible: { 
                y: [0, -15, 0], 
                opacity: [0.5, 1, 0.5],
                transition: { 
                  repeat: Infinity, 
                  repeatType: "loop", 
                  duration: 0.6, 
                  delay: i * 0.2,
                }
              }
            }}
          />
        ))}
      </motion.div>

      {/* 🔹 Texto abaixo da animação */}
      <motion.p 
        className="mt-4 text-[#F97B17] font-semibold text-lg animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      >
        {message}
      </motion.p>
    </div>
  );
}