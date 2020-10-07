import React, { Component } from 'react';
import axios from 'axios';

import '../../styles.scss';
import TableHeader from '../../components/TableComponents/Header/TableHeader';
import Pagination from '../../components/TableComponents/Pagination/Pagination';
import Spinner from '../../components/TableComponents/Spinner/Spinner';

const headers = [
	'id',
	'name',
	'city',
	'totalIncome',
	'averageIncome',
	'lastIncome',
];

class Table extends Component {
	state = {
		companies: [],
		filteredCompanies: [],
		isAscending: true,
		currentPage: 1,
		resultsPerPage: 30,
		pageOfItems: [],
		loading: true,
	};

	componentDidMount() {
		this.getCompanies();
	}

	// Fetch the companies
	getCompanies = () => {
		axios
			.get('https://recruitment.hal.skygate.io/companies')
			.then((response) => this.getIncomes(response.data))
			.catch((error) => console.log(error));
	};

	// Fetch the incomes
	getIncomes = (companies) => {
		const incomes = [];

		companies.forEach((company) => {
			axios
				.get(`https://recruitment.hal.skygate.io/incomes/${company.id}`)
				.then((response) => incomes.push(response.data))
				.then(() => {
					this.mergeData(companies, incomes);
				})
				.then(() => {
					this.setState({ loading: false });
				})
				.catch((error) => console.log(error));
		});
	};

	// Display the income value for company's last month.
	showLastMonthIncome = (income) => {
		const lastDate = new Date(
			Math.max.apply(
				null,
				income.map((income) => {
					return new Date(income.date);
				})
			)
		);

		const lastMonth = lastDate.getMonth();
		const lastYear = lastDate.getFullYear();

		const lastMonthTotal = income
			.filter((inc) => {
				const val = new Date(inc.date);
				const currentMonth = val.getMonth();
				const currentYear = val.getFullYear();

				return lastMonth === currentMonth && lastYear === currentYear;
			})
			.reduce((total, current) => total + parseInt(current.value), 10);

		return lastMonthTotal;
	};

	// Merging together data from 2 API's and converting the income values
	mergeData = (companies, incomes) => {
		const mergedData = [];
		// Helper functions
		function value(item) {
			const str = item.value;
			const num = parseFloat(str);
			return num;
		}
		function sum(prev, next) {
			return prev + next;
		}

		companies.forEach((company) => {
			incomes.forEach((income) => {
				if (company.id === income.id) {
					const { incomes } = income;

					const totalIncome = {
						totalIncome: incomes.map(value).reduce(sum),
					};
					const averageIncome = {
						averageIncome: incomes.length
							? incomes.map(value).reduce(sum) / incomes.length
							: null,
					};
					const lastIncome = {
						lastIncome: this.showLastMonthIncome(incomes),
					};

					const allIncomes = {
						...totalIncome,
						...averageIncome,
						...lastIncome,
					};
					const companies = { ...company, ...allIncomes };
					mergedData.push(companies);
				}
			});
		});
		this.setState({
			companies: mergedData,
			filteredCompanies: mergedData,
		});
	};

	// Sorting results ascending/descending for each column
	sortData = (key) => {
		const data = this.state.filteredCompanies.map((company) => ({
			...company,
		}));

		const isAscending = this.state.isAscending;

		data.sort((a, b) => {
			const check = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0;
			return isAscending ? check : -check;
		});

		this.setState({
			filteredCompanies: data,
			isAscending: !isAscending,
		});
	};

	// Filtering results in each column by their content
	filterData = (e, key) => {
		const companies = this.state.companies.map((company) => ({
			...company,
		}));

		const filterCompanies = companies.filter((item) =>
			JSON.stringify(item[key])
				.toLowerCase()
				.includes(e.target.value.toLowerCase())
		);
		this.setState({ filteredCompanies: filterCompanies });
	};

	// Updatng state with new page of items
	onChangePage = (pageOfItems) => {
		this.setState({ pageOfItems });
	};

	render() {
		const { filteredCompanies, isAscending, loading } = this.state;

		//Rendering search inputs
		const mappedSearchInput = headers.map((header) => (
			<td key={header} className='SearchData'>
				<input
					type='search'
					className='Search'
					onChange={(e) => this.filterData(e, header)}
				/>
			</td>
		));

		return (
			<>
				{!loading ? (
					<main>
						<table className='Table'>
							<TableHeader ascending={isAscending} sort={this.sortData} />
							<tbody className='Results'>
								<tr>{mappedSearchInput}</tr>
								{this.state.pageOfItems.map((item) => (
									<tr key={item.id}>
										<td>{item.id}</td>
										<td>{item.name}</td>
										<td>{item.city}</td>
										<td>{item.totalIncome.toFixed(2)}</td>
										<td>{item.averageIncome.toFixed(2)}</td>
										<td>{item.lastIncome}</td>
									</tr>
								))}
							</tbody>
						</table>
					</main>
				) : (
					<Spinner />
				)}
				{/* <ul className='Pages'>{mappedPageNumbers}</ul> */}
				<Pagination
					items={filteredCompanies}
					onChangePage={this.onChangePage}
				/>
			</>
		);
	}
}

export default Table;
