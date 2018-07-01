import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PostForm from './PostForm';
import Spinner from '../common/Spinner';
import {getPosts} from "../../actions/postActions";
//import PostFeed from './PostFeed';
import './PostPagination.css';
import PostItem from './PostItem';

class Posts extends Component{
  constructor() {
    super();
    this.state = {
      profiles: ['a','b','c','d','e','f','g','h','i','j','k'],
      currentPage: 1,
      todosPerPage: 3
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    this.props.getPosts();
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  render(){
    const {posts, loading} = this.props.post;
    let postContent, renderTodos, renderPageNumbers;

    if(posts == null || loading){
      postContent = <Spinner/>
    }else{
      if (posts.length >0) {
        var { currentPage, todosPerPage } = this.state;
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        console.log(indexOfLastTodo);
        console.log(indexOfFirstTodo);
        console.log(posts);

        const currentTodos = posts.slice(indexOfFirstTodo, indexOfLastTodo);
        postContent = currentTodos.map((post) => {
          //return <PostFeed posts={posts}/>
          return <PostItem key={post._id} post={post}/>
        });

        console.log("RenderTodos", renderTodos);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(posts.length / todosPerPage); i++) {
          pageNumbers.push(i);
        }

        renderPageNumbers = pageNumbers.map(number => {
          return (
            <li className="page-link"
                key={number}
                id={number}
                onClick={this.handleClick}
            >
              {number}
            </li>
          );
        });

        console.log("RenderPageNumber", renderPageNumbers);

        //postContent = <PostFeed posts={posts}/>
      }else{
        postContent = <h4>No profiles found...</h4>;
      }
    }

    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PostForm/>
              <ul>
              {postContent}
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

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, {getPosts})(Posts);