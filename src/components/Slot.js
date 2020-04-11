import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { akAlert } from './Common/AKAlertConfirm';
import Projects from '../lib/models/Projects';
import { getHumanTime } from '../lib/utils/dateUtils';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { connect } from 'react-redux';
import Job from '../lib/models/job';
import { akToast } from './Common/AkToast';

class Slot extends PureComponent {
  static propTypes = {
    team_id: PropTypes.string.isRequired,
    project_id: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onSlotSaved: PropTypes.func.isRequired,
    date: PropTypes.string,
    job: PropTypes.object.isRequired
  };

  state = {
    time: 0,
    note: ''
  };

  today = new Date();

  render() {
    const { time } = this.state;
    const { date, project_id } = this.props;
    const { job } = this.props;
    const _date = date ? new Date(date) : this.today;
    const time_as_str = getHumanTime(time);
    return (
      <div className="slot-form-wrapper p-2">
        <div className="mb-3">
          <button className="btn btn-success" onClick={this.toggleJob}>
            {job.job && job.job.project_id === project_id ? 'STOP JOB' : 'START JOB'}
          </button>
        </div>
        <hr />
        <div className="time-date text-center mb-3">
          <DatePicker
            todayButton={<span>TODAY</span>}
            dateFormat="dd-MM-yyyy"
            selected={_date}
            onChange={this.setSlotDate}
            maxDate={this.today}
          />
        </div>
        <div className="time-btns">
          <button className="btn btn-info" onClick={() => this.addTime(15)}>
            15'
          </button>
          <button className="btn btn-info" onClick={() => this.addTime(30)}>
            30'
          </button>
          <button className="btn btn-info" onClick={() => this.addTime(60)}>
            1h
          </button>
          <button className="btn btn-info" onClick={() => this.addTime(240)}>
            4h
          </button>
          <button className="btn btn-info" onClick={() => this.addTime(480)}>
            8h
          </button>
        </div>
        {time > 0 && (
          <div className="">
            {time_as_str}
            <button className="btn btn-sm btn-link" onClick={() => this.setState({ time: 0 })}>
              Clear
            </button>
          </div>
        )}
        {time === 0 && (
          <div>
            <p>&nbsp;</p>
          </div>
        )}
        <div className="my-3">
          <textarea
            className="form-control"
            value={this.state.note}
            onChange={e => this.setState({ note: e.target.value })}
          />
        </div>
        <button className="btn btn-info" disabled={time === 0} onClick={this.registerSlot}>
          SAVE
        </button>
      </div>
    );
  }

  setSlotDate = date => {
    this.props.onDateChange(date);
  };

  addTime = min => {
    const time = this.state.time + min;
    if (time > 1440) {
      akAlert("Can't add more than 24h...", () => {});
      return;
    }
    this.setState({ time });
  };

  registerSlot = () => {
    const { time, note } = this.state;
    const { team_id, project_id } = this.props;
    Projects.registerSlot(team_id, project_id, {
      time,
      note,
      date: this.props.date
    })
      .then(() => {
        this.setState({ time: 0, note: '' }, this.props.onSlotSaved);
      })
      .catch(e => {
        akAlert('Enable to save slot: ' + e.message, () => {});
      });
  };

  toggleJob = async () => {
    const { job, project_id } = this.props;

    try {
      if (job.job && job.job.project_id === project_id) {
        await Job.stopJob();
      } else {
        await Job.startJob(project_id);
      }
    } catch (e) {
      akToast('Failed to change job status: ' + e.message);
    }
  };
}

function mapStateToProps(state) {
  const { job } = state;

  return {
    job
  };
}

export default connect(mapStateToProps)(Slot);
