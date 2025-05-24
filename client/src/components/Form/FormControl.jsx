import { Fragment, useRef } from 'react';

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
    const dateRef = useRef();

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
                        <Fragment>
                            <div className="birthday_input_wrapper">
                                <div
                                    className="birthday_input"
                                    onClick={() => {
                                        if (dateRef?.current) dateRef.current.showPicker();
                                    }}
                                >
                                    {value ? new Date(value).toLocaleDateString('en-GB') : 'dd/mm/yyyy'}
                                </div>

                                <input
                                    ref={dateRef}
                                    id="date_input"
                                    type="date"
                                    name="birthday"
                                    value={value}
                                    onChange={onChange}
                                    lang="vi"
                                    required
                                    max="2006-12-31"
                                />
                            </div>
                        </Fragment>
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
