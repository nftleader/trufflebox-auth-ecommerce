import React, { Component } from 'react'
import { Table, Button, Grid } from 'semantic-ui-react'
import UserDetailedModal from 'components/common/UserDetailedModal'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as OwnerAction from 'components/owner/OwnerAction'

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {};
    this.state.col = [1,4,3,1,1]
    this.state.datas = [{
      name: 'aaa',
      email: 'email1.e.com',
      address: 'address1',
      userType: 'Buyer',
      userState: 'Pending'
    }, {
      name: '21433214',
      email: 'email2.e.com',
      address: 'address1',
      userType: 'Seller',
      userState: 'Pending'
    }, {
      name: '334354654',
      email: 'email3.e.com',
      address: 'address1',
      userType: 'Owner',
      userState: 'Approved'
    }];
    
    this.state.contactInfo = {
      address: "adskflasjdf",
      abi: "klsdjflksdf",
      balance: "0.1 ETH",
      stores: 97,
      sellers: 98,
      admins: 99,
    }
  }

  componentDidMount() {
    this.setState({
      contactInfo: {
        admins:   this.props.dashboard.data.arbiterCount,
        address:  this.props.dashboard.data.contractData.address,
        balance:  this.props.dashboard.data.balance,
        stores: 0,
        sellers: this.props.dashboard.data.sellerCount,
      }
    });
    this.setState({
      datas:this.props.dashboard.data.userData
    })
  }
  //{Pending, Approved}
  showState(state) {
    if (state == 'Pending')
      return (<Table.Cell negative>{state}</Table.Cell>);
    else
      return (<Table.Cell positive>{state}</Table.Cell>);
  }

  showTypeBtn(curType, tgtType, title, id) {
    if (curType == tgtType)
      return (<Button positive>{tgtType}</Button>);
    else
      return (<Button onClick={() => this.onClickUserType(tgtType, id)}>{tgtType}</Button>);
  }
  showTypeBtns(type, id) {
    return (
      <Table.Cell>
        <Button.Group>
          {this.showTypeBtn(type, 'Buyer', 'Buyer', id)}
          <Button.Or />
          {this.showTypeBtn(type, 'Seller', 'Seller', id)}
          <Button.Or />
          {this.showTypeBtn(type, 'Arbiter', 'Arbiter', id)}
        </Button.Group>
      </Table.Cell>);
  }

  showStateBtns(state, id) {
    if (state == 'Approved') {
      return (
        <Table.Cell>
          <Button.Group>
            <Button onClick={() => this.onClickUserState('Pending', id)}>Pending</Button>
            <Button.Or />
            <Button positive>Approve</Button>
          </Button.Group>
        </Table.Cell>);
    } else {
      return (
        <Table.Cell>
          <Button.Group>
            <Button negative>Pending</Button>
            <Button.Or />
            <Button onClick={() => this.onClickUserState('Approved', id)}>Approve</Button>
          </Button.Group>
        </Table.Cell>);
    }
  }

  onClickUserType(type, id) {
    this.props.action.changeUserType(type, id);
  }

  onClickUserState(state, id) {
    this.props.action.changeUserState(state, id);
  }

  onClickWithdrawButton(){
    alert('please withdraw');
  }
  render() {
    console.log('track_3');
    console.log(this.props);
    return(
      <main className="container">
        <div className="row">
          <div className="col-md-12">
            <h3>Contact Info</h3>
            <Grid>
              {Object.keys(this.state.contactInfo).map((key, index) => 
                <Grid.Column width={this.state.col[index]} key={key}>
                  <p as='h5' >{key}: {this.state.contactInfo[key]+' '}
                    {key === 'balance' ?<Button size='tiny' onClick={() => this.onClickWithdrawButton()}>withdraw</Button>:''}
                  </p>
                </Grid.Column>)}
            </Grid>
          </div>
          <hr/>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h3>User Information</h3>
            <Table celled structured textAlign = 'center'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan='2'>No</Table.HeaderCell>
                  <Table.HeaderCell rowSpan='2'>Name</Table.HeaderCell>
                  <Table.HeaderCell rowSpan='2'>Email</Table.HeaderCell>
                  <Table.HeaderCell rowSpan='2'>Address</Table.HeaderCell>
                  <Table.HeaderCell rowSpan='2'>User type</Table.HeaderCell>
                  <Table.HeaderCell rowSpan='2'>User state</Table.HeaderCell>
                  <Table.HeaderCell colSpan='3'>Action</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  <Table.HeaderCell>Change User State</Table.HeaderCell>
                  <Table.HeaderCell>Change User Type</Table.HeaderCell>
                  <Table.HeaderCell>Details</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
              {this.state.datas.map((item, index) => {
                return ( <Table.Row key={item.email}>
                          <Table.Cell>{index + 1}</Table.Cell>
                          <Table.Cell>{item.name}</Table.Cell>
                          <Table.Cell>{item.email}</Table.Cell>
                          <Table.Cell>{item.address}</Table.Cell>
                          <Table.Cell>{item.userType}</Table.Cell>
                          {this.showState(item.userState)}
                          {this.showStateBtns(item.userState, item.id)}
                          {this.showTypeBtns(item.userType, item.id)}
                          <Table.Cell><UserDetailedModal info={item}/></Table.Cell>
                        </Table.Row> )})
              }
              </Table.Body>
            </Table>
          </div>
        </div>
      </main>
    )
  }
}

const mapStateToProps = state => ({
  dashboard: state.owner
})

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(OwnerAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
