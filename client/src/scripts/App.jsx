import React, { Component } from 'react'
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select } from 'd3-selection'

import axios from 'axios'

class BarChart extends Component {
	constructor(props) {
		super(props)
		this.state = { data: [], size: [500, 500] }
		this.createBarChart = this.createBarChart.bind(this)
	}
	componentDidMount() {
		this.createBarChart()
		this.setState({ data: this.props.data })
		this.setState({ size: this.props.size })
	}
	componentDidUpdate() {
		this.createBarChart()
	}
	createBarChart() {
		const node = this.node
		const dataMax = max(this.state.data)
		const yScale = scaleLinear()
			.domain([0, dataMax])
			.range([0, this.state.size[1]])
		select(node)
			.selectAll('rect')
			.data(this.state.data)
			.enter()
			.append('rect')

		select(node).selectAll('rect').data(this.state.data).exit().remove()

		select(node)
			.selectAll('rect')
			.data(this.state.data)
			.style('fill', '#fe9922')
			.attr('x', (d, i) => i * 25)
			.attr('y', (d) => this.state.size[1] - yScale(d))
			.attr('height', (d) => yScale(d))
			.attr('width', 25)
	}
	render() {
		return (
			<svg
				ref={(node) => (this.node = node)}
				width={500}
				height={500}
			></svg>
		)
	}
}

class App extends Component {
	state = { data: [], quote: 'infy', input: '' }
	async componentDidMount() {
		setInterval(async () => {
			let quote = await axios.get(
				'http://localhost:5000/get_quote?quote=' + this.state.quote
			)

			let data = this.state.data
			this.setState({ data: data })
			data.push(quote.data.lastPrice)
		}, 2000)
	}
	render() {
		return (
			<div className='App'>
				<h2>NSE dashboard</h2>
				<div>
					<BarChart data={this.state.data} size={[1000, 1000]} />
				</div>
				<br />
				<div>
					<input
						type='text'
						value={this.state.quote}
						onChange={(e) => {
							this.setState({ input: [e.target.value] })
						}}
					/>
					<input
						type='submit'
						value='submit'
						onSubmit={() => {
							let input = this.state.input
							this.setState({ quote: input })
						}}
					/>
					<br />
					{/* {this.state.quote} */}
				</div>
			</div>
		)
	}
}

export default App
