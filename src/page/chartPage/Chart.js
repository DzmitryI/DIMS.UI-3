import React, { Component } from 'react';
import { connect } from 'react-redux';
import Backdrop from '../../components/UI/backdrop';
import { statusThePageChart } from '../../redux/actions/statusThePage';
import { LineChart, AreaChart, Line, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { updateMemberChart, getDateToComporation } from '../../components/helpersComponents';
import Spinner from '../../components/spinner';
import Radio from '../../components/UI/radio';

import './chart.scss';

class Chart extends Component {
  state = {
    memberProgresses: [],
    data: [],
    loading: true,
    allMemberTasks: [],
    chart: 'lineChart',
  };

  async componentDidUpdate(prevProps) {
    const { userId, isChartOpen } = this.props;
    const arrDatas = [];
    if (isChartOpen !== prevProps.isChartOpen && isChartOpen) {
      this.setState({ loading: true, data: [] });
      try {
        const [memberProgresses, arrDates, allMemberTasks] = await updateMemberChart(userId);
        while (arrDates.startDate.toISOString().slice(0, 10) <= arrDates.deadlineDate.toISOString().slice(0, 10)) {
          const result = memberProgresses.filter(
            (memberProgress) =>
              getDateToComporation(new Date(memberProgress.trackDate)) === getDateToComporation(arrDates.startDate),
          );
          const poin = {};
          if (result.length) {
            for (let value of result) {
              poin[value.name] = +value.trackProgress;
            }
            arrDatas.push({
              name: `${arrDates.startDate.getDate()}/${arrDates.startDate.getMonth()}`,
              ...poin,
            });
          }
          arrDates.startDate.setDate(arrDates.startDate.getDate() + 1);
        }
        this.setState({ data: arrDatas, allMemberTasks: Array.from(allMemberTasks), loading: false });
      } catch ({ message }) {}
    }
  }

  handleRadioClick = ({ target: { value } }) => {
    this.setState({ chart: value });
  };

  render() {
    const { isChartOpen, statusThePageChart } = this.props;
    const { data, allMemberTasks, loading, chart } = this.state;
    return (
      <>
        <div className={`page-wrap chart ${isChartOpen ? '' : 'close'}`}>
          <h1 className='title'>Detail chart</h1>
          <form className='page-form'>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className='icon-close' onClick={statusThePageChart}>
                  &#10006;
                </div>
                <>
                  <Radio
                    key='lineChart'
                    value='lineChart'
                    checked={chart === 'lineChart'}
                    onClick={this.handleRadioClick}
                    label='line chart'
                  />
                  <Radio
                    key='areaChart'
                    value='areaChart'
                    checked={chart !== 'lineChart'}
                    onClick={this.handleRadioClick}
                    label='area chart'
                  />
                </>
                {chart === 'lineChart' ? (
                  <LineChart width={430} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
                  <AreaChart width={430} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
          </form>
        </div>
        {isChartOpen && <Backdrop className='backdrop-chart' />}
      </>
    );
  }
}

const mapStateToProps = ({ statusThePage: { isChartOpen } }) => {
  return {
    isChartOpen,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { statusThePageChart: () => dispatch(statusThePageChart()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chart);
