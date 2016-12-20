import React from 'react';
import { titleize } from '../utils';

export default (props) => {
  return (
    <th>
      {titleize(props.text)}
      <i className="fa fa-sort"></i>
    </th>
  );
};
