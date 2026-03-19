import { motion } from "framer-motion";
import {HiOutlineXMark} from "react-icons/hi2";

function Modal({tipo, onClose}){

    return(
        <section>
            {tipo === "success" ?(
                <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <motion.div  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                        whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                        viewport={{ once: true }}             // anima apenas uma vez
                        className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <h2 className="text-lg font-medium">
                                Sucesso!
                        </h2>
                        
                        <p className="pt-5 mb-10">
                            A sua ação foi concluída com sucesso.
                            Obrigado por mostrar interesse, aguarde a aprovação
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                            <button onClick={onClose} type="button" className=" bg-branco-100 text-preto-300 px-8 py-2 rounded-lg border border-black/10 hover:text-branco-100 hover:bg-green-700 transition-all duration-200">
                                Fechar
                            </button>
                        </div>
                    </motion.div>
                </dialog>
                ) : (
                null
            )}
        </section>
            );
}
export default Modal;