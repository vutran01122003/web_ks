function PreviewImagesModal({proofFilesData, setOpenPreviewModal}) {
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
                {
                    proofFilesData.map((proofFiles) => ( 
                        <a key={proofFiles?.fileId} href={proofFiles?.fileUrl} download >
                            {proofFiles?.fileId}
                        </a>
                    ))
                }
            </div>
        </div> 
    );
}

export default PreviewImagesModal;