import React from 'react';
import PropTypes from 'prop-types';

class Input extends React.Component {
  render() {
    const { dataTestId, placeholder, className,
      children, type, name, value, checked, ...otherProps } = this.props;
    return (
      <input
        data-testid={ dataTestId }
        name={ name }
        id={ `input-${name}` }
        type={ type }
        value={ value }
        checked={ checked }
        placeholder={ placeholder }
        className={ className }
        { ...otherProps }
      />
    );
  }
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dataTestId: PropTypes.string,
  value: PropTypes.string,
  checked: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};

Input.defaultProps = {
  value: null,
  checked: null,
  dataTestId: null,
  placeholder: null,
  className: null,
  children: null,
};

export default Input;
