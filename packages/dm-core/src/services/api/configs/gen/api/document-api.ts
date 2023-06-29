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
 * DocumentApi - axios parameter creator
 * @export
 */
export const DocumentApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * Add a document to a package (or a data source) using an address.  - **address**:   - Reference to data source: PROTOCOL://DATA SOURCE   - Reference to package by id: PROTOCOL://DATA SOURCE/$ID   - Reference to package by path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE   The PROTOCOL is optional, and the default is dmss.
         * @summary Add Document
         * @param {string} address 
         * @param {string} document 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentAdd: async (address: string, document: string, updateUncontained?: boolean, files?: Array<File>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('documentAdd', 'address', address)
            // verify required parameter 'document' is not null or undefined
            assertParamExists('documentAdd', 'document', document)
            const localVarPath = `/api/documents/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
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

            if (updateUncontained !== undefined) {
                localVarQueryParameter['update_uncontained'] = updateUncontained;
            }


            if (document !== undefined) { 
                localVarFormParams.append('document', document as any);
            }
                if (files) {
                files.forEach((element) => {
                    localVarFormParams.append('files', element as any);
                })
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
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentAddSimple: async (dataSourceId: string, body: object, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'dataSourceId' is not null or undefined
            assertParamExists('documentAddSimple', 'dataSourceId', dataSourceId)
            // verify required parameter 'body' is not null or undefined
            assertParamExists('documentAddSimple', 'body', body)
            const localVarPath = `/api/documents-add-raw/{data_source_id}`
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

            // authentication APIKeyHeader required
            await setApiKeyToObject(localVarHeaderParameter, "Access-Key", configuration)

            // authentication OAuth2AuthorizationCodeBearer required
            // oauth required
            await setOAuthToObject(localVarHeaderParameter, "OAuth2AuthorizationCodeBearer", [], configuration)


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(body, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Get document as JSON string.  - **address**: An address to a package or a data source   - By id: PROTOCOL://DATA SOURCE/$ID.Attribute   - By path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY.Attribute   - By query: PROTOCOL://DATA SOURCE/$ID.list(key=value)  The PROTOCOL is optional, and the default is dmss.  - **depth**: Maximum depth for resolving nested documents.
         * @summary Get
         * @param {string} address 
         * @param {number} [depth] 
         * @param {boolean} [resolveLinks] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGet: async (address: string, depth?: number, resolveLinks?: boolean, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('documentGet', 'address', address)
            const localVarPath = `/api/documents/{address}`
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

            if (depth !== undefined) {
                localVarQueryParameter['depth'] = depth;
            }

            if (resolveLinks !== undefined) {
                localVarQueryParameter['resolve_links'] = resolveLinks;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * Remove a document from DMSS.
         * @summary Remove
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentRemove: async (address: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'address' is not null or undefined
            assertParamExists('documentRemove', 'address', address)
            const localVarPath = `/api/documents/{address}`
                .replace(`{${"address"}}`, encodeURIComponent(String(address)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
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
         * Update document - **id_address**: <protocol>://<data_source>/$<document_uuid> (can also include an optional .<attribute> after <document_uuid>)
         * @summary Update
         * @param {string} idAddress 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentUpdate: async (idAddress: string, data: string, updateUncontained?: boolean, files?: Array<File>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'idAddress' is not null or undefined
            assertParamExists('documentUpdate', 'idAddress', idAddress)
            // verify required parameter 'data' is not null or undefined
            assertParamExists('documentUpdate', 'data', data)
            const localVarPath = `/api/documents/{id_address}`
                .replace(`{${"id_address"}}`, encodeURIComponent(String(idAddress)));
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

            if (updateUncontained !== undefined) {
                localVarQueryParameter['update_uncontained'] = updateUncontained;
            }


            if (data !== undefined) { 
                localVarFormParams.append('data', data as any);
            }
                if (files) {
                files.forEach((element) => {
                    localVarFormParams.append('files', element as any);
                })
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
 * DocumentApi - functional programming interface
 * @export
 */
export const DocumentApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DocumentApiAxiosParamCreator(configuration)
    return {
        /**
         * Add a document to a package (or a data source) using an address.  - **address**:   - Reference to data source: PROTOCOL://DATA SOURCE   - Reference to package by id: PROTOCOL://DATA SOURCE/$ID   - Reference to package by path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE   The PROTOCOL is optional, and the default is dmss.
         * @summary Add Document
         * @param {string} address 
         * @param {string} document 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentAdd(address: string, document: string, updateUncontained?: boolean, files?: Array<File>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentAdd(address, document, updateUncontained, files, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentAddSimple(dataSourceId: string, body: object, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<string>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentAddSimple(dataSourceId, body, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Get document as JSON string.  - **address**: An address to a package or a data source   - By id: PROTOCOL://DATA SOURCE/$ID.Attribute   - By path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY.Attribute   - By query: PROTOCOL://DATA SOURCE/$ID.list(key=value)  The PROTOCOL is optional, and the default is dmss.  - **depth**: Maximum depth for resolving nested documents.
         * @summary Get
         * @param {string} address 
         * @param {number} [depth] 
         * @param {boolean} [resolveLinks] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentGet(address: string, depth?: number, resolveLinks?: boolean, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<object>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentGet(address, depth, resolveLinks, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Remove a document from DMSS.
         * @summary Remove
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentRemove(address: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentRemove(address, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * Update document - **id_address**: <protocol>://<data_source>/$<document_uuid> (can also include an optional .<attribute> after <document_uuid>)
         * @summary Update
         * @param {string} idAddress 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async documentUpdate(idAddress: string, data: string, updateUncontained?: boolean, files?: Array<File>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.documentUpdate(idAddress, data, updateUncontained, files, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DocumentApi - factory interface
 * @export
 */
export const DocumentApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DocumentApiFp(configuration)
    return {
        /**
         * Add a document to a package (or a data source) using an address.  - **address**:   - Reference to data source: PROTOCOL://DATA SOURCE   - Reference to package by id: PROTOCOL://DATA SOURCE/$ID   - Reference to package by path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE   The PROTOCOL is optional, and the default is dmss.
         * @summary Add Document
         * @param {string} address 
         * @param {string} document 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentAdd(address: string, document: string, updateUncontained?: boolean, files?: Array<File>, options?: any): AxiosPromise<object> {
            return localVarFp.documentAdd(address, document, updateUncontained, files, options).then((request) => request(axios, basePath));
        },
        /**
         * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
         * @summary Add Raw
         * @param {string} dataSourceId 
         * @param {object} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentAddSimple(dataSourceId: string, body: object, options?: any): AxiosPromise<string> {
            return localVarFp.documentAddSimple(dataSourceId, body, options).then((request) => request(axios, basePath));
        },
        /**
         * Get document as JSON string.  - **address**: An address to a package or a data source   - By id: PROTOCOL://DATA SOURCE/$ID.Attribute   - By path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY.Attribute   - By query: PROTOCOL://DATA SOURCE/$ID.list(key=value)  The PROTOCOL is optional, and the default is dmss.  - **depth**: Maximum depth for resolving nested documents.
         * @summary Get
         * @param {string} address 
         * @param {number} [depth] 
         * @param {boolean} [resolveLinks] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentGet(address: string, depth?: number, resolveLinks?: boolean, options?: any): AxiosPromise<object> {
            return localVarFp.documentGet(address, depth, resolveLinks, options).then((request) => request(axios, basePath));
        },
        /**
         * Remove a document from DMSS.
         * @summary Remove
         * @param {string} address 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentRemove(address: string, options?: any): AxiosPromise<any> {
            return localVarFp.documentRemove(address, options).then((request) => request(axios, basePath));
        },
        /**
         * Update document - **id_address**: <protocol>://<data_source>/$<document_uuid> (can also include an optional .<attribute> after <document_uuid>)
         * @summary Update
         * @param {string} idAddress 
         * @param {string} data 
         * @param {boolean} [updateUncontained] 
         * @param {Array<File>} [files] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        documentUpdate(idAddress: string, data: string, updateUncontained?: boolean, files?: Array<File>, options?: any): AxiosPromise<any> {
            return localVarFp.documentUpdate(idAddress, data, updateUncontained, files, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for documentAdd operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentAddRequest
 */
export interface DocumentApiDocumentAddRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentAdd
     */
    readonly address: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentAdd
     */
    readonly document: string

    /**
     * 
     * @type {boolean}
     * @memberof DocumentApiDocumentAdd
     */
    readonly updateUncontained?: boolean

    /**
     * 
     * @type {Array<File>}
     * @memberof DocumentApiDocumentAdd
     */
    readonly files?: Array<File>
}

/**
 * Request parameters for documentAddSimple operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentAddSimpleRequest
 */
export interface DocumentApiDocumentAddSimpleRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentAddSimple
     */
    readonly dataSourceId: string

    /**
     * 
     * @type {object}
     * @memberof DocumentApiDocumentAddSimple
     */
    readonly body: object
}

/**
 * Request parameters for documentGet operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentGetRequest
 */
export interface DocumentApiDocumentGetRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentGet
     */
    readonly address: string

    /**
     * 
     * @type {number}
     * @memberof DocumentApiDocumentGet
     */
    readonly depth?: number

    /**
     * 
     * @type {boolean}
     * @memberof DocumentApiDocumentGet
     */
    readonly resolveLinks?: boolean
}

/**
 * Request parameters for documentRemove operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentRemoveRequest
 */
export interface DocumentApiDocumentRemoveRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentRemove
     */
    readonly address: string
}

/**
 * Request parameters for documentUpdate operation in DocumentApi.
 * @export
 * @interface DocumentApiDocumentUpdateRequest
 */
export interface DocumentApiDocumentUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly idAddress: string

    /**
     * 
     * @type {string}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly data: string

    /**
     * 
     * @type {boolean}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly updateUncontained?: boolean

    /**
     * 
     * @type {Array<File>}
     * @memberof DocumentApiDocumentUpdate
     */
    readonly files?: Array<File>
}

/**
 * DocumentApi - object-oriented interface
 * @export
 * @class DocumentApi
 * @extends {BaseAPI}
 */
export class DocumentApi extends BaseAPI {
    /**
     * Add a document to a package (or a data source) using an address.  - **address**:   - Reference to data source: PROTOCOL://DATA SOURCE   - Reference to package by id: PROTOCOL://DATA SOURCE/$ID   - Reference to package by path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE   The PROTOCOL is optional, and the default is dmss.
     * @summary Add Document
     * @param {DocumentApiDocumentAddRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentAdd(requestParameters: DocumentApiDocumentAddRequest, options?: AxiosRequestConfig) {
        return DocumentApiFp(this.configuration).documentAdd(requestParameters.address, requestParameters.document, requestParameters.updateUncontained, requestParameters.files, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Adds the document \'as-is\' to the datasource. NOTE: The \'explorer-add\' operation is to be preferred. This is mainly for bootstrapping and imports. Blueprint need not exist, and so there is no validation or splitting of entities. Posted document must be a valid Entity.
     * @summary Add Raw
     * @param {DocumentApiDocumentAddSimpleRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentAddSimple(requestParameters: DocumentApiDocumentAddSimpleRequest, options?: AxiosRequestConfig) {
        return DocumentApiFp(this.configuration).documentAddSimple(requestParameters.dataSourceId, requestParameters.body, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Get document as JSON string.  - **address**: An address to a package or a data source   - By id: PROTOCOL://DATA SOURCE/$ID.Attribute   - By path: PROTOCOL://DATA SOURCE/ROOT PACKAGE/SUB PACKAGE/ENTITY.Attribute   - By query: PROTOCOL://DATA SOURCE/$ID.list(key=value)  The PROTOCOL is optional, and the default is dmss.  - **depth**: Maximum depth for resolving nested documents.
     * @summary Get
     * @param {DocumentApiDocumentGetRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentGet(requestParameters: DocumentApiDocumentGetRequest, options?: AxiosRequestConfig) {
        return DocumentApiFp(this.configuration).documentGet(requestParameters.address, requestParameters.depth, requestParameters.resolveLinks, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Remove a document from DMSS.
     * @summary Remove
     * @param {DocumentApiDocumentRemoveRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentRemove(requestParameters: DocumentApiDocumentRemoveRequest, options?: AxiosRequestConfig) {
        return DocumentApiFp(this.configuration).documentRemove(requestParameters.address, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * Update document - **id_address**: <protocol>://<data_source>/$<document_uuid> (can also include an optional .<attribute> after <document_uuid>)
     * @summary Update
     * @param {DocumentApiDocumentUpdateRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DocumentApi
     */
    public documentUpdate(requestParameters: DocumentApiDocumentUpdateRequest, options?: AxiosRequestConfig) {
        return DocumentApiFp(this.configuration).documentUpdate(requestParameters.idAddress, requestParameters.data, requestParameters.updateUncontained, requestParameters.files, options).then((request) => request(this.axios, this.basePath));
    }
}
