import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import { FormGroup, Label, Input, Button} from 'reactstrap';
import Calendar from "react-calendar";

describe('App', () => {
  var MockDate = require('mockdate');

  it('should render component correctly', () => {
    MockDate.set(1434319925275);

    const component = shallow(<App />);
    expect(component).toMatchSnapshot();

    MockDate.reset();
  });

  it('should render the form correctly', () => {
    const wrapper = shallow(<App />);

    expect(wrapper.find(FormGroup).length).toBe(5);
    expect(wrapper.find(Label).length).toBe(5);
    expect(wrapper.find(Input).length).toBe(4);
    expect(wrapper.find(Calendar).length).toBe(1);
    expect(wrapper.find(Button).length).toBe(1);
  });

  it('should render the button with the right label', () => {
    const wrapper = shallow(<App />);

    console.log(wrapper.find(Button).text);
    expect(wrapper.find('button').text).toEqual('Generate Stand Up');
  });
});
