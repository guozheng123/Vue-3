export type MessageTemplate = {
    templateTitle: string;
    templateCode: string;
    languageCode: string;
    objectCode?: string;
    templateNo?: number;
    templateInfo: string;
    enable: string;
};

export type querylist = {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    templateTitle: string;
    totalPageValue: number;
};

export type viewquerylist = {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: boolean;
    templateName: string;
    queryTimeStart: string;
    queryTimeEnd: string;
};

export type AllMessages = {
    total: number;
    page: number;
    pageSize: number;
    totalPage: number;
    list: List[];
};

interface List {
    sendDetailNo: number; // 消息发送详单号
    isRead: string; //是否已读
    sendInfo: string; //实际发送消息
    createDateTime: string; //创建时间
}

export type MessageLog = {
    page: number;
    pageSize: number;
    sortedField: string;
    sortByAsc: boolean;
    eventNo: string;
};

export type MessageConfiguration = {
    msgConfNo: string;
    objectCode: string;
    noticeCondition: string;
    noticeStatus: string;
    noticeChannel: string[];
    noticeCreate: string;
    noticeRole: number[];
    noticeUsers: number[];
    templateNo: number;
    enable: string;
};

export type addConfiguration = {
    objectCode: string;
    noticeCondition: string;
    noticeStatus: string;
    noticeChannel: string[];
    noticeCreate: string;
    noticeRole: number[];
    noticeUsers: number[];
    templateNo: number;
    enable: string;
};
