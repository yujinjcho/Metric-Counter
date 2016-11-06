var React = require('react');
var Slider = require('react-slick');
require('../../static/css/category-slider.css');

var CategorySlider = React.createClass({
  render: function () {
    var settings = {
      arrows: true,
      dots: false
    };
    var categories = this.props.categories.map(function(cat, i) {
      return <div key={i} className='category-name'>{cat}</div>
    });
    return (
      <Slider {...settings}>
        {categories}
      </Slider>
    );
  }
});

module.exports = CategorySlider;
