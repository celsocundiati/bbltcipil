import React from "react";
import {FiSearch} from "react-icons/fi";

function InputAdmin({type, placeholder})
{
    return(
        <div className="w-full">
            <div className="flex items-center bg-black/5 border rounded-xl overflow-hiddenmax-w-md text-[#000000]/57
                relative focus-within:ring-2 focus-within:ring-[#f97b17] border-[#E6E6E6] transition
            ">
                <button className="h-full rounded-l-lg px-2 py-1.5 hover:text-[#f97b17] transition cursor-pointer"> <FiSearch size={22}/> </button>

                <input type={type} placeholder={placeholder} className="flex-1 px-4 py-1.5 outline-none"/>
            </div>
        </div>
    );
}
export default InputAdmin;