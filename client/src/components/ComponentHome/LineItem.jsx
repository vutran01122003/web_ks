const LineItem = ({ info, text, className }) => {
    return (
        <div className={`line ${className ? className : ''}`}>
            <span>{info}</span>:<p>{text}</p>
        </div>
    );
};
export default LineItem;
