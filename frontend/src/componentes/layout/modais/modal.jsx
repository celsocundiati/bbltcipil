import {HiOutlineXMark} from "react-icons/hi2";

function Modal({tipo, onClose}){

    return(
        <section>
            {tipo === "success" ?(
                <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
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
                    </div>
                </dialog>
            ) : tipo === "perfil" ?(
                <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                    <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-black/50 hover:text-black transition"
                        >
                            <HiOutlineXMark size={28}/>
                        </button>

                        <h2 className="text-lg md:text-xl font-semibold mb-4">
                            Editando meu perfil
                        </h2>

                        <form className="space-y-4">

                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-sm md:text-base">Nome:</label>
                                <input
                                    type="text"
                                    required
                                    name="nome"
                                    placeholder="Meu nome..."
                                    defaultValue="Cristiano De Carvalho"
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                                />
                            </div>

                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-sm md:text-base">Email:</label>
                                <input
                                    type="email"
                                    required
                                    name="email"
                                    placeholder="exemplo@gmail.com"
                                    defaultValue="cristianocarvalh207@gmail.com"
                                    className="bg-black/5 outline-none py-2 px-3 rounded-lg focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                                />
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                                <label className="text-black/75 text-sm md:text-base">Matrícula:</label>
                                <span className="bg-black/5 py-1 px-4 rounded-md text-sm">
                                    71286
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                                <label className="text-black/75 text-sm md:text-base">Categoria:</label>
                                <span className="bg-black/5 py-1 px-4 rounded-md text-sm">
                                    Estudante
                                </span>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto border border-black/10 text-black/70 px-6 py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Salvar Alterações
                                </button>
                            </div>

                        </form>
                    </div>
                </dialog>
                ) : (
                null
            )}
        </section>
            );
}
export default Modal;