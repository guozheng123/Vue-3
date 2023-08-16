// 上传，获取file文件
export const useUpload = (options?: any): Promise<FileList> => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', options?.accept || '*');
    input.style.display = 'none';
    document.body.appendChild(input);
    return new Promise((resolve, reject) => {
        input.click();
        const fileChange = (e: any) => {
            const { files } = e.target;
            const nums = files[0].name.lastIndexOf('.');
            const type = files[0].name.slice(-nums);
            input.parentNode?.removeChild(input);
            const [{ size }] = files;
            resolve(files);
        };
        input.onchange = fileChange;
    });
};
