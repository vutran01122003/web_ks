export function checkImageUpload(file) {
    if (file?.type !== 'image/jpeg' && file?.type !== 'image/png' && file?.type !== 'image/gif') {
        return {
            inValid: true,
            msg: 'Vui lòng kiểm tra lại định dạng ảnh'
        };
    }

    if (file.size > 1 * 1024 * 1024) {
        return {
            inValid: true,
            msg: 'Kích thước hình ảnh tối đa cho phép là 1MB'
        };
    }

    return {
        inValid: false,
        msg: 'Định dạng ảnh chính xác'
    };
}