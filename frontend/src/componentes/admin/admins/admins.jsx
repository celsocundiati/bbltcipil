import HeaderOutle from "../../layout/outle/headerholte";
import RotulosOutle from "../../layout/outle/rotulosotles";
import InputAdmin from "../../layout/admInput/input";
import ContainerAdmins from "./seccoes/ContainerAdmins";
import LogsAdmins from "./seccoes/LogsAdmins";

function Admins()
{
    return(
        <main className="w-full grid grid-cols-1 space-y-10 pb-10">
            <HeaderOutle page="admins"/>
            <RotulosOutle page="admins"/>
            <div className="flex items-center justify-center gap-8 bg-white px-5 py-8 border border-black/5 rounded-2xl">
                <InputAdmin page="outros" type="text" placeholder="Pesquisar administradores..."/>
            </div>
            <ContainerAdmins/>
            <LogsAdmins/>
        </main>
    );
}
export default Admins;