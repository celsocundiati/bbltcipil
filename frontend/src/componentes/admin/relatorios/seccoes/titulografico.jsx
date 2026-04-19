
function TituloGrafico({variant}){

    return(
        <section>
            {variant === "line" ?(
                <article>
                    <h1 className="text-lg">Empréstimos  Mensais</h1>
                    <p className="text-lg text-black/70">Evoluição ao longo do ano</p>
                </article>

            ) : variant === "bar" ?(
                <article>
                    <h1 className="text-lg">Receitas de Multas</h1>
                    <p className="text-lg text-black/70">Valores mensalmente cobrados</p>
                </article>
            ) : (
                null
            )}

        </section>
    );
}
export default TituloGrafico;