export interface ReqAddGuidebook {
    guidebookBaseInfo: GuidebookBaseInfo;
    guidebookMaterials: GuidebookMateriel[];
    guidebookInstructions: GuidebookInstruction[];
    guidebookChecklists: GuidebookChecklist[];
    guidebookFiles: any[];
}

export interface GuidebookFile {
    id: number;
    guidebookId: number;
    fileCode: number;
    fileName: string;
    [k]: any;
}

export interface GuidebookChecklist {
    guidebookChecklistId: number;
    guidebookId: number;
    item: string;
    content: string;
    attention: string;
}

export interface GuidebookInstruction {
    guidebookInstructionId: number;
    guidebookId: number;
    content: string;
    requirement: string;
    attention: string;
}

export interface GuidebookMateriel {
    guidebookMaterielId: number;
    guidebookId: number;
    tenantId: number;
    materielCode: string;
    materialName: string;
    materialTypeName: string;
    materialUnitName: string;
    figureNum: string;
    materialSpec: string;
}

interface GuidebookBaseInfo {
    guidebookId: number;
    guidebookCode: string;
    guidebookName: string;
    version: number;
    versionName: string;
    operationCode: string;
    operationName: string;
    releaseFlag: string;
    defaultFlag: string;
    enable: string;
    remark: string;
}
