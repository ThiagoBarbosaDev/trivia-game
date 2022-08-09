import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Button from '../components/Button';
import Header from '../components/Header';
import { updateRanking } from '../helpers/index';

// para implementar
// conectar ao estado global
// recuperar as informações do jogador
// enviar ao localStorage
// O localStorage deve conter as chaves ranking e token com a seguinte estrutura:
// {
//   ranking: [
//     { name: nome_da_pessoa, score: 10, picture: url_da_foto_no_gravatar }
//   ],
//   token: token_recebido_pela_API
// }
// recuperar do localStorage o Ranking
// fazer um map que retorna uma lista de <li> com os dados do ranking em ordem decrescente de score da maior para a menor.

class Ranking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ranking: [],
    };
  }

  componentDidMount() {
    this.handleStorage();
  }

handleHomeClick = () => {
  const { history: { push } } = this.props;
  push('/');
}

handleStorage = () => {
  const { userName, score, gravatarEmail } = this.props;
  const gravatarHash = md5(gravatarEmail).toString();
  const payload = { name: userName, score, picture: `https://www.gravatar.com/avatar/${gravatarHash}` };
  const rankingData = updateRanking(payload);
  this.setState({
    ranking: rankingData,
  });
}

renderRanking = () => {
  const { ranking } = this.state;
  const sortedRanking = ranking.sort((a, b) => a.name - b.name);
  console.log(sortedRanking);
}

render() {
  this.renderRanking();
  return (
    <div>
      <Header />
      <main>
        <h2 data-testid="ranking-title">
          Ranking
        </h2>
        <Button
          dataTestId="btn-go-home"
          onClick={ () => this.handleHomeClick() }
        >
          Home
        </Button>
      </main>
    </div>
  );
}
}

const mapStateToProps = (state) => ({
  userName: state.playerReducer.name,
  score: state.playerReducer.score,
  gravatarEmail: state.playerReducer.gravatarEmail,
});

Ranking.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  userName: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  gravatarEmail: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(Ranking);
