import React from 'react'
import { Button, Header, Image, Modal, Segment } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ItemImage from 'images/image.png'
class ItemModal extends React.Component {
  constructor(props) {
    super(props)
  }

  renderButton() {
    if(this.props.store.user.data.userType === ''){
      alert('here')
      return (
        <Button positive labelPosition='right' content='Cancel'/>
      )
    }
    // <Button onClick={this.close} positive content="Release"></Button>
    // <Button onClick={this.close} negative content="Redund"></Button>
    // <Button positive icon='checkmark' labelPosition='right' content='BUY' />
  }

  render() {
    console.log('track_modal')
    console.log(this.props)
    return (
      <div>
        <Modal className="productmodal" trigger={<Button className="productname">Product Name</Button>} centered={false}>
            <Modal.Header>Product Name</Modal.Header>
            <Modal.Content image>
                <Image wrapped size='medium' src={ItemImage} />
                <Modal.Description>
                    <Header>Product details</Header>
                    <p as='h5'>Name: {this.props.product.name}</p>
                    <p as='h5'>Price: {this.props.product.price}</p>
                    <p as='h5'>DescLink: {this.props.product.descLink}</p>
                    <p as='h5'>ProductCondition: {this.props.product.productCondition}</p>
                    <p as='h5'>ProductState: {this.props.product.productState}</p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              {
                this.renderButton()
              }
            </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  store: state
})

const mapDispatchToProps = dispatch => ({
  
})

export default connect(mapStateToProps, mapDispatchToProps)(ItemModal)