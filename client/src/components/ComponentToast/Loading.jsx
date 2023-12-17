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
                <div class="mesh-loader">
                    <div class="set-one">
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                    <div class="set-two">
                        <div class="circle"></div>
                        <div class="circle"></div>
                    </div>
                </div>

            </Backdrop>
        </div>
    );
}
