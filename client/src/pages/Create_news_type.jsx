import { useState } from "react";
import { createPage } from "../redux/actions/pageAction";
import {useDispatch} from 'react-redux';

function CreateNewType() {
    const dispatch = useDispatch();
    const [newsTypeValue, setNewsTypeValue] = useState('');
    
    const handleChangeNewsTypeValue = (e) => {
        setNewsTypeValue(e.target.value);
    }

    const handleCreateNewsType = () => {
        dispatch(createPage({
            pageData: {
                pageName: newsTypeValue,
                pageType: "Tin Tức"
            }
        }))
    }
    return ( 
        <div className="create_type_page_container">
            <h1>Thêm Loại Tin Tức</h1>
            <div  className="create_type_input_wrapper">
                <input 
                    type="text" 
                    placeholder="Nhập loại tin tức" 
                    onChange={handleChangeNewsTypeValue}
                    value={newsTypeValue}
                />
                <input type="text" placeholder="Mô tả loại tin tức" />
                <button onClick={handleCreateNewsType}>
                    Tạo Loại Tin Tức
                </button>
            </div>
        </div>
    );
}

export default CreateNewType;