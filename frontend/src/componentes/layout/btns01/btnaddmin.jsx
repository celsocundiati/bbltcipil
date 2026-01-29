
function BtnAddAdmin({tipo, onClick}){

    return(
        <div className="flex text-end justify-end relative">
            {tipo === "categoria" ?(
                <button onClick={onClick} className="bg-[#F86417] text-white px-4 py-1.5 text-lg rounded-xl absolute cursor-pointer">
                    + Nova Categória
                </button>
            ) : tipo === "autor" ?(
                <button onClick={onClick} className="bg-[#F86417] text-white px-4 py-1.5 text-lg rounded-xl absolute cursor-pointer">
                    + Novo Autor
                </button>
            ) : (
                null
            )}
        </div>
        
    );
}
export default BtnAddAdmin;