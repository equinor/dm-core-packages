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
 * BlobApi - axios parameter creator
 * @export
 */
export const BlobApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Get blob from id.  A blob file is a binary object, which can be any kind of data object.  Args: - data_source_id (str): The ID of the data source in which to find the blob. - blob_id (str): The ID of the requested blob. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - Filestream: The requested blob.
         * @summary Get By Id
         * @param {string} dataSourceId 
         * @param {string} blobId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blobGetById: async (dataSourceId: string, blobId: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('blobGetById', 'dataSourceId', dataSourceId)
            // verify required parameter 'blobId' is not null or undefined
            assertParamExists('blobGetById', 'blobId', blobId)
            const localVarPath = `/api/blobs/{data_source_id}/{blob_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"blob_id"}}`, encodeURIComponent(String(blobId)));
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
        /**
         * Upload a new blob or modify an existings blob.  A blob (binary large object) can be anything from video to text file. If you give an ID to a blob that already exists, the old blob will be updated in place.  Args: - data_source_id (str): The ID of the data source in which to store the blob. - blob_id (str): The ID that the blob should be stored under. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: OK (200)
         * @summary Upload
         * @param {string} dataSourceId 
         * @param {string} blobId 
         * @param {File} file 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blobUpload: async (dataSourceId: string, blobId: string, file: File, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('blobUpload', 'dataSourceId', dataSourceId)
            // verify required parameter 'blobId' is not null or undefined
            assertParamExists('blobUpload', 'blobId', blobId)
            // verify required parameter 'file' is not null or undefined
            assertParamExists('blobUpload', 'file', file)
            const localVarPath = `/api/blobs/{data_source_id}/{blob_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)))
                .replace(`{${"blob_id"}}`, encodeURIComponent(String(blobId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PUT', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


            if (file !== undefined) { 
                localVarFormParams.append('file', file as any);
            }
    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * BlobApi - functional programming interface
 * @export
 */
export const BlobApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = BlobApiAxiosParamCreator(configuration)
    return {
        /**
         * Get blob from id.  A blob file is a binary object, which can be any kind of data object.  Args: - data_source_id (str): The ID of the data source in which to find the blob. - blob_id (str): The ID of the requested blob. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - Filestream: The requested blob.
         * @summary Get By Id
         * @param {string} dataSourceId 
         * @param {string} blobId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async blobGetById(dataSourceId: string, blobId: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<File>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.blobGetById(dataSourceId, blobId, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Upload a new blob or modify an existings blob.  A blob (binary large object) can be anything from video to text file. If you give an ID to a blob that already exists, the old blob will be updated in place.  Args: - data_source_id (str): The ID of the data source in which to store the blob. - blob_id (str): The ID that the blob should be stored under. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: OK (200)
         * @summary Upload
         * @param {string} dataSourceId 
         * @param {string} blobId 
         * @param {File} file 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async blobUpload(dataSourceId: string, blobId: string, file: File, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.blobUpload(dataSourceId, blobId, file, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * BlobApi - factory interface
 * @export
 */
export const BlobApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = BlobApiFp(configuration)
    return {
        /**
         * Get blob from id.  A blob file is a binary object, which can be any kind of data object.  Args: - data_source_id (str): The ID of the data source in which to find the blob. - blob_id (str): The ID of the requested blob. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - Filestream: The requested blob.
         * @summary Get By Id
         * @param {BlobApiBlobGetByIdRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blobGetById(requestParameters: BlobApiBlobGetByIdRequest, options?: AxiosRequestConfig): AxiosPromise<File> {
            return localVarFp.blobGetById(requestParameters.dataSourceId, requestParameters.blobId, options).then((request) => request(axios, basePath));
        },
        /**
         * Upload a new blob or modify an existings blob.  A blob (binary large object) can be anything from video to text file. If you give an ID to a blob that already exists, the old blob will be updated in place.  Args: - data_source_id (str): The ID of the data source in which to store the blob. - blob_id (str): The ID that the blob should be stored under. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: OK (200)
         * @summary Upload
         * @param {BlobApiBlobUploadRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        blobUpload(requestParameters: BlobApiBlobUploadRequest, options?: AxiosRequestConfig): AxiosPromise<string> {
            return localVarFp.blobUpload(requestParameters.dataSourceId, requestParameters.blobId, requestParameters.file, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for blobGetById operation in BlobApi.
 * @export
 * @interface BlobApiBlobGetByIdRequest
 */
export interface BlobApiBlobGetByIdRequest {
    /**
     * 
     * @type {string}
     * @memberof BlobApiBlobGetById
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof BlobApiBlobGetById
     */
    readonly blobId: string
}

/**
 * Request parameters for blobUpload operation in BlobApi.
 * @export
 * @interface BlobApiBlobUploadRequest
 */
export interface BlobApiBlobUploadRequest {
    /**
     * 
     * @type {string}
     * @memberof BlobApiBlobUpload
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof BlobApiBlobUpload
     */
    readonly blobId: string

    /**
     * 
     * @type {File}
     * @memberof BlobApiBlobUpload
     */
    readonly file: File
}

/**
 * BlobApi - object-oriented interface
 * @export
 * @class BlobApi
 * @extends {BaseAPI}
 */
export class BlobApi extends BaseAPI {
    /**
     * Get blob from id.  A blob file is a binary object, which can be any kind of data object.  Args: - data_source_id (str): The ID of the data source in which to find the blob. - blob_id (str): The ID of the requested blob. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - Filestream: The requested blob.
     * @summary Get By Id
     * @param {BlobApiBlobGetByIdRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BlobApi
     */
    public blobGetById(requestParameters: BlobApiBlobGetByIdRequest, options?: AxiosRequestConfig) {
        return BlobApiFp(this.configuration).blobGetById(requestParameters.dataSourceId, requestParameters.blobId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Upload a new blob or modify an existings blob.  A blob (binary large object) can be anything from video to text file. If you give an ID to a blob that already exists, the old blob will be updated in place.  Args: - data_source_id (str): The ID of the data source in which to store the blob. - blob_id (str): The ID that the blob should be stored under. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - str: OK (200)
     * @summary Upload
     * @param {BlobApiBlobUploadRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BlobApi
     */
    public blobUpload(requestParameters: BlobApiBlobUploadRequest, options?: AxiosRequestConfig) {
        return BlobApiFp(this.configuration).blobUpload(requestParameters.dataSourceId, requestParameters.blobId, requestParameters.file, options).then((request) => request(this.axios, this.basePath));
    }
}
