import React from 'react';
import UserOptions from './UserOptions';
import '../../static/css/navbar-options.css';

const NavbarOptions = (props) => {
  return (
    <div className = {props.options}>
      <UserOptions
        options = {props.navbarOptionsName}
        loginName = {props.loginName}
        accountName = {props.accountName}
        user = {props.user}
        categories = {props.categories}
        change = {props.change}
        collapse = {props.collapse}
        activeCategory = {props.activeCategory}
      />
    </div>
  );
};

module.exports = NavbarOptions;
