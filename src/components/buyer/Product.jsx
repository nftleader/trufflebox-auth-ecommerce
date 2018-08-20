import React, { Component } from 'react'
import { Grid, Menu, Segment, Header, Pagination } from 'semantic-ui-react'
import PItem from 'components/common/Item'

class Product extends Component {
  state = { activeItem: 'bio' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Grid className="product">
        <Grid.Column width={4}>
          <Header as='h3'>Categories</Header>
          <Menu fluid vertical tabular>
            <Menu.Item name='bio' active={activeItem === 'bio'} onClick={this.handleItemClick} />
            <Menu.Item name='pics' active={activeItem === 'pics'} onClick={this.handleItemClick} />
            <Menu.Item
              name='companies'
              active={activeItem === 'companies'}
              onClick={this.handleItemClick}
            />
            <Menu.Item
              name='links'
              active={activeItem === 'links'}
              onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>
            <Header as='h3'>Products</Header>
            <PItem/>
            <Pagination
              defaultActivePage={1}
              firstItem={null}
              lastItem={null}
              pointing
              secondary
              totalPages={3}
              className="pagination"
            />
          </Segment>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Product