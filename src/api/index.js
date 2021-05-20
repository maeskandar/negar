import axios from 'axios'

const baseAddress = "https://quranback.iran.liara.run/api";

export const getAxiosBase = () => {
    return axios.create({
        baseURL: baseAddress,
        timeout: 10000
    })
};



