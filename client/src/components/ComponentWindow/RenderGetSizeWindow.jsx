import React, { createContext, useEffect, useState } from 'react'

export const ContextFromWindowResize = createContext();

const RenderGetSizeWindow = ({ children }) => {
    const [windowSize, setWindowSize] = useState(() => {
        const { innerWidth } = window;
        return { innerWidth };
    });

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(() => {
                const { innerWidth } = window;
                return { innerWidth };
            });
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    const getWidthWindow = windowSize.innerWidth
    const valueWindowSize = { getWidthWindow };

    return (
        <ContextFromWindowResize.Provider value={valueWindowSize}>
            {children}
        </ContextFromWindowResize.Provider>
    )
}
export default RenderGetSizeWindow;