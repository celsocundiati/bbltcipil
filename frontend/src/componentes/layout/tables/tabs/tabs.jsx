import { useState } from "react";

function Tabs({tabs, defaultTab = 0})
{
    const [active, setActive] = useState(defaultTab);

    return(
        <section className="relative w-full">
            <div className="absolute">
                <nav className="flex items-center justify-start w-64 gap-2 rounded-full bg-black/10 px-2 py-1.5">
                    {tabs.map((tab, index) => (
                        <button key={tab.label} onClick={() => setActive(index)} 
                        className={`px-6 py-2 text-sm font-medium rounded-full cursor-pointer transition-all 
                        ${ active === index ? "bg-white text-black/85 shadow" : "text-black70 hover:text-black"}`}>
                            {tab.label}
                        </button>
                    ))}
                </nav>
                <section>
                    {tabs[active].content}
                </section>
            </div>
        </section>
    );
}
export default Tabs;