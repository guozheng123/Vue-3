// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';

declare module 'axios' {
    export interface AxiosInstance {
        delete<T = any, R = TpfAxiosRes<T>>(
            url: string,
            data?: any,
            config?: AxiosRequestConfig
        ): Promise<R>;
        put<T = any, R = TpfAxiosRes<T>>(
            url: string,
            data?: any,
            config?: AxiosRequestConfig
        ): Promise<R>;
        post<T = any, R = TpfAxiosRes<T>>(
            url: string,
            data?: any,
            config?: AxiosRequestConfig
        ): Promise<R>;
        postForm<T = any, R = TpfAxiosRes<T>>(
            url: string,
            data?: any,
            config?: AxiosRequestConfig
        ): Promise<R>;
        get<T = any, R = TpfAxiosRes<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
    }
}

export interface TpfPagerRes {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
}

export interface ResTpfObject<T> {
    object: T & TpfPagerRes;
}

export interface ResTpfList<T> {
    list: T;
}
export interface ResTpfValue<T = string> {
    value: T;
}

export interface TpfAxiosRes<T> {
    headers: any;
    success: boolean;
    errorCode: string;
    errorMessage: string;
    timeStamp: Date;
    data: T;
    pager: Pager;
}
