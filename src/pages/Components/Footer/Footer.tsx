
import { Link } from 'react-router-dom';
import { FaGithub} from 'react-icons/fa';

const Footer = () => {

    return (
        <footer className="absolute bottom-0 bg-neutral-900 w-full justify-between text-white py-6 text-center">
            <div className="container grid md:flex mb-8 md:mb-0 mx-auto justify-center px-4 md:justify-between items-center">
                <p className="flex text-md">
                    © {new Date().getFullYear()} Spoekle. All rights reserved.
                    <Link to="/privacy" className='ml-2 underline text-indigo-500 hover:text-blurple-dark transition duration-200'>
                        Privacy Statement
                    </Link>
                </p>
                <div className="flex justify-center mt-2 md:mt-0">
                    <a
                        href="https://github.com/Spoekle/genpass"
                        target="_blank"
                        rel="noreferrer"
                        className="mx-2 hover:scale-110 transition duration-200 cursor-pointer"
                    >
                        <FaGithub className="text-4xl" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;