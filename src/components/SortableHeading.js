import React from 'react';

export default (props) => {
  return (
    <th>
      {titleize(props.text)}
      <i className="fa fa-sort"></i>
    </th>
  );
};
