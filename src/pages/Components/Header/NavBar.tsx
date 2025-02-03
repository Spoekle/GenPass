import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav className="absolute top-0 flex space-x-3 bg-neutral-900  w-full  text-white py-6 text-center">
            <div className="container grid md:flex mx-auto space-x-3 px-4 items-center">
                <div className="flex items-center space-x-2 mr-4">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full"></div>
                    <h2 className="text-xl font-semibold text-indigo-500">GenPass</h2>
                </div>
                <NavLink
                    to="/generator"
                    className={({ isActive }) =>
                        `text-md ${isActive ? 'bg-black/20 scale-110' : 'hover:bg-black/20 hover:scale-110'} rounded-md py-2 px-3 transition duration-200 text-left text-white`
                    }
                >
                    Generator
                </NavLink>
                <NavLink
                    to="/editor"
                    className={({ isActive }) =>
                        `text-md font-semibold ${isActive ? 'bg-black/20 scale-110' : 'hover:bg-black/20 hover:scale-110'} rounded-md py-2 px-3 transition duration-200 text-left text-white`
                    }
                >
                    Editor
                </NavLink>
            </div>
        </nav>
    );
};

export default NavBar;