import React from 'react';
import $ from 'jquery';
import SortableHeading from './SortableHeading';

const fields = ['name', 'count', 'days', 'dailyAverage', 'progress', 'projectedDaysLeft'];

function titleize(field) {
  return `${field[0].toUpperCase()}${field.slice(1)}`.match(/[A-Z]{1}[a-z]*/g).join(' ');
}

export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  componentDidMount() {
    $.get('/api/leaderboard', (data) => this.setState(data));
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
          {fields.map((field, i) => <SortableHeading key={i} text={field} />)}
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
