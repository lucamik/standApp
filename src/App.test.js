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

    //not working yet
    it('form submission with wrong credentials', () => {
        const wrapper = mount(<App />);

        const inputApiKey = wrapper.find('input#apiKey').getDOMNode();
        const inputToken = wrapper.find('input#token').getDOMNode();
        const devTeam = wrapper.find('input#devTeam').getDOMNode();
        const button = wrapper.find(Button);
        const errorMsg = wrapper.find('.errorMsg');

        expect(wrapper.state('errors').length).toBe(0);
        expect(wrapper.find(Alert).length).toBe(0);

        inputApiKey.value = "wrong key";
        inputToken.value = "wrong token";
        devTeam.value = "Chameleon";

        button.simulate('click');

        expect(wrapper.state('errors').length).toBe(2);
        expect(wrapper.find(Alert).length).toBe(2);

        wrapper.state().errors.forEach((error, id) => {
            expect(wrapper.contains(error)).toBe(true);
        });
    });
});

