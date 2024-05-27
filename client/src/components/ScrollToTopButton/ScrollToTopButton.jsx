import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Cuộn mượt
        });
    };

    return (
        <div>
            {isVisible && (
                <button onClick={scrollToTop} className="scroll-to-top-button">
                    <FiArrowUp />
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;
