import axios from "axios";

export const instance = axios.create({
    // baseURL: 'http://localhost:3333/',
    baseURL: 'process.env.REACT_APP_FEEDER_URL',
})

