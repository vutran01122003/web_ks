const LineItem = ({ label, content }) => {
    return (
        <div className="line">
            <span>{label}</span>:<p>{content}</p>
        </div>
    );
};
export default LineItem;
