import { InputFile } from '@resources/components/form';
import { useContext } from 'react';
import { ExercisePageContext } from './[id]/page';

const FileInstructions = () => {
    const { id, edit, setValue, getValues } = useContext(ExercisePageContext);

    return (
        <div className='flex flex-column gap-4'>
            <div className='p-4 bg-white shadow-2 border-round'>
                <div className='flex align-items-center gap-2 mb-3'>
                    <p className='text-xl font-semibold flex-1'>Tài liệu đi kèm</p>
                </div>

                <InputFile
                    id='form_data_files'
                    folder='test_cua_son_2/'
                    fileClassName='col-12'
                    value={getValues?.('files')}
                    disabled={id > 0 && !edit}
                    multiple={true}
                    hasDefault={false}
                    onChange={({ files }) => {
                        if (files) {
                            setValue?.('files', files);
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default FileInstructions;
