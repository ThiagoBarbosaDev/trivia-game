import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { userName, score, gravatarEmail } = this.props;
    const gravatarHash = md5(gravatarEmail).toString();
    return (
      <div>
        <header>
          <img
            className="gravatar"
            data-testid="header-profile-picture"
            src={ `https://www.gravatar.com/avatar/${gravatarHash}` }
            alt={ `foto de ${userName}` }
          />
          <p
            data-testid="header-player-name"
          >
            { userName }

          </p>
          <span
            data-testid="header-score"
          >
            { `Score: ${score}` }
          </span>
        </header>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userName: state.player.name,
  score: state.player.score,
  gravatarEmail: state.player.gravatarEmail,
});

Header.propTypes = {
  userName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,

};

export default connect(mapStateToProps)(Header);
