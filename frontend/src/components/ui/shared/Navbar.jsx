import { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, User2, Target } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


function Navbar() {
    const [user, setUser] = useState(null);
    const userId = localStorage.getItem("userId");
    const [goalData, setGoalData] = useState({
        workoutGoal: 100,
        currentProgress: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) return;

        axios
            .get(`http://127.0.0.1:8000/profile/${userId}`)
            .then((res) => setUser(res.data))
            .catch((err) => {
                console.log(err);
                toast.error("Failed to load profile");
            });

        axios
            .get(`http://127.0.0.1:8000/goal/${userId}`)
            .then((res) => {
                setGoalData(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem("userId");

        toast.success("Logged Out Successfully");

        setTimeout(() => {
            navigate("/")
        }, 500);
    };

    return (
        <div className='sticky top-0 z-50 border-b border-slate-700 bg-slate-900/70 backdrop-blur-xl'>
            <div className='max-w-7xl mx-auto flex items-center justify-between h-16 px-6'>
                <div>
                    <h1 className='text-3xl font-bold text-white'>Smart<span className='text-emerald-400'>Fit</span></h1>
                </div>
                <div className='flex items-center gap-4 md:gap-8'>
                    <ul className='flex text-white font-medium items-center gap-5'>
                        <li><Link to="/dashboard" className='hover:text-emerald-400 transition'>Dashboard</Link></li>
                        <li><Link to="/history" className='hover:text-emerald-400 transition'>History</Link></li>
                        <li><Link to="/goal" className="hover:text-emerald-400 transition">Goal</Link> </li>
                    </ul>


                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/70 border border-slate-700" >
                        <Target
                            size={18}
                            className="text-emerald-400"
                        />

                        <span className="text-white text-sm">
                            {Math.round(
                                (goalData.currentProgress /
                                    goalData.workoutGoal) * 100
                            )}%
                        </span>
                    </div>
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
                                        onClick={handleLogout}
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