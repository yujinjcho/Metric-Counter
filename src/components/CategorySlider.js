var React = require('react');
var Slider = require('react-slick');
require('../../static/css/category-slider.css');

var CategorySlider = React.createClass({
  render: function () {
    var settings = {
      arrows: true,
      dots: false
    };

    var handleClick = this.changeCategory;
    var categories = this.props.categories.map(function(cat, i) {
      return <div key={i} className='category-name' onClick={handleClick.bind(null, cat)}>{cat}</div>
    });
    return (
      <Slider {...settings}>
        {categories}
      </Slider>
    );
  },
  changeCategory: function(category) {
    this.props.change(category);
    this.props.collapse();
  }
});

module.exports = CategorySlider;
