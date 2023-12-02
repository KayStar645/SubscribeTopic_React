import { FaImage } from 'react-icons/fa6';
import { FaFileWord } from 'react-icons/fa6';
import { FaFileExcel } from 'react-icons/fa6';
import { FaFilePowerpoint } from 'react-icons/fa6';
import { FaFileArchive } from 'react-icons/fa';
import { FaFilePdf } from 'react-icons/fa';

const IMAGE_MIME_TYPE: any = {
    '.jpeg': <FaImage />,
    '.jpg': <FaImage />,
    '.png': <FaImage />,
    '.gif': <FaImage />,
    '.webp': <FaImage />,
    '.avif': <FaImage />,
};

const DOCUMENT_MIME_TYPE: any = {
    '.xlsx': <FaFileExcel />,
    '.xls': <FaFileExcel />,
    '.pptx': <FaFilePowerpoint />,
    '.ppt': <FaFilePowerpoint />,
    '.docx': <FaFileWord />,
    '.doc': <FaFileWord />,
    '.pdf': <FaFilePdf />,
};

const COMPRESSED_MIME_TYPE: any = {
    '.zip': <FaFileArchive />,
    '.rar': <FaFileArchive />,
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
