import { PageProps } from '@assets/types/common';

const AuthLayout = ({ children, params: { lng } }: PageProps) => {
	return (
		<body>
			<div>{children}</div>;
		</body>
	);
};

export default AuthLayout;
