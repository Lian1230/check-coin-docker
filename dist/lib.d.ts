export declare const limit: {
    ETH: {
        low: any;
        high: any;
    };
    LTC: {
        low: any;
        high: any;
    };
};
export declare const getPrice: () => Promise<any>;
export declare const formatData: (data: any) => {
    raw: any;
};
export declare const checkLimit: (data: any) => any[];
export declare const sendAlert: (data: any, reached: any) => void;
export declare const setLimit: (newLimit: any) => any;
export declare const formatQuery: (query: any) => {};
