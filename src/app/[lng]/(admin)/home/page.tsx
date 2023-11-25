import { InputFile } from '@resources/components/form';

const HomePage = () => {
    return (
        <div>
            <InputFile multiple={true} folderName='test' id='form_image' />
        </div>
    );
};

export default HomePage;
