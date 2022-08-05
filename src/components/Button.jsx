import React from 'react';
import PropTypes from 'prop-types';

class Button extends React.Component {
  render() {
    const { dataTestId, children, className, disabled, ...otherProps } = this.props;
    return (
      <button
        className={ className }
        data-testid={ dataTestId }
        type="button"
        disabled={ disabled }
        { ...otherProps }
      >
        { children }
      </button>
    );
  }
}

Button.propTypes = {
  type: PropTypes.string,
  dataTestId: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
};

Button.defaultProps = {
  type: 'button',
  dataTestId: null,
  children: null,
  className: null,
};

export default Button;
