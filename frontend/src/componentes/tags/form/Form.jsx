import React from "react";
import InputGroup from "./inputs/InputGroup";

function Form({onPesquisar})
{
    return(
        <div>
            <form action="">

                <InputGroup type="text" placeholder="Busca por título, autor ou categória" onPesquisar={onPesquisar}/>
                
            </form>
        </div>
    );
}
export default Form;