import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function PreviewImagesModal({proofImagesData, setOpenPreviewModal}) {
    const handleHidePreviewImagesModal = (e) => {
        if(e.currentTarget === e.target) {
            setOpenPreviewModal(false);
        }
        return;
    }

    return ( 
        <div 
            className="previewImagesModal"
            onClick={handleHidePreviewImagesModal}
        >
            <div className='carousel_wrapper'>
                <Swiper
                    style={{
                        userSelect: 'none',
                        '--swiper-navigation-size': '40px',
                        position: 'relative',
                        zIndex: 0
                    }}
                    navigation={true}
                    modules={[Pagination, Navigation]}
                    loop={true}
                    className='mySwiper'
                >
                    {proofImagesData.map((proofImage) => (
                        <SwiperSlide key={proofImage.proofImageId}>     
                            <img
                                src={proofImage.url}
                                alt='preview_images'
                                // onError={({ currentTarget }) => {
                                //     currentTarget.onerror = null; 
                                //     currentTarget.src = require('../../../images/no_image.png');
                                // }}
                            />
                        
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div> 
    );
}

export default PreviewImagesModal;