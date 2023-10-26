import React, { useRef} from 'react'

const ComponentInput = ({
    children,
    label,
    type,
    value,
    placeholder,
    id,
    classNameWrap,
    className,
    classNameInputItem,
    iconBefore,
    disabled,
    onChange,
    name,
    readonly,
    labelTypeFile
}) => {


    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div className="component__input">
            <label htmlFor={id}>{label}</label>
            <div className={classNameWrap}>
                <div className={`line__input ${className}`}>
                    {
                        type === "file" ?
                            <button
                                type='button'
                                id={id}
                                className="btn__addFile"
                                onClick={handleButtonClick}
                            >
                                    {labelTypeFile}
                        
                            </button>
                            :
                            <></>
                    }
                    <input
                        ref={fileInputRef}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        id={id}
                        disabled={disabled}
                        onChange={onChange}
                        name={name}
                        readOnly={readonly}
                        className={classNameInputItem}
                    />

                    <div className="icon__before">
                        {iconBefore}
                    </div>
                </div>

                {children}
            </div>
        </div>
    )
}

export default ComponentInput