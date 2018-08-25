import React, { Component } from 'react'
import { Container, Header } from 'semantic-ui-react'
import Product from 'layouts/home/Product'
class AboutContractAndWebsite extends Component {
  render() {
    return(
      <Container textAlign='center'>
        <Header as='h2'>About Smart-Contract and Website</Header>
        <p>
          About Smart Contract and website
        </p>
      </Container>
    )
  }
}
class Home extends Component {
  render() {
    return(
      <div>
        <AboutContractAndWebsite/>
        <Product/>
      </div>
    )
  }
}

export default Home
