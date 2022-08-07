import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '../components/Button';

class Ranking extends Component {
handleHomeClick = () => {
  const { history: { push } } = this.props;
  push('/');
}

render() {
  return (
    <div>
      <Button
        dataTestId="btn-go-home"
        onClick={ () => this.handleHomeClick() }
      >
        Home
      </Button>
    </div>
  );
}
}

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Ranking;
