import React, { Component } from 'react';
import { connect } from 'react-redux';
import Backdrop from '../../components/UI/backdrop';
import { statusThePageChart } from '../../redux/actions/statusThePage';
import { LineChart, AreaChart, Line, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { updateDataMemberChart, getAllPointsForPeriod } from '../../components/helpersComponents';
import Spinner from '../../components/spinner';
import Radio from '../../components/UI/radio';
import ErrorIndicator from '../../components/errorIndicator';

import './chartPage.scss';

class Chart extends Component {
  state = {
    memberProgresses: [],
    data: [],
    loading: true,
    allMemberTasks: [],
    chart: 'lineChart',
    error: false,
    errorMessage: '',
  };

  async componentDidUpdate(prevProps) {
    const { userId, isChartOpen } = this.props;
    if (isChartOpen !== prevProps.isChartOpen && isChartOpen) {
      this.setState({ loading: true, data: [] });
      try {
        const [memberProgresses, arrDates, allMemberTasks] = await updateDataMemberChart(userId);
        const data = getAllPointsForPeriod(arrDates, memberProgresses);
        this.setState({ data, allMemberTasks, loading: false });
      } catch ({ message }) {
        this.setState({ loading: false, error: true, errorMessage: message });
      }
    }
  }

  handleRadioClick = ({ target: { value } }) => {
    this.setState({ chart: value });
  };

  render() {
    const { isChartOpen, statusThePageChart } = this.props;
    const { data, allMemberTasks, loading, chart, error, errorMessage } = this.state;
    const isLineChart = chart === 'lineChart';
    return (
      <>
        <div className={`page-wrap chart ${isChartOpen ? '' : 'close'}`}>
          <h1 className='title'>Detail chart</h1>
          <form className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                {error ? (
                  <ErrorIndicator errorMessage={errorMessage} />
                ) : (
                  <>
                    <div className='icon-close' onClick={statusThePageChart}>
                      &#10006;
                    </div>
                    <>
                      <Radio
                        key='lineChart'
                        value='lineChart'
                        checked={isLineChart}
                        onClick={this.handleRadioClick}
                        label='line chart'
                      />
                      <Radio
                        key='areaChart'
                        value='areaChart'
                        checked={!isLineChart}
                        onClick={this.handleRadioClick}
                        label='area chart'
                      />
                    </>
                    {chart === 'lineChart' ? (
                      <LineChart
                        width={430}
                        height={300}
                        data={data}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        {allMemberTasks.map((track, index) => {
                          return <Line key={index} type='monotone' dataKey={track} stroke='#82ca9d' />;
                        })}
                        <CartesianGrid stroke='#ccc' strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                      </LineChart>
                    ) : (
                      <AreaChart
                        width={430}
                        height={300}
                        data={data}
                        margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                      >
                        {allMemberTasks.map((track, index) => {
                          return <Area key={index} type='monotone' dataKey={track} stroke='#82ca9d' fill='#8884d8' />;
                        })}
                        <CartesianGrid stroke='#ccc' strokeDasharray='3 3' />
                        <XAxis dataKey='name' />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                      </AreaChart>
                    )}
                  </>
                )}
              </>
            )}
          </form>
        </div>
        {isChartOpen && <Backdrop className='backdrop-chart' />}
      </>
    );
  }
}

const mapStateToProps = ({ statusThePage: { isChartOpen } }) => ({
  isChartOpen,
});

const mapDispatchToProps = (dispatch) => {
  return { statusThePageChart: () => dispatch(statusThePageChart()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
