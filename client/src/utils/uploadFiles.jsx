export function checkFilesUpload(file) {
    if (file.size > 10 * 1024 * 1024) {
        return {
            inValid: true,
            msg: 'Kích thước hình ảnh tối đa cho phép là 5MB'
        };
    }

    if (!(
        file.type.split('/')[0] === 'image' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/pdf'
    )) {
        return {
            inValid: true,
            msg: 'Định dạng file không hợp lệ'
        };
    }

    return {
        inValid: false,
        msg: 'Định dạng ảnh và kích thước đủ điều kiện'
    };
}

export const encodeFileName = (file) => {
    const blob = file.slice(0, file.size, file.type); 
    const newFile = new File([blob], encodeURI(file.name), {type: file.type});
    return newFile;
}