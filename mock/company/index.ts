import responseMock from '../responseMock';

export default [
    {
        url: '/api/company/getCompanyList',
        method: 'get',
        response: () =>
            responseMock({
                'list|4-10': [
                    {
                        customerSupplierId: /\d{1,5}/,
                        customerSupplierCode: /\S{1,5}/,
                        customerSupplierName: /\S{1,5}/
                    }
                ]
            })
    },
    {
        url: '/api/group/getGroupList',
        method: 'get',
        response: () =>
            responseMock({
                'list|4-10': [
                    {
                        groupId: /\d{1,5}/,
                        groupCode: /\S{1,5}/,
                        groupName: /\S{1,5}/,
                        status: '1',
                        createDatetime: '@datetime',
                        modifyDatetime: '@datetime'
                    }
                ]
            })
    },
    {
        url: '/api/group/createGroup',
        method: 'post',
        response: () =>
            responseMock({
                object: {
                    success: true
                }
            })
    },
    {
        url: '/api/group/updateGroup',
        method: 'put',
        response: () =>
            responseMock({
                object: {
                    success: true
                }
            })
    },
    {
        url: '/api/group/deleteGroup',
        method: 'delete',
        response: () =>
            responseMock({
                object: {
                    success: true
                }
            })
    },
    {
        url: '/api/group/checkGroupNameUnique',
        method: 'post',
        response: () =>
            responseMock({
                object: {
                    success: true
                }
            })
    },
    {
        url: '/api/demo/useMock1',
        method: 'get',
        response: () =>
            responseMock({
                'list|2-5': [
                    {
                        text: /\S{5,10}/,
                        id: '@id()',
                        siteCode: /\d{5,10}/,
                        color: '@hex'
                    }
                ]
            })
    },
    {
        url: '/api/company/getGroupCompanyTreeList',
        method: 'get',
        response: () =>
            responseMock({
                'list|2-4': [
                    {
                        rootId: /\S{5,10}/,
                        rootName: '@id()',
                        'branchTree|3-6': [
                            {
                                rootId: /\S{5,10}/,
                                rootName: '@id()'
                            }
                        ]
                    }
                ]
            })
    }
];
