/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.6.4
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { ErrorResponse } from '../models';
/**
 * AttributeApi - axios parameter creator
 * @export
 */
export const AttributeApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Fetch the BlueprintAttribute which is the container for the addressed object.  This endpoint is used for fetching a BlueprintAttribute in which the addressed entity is contained.  Args: - address (str): The address to the entity. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The blueprint-attribute object.
         * @summary Get Attribute
         * @param {string} address 
         * @param {boolean} [resolve] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        attributeGet: async (address: string, resolve?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('attributeGet', 'address', address)
            const localVarPath = `/api/attribute/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)

            if (resolve !== undefined) {
                localVarQueryParameter['resolve'] = resolve;
            }


    
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
 * AttributeApi - functional programming interface
 * @export
 */
export const AttributeApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = AttributeApiAxiosParamCreator(configuration)
    return {
        /**
         * Fetch the BlueprintAttribute which is the container for the addressed object.  This endpoint is used for fetching a BlueprintAttribute in which the addressed entity is contained.  Args: - address (str): The address to the entity. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The blueprint-attribute object.
         * @summary Get Attribute
         * @param {string} address 
         * @param {boolean} [resolve] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async attributeGet(address: string, resolve?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.attributeGet(address, resolve, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * AttributeApi - factory interface
 * @export
 */
export const AttributeApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = AttributeApiFp(configuration)
    return {
        /**
         * Fetch the BlueprintAttribute which is the container for the addressed object.  This endpoint is used for fetching a BlueprintAttribute in which the addressed entity is contained.  Args: - address (str): The address to the entity. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The blueprint-attribute object.
         * @summary Get Attribute
         * @param {AttributeApiAttributeGetRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        attributeGet(requestParameters: AttributeApiAttributeGetRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.attributeGet(requestParameters.address, requestParameters.resolve, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for attributeGet operation in AttributeApi.
 * @export
 * @interface AttributeApiAttributeGetRequest
 */
export interface AttributeApiAttributeGetRequest {
    /**
     * 
     * @type {string}
     * @memberof AttributeApiAttributeGet
     */
    readonly address: string

    /**
     * 
     * @type {boolean}
     * @memberof AttributeApiAttributeGet
     */
    readonly resolve?: boolean
}

/**
 * AttributeApi - object-oriented interface
 * @export
 * @class AttributeApi
 * @extends {BaseAPI}
 */
export class AttributeApi extends BaseAPI {
    /**
     * Fetch the BlueprintAttribute which is the container for the addressed object.  This endpoint is used for fetching a BlueprintAttribute in which the addressed entity is contained.  Args: - address (str): The address to the entity. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The blueprint-attribute object.
     * @summary Get Attribute
     * @param {AttributeApiAttributeGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof AttributeApi
     */
    public attributeGet(requestParameters: AttributeApiAttributeGetRequest, options?: AxiosRequestConfig) {
        return AttributeApiFp(this.configuration).attributeGet(requestParameters.address, requestParameters.resolve, options).then((request) => request(this.axios, this.basePath));
    }
}
