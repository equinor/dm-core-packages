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
 * FileApi - axios parameter creator
 * @export
 */
export const FileApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Upload a New Binary File  This endpoint uploads a new file and creates a file entity with the uploaded binary data as content.  Args: - data_source_id (str): ID of the data source to which the file should be uploaded. - data (dict with a \"file_id\" attribute): A dict containing data source ID to be used for the file entity that will be created. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The file entity that was created to contain the file.
         * @summary Upload File
         * @param {string} dataSourceId 
         * @param {string} data 
         * @param {File} file 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fileUpload: async (dataSourceId: string, data: string, file: File, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('fileUpload', 'dataSourceId', dataSourceId)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('fileUpload', 'data', data)
            // verify required parameter 'file' is not null or undefined
            assertParamExists('fileUpload', 'file', file)
            const localVarPath = `/api/files/{data_source_id}`
                .replace(`{${"data_source_id"}}`, encodeURIComponent(String(dataSourceId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


            if (data !== undefined) { 
                localVarFormParams.append('data', data as any);
            }
    
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
 * FileApi - functional programming interface
 * @export
 */
export const FileApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = FileApiAxiosParamCreator(configuration)
    return {
        /**
         * Upload a New Binary File  This endpoint uploads a new file and creates a file entity with the uploaded binary data as content.  Args: - data_source_id (str): ID of the data source to which the file should be uploaded. - data (dict with a \"file_id\" attribute): A dict containing data source ID to be used for the file entity that will be created. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The file entity that was created to contain the file.
         * @summary Upload File
         * @param {string} dataSourceId 
         * @param {string} data 
         * @param {File} file 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async fileUpload(dataSourceId: string, data: string, file: File, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.fileUpload(dataSourceId, data, file, options);
            const index = configuration?.serverIndex ?? 0;
            const operationBasePath = operationServerMap['FileApi.fileUpload']?.[index]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, operationBasePath || basePath);
        },
    }
};

/**
 * FileApi - factory interface
 * @export
 */
export const FileApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = FileApiFp(configuration)
    return {
        /**
         * Upload a New Binary File  This endpoint uploads a new file and creates a file entity with the uploaded binary data as content.  Args: - data_source_id (str): ID of the data source to which the file should be uploaded. - data (dict with a \"file_id\" attribute): A dict containing data source ID to be used for the file entity that will be created. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The file entity that was created to contain the file.
         * @summary Upload File
         * @param {FileApiFileUploadRequest} requestParameters Request parameters.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        fileUpload(requestParameters: FileApiFileUploadRequest, options?: AxiosRequestConfig): AxiosPromise<object> {
            return localVarFp.fileUpload(requestParameters.dataSourceId, requestParameters.data, requestParameters.file, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for fileUpload operation in FileApi.
 * @export
 * @interface FileApiFileUploadRequest
 */
export interface FileApiFileUploadRequest {
    /**
     * 
     * @type {string}
     * @memberof FileApiFileUpload
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {string}
     * @memberof FileApiFileUpload
     */
    readonly data: string

    /**
     * 
     * @type {File}
     * @memberof FileApiFileUpload
     */
    readonly file: File
}

/**
 * FileApi - object-oriented interface
 * @export
 * @class FileApi
 * @extends {BaseAPI}
 */
export class FileApi extends BaseAPI {
    /**
     * Upload a New Binary File  This endpoint uploads a new file and creates a file entity with the uploaded binary data as content.  Args: - data_source_id (str): ID of the data source to which the file should be uploaded. - data (dict with a \"file_id\" attribute): A dict containing data source ID to be used for the file entity that will be created. - user (User): The authenticated user accessing the endpoint, automatically generated from provided bearer token or Access-Key.  Returns: - dict: The file entity that was created to contain the file.
     * @summary Upload File
     * @param {FileApiFileUploadRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof FileApi
     */
    public fileUpload(requestParameters: FileApiFileUploadRequest, options?: AxiosRequestConfig) {
        return FileApiFp(this.configuration).fileUpload(requestParameters.dataSourceId, requestParameters.data, requestParameters.file, options).then((request) => request(this.axios, this.basePath));
    }
}

