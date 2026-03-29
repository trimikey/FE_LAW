import { MdSearch, MdMenu, MdNotifications, MdAccountCircle, MdKeyboardArrowDown } from 'react-icons/md';

const AdminTopbar = () => {
    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="flex items-center gap-4 flex-1">
                <button className="text-gray-500 hover:text-gray-700 lg:hidden">
                    <MdMenu className="text-2xl" />
                </button>
                <div className="relative w-96 max-w-full">
                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-light"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg relative">
                    <MdNotifications className="text-2xl" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-2 pl-4 border-l border-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                        <MdAccountCircle className="text-2xl" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Account</span>
                    <MdKeyboardArrowDown className="text-gray-400" />
                </div>
            </div>
        </header>
    );
};

export default AdminTopbar;
