
import { FiArrowRight, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { LuClock } from "react-icons/lu";
import { motion } from "framer-motion";
import CardLivro from "../../cards/cardsLivros/livro";


    const livros = [
        {
            "id": 1,
            "titulo": "Tecnologias Digitais na Educação",
            "autor": "Ana Beatriz Andrades",
            "categoria": "Tecnologia",
            "descricao": "Um estudo prático sobre como ferramentas digitais transformam o processo de ensino e aprendizagem trazendo novas possiblidades para professores e alunos.",
            "sumario":[
                "A evoluição das tecnologias digitais",
                "Aprendizagem mediada por dispositivos",
                "Ferramentas digitais para sala de aulas",
                "Desafios da educação digital",
                "Estratégias pedagógicas inovadoras",
                "Futuro da educação integradas na tecnologia"
            ],
            "n_paginas": 198,
            "data_publicacao": "2023",
            "editora": "EdTech Press",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765812599/livro02_hawwht.webp",
            "estado": "Disponível",
            "extra": "recente",
            "icon": <FiCheckCircle size={20}/>
        },

        {
            "id": 7,
            "titulo": "Cultura e Elegância",
            "autor": "Valéria Monteiro",
            "categoria": "Cultura e História",
            "descricao": "Um olhar refinado sobre como a cultura molda comportamentos elegantes, hábitos sociais e expressões de identidade ao longo do tempo.",
            "sumario":[
                "A evoluição da elegância ",
                "Cultura e comportamento social",
                "Moda, arte e estilo de vida",
                "Espressões culturais contemporâneas",
                "A elegância como identidade",
                "A influência cultural global"
            ],
            "n_paginas": 215,
            "data_publicacao": "2024",
            "editora": "Artes & Cultura",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765812599/livro02_hawwht.webp",
            "estado": "Pendente",
            "extra": "recente",
            "icon": <LuClock size={20}/>
        },

          {
            "id": 2,
            "titulo": "Ciência Tecnologia, Inovação no Futuro de São Carlos",
            "autor": "São Carlos",
            "categoria": "Tecnologia",
            "descricao": "Uma análise profunda do impacto da ciência e da inovação no desenvolvimento global, explorando tendências que moldarão o futuro.",
            "sumario":[
                "O papel da ciência moderna",
                "Inovações que mudaram o mundo",
                "Tecnologias emergentes",
                "Transformação digital global",
                "Impactos sociais da inovação",
                "O futuro da ciência e tecnologia"
            ],
            "n_paginas": 256,
            "data_publicacao": "2024",
            "editora": "FuturaTech",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765812599/livro02_hawwht.webp",
            "estado": "Disponível",
            "extra": "recente",
            "icon": <FiCheckCircle size={20}/>
        },
         {
            "id": 3,
            "titulo": "Inteligência Artificial na Sala de Aula",
            "autor": "Mariana SOusa Pinto",
            "categoria": "Tecnologia",
            "descricao": "Um guia acessível que demonstra como a inteligência artificial pode apoiar educaadores, personalizar o aprendizado e melhorar a experiência do estudante.",
            "sumario":[
                "O que é a Inteligência Artificial ?",
                "Aplicações da IA na educação",
                "Personalização do aprendizado",
                "Assistentes educacionais inteligentes",
                "Ética e Responsablidades",
                "O futuro da IA na sala de aula"
            ],
            "n_paginas": 175,
            "data_publicacao": "2025",
            "editora": "SmartLearn",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765812599/livro02_hawwht.webp",
            "estado": "Pendente",
            "extra": "recente",
            "icon": <LuClock size={20}/>
        },
        {
            "id": 4,
            "titulo": "Transformação Digital uma Jornada Possível",
            "autor": "Ricardo Alves Monteiro",
            "categoria": "Tecnologia",
            "descricao": "Um livro prático que mostra como organizações de qualquer porte podem iniciar e evoluir em processos de transformação digital de forma estratégica.",
            "sumario":[
                "Fundamentos da transformação digital ",
                "Mudanças culturais e organizacionais",
                "Digitalização de processos",
                "Novos modelos de negócio",
                "Ferramentas indispensáveis",
                "Construindo uma jornada sustentável"
            ],
            "n_paginas": 220,
            "data_publicacao": "2022",
            "editora": "Digital Path",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765706369/livro_ye5lep.webp",
            "estado": "Disponível",
            "extra": "popular",
            "icon": <FiCheckCircle size={20}/>
        },
        
        {
            "id": 5,
            "titulo": "Tecnologia da Informação e Comunicação",
            "autor": "João Pedro Fernandes",
            "categoria": "Tecnologia",
            "descricao": "Uma introdução clara e moderna aos principais conceitos de Tecnologia da Informação e Comunicação, com aplicações no mundo real.",
            "sumario":[
                "Fundamentos das TICs ",
                "Infraestruturas tecnológicas",
                "Sistemas de comunicação",
                "Redes e conectividade",
                "TIC na sociedade moderna",
                "Tendências futuras em tecnologia"
            ],
            "n_paginas": 240,
            "data_publicacao": "2023",
            "editora": "InfoTech Books",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765706369/livro_ye5lep.webp",
            "estado": "Emprestado",
            "extra": "popular",
            "icon": <FiXCircle size={20}/>
        },
        
        {
            "id": 6,
            "titulo": "Cultura: A Nossa História das Pinturas Rupestres",
            "autor": "Helena M. Santos",
            "categoria": "Cultura e História",
            "descricao": "Uma viagem artísticas da humanidade, explorando pinturas rupestres e seus significados culturais ao longo dos séculos.",
            "sumario":[
                "Introdução às artes pré-históricas ",
                "As primeiras expressões humanas",
                "Cenários arqueológicos importantes",
                "Interpretações e significados simbólicos",
                "A preservação da arte rupestre",
                "Conexões culturais contemporâneas"
            ],
            "n_paginas": 190,
            "data_publicacao": "2023",
            "editora": "Cultura Raiz",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765706369/livro_ye5lep.webp",
            "estado": "Disponível",
            "extra": "popular",
            "icon": <FiCheckCircle size={20}/>
        },

        {
            "id": 8,
            "titulo": "História e Cultura dos Povos Indígenas",
            "autor": "Mateus Araújo",
            "categoria": "Cultura e História",
            "descricao": "Um estudo profundo sobre as tradições, crenças, história e sabedoria dos povos indígenas, destacando sua riqueza cultural.",
            "sumario":[
                "Origens dos povos indígenas",
                "Crenças e espiritualidade",
                "Tradições e costumes",
                "Arte e simbolismo indígenas",
                "Luta e preservação cultural",
                "O futuro das culturas originárias"
            ],
            "n_paginas": 260,
            "data_publicacao": "2022",
            "editora": "Luciana Ribeiro",
            "capa": "https://res.cloudinary.com/degsmhalt/image/upload/v1765706369/livro_ye5lep.webp",
            "estado": "Disponível",
            "extra": "popular",
            "icon": <FiCheckCircle size={20}/>
        },
        
    ]

function Sessao04() {

  return (
    // Livros Populares
// Os mais procurados pelos estudantes
    <motion.div initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
        whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
        viewport={{ once: true }}             // anima apenas uma vez
        transition={{ duration: 0.8 }}     // começa invisível e levemente abaixo
        className=" px-5 py-9">

        <div className="pb-6 flex items-center justify-between w-full">
            <div>
                <h4 className="text-2xl">Adicionados Recentemente</h4>
                <p className="text-black/57 cursor-pointer">Novidades no acervo</p>
            </div>

            <div className="flex items-center text-[#f97b17] cursor-pointer">
                <h4>Ver exposições</h4>
                <FiArrowRight/>
            </div>
        </div>

        <CardLivro props="recente"/>
      
    </motion.div>
  );
}

export default Sessao04;