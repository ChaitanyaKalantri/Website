import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import ProfileItem from './ProfileItem';
import { getProfiles } from '../../actions/profileActions';
import './ProfilesPagination.css';

class Profiles extends Component {
  constructor() {
    super();
    this.state = {
      profiles: ['a','b','c','d','e','f','g','h','i','j','k'],
      currentPage: 1,
      todosPerPage: 2
    };
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    this.props.getProfiles();
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  render() {
    var { profiles, loading } = this.props.profile;
    let profileItems, renderTodos, renderPageNumbers;

    console.log(this.props.profile);

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length >0) {

        var { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        console.log(indexOfLastTodo);
        console.log(indexOfFirstTodo);
        console.log(profiles);

        const currentTodos = profiles.slice(indexOfFirstTodo, indexOfLastTodo);

        profileItems = currentTodos.map(profile => {
         return <ProfileItem key={profile._id} profile={profile} className="list-row" />
        });

        console.log("RenderTodos", renderTodos);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(profiles.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }

        renderPageNumbers = pageNumbers.map(number => {
          return (
            <li class="page-link"
              key={number}
              id={number}
              onClick={this.handleClick}
            >
              {number}
            </li>
          );
        });

        console.log("RenderPageNumber", renderPageNumbers);

        // profileItems = profiles.map(profile => (
        //   <ProfileItem key={profile._id} profile={profile} />
        // ))

      } else {
        profileItems = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4 text-center">Developer Profiles</h1>
              <p className="lead text-center">
                Browse and connect with developers
              </p>

              <ul>
                {profileItems}
              </ul>
              <ul className="pagination">
              <ul>
                {renderPageNumbers}
              </ul>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(mapStateToProps, { getProfiles })(Profiles);