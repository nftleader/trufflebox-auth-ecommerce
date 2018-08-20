import React, { Component } from 'react'
import { Item, Header } from 'semantic-ui-react'
import ItemImage from 'images/image.png'
import ItemModal from 'components/common/Modal'

class PItem extends Component {
    render() {
        return (
            <div>
                <Item.Group>
                    <Item>
                        <Item.Image size='small' src={ItemImage} />
                        <Item.Content>
                            <Item.Header><ItemModal/></Item.Header>
                            <Item.Description>
                            <p as='h5'>Price: 50$</p>
                            <p as='h5'>Seller: oca</p>
                            <p as='h5'>Condition: shop</p>
                            </Item.Description>
                        </Item.Content>
                    </Item>

                    <Item>
                        <Item.Image size='small' src={ItemImage} />
                        <Item.Content>
                            <Item.Header><ItemModal/></Item.Header>
                            <Item.Description>
                            <p as='h5'>Price: 50$</p>
                            <p as='h5'>Seller: oca</p>
                            <p as='h5'>Condition: shop</p>
                            </Item.Description>
                        </Item.Content>
                    </Item>

                    <Item>
                    <Item.Image size='small' src={ItemImage} />
                        <Item.Content>
                            <Item.Header><ItemModal/></Item.Header>
                            <Item.Description>
                            <p as='h5'>Price: 50$</p>
                            <p as='h5'>Seller: oca</p>
                            <p as='h5'>Condition: shop</p>
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
                
            </div>
        )
    }

}

export default PItem