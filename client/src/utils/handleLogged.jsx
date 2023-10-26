export const setLogged = () => {
    localStorage.setItem('logged', 'true');
}

export const removeLogged = () => {
    localStorage.removeItem('logged');
}

export const getLogged = () => {
    return localStorage.getItem('logged');
}