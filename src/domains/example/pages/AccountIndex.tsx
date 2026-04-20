import React, { useEffect } from 'react';

interface IAccountIndexProps {
	test?: string;
}

export default function AccountIndex({}: IAccountIndexProps): React.ReactNode {
	// useEffect hooks
	useEffect(() => {
		// ...
	}, []);

	return (
		<>
			<div>계좌 메인 Page!!</div>
			<button onClick={() => $router.push('/')}>메인 페이지로 이동</button>
		</>
	);
}
