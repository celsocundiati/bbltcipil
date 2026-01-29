import InputGroup from "../../tags/inputs/InputGroup";
import { HiOutlineBell, HiOutlineQuestionMarkCircle } from "react-icons/hi2";

function AdminNav(){

    return(
        <header className="flex justify-between px-5 py-4 items-center gap-5 fixed top-0 left-82 right-0 shadow z-50 bg-white">
            <div className="w-2/4">
                <InputGroup page="catalogo" type="text" placeholder="Busque por livros, estudantes e empréstimos" />
            </div>
            <section className="flex justify-center gap-7">
                <div className="flex items-center justify-center gap-7">
                    <HiOutlineBell size={30}/>
                    <HiOutlineQuestionMarkCircle size={30}/>
                </div>
                <div className="flex justify-center items-center gap-4">
                    <div className="flex justify-center items-center rounded-full w-12 h-12 bg-[#f97b17] text-white text-center text-xl">
                        CC
                    </div>
                    <div className="flex flex-col justify-center items-start font-semibold">
                        <label className="text-lg font-medium">Celso Cristiano</label>
                        <label className="text-black/70 text-sm">Super Admin</label>
                    </div>
                </div>
            </section>
        </header>
    );
}
export default AdminNav;