import { tabItems } from '@/lib/data'
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const BottomNavbar = () => {
    const [activeTab, setActiveTab] = useState("home");

    const [searchParams, setSearchParams] = useSearchParams();
    const handleTabClick = (tabId: string) => {
        setSearchParams({ tab: tabId });
    };
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab");
        if (tabFromUrl) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);
    return (
        <>
            <nav className="xl:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-border px-4 pt-4 pb-5 z-50">
                <div className="flex items-center justify-around">
                    {tabItems?.slice(0, 5)?.map(tab => <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${activeTab === tab.id ? "text-primary" : "text-muted-foreground"}`}>
                        <tab.icon className="w-7 h-7" />
                    </button>)}
                </div>
            </nav>
        </>
    )
}

export default BottomNavbar