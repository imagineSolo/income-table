import React from 'react';

import './styles.scss';
import Header from './components/Header/Header';
import Table from './containers/Table/Table';
import Footer from './components/Footer/Footer';

const app = () => {
	return (
		<div className='App'>
			<Header />
			<Table />
			<Footer />
		</div>
	);
};

export default app;
