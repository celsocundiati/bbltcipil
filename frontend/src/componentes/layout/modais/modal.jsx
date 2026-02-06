import {HiOutlineXMark} from "react-icons/hi2";

function Modal({tipo, onClose}){


    return(
        <section>
            {tipo === "success" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-preto-500/40 flex flex-col w-1/4  rounded-xl border border-black/5">
                    <div className="bg-green-500 text-green-100 shadow-md rounded-xl p-6 relative ">
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
                        <div className="flex items-end justify-end">
                            <button onClick={onClose} type="button" className=" bg-branco-100 text-preto-300 px-8 py-2 rounded-lg border border-black/10 hover:text-branco-100 hover:bg-green-700 transition-all duration-200">
                                Fechar
                            </button>
                        </div>
                    </div>
                </dialog>
            ) : tipo === "perfil" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <h2 className="text-xl pyy-2 font-medium">
                            Editando meu perfil
                        </h2>
                        <form className="space-y-4" action="">
                            <div className="grid grid-cols-1 gap-2 space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Nome:</label>
                                    <input type="text" required name="nome" id="nome" placeholder="Meu nome..." value="Cristiano De Carvalho" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Email:</label>
                                    <input type="email" required name="email" id="email" placeholder="exemplo@gmail.com" value="cristianocarvalh207@gmail.com"  className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex gap-5 outline-none  w-full ">
                                    <label className="text-black/75 text-lg">Matricula:</label>
                                    <label className=" py-1 px-5 rounded-md bg-black/5 outline-none">71286</label>
                                </div>
                                <div className="flex gap-5 outline-none w-full ">
                                    <label className="text-black/75 text-lg">Categória</label>
                                    <label id="cat" className="bg-black/5 outline-none py-1 px-5 rounded-md">Estudante</label>
                                </div>
                                <div className="flex items-center justify-end gap-2 py-4">
                                    <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                        Cancelar
                                    </button>
                                    <button onClick={close} className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">Salvar Alterações</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </dialog>

            ) : tipo === "estudante" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4">
                            <h2 className="text-xl font-medium">
                                Registar Estudante
                            </h2>
                            <p className="text-lg">
                                Cadastrar estudantes para o banco de dados do acervo escolar
                            </p>
                        </article>
                        <form className="space-y-4" action="">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Nome:</label>
                                    <input type="text" required name="nome" id="nome" placeholder="Celso Cristiano Gabriel Domilde" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Nº Proc:</label>
                                    <input type="number" required name="n_proc" id="n_proc" placeholder="100123" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Email:</label>
                                    <input type="email" required name="email" id="email" placeholder="celso@gmail.com" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Classe:</label>
                                    <input type="text" required name="classe" id="classe" placeholder="13ª Classe" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Curso:</label>
                                    <input type="text" required name="curso" id="curso" placeholder="Gestão de Sistemas Informáticos" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Estado:</label>
                                    <input type="text" required name="estado" id="estado" placeholder="Ativo, Suspenso, Inativo" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Reservas:</label>
                                    <input type="number" required name="reservas" id="reservas" placeholder="0" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-black/75 text-lg">Empréstimos:</label>
                                    <input type="number" required name="emprestimos" id="emprestimos" placeholder="0" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-4">
                                <button onClick={onClose} type="submit" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            ) : tipo === "emprestimo" ? (
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4">
                            <h2 className="text-xl font-medium">
                                Registar Empréstimos
                            </h2>
                            <p className="text-lg">
                                Cadastrar novo empréstimos de livros
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
                                    <label className="text-black/75 text-lg">Data de Empréstimo:</label>
                                    <input type="date" required name="date_emprest" id="date_emprest" placeholder="dd/mm/aa" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
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
            ) : tipo === "reserva" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
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
            ) : tipo === "devoluicao" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4">
                            <h2 className="text-xl font-medium">
                                Registar Devolução
                            </h2>
                            <p className="text-lg">
                                Registar devoluições de livros   
                            </p>
                        </article>
                        <form className="space-y-4" action="">
                            <div className="grid grid-cols-1 gap-2 space-y-4">
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="titulo" className="text-lg">Estudante:</label>
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
            ) : tipo === "categoria" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4 text-left">
                            <h2 className="text-xl font-medium">
                                Adicionar Categória
                            </h2>
                            <p className="text-lg">
                                Cadastrar nova categória de livros
                            </p>
                        </article>
                        <form action="" className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">Nome da Categória:</label>
                                    <input type="text" required name="categoria" id="categoria" placeholder="Nome da categória do livro" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">
                                        Descrição
                                    </label>
                                    <textarea placeholder="Breve descrição do livro..."
                                    className="mt-1 w-full h-24 rounded-md border border-black/10 bg-black/5 outline-none px-3 py-2 text-black/70  font-medium focus:ring-2 focus:ring-green-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">Quantidade de livros:</label>
                                    <input type="text" required name="qtd" id="qtd" placeholder="Insira o nº de livros desta categória" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                    Adicionar Livro
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            ) : tipo === "autor" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4 text-left">
                            <h2 className="text-xl font-medium">
                                Adicionar Autor
                            </h2>
                            <p className="text-lg">
                                Cadastrar novao autor
                            </p>
                        </article>
                        <form action="" className="space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">Nome do Autor:</label>
                                    <input type="text" required name="categoria" id="categoria" placeholder="Nome do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">Nacionalidade:</label>
                                    <input type="text" required name="nacionalidade" id="nacionalidade" placeholder="Nacionalidade proveniente do autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">
                                        Bibiográfia
                                    </label>
                                    <textarea placeholder="Breve descrição do livro..."
                                    className="mt-1 w-full h-24 rounded-md border border-black/10 bg-black/5 outline-none px-3 py-2 text-black/70  font-medium focus:ring-2 focus:ring-green-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-black/75 text-lg text-left">Quantidade de livros:</label>
                                    <input type="text" required name="qtd" id="qtd" placeholder="Insira o nº de livros deste autor" className="bg-black/5 outline-none py-2 px-2 rounded-lg text-black/70  font-medium focus:ring-2 focus:ring-green-500"/>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                    Adicionar Livro
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            ) : tipo === "admins" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black">
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4">
                            <h2 className="text-xl font-medium">
                                Registar Administrador
                            </h2>
                            <p className="text-lg">
                                Cadastrar administradores para o banco de dados do acervo escolar
                            </p>
                        </article>
                        <form className="space-y-4" action="">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-lg">Nome:</label>
                                    <input type="text" required name="nome" id="nome" placeholder="Nome do funcionário" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-lg">NIF:</label>
                                    <input type="text" required name="nif" id="nif" placeholder="Número de Identificação Funcional do funcionário" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label  className="text-lg">Email:</label>
                                    <input type="email" required name="email" id="email" placeholder="Email do funcionário" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-lg">Estado:</label>
                                    <input type="text" required name="estado" id="estado" placeholder="Estado do funcionário" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-4">
                                <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </dialog>
            ) : tipo === "multas" ?(
                <dialog className="fixed inset-0 z-50 shadow bg-black/20 h-full flex flex-col w-full  rounded-xl border border-black/10">
                    <div className="w-1/2 bg-white shadow-md rounded-xl p-6 relative top-1/9 left-1/4">
                        <button onClick={onClose} className="absolute top-4 right-4 text-black/50 cursor-pointer hover:text-black" >
                            <HiOutlineXMark size={35}/>
                        </button>
                        <article className="py-4">
                            <h2 className="text-xl font-medium">
                                Configurações de Multas
                            </h2>
                            <p className="text-lg">
                                Definir valores para diferentes tipos de multas
                            </p>
                        </article>
                        <form className="space-y-4" action="">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex flex-col space-y-1">
                                    <label className="text-lg">Multa por Dia de Atraso:</label>
                                    <input type="number" required name="nome" id="nome" value="500" placeholder="valor em kwanzas" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label  className="text-lg">Multa por Danos:</label>
                                    <input type="number" required name="nif" id="nif" value="1500" placeholder="valor em kwanzas" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label className="text-lg">Multa por Livro Perdido:</label>
                                    <input type="number" required name="email" id="email" value="5000" placeholder="valor em kwanzas" className="bg-black/5 outline-none py-2 px-2 rounded-lg focus:ring-2 focus:ring-green-500"/>
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 py-4">
                                <button onClick={onClose} type="button" className="bg-white text-black/70 px-8 py-2 rounded-lg border border-black/10 cursor-pointer hover:text-white hover:bg-red-500 transition-all duration-200">
                                    Cancelar
                                </button>
                                <button type="submit" className="bg-green-500 text-white py-2 px-4 text-lg rounded-lg cursor-pointer hover:bg-green-600 transition-all duration-200">
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