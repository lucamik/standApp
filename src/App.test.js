import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import { FormGroup, Label, Input, Button, Alert} from 'reactstrap';
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

    expect(wrapper.find(FormGroup).length).toBe(4);
    expect(wrapper.find(Label).length).toBe(4);
    expect(wrapper.find(Input).length).toBe(3);
    expect(wrapper.find(Calendar).length).toBe(1);
  });

  it('form submission with missing parameters', () => {
    const wrapper = mount(<App />);

    const button = wrapper.find(Button);
    const errorMsg = wrapper.find('.errorMsg');

    expect(button.length).toBe(1);
    expect(errorMsg.length).toBe(1);
    expect(wrapper.state('errors').length).toBe(0);
    expect(wrapper.find(Alert).length).toBe(0);

    button.simulate('click');
    expect(wrapper.state('errors').length).toBe(3);
    expect(wrapper.find(Alert).length).toBe(3);

    wrapper.state().errors.forEach((error, id) => {
        expect(wrapper.contains(error)).toBe(true);
    });
  });

    it('form submission with wrong credentials', () => {
        const wrapper = mount(<App />);

        const inputApiKey = wrapper.find('input#apiKey');
        const inputToken = wrapper.find('input#token');
        const button = wrapper.find(Button);
        const errorMsg = wrapper.find('.errorMsg');

        expect(inputApiKey.length).toBe(1);
        expect(inputToken.length).toBe(1);
        expect(errorMsg.length).toBe(1);

        expect(wrapper.state('errors').length).toBe(0);
        expect(wrapper.find(Alert).length).toBe(0);

        inputApiKey.instance().value = "wrong key";
        inputToken.simulate('change', { target: { value: 'wrong token'} });
        expect(inputApiKey.instance().value).toBe('wrong key');

        button.simulate('click');

        expect(wrapper.state('errors').length).toBe(2);
        expect(wrapper.find(Alert).length).toBe(2);

        wrapper.state().errors.forEach((error, id) => {
            expect(wrapper.contains(error)).toBe(true);
        });
    });
});

