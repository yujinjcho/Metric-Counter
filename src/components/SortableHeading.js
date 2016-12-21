import React from 'react';
import { titleize } from '../utils';

export default (props) => {
  const { field, onSort } = props;

  return (
    <th onClick={() => onSort(field)}>
      {titleize(field)}
      <i className="fa fa-sort"></i>
    </th>
  );
};
