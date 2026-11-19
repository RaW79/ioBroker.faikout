
    export type RemoteKeys = 'REMOTE_ALIAS_IDENTIFIER/customComponents';
    type PackageType<T> = T extends 'REMOTE_ALIAS_IDENTIFIER/customComponents' ? typeof import('REMOTE_ALIAS_IDENTIFIER/customComponents') :any;