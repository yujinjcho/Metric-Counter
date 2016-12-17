import React from 'react';
import $ from 'jquery';

const fields = ['name', 'count', 'days', 'dailyAverage', 'progress', 'projectedDaysLeft'];

export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  componentDidMount() {
    $.get('/api/leaderboard', ({ users }) => {
      this.setState({ users })
    });
  }

  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <table>
          {this._renderHeading()}
          {this._renderBody()}
        </table>
      </div>
    );
  }

  _renderHeading() {
    return (
      <thead>
        <tr>
          <th>Name</th>
          <th>Count</th>
          <th>Days</th>
          <th>Average</th>
          <th>Progress</th>
          <th>Days Left</th>
        </tr>
      </thead>
    );
  }

  _renderBody() {
    return <tbody>{this.state.users.map(this._renderUser)}</tbody>;
  }

  _renderUser(user, i) {
    return (
      <tr key={i}>
        {fields.map((field, i) => <td key={i}>{user[field]}</td>)}
      </tr>
    );
  }
}
