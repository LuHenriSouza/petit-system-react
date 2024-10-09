export interface IBodyOutflow {
    type: string;
    value: number;
    desc?: string | null;
    supplier_id?: number | null;
}

interface IBodyDelete {
    type: 'delete';
    content: {
        outflow_id: number;
    };
}

interface IBodyUpdate {
    type: 'update';
    content: {
        outflow_id: number;
        body: IBodyOutflow;
    };
}

interface IBodyAdd {
    type: 'add';
    content: {
        fincash_id: number;
        body: IBodyOutflow;
    };
}

export type TEditBodyProps = IBodyDelete | IBodyUpdate | IBodyAdd;
