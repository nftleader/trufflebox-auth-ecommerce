import React, { Component } from 'react'
import { Grid, Segment, List, Header, Button, Form } from 'semantic-ui-react'
import { connect } from 'react-redux'
import * as StoreAction from 'components/seller/StoreAction'
import { bindActionCreators } from 'redux'

var style = {
    overflowY: "scroll",
    maxHeight: "250px",
}

var styleproductcreate = {
    overflowY: "scroll",
    maxHeight: "400px",
}

var styleproductlist = {
    overflowY: "scroll",
    maxHeight: "800px",
}

class Store extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      name: '',
      email: '',
      storePicture: '',
      selectedman:'',
    }

    this.state.product = {
        name: '',
        category: '',
        imageLink: '',
        descLink: '',
        startTime: '',
        price: '',
        ratioselected: {
            condition: '',
            state: ''
        },
        productCondition:['New' , 'Used'],
        productState: ['ForSale', 'Sold', 'Shipped', 'Received', 'Deleted'],
    }

    this.state.datas = [{
        name: 'aaa',
        email: 'email1.e.com'
      }, {
        name: '21433214',
        email: 'email2.e.com'
      },{
        name: '21433214',
        email: 'email2.e.com'
      },{
        name: '21433214',
        email: 'email2.e.com'
      },
      {
        name: '21433214',
        email: 'email2.e.com'
      }, {
        name: '334354654',
        email: 'email3.e.com'
    }];
  }

  onInputChange(event) {
    console.log(event.target.id);
    let newState={};
    newState[event.target.id] = event.target.value;
    this.setState(newState)
  }

  onproductInputChange(event){
      console.log('track_product');
      const id = event.target.id;
      const value = event.target.value;
      let mem = this.state.product;
      mem[id] = value;
      this.setState({
          ...this.state.product,...mem
      })
  }

  onSelectChange(item, index) {
    this.setState({
        selectedman:index
    })
  }

  onRoleChange(event) {
    console.log(event.target.value);
    this.setState({
      userType: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault()

    if (this.state.name.length < 2)
    {
      return alert('Please fill in your name.')
    }

    if(this.state.selectedman === ''){
        return alert('Please select admin')
    }

    let data = {
      name: this.state.name,
      email: this.state.email,
      storePicture: this.state.storePicture,
      admin: this.state.selectedman
    };
    this.props.action.CreateStore(data)
  }
  handleSubmitProduct(event) {
        event.preventDefault()
        let data = this.state.product
        this.props.action.CreateProduct(data)
  }

  onClickWithdraw(){
      alert('With Draw');
  }

  listrender(item, index){
    if(index === this.state.selectedman) {
        return (
            <List.Item active key={index} value='index' onClick={() => this.onSelectChange(item,index)}>
                <List.Content>
                    Name:{item.name}
                </List.Content>
                <List.Content>
                    Email:{item.email}
                </List.Content>
            </List.Item>
        )
    } else {
        return (
            <List.Item key={index} value='index' onClick={() => this.onSelectChange(item,index)}>
                <List.Content>
                    Name:{item.name}
                </List.Content>
                <List.Content>
                    Email:{item.email}
                </List.Content>
            </List.Item>
        )
    }
  }

  handleproductcondigionChange = (e, { value }) =>{
      if(e.target.name === 'productCondition') {
          let mem = this.state.product.ratioselected;
          mem.condition = value;
          this.setState({
            ...this.state.product.ratioselected,...mem
          })
      }
      if(e.target.name === 'productState'){
        let mem = this.state.product.ratioselected;
        mem.state = value;
        this.setState({
          ...this.state.product.ratioselected,...mem
        })
      }
  }

  productrender(item, indexa){
    if(item === 'productCondition') {
        return(
            <Form.Group inline key = {item}>
            <Header as='h5'>productCondition</Header>
            {this.state.product.productCondition.map((ritem, index) => {
                return(
                    <Form.Radio
                        key={index}
                        name={item}
                        id={ritem}
                        value={ritem}
                        label={ritem}
                        checked={ritem === this.state.product.ratioselected.condition}
                        onChange={this.handleproductcondigionChange}
                    />
                )
            })}
            </Form.Group>
        )      
    }
    if(item === 'productState') {
        return(
            <Form.Group inline key={item}>
            <Header as='h5'>productState</Header>
            {this.state.product.productState.map((ritem, index) => {
                return(
                    <Form.Radio
                        key={index}
                        name={item}
                        id={ritem}
                        value={ritem}
                        label={ritem}
                        checked={ritem === this.state.product.ratioselected.state}
                        onChange={this.handleproductcondigionChange}
                    />
                )
            })}
            </Form.Group>
        ) 
    }
    if(item === 'ratioselected') {
        return (<div key = {item}></div>)
    }
    return (
        <input key = {item} id={item} type="text" value={this.state.product[item]} onChange={this.onproductInputChange.bind(this)} placeholder={item} required/>
    )
  }

  render() {
      console.log('track_10');
      console.log(this.props.store.product);
      const pro = this.props.store.product
      if(this.props.store.data.name === undefined){
        return(
        <main className="container" >
            <div className="row">
                <div className="col-md-12">
                    <Grid columns={3} divided>
                        <Grid.Row className="storeform">
                            <Grid.Column>
                            </Grid.Column>
                            <Grid.Column> 
                            <Grid columns={2}>
                                <Grid.Row>
                                    <Grid.Column>
                                        <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit.bind(this)}>
                                            <fieldset>
                                                <input id="name" type="text" value={this.state.name} onChange={this.onInputChange.bind(this)} placeholder="Store Name" required/>
                                                <input id="email" type="email" value={this.state.email} onChange={this.onInputChange.bind(this)} placeholder="Email" required/>
                                                <input id="storePicture" type="text" value={this.state.storePicture} onChange={this.onInputChange.bind(this)} placeholder="front Image" required/>
                                                <br/>
                                                <button type="submit" className="pure-button pure-button-primary">Create Store</button>
                                            </fieldset>
                                        </form>
                                    </Grid.Column>
                                    <Grid.Column>
                                        <Segment className='storeseg'>
                                            <List divided style={style} selection>
                                                {this.state.datas.map((item, index) => {
                                                    return(
                                                        this.listrender(item, index)
                                                    )
                                                })}
                                            </List>
                                        </Segment>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            </Grid.Column>
                            <Grid.Column>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            </div>
        </main>
        )
    }
    else {
        console.log('here'); 
        return(
            <main className="container" >
                <div className="row">
                    <div className="col-md-12 storestore">
                        <Grid>
                            <Grid.Column  width="3">

                            </Grid.Column>
                            <Grid.Column  width="3">
                                <Header as='h3'>Store Dashboard</Header>
                                <Segment className='storeseg' style={style}>
                                    <Header as='h5'>Name:{this.props.store.data.name}</Header>
                                    <Header as='h5'>Email:{this.props.store.data.email}</Header>
                                    <Header as='h5'>Picture:{this.props.store.data.storePicture}</Header>
                                    <Header as='h5'>Admin:{this.props.store.data.admin}</Header>
                                    <Button onClick={() => this.onClickWithdraw()}>WithDraw</Button>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3">
                                <Header as='h3'>Create Product</Header>
                                <Segment className='storeseg' style={styleproductcreate}>
                                    <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmitProduct.bind(this)}>
                                        <fieldset>
                                            {Object.keys(this.state.product).map((key, index) => {
                                                console.log(key);
                                                return(
                                                    this.productrender(key)
                                                )
                                            })}
                                            <br/>
                                            <button type="submit" className="pure-button pure-button-primary">Create Store</button>
                                        </fieldset>
                                    </form>
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3" className="storelist">
                                <Header as='h3'>Product List</Header>
                                <Segment className='storeseg' style={styleproductlist}>
                                    <List>
                                        {pro.map((key, index) => {
                                            return(
                                                <List.Item key={index}>
                                                    {key.name}
                                                </List.Item>
                                            )
                                        })}
                                    </List>    
                                </Segment>
                            </Grid.Column>
                            <Grid.Column  width="3">
                            </Grid.Column>
                        </Grid>
                    </div>
                </div>
            </main>
        )
    }
  }
}

const mapStateToProps = state => ({
    store: state.store
})
  
const mapDispatchToProps = dispatch => ({
    action: bindActionCreators(StoreAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Store)

