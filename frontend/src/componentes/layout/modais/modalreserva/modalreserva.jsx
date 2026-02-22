import {HiOutlineXMark} from "react-icons/hi2";

function ModalReserva({onClose}){
    return(
        <main>
            <dialog className="fixed inset-0 z-50 bg-black/40 flex items-center w-full h-screen justify-center p-4">
                <div className="w-full max-w-lg md:max-w-2xl bg-white shadow-xl rounded-2xl p-6 relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                        <HiOutlineXMark size={35}/>
                    </button>
                    <article className="py-4">
                        <h2 className="text-xl font-medium">
                            Registar Reservas
                        </h2>
                        <p className="text-lg">
                            Cadastrar nova reserva de livros
                        </p>
                    </article>
                    <form className="space-y-4" action="">
                        <div className="grid grid-cols-1 gap-2 space-y-4">
                            <div className="flex flex-col space-y-1">
                                <label  className="text-black/75 text-lg">Estudante:</label>
                                <input type="text" required name="nome" id="nome" placeholder="ID nome do estudante" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Livro:</label>
                                <input type="text" required name="livro" id="livro" placeholder="ISBN ou título do livro" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex flex-col space-y-1">
                                <label className="text-black/75 text-lg">Data de Devolução:</label>
                                <input type="date" required name="date_devol" id="date_devol" placeholder="dd/mm/aa" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-4">
                                <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">Salvar Alterações</button>
                            </div>
                        </div>
                    </form>
                </div>
            </dialog>
        </main>
    )
}

export default ModalReserva;