var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartInstance = require('./ChartInstance');
var $ = require('jquery');

var ChartContainer = React.createClass({
  getInitialState: function() {
    return {
      daily: [],
      cumulative: [],
      test: 'hi'
    };
  },
  componentDidMount: function() {
    this.loadDummyData();
  },
  loadData: function() {
    $.ajax('/api/data/').done(function(data){
      this.setState(data);
    }.bind(this));
  },
  loadDummyData: function() {
    var data = {
      daily: [
        ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
        ['daily', 2, 2, 3, 3, 4, 4, 5]
      ],
      cumulative: [
        ['x', '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
        ['daily', 2, 4, 7, 10, 14, 19, 24]
      ]
    };
  },
  render: function() {
    var chartRow = {
      flex: 2,
      overflow: 'visible'
    };

    var chartContainer = {
      textAlign: 'center',
      display: 'flex',
      flexFlow: 'column',
      height: '100%',
      paddingTop: 50
    };

    var divider = {
      border: '1px solid #CCCCCC',
      height: 1,
      width: '100%'
    };

    return (
      <Row className='show-grid' style={chartRow}>
        <Col style={chartContainer} xs={12}>
            <ChartInstance
              title='Daily'
              format={this.state.format}
              data={this.state.daily}
            />
            <div style={divider}></div>
            <ChartInstance
              title='Cumulative'
              data={this.state.cumulative}
            />
        </Col>
      </Row>
    )
  }
});

module.exports = ChartContainer;