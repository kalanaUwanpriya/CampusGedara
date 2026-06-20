import { Bus, Clock, MapPin, ChevronRight, DollarSign } from 'lucide-react'

const RouteCard = ({ route, onClick }) => {
    const { 
        vehicleName, 
        startLocation, 
        endLocation, 
        startTime, 
        ticketPrice, 
        duration, 
        status 
    } = route

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
            case 'Full': return 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
            case 'Delayed': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
            default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-dark-text-muted border-slate-100 dark:border-slate-800';
        }
    }

    return (
        <div
            className="bg-white dark:bg-dark-card rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all duration-500"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-400/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
            
            <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center space-x-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-none transition-transform group-hover:rotate-6">
                        <Bus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-dark-text-main leading-none mb-2">{vehicleName}</h3>
                        <div className={`inline-flex px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(status)}`}>
                            {status}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-indigo-600 dark:text-dark-accent">Rs. {ticketPrice}</span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-wider mt-1">Single Trip</span>
                </div>
            </div>

            <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 dark:bg-dark-bg rounded-[2rem] border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500 ring-8 ring-indigo-500/10"></div>
                    <div className="w-[2px] h-10 bg-indigo-500/20 dark:bg-indigo-400/10"></div>
                    <div className="w-3 h-3 rounded-full bg-purple-500 ring-8 ring-purple-500/10"></div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest mb-1.5">Starting Terminal</p>
                        <p className="text-md font-bold text-slate-700 dark:text-dark-text-main">{startLocation}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest mb-1.5">End Destination</p>
                        <p className="text-md font-bold text-slate-700 dark:text-dark-text-main">{endLocation}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 font-bold">
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-dark-accent">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest mb-0.5">Start Time</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{startTime}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-dark-bg border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 dark:text-dark-text-muted uppercase tracking-widest mb-0.5">Duration</p>
                        <p className="text-sm font-black text-gray-900 dark:text-white">{duration}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RouteCard
