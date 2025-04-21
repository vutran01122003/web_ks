const FormControl = ({
    children,
    label,
    type,
    value,
    placeholder,
    id,
    classNameWrap,
    className,
    classNameInputItem,
    classNameRoot,
    iconBefore,
    disabled,
    onChange,
    name,
    readonly,
    max,
    onClickBeforeIcon
}) => {
    return (
        <div className={`component__input ${classNameRoot ? classNameRoot : ''}`}>
            <label htmlFor={id}>{label}</label>
            <div className={classNameWrap}>
                <div className={`line__input ${className}`}>
                    {type !== 'date' ? (
                        <input
                            type={type}
                            placeholder={placeholder}
                            value={value}
                            id={id}
                            disabled={disabled}
                            onChange={onChange}
                            name={name}
                            readOnly={readonly}
                            className={classNameInputItem}
                            max={max}
                        />
                    ) : (
                        <Fragment></Fragment>
                    )}

                    <div className="icon__before" onClick={onClickBeforeIcon}>
                        {iconBefore}
                    </div>
                </div>

                {children}
            </div>
        </div>
    );
};

export default FormControl;
