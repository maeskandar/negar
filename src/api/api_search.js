import { getAxiosBase } from "./index";


export const getRecommendedSearch = (text, id) => {
    return getAxiosBase().get(`/Search/lookup/${text}?random=${id}`).then(res => res.data.data).catch(err => {
        throw new Error(err.response.data);
    });
};

export const getResultSearch = (data) => {
    return getAxiosBase().post('/Search',data).then(res => res.data.data).catch(err => {
        throw new Error(err.response.data);
    });
};
