var React = require('react');
import C3Chart from 'react-c3js';


var ChartInstance = React.createClass({
  getInitialState: function() {
    return {
      // are you doing this because this is the structure required by the c3chart component?
      // i'd probably just inline the object in the component declaration, like:
      // title={ { text: this.props.title } }
      //
      // otherwise, you have two places where title is stored, which can potentially become
      // out of sync (like if you update component state directly).
      //
      // another option is to have another function that is derived from props but just
      // returns the correct data format:
      //
      // title: function() {
      //   return { text: { this.props.title } };
      // }
      title: {
        text: this.props.title
      }
    }
  },
  // since this function is completely based on received props, probably better to just
  // pass down the already formatted data as a prop, instead of each piece and composing
  // them in the child
  formatData: function() {
    var dates = this.props.dates;
    var points = this.props.data;
    return this.props.formatInputs(dates, points);
  },
  formatTitle: function() {

  },
  render: function() {
    return (
      <C3Chart
        style={this.props.style}
        title={this.state.title}
        // data={this.props
        // related to above comment, this would then be something like:
        // data={this.formattedData}
        data={this.formatData()}
        legend={this.props.legend}
        axis={this.props.axis}
      />
    )
  }
});


module.exports = ChartInstance;
