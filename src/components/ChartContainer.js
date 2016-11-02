var React = require('react');
var Row = require('react-bootstrap/lib/Row');
var Col = require('react-bootstrap/lib/Col');
var ChartInstance = require('./ChartInstance');

require('../../static/css/chart-container.css');

var ChartContainer = React.createClass({
  render: function() {

    return (
      <Row className='show-grid chart-row' >
        <Col className='chart-container' xs={12}>
            <ChartInstance
              title="Daily"
              data={this.props.dailyData}
              dates={this.props.dateLabels}
            />
            <div className='divider'></div>
            <ChartInstance
              title="Cumulative"
              data={this.props.cumulativeData}
              dates={this.props.dateLabels}
            />
        </Col>
      </Row>
    )
  }
});

module.exports = ChartContainer;