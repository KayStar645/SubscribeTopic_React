import { FaImage } from 'react-icons/fa6';
import { FaFileWord } from 'react-icons/fa6';
import { FaFileExcel } from 'react-icons/fa6';
import { FaFilePowerpoint } from 'react-icons/fa6';
import { FaFileArchive } from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa';
import { FaFileLines } from 'react-icons/fa6';

const IMAGE_MIME_TYPE: any = {
    'image/jpeg': <FaImage />,
    'image/png': <FaImage />,
    'image/gif': <FaImage />,
    'image/webp': <FaImage />,
    'image/jpg': <FaImage />,
};

const DOCUMENT_MIME_TYPE: any = {
    'application/vnd.ms-excel': <FaFileExcel />,
    '.xls': <FaFileExcel />,
    '.pptx': <FaFilePowerpoint />,
    '.ppt': <FaFilePowerpoint />,
    'application/msword': <FaFileWord />,
    '.doc': <FaFileWord />,
    '.pdf': <FaFilePdf />,
    'text/plain': <FaFileLines />,
};

const COMPRESSED_MIME_TYPE: any = {
    '.zip': <FaFileArchive />,
    'application/rar': <FaFileArchive />,
    '.tar': <FaFileArchive />,
    '.gz': <FaFileArchive />,
    '.7z': <FaFileArchive />,
};

const MIME_TYPES: any = {
    ...IMAGE_MIME_TYPE,
    ...DOCUMENT_MIME_TYPE,
    ...COMPRESSED_MIME_TYPE,
};

export { IMAGE_MIME_TYPE, DOCUMENT_MIME_TYPE, COMPRESSED_MIME_TYPE, MIME_TYPES };
