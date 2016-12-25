import React from 'react';
import $ from 'jquery';
import SortableHeading from './SortableHeading';
import { titleize } from '../utils';

const fields = ['name', 'count', 'days', 'dailyAverage', 'progress', 'projectedDaysLeft'];

function sortedUsers(users, { field, direction }) {
  return users.sort((a, b) => (parseFloat(a[field]) - parseFloat(b[field])) * direction);
}

export default class Leaderboard extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      sort: { field: 'count', direction: -1 }
    };
    this._handleSort = this._handleSort.bind(this);
  }

  componentDidMount() {
    $.get('/api/leaderboard', (data) => this.setState(data));
  }

  _handleSort(field) {
    const { sort } = this.state;
    this.setState({ sort: { field, direction: field === sort.field ? sort.direction * -1 : -1 } });
  }

  render() {
    return (
      <div>
        <h1>Leaderboard</h1>
        <table className="table">
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
          <th>{titleize(fields[0])}</th>
          {fields.slice(1).map((field, i) => (
            <SortableHeading key={i} field={field} onSort={this._handleSort} />
          ))}
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
