import instance from '../config/axios.config';
export const getDataApi = async (uri, params) => {
    const res = await instance.get(`/api${uri}`, {params});
    return res;
};

export const postDataApi = async (uri, data, headers) => {
    const res = await instance.post(`/api${uri}`, data, {headers});
    return res;
};

export const patchDataApi = async (uri, data) => {
    const res = await instance.patch(`/api${uri}`, data);
    return res;
};

export const deleteDataApi = async (uri, data) => {
    const res = await instance.delete(`/api${uri}`, {data});
    return res;
};
