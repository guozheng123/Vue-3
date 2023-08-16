declare namespace API {
    // 企业信息
    interface enterpriseInfoType {
        enterpriseId: string;
        serialNo: string;
        enterpriseName: string;
        enterpriseEngName: string;
        logoImg: string;
        licenseNum: string;
        emailAddress: string;
        fax: string;
        enterpriseNature: string;
        employeeNum: string;
        factorySize: string;
        annualProductionValue: string;
        annualProcurement: string;
        foundTimeY: string;
        industryType: string;
        hasIEPower: string;
        introduction: string;
        manufacturingCapacity: string;
        phoneNumber: string;
        tel: string;
        refuseInfo: string;
        renzheng: string;
        province: string;
        city: string;
        district: string;
        productKey: string;
        deviceKey: string;
        agentId: string;
        tpfLogo: string;
        tpfPadLogo: string;
        organizationCode: string;
        legalRepresentative: string;
        applyPhoneNumber: string;
        applyTelNum: string;
        applyNum: string;
        technology: string;
        enterpriseFiles: string;
        enterpriseAddress: string;
        enterpriseSpecialAppInfo: string;
    }

    // 用户信息
    interface IUserBeanType {
        code: string;
        userId: string;
        ucenterId: string;
        userType: string;
        enterpriseLevel: string;
        enterpriseInfo: enterpriseInfoType;
        accountName: string;
        headImg: string;
        headSourceImg: string;
        realName: string;
        sex: string;
        city: string;
        company: string;
        phoneNumber: string;
        emailAddress: string;
        isApprove: string;
        hasFa: string;
        hasEfeibiao: string;
        hasTmgc: string;
        hasSbbjy: string;
    }
    // 获取token
    interface ItokenType {
        Authorization: string;
    }
}
