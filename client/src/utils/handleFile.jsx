import slugify from 'slugify';
import instance from '../config/axios.config';
import { s3Client } from '../config/aws.config';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getDataApi } from './fetchData';
import axios from 'axios';
import { getAccessToken } from './handleCredentials';

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

export function checkFilesUpload(file) {
    if (file.size > 10 * 1024 * 1024) {
        return {
            inValid: true,
            msg: 'Kích thước hình ảnh tối đa cho phép là 5MB'
        };
    }

    if (!(file.type === 'application/pdf')) {
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
    const newFile = new File([blob], encodeURI(file.name), { type: file.type });
    return newFile;
};

export const getFileFromS3 = ({ Key, Bucket, type }) => {
    return new Promise((resolve, reject) => {
        s3Client
            .send(
                new GetObjectCommand({
                    Bucket,
                    Key
                })
            )
            .then((res) => {
                return res.Body.transformToByteArray();
            })
            .then((content) => {
                resolve(new Blob([content.buffer], { type }));
            })
            .catch((error) => {
                reject(error);
            });
    });
};

export const getFileFromServer = (fileUrl) => {
    return new Promise((resolve, reject) => {
        axios
            .get(fileUrl, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
                responseType: 'blob'
            })
            .then((res) => {
                resolve(new Blob([res.data], { type: 'application/pdf' }));
            })
            .catch((error) => {
                reject(error);
            });
    });
};
