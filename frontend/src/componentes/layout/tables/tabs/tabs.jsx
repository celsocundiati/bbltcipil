import { useState } from "react";
import { motion } from "framer-motion";

function Tabs({tabs, defaultTab = 0})
{
    const [active, setActive] = useState(defaultTab);

    return(
        <motion.section  initial={{ opacity: 0, y: 20 }}       // começa invisível e levemente abaixo
            whileInView={{ opacity: 1, y: 0 }}   // anima quando entra na tela
            viewport={{ once: true }}             // anima apenas uma vez
            className="relative w-full">
            <div className="absolute space-y-10">
                <nav className="flex items-center justify-start w-64 gap-2 rounded-full bg-black/10 px-2 py-1.5">
                    {tabs.map((tab, index) => (
                        <button key={tab.label} onClick={() => setActive(index)} 
                        className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all 
                        ${ active === index ? "bg-white text-black/85 shadow" : "text-black70 hover:text-black"}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <section className="w-full">
                    {tabs[active].content}
                </section>
            </div>
        </motion.section>
    );
}
export default Tabs;