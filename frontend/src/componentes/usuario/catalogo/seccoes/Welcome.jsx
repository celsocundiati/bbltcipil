import { motion } from "framer-motion";

function Welcome({titulo, paragrafo})
{
    return(
        <motion.section initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                    whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                    viewport={{ once: true }}             // anima apenas uma vez 
                className="pt-18">
            <div className=" px-5 h-52 flex flex-col items-start justify-center">
                <h4 className="text-4xl">{titulo}</h4>
                <p className="text-xl text-[#000000]/57">{paragrafo}</p>
            </div>
        </motion.section>
    );
}
export default Welcome;