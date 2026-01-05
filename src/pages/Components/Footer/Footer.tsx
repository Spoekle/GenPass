import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <motion.footer 
            className="fixed bottom-0 w-full backdrop-blur-md bg-black/60 text-white py-3 z-40 shadow-md"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
        >
            <div className="container mx-auto flex justify-center px-4 items-center">
                <motion.p 
                    className="flex text-sm items-center text-neutral-300"
                >
                    © {new Date().getFullYear()} Grabs Software. All rights reserved.
                    <motion.div
                        whileHover={{ y: -1 }}
                        className="ml-3"
                    >
                        <Link to="/privacy" className="text-neutral-300 hover:text-white underline transition-colors duration-200">
                            Privacy Statement
                        </Link>
                    </motion.div>
                </motion.p>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-4">
                {/* Social Media & Copyright */}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700 rounded-xl py-4 px-4 justify-between items-center text-center transition duration-200">
                    <div className="text-neutral-400 text-md">
                        This website is powered by
                        <a
                            href="https://grabssoftware.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                            Grabs Software
                        </a>
                        .
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}

export default Footer;