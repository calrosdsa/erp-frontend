/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get user account */
        get: operations["get-account"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/account/sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Sign in a user */
        post: operations["sign-in"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/company": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get User companies */
        get: operations["companies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/greeting/{name}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get greeting by name */
        get: operations["get-greeting-by-name"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/plugin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get available plugins */
        get: operations["plugins"];
        put?: never;
        /** Add plugin */
        post: operations["add-plugin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/plugin/{plugin}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get plugin from company */
        get: operations["get-plugin"];
        /** Update plugin credentials */
        put: operations["update-plugin-credentials"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stock": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Item groups */
        get: operations["item-group"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        AccountResponseBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            appConfig: components["schemas"]["AppConfigStruct"];
            user: components["schemas"]["User"];
        };
        AddPluginRequestBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            plugin: string;
        };
        AddPluginResponseBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            company_plugin: components["schemas"]["CompanyPlugins"];
        };
        AppConfigStruct: {
            plugins: components["schemas"]["PluginApp"][];
        };
        CompaniesResponsePaginationResultListItemGroupBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            pagination_result: components["schemas"]["PaginationResultListItemGroup"];
        };
        Company: {
            CompanyPlugins: components["schemas"]["CompanyPlugins"][];
            /** Format: date-time */
            CreatedAt: string;
            DeletedAt: components["schemas"]["DeletedAt"];
            /** Format: int64 */
            ID: number;
            IsParent: boolean;
            ItemGroups: components["schemas"]["ItemGroup"][];
            Name: string;
            Parent: components["schemas"]["Company"];
            /** Format: int64 */
            ParentID: number | null;
            /** Format: date-time */
            UpdatedAt: string;
            Users: components["schemas"]["User"][];
            Uuid: string;
        };
        CompanyPlugins: {
            /** Format: int64 */
            CompanyID: number;
            Credentials: string;
            Plugin: string;
        };
        DeletedAt: {
            /** Format: date-time */
            Time: string;
            Valid: boolean;
        };
        ErrorDetail: {
            /** @description Where the error occurred, e.g. 'body.items[3].tags' or 'path.thing-id' */
            location?: string;
            /** @description Error message text */
            message?: string;
            /** @description The value at the given location */
            value?: unknown;
        };
        ErrorModel: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            /** @description A human-readable explanation specific to this occurrence of the problem. */
            detail?: string;
            /** @description Optional list of individual error details */
            errors?: components["schemas"]["ErrorDetail"][];
            /**
             * Format: uri
             * @description A URI reference that identifies the specific occurrence of the problem.
             */
            instance?: string;
            /**
             * Format: int64
             * @description HTTP status code
             */
            status?: number;
            /** @description A short, human-readable summary of the problem type. This value should not change between occurrences of the error. */
            title?: string;
            /**
             * Format: uri
             * @description A URI reference to human-readable documentation for the error.
             * @default about:blank
             */
            type: string;
        };
        GreetingOutputBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            /** @description Greeting message */
            message: string;
        };
        ItemGroup: {
            /** Format: date-time */
            CreatedAt: string;
            DeletedAt: components["schemas"]["DeletedAt"];
            /** Format: int64 */
            ID: number;
            IsParent: boolean;
            Name: string;
            Parent: components["schemas"]["ItemGroup"];
            /** Format: int64 */
            ParentID: number | null;
            /** Format: date-time */
            UpdatedAt: string;
            Uuid: string;
        };
        NullTime: {
            /** Format: date-time */
            Time: string;
            Valid: boolean;
        };
        PaginationResponsePaginationResultListCompanyBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            pagination_result: components["schemas"]["PaginationResultListCompany"];
        };
        PaginationResultListCompany: {
            results: components["schemas"]["Company"][];
            /** Format: int64 */
            total: number;
        };
        PaginationResultListItemGroup: {
            results: components["schemas"]["ItemGroup"][];
            /** Format: int64 */
            total: number;
        };
        PluginApp: {
            Name: string;
        };
        PluginDetailResponseBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            company_plugin: components["schemas"]["CompanyPlugins"];
        };
        PluginsResponseBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            plugins: components["schemas"]["PluginApp"][];
        };
        ResponseMessageBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            errors: {
                [key: string]: string | undefined;
            };
            message: string;
        };
        SignInRequestBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            /** @description Email of the user */
            email: string;
            /** @description Password of the user */
            password: string;
        };
        SignInResponseBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            /** @description Access token of the user */
            access_token: string;
        };
        UpdateCredentialsPluginRequestBody: {
            /**
             * Format: uri
             * @description A URL to the JSON Schema for this object.
             */
            readonly $schema?: string;
            credentials: string;
        };
        User: {
            Companies: components["schemas"]["Company"][];
            /** Format: date-time */
            CreatedAt: string;
            DeletedAt: components["schemas"]["DeletedAt"];
            /** Format: int64 */
            ID: number;
            Identifier: string;
            LastLogin: components["schemas"]["NullTime"];
            /** Format: int64 */
            RoleID: number;
            /** Format: date-time */
            UpdatedAt: string;
            Uuid: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "get-account": {
        parameters: {
            query?: never;
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponseBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "sign-in": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SignInRequestBody"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SignInResponseBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    companies: {
        parameters: {
            query: {
                page: string;
                size: string;
                query?: string;
            };
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PaginationResponsePaginationResultListCompanyBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "get-greeting-by-name": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /**
                 * @description Name to greet
                 * @example world
                 */
                name: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GreetingOutputBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    plugins: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PluginsResponseBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "add-plugin": {
        parameters: {
            query?: never;
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AddPluginRequestBody"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AddPluginResponseBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "get-plugin": {
        parameters: {
            query?: never;
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path: {
                plugin: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PluginDetailResponseBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "update-plugin-credentials": {
        parameters: {
            query?: never;
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path: {
                plugin: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCredentialsPluginRequestBody"];
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResponseMessageBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
    "item-group": {
        parameters: {
            query: {
                page: string;
                size: string;
                query?: string;
            };
            header?: {
                Authorization?: string;
                "Active-Company"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CompaniesResponsePaginationResultListItemGroupBody"];
                };
            };
            /** @description Error */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["ErrorModel"];
                };
            };
        };
    };
}
