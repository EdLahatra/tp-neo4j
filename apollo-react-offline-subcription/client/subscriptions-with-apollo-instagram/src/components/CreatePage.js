import React from 'react'
import { withRouter } from 'react-router'
import { graphql, gql } from 'react-apollo'

class CreatePage extends React.Component {

  static propTypes = {
    router: React.PropTypes.object,
    addPost: React.PropTypes.func,
  }

  state = {
    name: '',
    imageUrl: '',
  }

  render () {
    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          <input
            className='w-100 pa3 mv2'
            value={this.state.name}
            placeholder='Description'
            onChange={(e) => this.setState({name: e.target.value})}
          />
          {/* <input
            className='w-100 pa3 mv2'
            value={this.state.imageUrl}
            placeholder='Image Url'
            onChange={(e) => this.setState({imageUrl: e.target.value})}
          /> */ }
          {this.state.imageUrl &&
            <img src={this.state.imageUrl} role='presentation' className='w-100 mv3' />
          }
          {this.state.name &&
            <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={this.handlePost}>Post</button>
          }
        </div>
      </div>
    )
  }

  handlePost = async () => {
    const d = new Date()
    console.log(d)
    const { name } = this.state
    for (let i = 0 ; i <= 1000; i++){
      console.log(`create test ${i}`)
      await this.props.addPost({ name: `test ${i}` })
    }
    const d1 = new Date()
    console.log(d1)    
    alert(d, '======= fin ======', d1)
    this.props.router.push('/')
    /* this.props.addPost({ name })
      .then(() => {
        this.props.router.push('/')
      })
      */
  }
}

const addMutation = gql`
  mutation createPerson($name: String!) {
    createPerson(name: $name) {
      name
    }
  }
`

const PageWithMutation = graphql(addMutation, {
  props: ({ ownProps, mutate }) => ({
    addPost: ({ name }) =>
      mutate({
        variables: { name },
        updateQueries: {
          Personne: (state, { mutationResult }) => {
            const newPost = mutationResult.data.createPerson
            return {
              Personne: [...state.Personne, newPost]
            }
          },
        },
      })
  })
})(withRouter(CreatePage))

export default PageWithMutation