import slugify from 'slugify';
import instance from '../config/axios.config';

export const downloadExcel = async ({ endpoint, filterData, filename }) => {
    try {
        const res = await instance.get(endpoint, {
            responseType: 'blob',
            params: filterData
        });

        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', `${slugify(filename, '_')}.xlsx`);

        document.body.appendChild(link);

        link.click();
        link.parentNode.removeChild(link);

        window.URL.revokeObjectURL(url);
    } catch (error) {
        throw error;
    }
};
