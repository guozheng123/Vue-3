export interface ResGetBomInfoRevisionHistory {
    bomId: number;
    fromBomId: any;
    bomVersion: string;
    remark: any;
    createUser: number;
    createUserName: any;
    createDatetime: string;
    modifyUser: any;
    modifyUserName: any;
    modifyDatetime: any;
    bomInfoRevisionHistoryDetailVos: BomInfoRevisionHistoryDetailVo[];
    result: any;
}
interface BomInfoRevisionHistoryDetailVo {
    materialCode: string;
    materialName: string;
    materialUnitCode: any;
    materialUnitName: string;
    remark: any;
    num: number;
    oldNum: any;
}
