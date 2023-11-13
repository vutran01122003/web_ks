import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import no_image from '../../assets/images/no_image.jpg';

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
            className="modal_overlap"
            onMouseUp={handleHidePreviewImagesModal}
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
                        <SwiperSlide key={proofImage.imageId}>     
                            <img
                                src={proofImage?.url || no_image}
                                alt='preview_images'
                            />
                        
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div> 
    );
}

export default PreviewImagesModal;