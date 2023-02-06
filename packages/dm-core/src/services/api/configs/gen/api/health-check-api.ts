/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ErrorResponse } from '../models';
/**
 * HealthCheckApi - axios parameter creator
 * @export
 */
export const HealthCheckApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Healthcheck endpoint. Responds with \"OK\" - 200.
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiHealthcheckGet: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/api/healthcheck`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * HealthCheckApi - functional programming interface
 * @export
 */
export const HealthCheckApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = HealthCheckApiAxiosParamCreator(configuration)
    return {
        /**
         * Healthcheck endpoint. Responds with \"OK\" - 200.
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getApiHealthcheckGet(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getApiHealthcheckGet(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * HealthCheckApi - factory interface
 * @export
 */
export const HealthCheckApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = HealthCheckApiFp(configuration)
    return {
        /**
         * Healthcheck endpoint. Responds with \"OK\" - 200.
         * @summary Get
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getApiHealthcheckGet(options?: any): AxiosPromise<string> {
            return localVarFp.getApiHealthcheckGet(options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * HealthCheckApi - object-oriented interface
 * @export
 * @class HealthCheckApi
 * @extends {BaseAPI}
 */
export class HealthCheckApi extends BaseAPI {
    /**
     * Healthcheck endpoint. Responds with \"OK\" - 200.
     * @summary Get
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof HealthCheckApi
     */
    public getApiHealthcheckGet(options?: AxiosRequestConfig) {
        return HealthCheckApiFp(this.configuration).getApiHealthcheckGet(options).then((request) => request(this.axios, this.basePath));
    }
}
