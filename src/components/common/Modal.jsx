import React from 'react'
import { Button, Header, Image, Modal, Segment } from 'semantic-ui-react'
import ItemImage from 'images/image.png'
class ItemModal extends React.Component {
  render() {
    return (
      <div>
        <Modal className="productmodal" trigger={<Button className="productname">Product Name</Button>} centered={false}>
            <Modal.Header>Product Name</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='massive' src={ItemImage} />
                <Modal.Description>
                    <Header>Product details</Header>
                    <p as='h5'>Price: 50$</p>
                    <p as='h5'>Seller: oca</p>
                    <p as='h5'>Condition: shop</p>
                    <p>
                    https://courses.wesbos.com/account/access/5adae24142c2397eec31f28b/view/195950019
                    https://www.ibm.com/developerworks/library/wa-manage-state-with-redux-p1-david-geary/index.html
                    (blog)

                    https://www.valentinog.com/blog/react-redux-tutorial-beginners/#React_Redux_tutorial_refactoring_the_reducer  (blog 2018)
                    </p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={this.close} positive content="Release"></Button>
                <Button onClick={this.close} negative content="Redund"></Button>
                <Button positive icon='checkmark' labelPosition='right' content='BUY' />
            </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ItemModal;