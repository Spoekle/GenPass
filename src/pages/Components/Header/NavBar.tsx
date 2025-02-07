import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '/src/images/logo_500px.png';

const NavBar = () => {
    const navRef = useRef<HTMLDivElement>(null);
    const [underlineStyle, setUnderlineStyle] = useState<React.CSSProperties>({});
    const location = useLocation();
    const currentPath = location.pathname;

    useEffect(() => {
        const activeLink = navRef.current?.querySelector('.active') as HTMLElement | null;
        if (activeLink) {
            const { offsetLeft, offsetWidth } = activeLink;
            setUnderlineStyle({
                left: offsetLeft,
                width: offsetWidth,
                background: '#6366F1',
                position: 'absolute',
                bottom: 0,
                height: '4px',
                transition: 'all 200ms ease'
            });
        }
    }, [currentPath]);

    return (
        <nav className="absolute top-0 w-full bg-neutral-950 text-white">
            <div className="container mx-auto flex items-center justify-between h-20 px-4">
                <a href="/" className="text-lg font-semibold text-indigo-500">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="logo" className="w-10 h-10 rounded-md" />
                        <h2 className="text-xl font-semibold text-indigo-500">GenPass</h2>
                    </div>
                </a>
                <div className="relative flex space-x-2" ref={navRef}>
                    <NavLink
                        to="/generator"
                        className={({ isActive }) =>
                            `p-2 px-4 text-lg transition-all duration-200 ${isActive ? 'active font-bold text-neutral-200' : 'text-neutral-400'}`
                        }
                    >
                        Generator
                    </NavLink>
                    <NavLink
                        to="/editor"
                        className={({ isActive }) =>
                            `p-2 px-4 text-lg transition-all duration-200 ${isActive ? 'active font-bold text-neutral-200' : 'text-neutral-400'}`
                        }
                    >
                        Editor
                    </NavLink>
                    <div className="absolute bottom-0 h-1 rounded-full" style={underlineStyle} />
                </div>
            </div>
        </nav>
    );
};

export default NavBar;