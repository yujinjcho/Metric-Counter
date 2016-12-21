import React from 'react';
import $ from 'jquery';
import SortableHeading from './SortableHeading';

const fields = ['name', 'count', 'days', 'dailyAverage', 'progress', 'projectedDaysLeft'];
const sortDelimiter = ':';

function sortedUsers(users, { field, direction }) {
  return users.sort((a, b) => (a[field] - b[field]) * direction);
}

export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      sort: { field: 'count', direction: -1 }
    };
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
    const { users, sort } = this.state;
    return <tbody>{sortedUsers(users, sort).map(this._renderUser)}</tbody>;
  }

  _renderUser(user, i) {
    return (
      <tr key={i}>
        {fields.map((field, i) => <td key={i}>{user[field]}</td>)}
      </tr>
    );
  }
}
