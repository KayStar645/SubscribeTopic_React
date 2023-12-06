import { FileType } from '@assets/types/form';

const FileExtension = ({ file }: { file: FileType }) => {
    return <div>{file.type}</div>;
};

export default FileExtension;
