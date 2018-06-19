import React from 'react'
import { graphql, gql } from 'react-apollo'

class Post extends React.Component {

  static propTypes = {
    post: React.PropTypes.object,
    mutate: React.PropTypes.func,
    refresh: React.PropTypes.func,
  }

  render () {
    return (
      <div className='pa3 bg-black-05 ma3'>
        {/* <div
          className='w-100'
          style={{
            backgroundImage: `url(${this.props.post.imageUrl})`,
            backgroundSize: 'cover',
            paddingBottom: '100%',
          }}
        /> */ }
        <div className='pt3'>
          {this.props.post.name}&nbsp;
          <span className='red f6 pointer dim' onClick={this.handleDelete}>Voir</span>
        </div>
      </div>
    )
  }

  handleDelete = async () => {
    const d = new Date()
    console.log(d)
    for (let i = 1 ; i <= 1000; i++){
      console.log(`test ${i} => test ${i + 1}`)
      await this.props.mutate({variables: {p1: `test ${i}`, p2: `test ${i + 1}`, relation: 'visite'}})
    }
    const d1 = new Date()
    console.log(d1)    
    alert(d, '======= fin ======', d1);
    /* this.props.mutate({variables: {p1: this.props.post.id}})
      .then(this.props.refresh) */
  }
}

const deleteMutation = gql`
  mutation ActionPersonne($p1: String, $p2: String, $relation: String!) {
    ActionPersonne(p1: $p1, p2: $p2, relation: $relation) {
      name
    }
  }
`

const PostWithMutation = graphql(deleteMutation)(Post)

export default PostWithMutation
