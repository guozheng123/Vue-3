
import Mock from 'mockjs';

const responseMock = (data: any) => {
    return Mock.mock({
        data,
        success: true,
        errorCode: '200',
        errorMessage: '',
        timeStamp: '@date()'
    })
}

export default responseMock


