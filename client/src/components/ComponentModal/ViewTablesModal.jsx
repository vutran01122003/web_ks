function ViewTablesModal({ handleHideViewTablesModal }) {
    const handleClosePopup = () => {
        handleHideViewTablesModal();
    }

    return (  
        <div 
            className="modal_overlap"
            onMouseUp={handleClosePopup}
        >
            <div className="box_wrapper">
                test
            </div>
        </div>
    );
}

export default ViewTablesModal;