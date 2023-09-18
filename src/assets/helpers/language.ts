import _ from 'lodash';

const addPrefixLanguage = (lng: string, pathName: string | undefined): string => {
	return `/${lng}${pathName}`;
};

const getRealPathName = (pathName: string): string => {
	return '/' + _.drop(_.split(pathName, '/'), 2).join('/');
};

const createNewPath = (language: string, pathName: string) => {
	return `/${language}${getRealPathName(pathName)}`;
};

const getChildPath = (pathName: string, item: string) => {
	const realPath = getRealPathName(pathName);
	const pathItems = _.split(realPath, '/');
	const pathIndex = _.indexOf(pathItems, item);

	return _.slice(pathItems, 0, pathIndex + 1).join('/');
};

export { addPrefixLanguage, getRealPathName, createNewPath, getChildPath };
