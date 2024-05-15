/* tslint:disable */
/* eslint-disable */
/**
 * Data Modelling Storage Service
 * API for basic data modelling interaction
 *
 * The version of the OpenAPI document: 1.26.0
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
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError, operationServerMap } from '../base';
// @ts-ignore
import { ErrorResponse } from '../models';
/**
 * MetaApi - axios parameter creator
 * @export
 */
export const MetaApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get Meta Information About a blob.  This endpoint returns meta information for a blob file provided document id and the id of the data source of which it is located.  Args: - data_source_id (str): The ID of the data source. - document_id (str): The ID of the document. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A dictionary containing the meta information about the blob file of the document.
         * @summary Get Meta By Id
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        metaById: async (dataSourceId: string, documentId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('metaById', 'dataSourceId', dataSourceId)
            // verify required parameter 'documentId' is not null or undefined
            assertParamExists('metaById', 'documentId', documentId)
            const localVarPath = `/api/meta/{data_source_id}/{document_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"document_id"}}`, encodeURIComponent(String(documentId)));
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
 * MetaApi - functional programming interface
 * @export
 */
export const MetaApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = MetaApiAxiosParamCreator(configuration)
    return {
        /**
         * Get Meta Information About a blob.  This endpoint returns meta information for a blob file provided document id and the id of the data source of which it is located.  Args: - data_source_id (str): The ID of the data source. - document_id (str): The ID of the document. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A dictionary containing the meta information about the blob file of the document.
         * @summary Get Meta By Id
         * @param {string} dataSourceId 
         * @param {string} documentId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async metaById(dataSourceId: string, documentId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.metaById(dataSourceId, documentId, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['MetaApi.metaById']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * MetaApi - factory interface
 * @export
 */
export const MetaApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = MetaApiFp(configuration)
    return {
        /**
         * Get Meta Information About a blob.  This endpoint returns meta information for a blob file provided document id and the id of the data source of which it is located.  Args: - data_source_id (str): The ID of the data source. - document_id (str): The ID of the document. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A dictionary containing the meta information about the blob file of the document.
         * @summary Get Meta By Id
         * @param {MetaApiMetaByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        metaById(requestParameters: MetaApiMetaByIdRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.metaById(requestParameters.dataSourceId, requestParameters.documentId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for metaById operation in MetaApi.
 * @export
 * @interface MetaApiMetaByIdRequest
 */
export interface MetaApiMetaByIdRequest {
    /**
     * 
     * @type {string}
     * @memberof MetaApiMetaById
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof MetaApiMetaById
     */
    readonly documentId: string
}

/**
 * MetaApi - object-oriented interface
 * @export
 * @class MetaApi
 * @extends {BaseAPI}
 */
export class MetaApi extends BaseAPI {
    /**
     * Get Meta Information About a blob.  This endpoint returns meta information for a blob file provided document id and the id of the data source of which it is located.  Args: - data_source_id (str): The ID of the data source. - document_id (str): The ID of the document. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: A dictionary containing the meta information about the blob file of the document.
     * @summary Get Meta By Id
     * @param {MetaApiMetaByIdRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof MetaApi
     */
    public metaById(requestParameters: MetaApiMetaByIdRequest, options?: AxiosRequestConfig) {
        return MetaApiFp(this.configuration).metaById(requestParameters.dataSourceId, requestParameters.documentId, options).then((request) => request(this.axios, this.basePath));
    }
}

