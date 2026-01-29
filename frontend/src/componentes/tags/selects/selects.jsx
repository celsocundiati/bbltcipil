
function Select({tipo, value, onChange, lbl})
{
    return(
        <section>
        {tipo === "categoria" ? (

            
            <section className="flex flex-col">
                <section>
                    <section className="flex flex-col">
                        <label className="mb-3 ">{lbl ? "Categória" : ''}</label>
                        <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
                            <option value="">Todas as categórias</option>
                            <option value="Tecnologia">Tecnologia</option>
                            <option value="Ciência">Ciência</option>
                            <option value="Arte">Arte</option>
                            <option value="Cultura">Cultura</option>
                            <option value="Cultura e História">Cultura e História</option>
                            <option value="Cultura e Romance">Cultura e Romance</option>
                        </select>
                    </section>
                </section>
            </section>

        ) : tipo === "estado" ?(
            <section className="flex flex-col">
                <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
                <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
                    <option value="">Todos os Status</option>
                    <option value="Disponível">Disponível</option>
                    <option value="Emprestado">Emprestado</option>
                    <option value="Reservado">Reservado</option>
                    <option value="Pendente">Pendente</option>
                </select>
            </section>
        ) : tipo === "todos" ?(
            <section className="flex flex-col">
                <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
                <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
                    <option value="">Todos</option>
                    <option value="Ativos">Ativos</option>
                    <option value="Suspensos">Suspensos</option>
                    <option value="Pendentes">Pendentes</option>
                </select>
            </section>
        ) : tipo === "cursos" ?(
            <section className="flex flex-col">
                <label className="mb-3 ">{lbl ? "Cursos" : ''}</label>
                <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
                    <option value="">Todos os cursos</option>
                    <option value="IG">IG</option>
                    <option value="II">II</option>
                    <option value="MM">MM</option>
                    <option value="QA">QA</option>
                </select>
            </section>
        ) : tipo === "estadoemprestimo" ?(
            <section className="flex flex-col">
                <label className="mb-3 ">{lbl ? "Estado" : ''}</label>
                <select value={value} onChange={onChange} className="border border-[#000000]/17 w-full lg:w-72 px-2 cursor-pointer outline-none h-10 rounded-lg">
                    <option value="">Todos os estados</option>
                    <option value="Atrasado">Em atraso</option>
                    <option value="Danos">Danos</option>
                    <option value="Perda">Perda</option>
                </select>
            </section>
        ) : (
            null
        )}

        </section>
    )
}
export default Select;