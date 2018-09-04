import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';

import { selectIsAuthorized } from 'common/selectors/auth';

@connect(state => ({
  isAuthorized: selectIsAuthorized(state),
}))
export default class GuestRoute extends React.PureComponent {
  static propTypes = {
    isAuthorized: PropTypes.bool,
  };

  static defaultProps = {
    isAuthorized: false,
  };

  render () {
    const { isAuthorized, ...rest } = this.props;

    if (isAuthorized) return <Redirect to="/filter" />;

    return <Route {...rest} />;
  }
}
