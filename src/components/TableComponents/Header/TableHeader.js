import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './TableHeader.scss';

const header = (props) => {
	return (
		// <header>
		// {/* <h1>Income Table</h1> */}
		<thead className='Table-Header'>
			<tr>
				<th onClick={() => props.sort('id')}>
					<span>ID</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
				<th onClick={() => props.sort('name')}>
					<span>Name</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
				<th onClick={() => props.sort('city')}>
					<span>City</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
				<th onClick={() => props.sort('totalIncome')}>
					<span>Total Income</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
				<th onClick={() => props.sort('averageIncome')}>
					<span>Average Income</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
				<th onClick={() => props.sort('lastIncome')}>
					<span>Last Month Income</span>
					<FontAwesomeIcon icon={props.ascending ? faSortDown : faSortUp} className='Sort' />
				</th>
			</tr>
		</thead>
		// </header>
	);
};

export default header;
