import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, User2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Link } from "react-router-dom";

function Navbar() {
    const [user, setUser] = useState(null);
    const userId = localStorage.getItem("userId");
    useEffect(() => {
        if (!userId) return;

        axios
            .get(`http://127.0.0.1:8000/profile/${userId}`)
            .then(res => setUser(res.data))
            .catch(err => console.log(err));
    }, [userId]);

    return (
        <div className='sticky top-0 z-50 border-b border-slate-700 bg-slate-900/70 backdrop-blur-xl'>
            <div className='max-w-7xl mx-auto flex items-center justify-between h-16 px-6'>
                <div>
                    <h1 className='text-3xl font-bold text-white'>Smart<span className='text-emerald-400'>Fit</span></h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex text-white font-medium items-center gap-5'>
                        <li><Link to="/dashboard" className='hover:text-emerald-400 transition'>Dashboard</Link></li>
                        <li><Link to="/history" className='hover:text-emerald-400 transition'>History</Link></li>
                    </ul>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Avatar className="cursor-pointer">
                                {user?.avatar ? (
                                    <AvatarImage src={user?.avatar} alt="@shadcn" />
                                ) : (
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 border border-emerald-500/20 bg-slate-900/80 backdrop-blur-xl shadow-xl shadow-emerald-500/10 text-white">
                            <div className=''>
                                <div className="flex items-center gap-2 p-2">
                                    <Avatar className="cursor-pointer ring-2 ring-emerald-500/40">
                                        {user?.avatar ? (
                                            <AvatarImage src={user?.avatar} alt="@shadcn" />
                                        ) : (
                                            <AvatarFallback>
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <h4 className='font-medium text-white'>{user?.name || "#"}</h4>
                                </div>
                                <div className="my-3 border-t border-slate-700"></div>
                                <div className='flex flex-col my-2 text-white'>
                                    <div className="flex items-center gap-2 rounded-xl p-2 hover:bg-emerald-500/10 transition cursor-pointer">
                                        <User2 />
                                        <Link to="/profile">
                                            View Profile
                                        </Link>
                                    </div>
                                    <div
                                        className="flex items-center gap-2 rounded-xl p-2 hover:bg-red-500/10 transition cursor-pointer"
                                        onClick={() => {
                                            localStorage.removeItem("userId");
                                            window.location.href = "/";
                                        }}
                                    >
                                        <LogOut />
                                        <span>Logout</span>
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}

export default Navbar;