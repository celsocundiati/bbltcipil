import CardLivro from "../cards/cardsLivros/livro";
import Cabecalho from "../casa/cabecalho/cabecalho";
import Footer from "../casa/footer/footer";
import Filtragem from "./seccoes/Filtragem";
import WelcomeCatalogo from "./seccoes/Welcome";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../../service/api/api";
import CardLivroCatalogo from "../cards/cardsLivros copy/livro";


function Catalogo() {
    
    const [livros, setLivros] = useState([]); 

    useEffect(() => {
        const fetchLivros = async() => {
            try{
                const res = await api.get('livros/livros/')
                setLivros(Array.isArray(res.data.results) ? res.data.results : res.data)
            }catch(err){
                console.error('Erro ao capturar livros', err)
            }
        }

        fetchLivros()
    }, []);

    return(
        <div>
            <Cabecalho/>
            <motion.main initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
                whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
                viewport={{ once: true }}             // anima apenas uma vez
                transition={{ duration: 0.8 }} >

                <WelcomeCatalogo className="pt-16" titulo="Catálogo de Livros" paragrafo="Explore nosso acervo completo"/>
                {/* <Filtragem/> */}
                {/* <section className="px-5 my-10 ">
                    <h2 className="py-5 text-xl text-[#000000]/57">{livros.length} Livros encontrados</h2>
                    <CardLivro props=""/>
                </section> */}
                <CardLivroCatalogo/>
            </motion.main>
            <Footer/>
        </div>  
    )
}

export default Catalogo;