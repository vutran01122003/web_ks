import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function SimpleBackdrop() {
    return (
        <div>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
                open={true}
            >
                {/* <CircularProgress color='inherit' /> */}
                <div className="mesh-loader">
                    <div className="set-one">
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>
                    <div className="set-two">
                        <div className="circle"></div>
                        <div className="circle"></div>
                    </div>
                </div>

            </Backdrop>
        </div>
    );
}
