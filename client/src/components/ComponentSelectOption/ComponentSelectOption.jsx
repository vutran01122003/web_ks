import React, { useEffect, useState } from 'react'

const ComponentSelectOption = ({
    id,
    label,
    labelOption,
    options,
    name,
    onChange,
    labelOptionNull
}) => {
    const [optionData, setOptionData] = useState([]);


    useEffect(() => {
        setOptionData(options);
    }, [options]);
    

    return (
        <div className='component__input'>
            <label htmlFor={id}>{label}</label>
            <select name={name} id={id} onChange={onChange}>
                <option value="null" >{labelOptionNull}</option>
                {optionData.map((option, item) => {
                    return (
                        <option value={option.value} key={item}>
                            {option.labelOption}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default ComponentSelectOption