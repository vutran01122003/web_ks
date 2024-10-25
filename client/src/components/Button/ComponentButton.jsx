const ComponentButton = ({ type, textButton, className, onClick, icon_before }) => {
    return (
        <button className={`button__component ${className}`} type={type} onClick={onClick}>
            {icon_before}
            {textButton}
        </button>
    );
};

export default ComponentButton;
