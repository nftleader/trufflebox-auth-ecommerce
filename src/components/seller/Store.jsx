import React, { Component } from 'react'
import { Grid, Segment, List } from 'semantic-ui-react'

var style = {
    overflowY: "scroll",
    maxHeight: "200px",
}

class Store extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      name: '',
      email: '',
      phoneNumber: '',
      profilePicture: '',
      userType: 'Buyer'
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

  onSelectChange(event) {
    console.log('track_1');
    console.log(event.target.content)
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

    this.props.onSignUpFormSubmit(
      this.state.name,
      this.state.email,
      this.state.phoneNumber,
      this.state.profilePicture,
      this.state.userType
    );
  }

  render() {
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
                                            <input id="profilePicture" type="text" value={this.state.profilePicture} onChange={this.onInputChange.bind(this)} placeholder="front Image" required/>
                                            <br/>
                                            <button type="submit" className="pure-button pure-button-primary">Create Store</button>
                                        </fieldset>
                                    </form>
                                </Grid.Column>
                                <Grid.Column>
                                    <Segment className='storeseg'>
                                        <List divided style={style}>
                                            {this.state.datas.map((item, index) => {
                                                return(
                                                    <List.Item key={index} value='index' onClick={this.onSelectChange.bind(this)}>
                                                        <List.Content>
                                                            Name:{item.name}
                                                        </List.Content>
                                                        <List.Content>
                                                            Name:{item.email}
                                                        </List.Content>
                                                    </List.Item>
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
}

export default Store
