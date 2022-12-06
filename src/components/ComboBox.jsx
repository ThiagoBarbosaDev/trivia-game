import React from 'react';
import PropTypes from 'prop-types';

class ComboBox extends React.Component {
  render() {
    const { value, onChange, data, name, dataTestId,
      className, ...otherProps } = this.props;
    return (
      <select
        className={ className }
        name={ name }
        value={ value }
        onChange={ onChange }
        { ...otherProps }
      >
        {data.map((option) => (
          <option key={ option }>{option}</option>
        ))}
      </select>
    );
  }
}

ComboBox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.string).isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string,
  dataTestId: PropTypes.string,
};

ComboBox.defaultProps = {
  className: '',
  dataTestId: null,
};

export default ComboBox;
