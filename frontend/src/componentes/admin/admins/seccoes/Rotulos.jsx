import { adminsRotulos } from "../../../../dados/db.json";

function Rotulos()
{
    return(
        <section className="w-full grid-cols-3 gap-5">
            {adminsRotulos.map(admR => (
                <div className="w-full border border-cinza-500 rounded-lg p-5 flex gap-4">
                    <div className="h-10 px-2 py-1 text-laranja-500 bg-cinza-300 rounded-md"> {admR.icone} </div>
                    <div>
                        <p className="text-lg"> {admR.label} </p>
                        <label className="text-lg"> {admR.value} </label>
                    </div>
                </div>
            ))}
        </section>
    );
}
export default Rotulos;