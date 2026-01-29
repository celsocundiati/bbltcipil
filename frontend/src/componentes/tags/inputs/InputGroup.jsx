import React from "react";
import {FiSearch} from "react-icons/fi";

function InputGroup({type, placeholder, onPesquisar})
{
    return(
        <div className="w-full">
            <div className="flex items-center border rounded-xl overflow-hiddenmax-w-md text-[#000000]/57
                relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition
            ">
                <button className="h-full rounded-l-lg px-2 py-2 hover:text-[#f97b17] transition cursor-pointer"> <FiSearch size={22}/> </button>

                <input type={type} placeholder={placeholder} 
                className="flex-1 px-4 py-2.5 bg-white/17 outline-none
                " onChange={(e) => onPesquisar(e.target.value)}/>
            </div>
        </div>
    );
}
export default InputGroup;