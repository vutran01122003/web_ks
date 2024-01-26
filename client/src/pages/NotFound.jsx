import React from 'react';
import notFound from '../assets/images/notfound.png';

const NotFound = () => {
    return (
        <div className='notfound_container'>
            <img src={notFound} alt='not_found' />
        </div>
    );
};

export default NotFound;
