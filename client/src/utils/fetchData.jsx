import instance from '../config/axios.config';
export const getDataApi = async (uri) => {
    const res = await instance.get(`/api${uri}`);
    return res;
};

export const postDataApi = async (uri, data) => {
    const res = await instance.post(`/api${uri}`, data);
    return res;
};

export const patchDataApi = async (uri, data) => {
    const res = await instance.patch(`/api${uri}`, data);
    return res;
};

export const deleteDateApi = async (uri, data) => {
    const res = await instance.delete(`/api${uri}`, data);
    return res;
};
