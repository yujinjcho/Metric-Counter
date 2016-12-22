import React from 'react';
import { titleize } from '../utils';

export default (props) => {
  const { field, onSort } = props;

  return (
    <th className="sortable-heading" onClick={() => onSort(field)}>
      <span className="sortable-heading-field">{titleize(field)}</span>
      <i className="fa fa-sort"></i>
    </th>
  );
};
