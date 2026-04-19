import { HiOutlineUserGroup } from "react-icons/hi2";

function Seccao3() {
    return (
        <section className="bg-[#f9fafc] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 text-center sm:text-left">
                <HiOutlineUserGroup size={28} className="text-[#F86417]" />
                <h2 className="text-xl sm:text-2xl ">
                    Equipe de Desenvolvimento
                </h2>
            </div>

            {/* DESCRIÇÃO */}
            <p className="text-gray-600 mb-6 text-sm sm:text-base text-center sm:text-left">
                Sistema desenvolvido como projeto académico para modernização da biblioteca escolar do IPIL.
            </p>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* EQUIPE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                    {/* DEV 1 */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl text-center shadow-md hover:shadow-lg transition">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F86417] rounded-full mx-auto mb-4"></div>
                        <h4 className="text-gray-800 text-sm sm:text-base">
                            Cristiano Francisco De Carvalho
                        </h4>
                        <span className="text-xs sm:text-sm text-gray-500">
                            Desenvolvedor Full Stack
                        </span>
                    </div>

                    {/* DEV 2 */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl text-center shadow-md hover:shadow-lg transition">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F86417] rounded-full mx-auto mb-4"></div>
                        <h4 className="text-gray-800 text-sm sm:text-base">
                            Celso Paulo Cundiati Huma
                        </h4>
                        <span className="text-xs sm:text-sm text-gray-500">
                            Desenvolvedor Full Stack
                        </span>
                    </div>

                </div>

                {/* OUTRAS INFO */}
                <div className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-md">
                    <h4 className="text-gray-800 text-lg mb-2">
                        Outras informações
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base">
                        Este sistema foi desenvolvido com foco em desempenho, usabilidade e modernização dos processos da biblioteca escolar.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default Seccao3;