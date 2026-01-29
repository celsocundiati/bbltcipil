function TitleGrafic({variant})
{
    return(
        <section>
            {variant === "line" ?(
                <article>
                    <h1 className="text-lg mb-1">Empréstimos  & Devoluções</h1>
                    <p className="text-lg text-black/70">Últimos 6 meses</p>
                </article>

            ) : variant === "bar" ?(
                <article>
                    <h1 className="text-lg mb-1">Livros por Categórias</h1>
                    <p className="text-lg text-black/70">Distribuição actual</p>
                </article>
            ) : (
                null
            )}

        </section>
    );
}
export default TitleGrafic;