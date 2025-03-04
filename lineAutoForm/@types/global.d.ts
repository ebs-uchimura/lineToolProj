export { };

declare global {
    // cache arguments
    interface cacheargs {
        message: string;
    }

    // select arguments
    interface selectargs {
        table: string;
        columns: string[];
        values: any[];
        limit?: any;
        offset?: any;
        spancol?: any;
        span?: any;
        order?: any;
        reverse?: boolean;
        fields?: string[];
    }

    // join arguments
    interface joinargs {
        table: string;
        columns: string[];
        values: any[];
        jointable: string;
        joincolumns: string[];
        joinvalues: any[];
        joinid1: string;
        joinid2: string;
        limit?: any;
        offset?: any;
        spantable?: any;
        spancol?: any;
        span?: any;
        order?: any;
        ordertable?: any;
        reverse?: boolean;
        fields?: string[];
    }

    // update arguments
    interface updateargs {
        table: string;
        setcol: string[];
        setval: any;
        selcol: string[];
        selval: any;
    }

    // insert arguments
    interface insertargs {
        table: string;
        columns: string[];
        values: any[];
    }

    // db result
    interface resultobj {
        total: number;
        result: any;
    }
}