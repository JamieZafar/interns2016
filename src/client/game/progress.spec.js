import React from 'react';
import { shallow } from 'enzyme';

import { Progress } from './progress';

describe('<Progress />', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Progress />);
    });

    it('renders no element with class progress if neither answering nor progressBarVisible props are true', () => {
        wrapper.setProps({
            answering: false,
            progressBarVisible: false
        });

        expect(wrapper.find('.progress').length).toEqual(0);
    });

    it('renders an element with class progress if answering is true', () => {
        wrapper.setProps({
            answering: true,
            progressBarVisible: false,
            answerTimerValue: 25,
            gameParams: {
                answerTime: 30
            }
        });

        expect(wrapper.find('.progress').length).toEqual(1);
    });

    it('renders an element with class progress if progressBarVisible is true', () => {
        wrapper.setProps({
            answering: false,
            progressBarVisible: true,
            submissionTimerValue: 10,
            gameParams: {
                submitTime: 15
            }
        });

        expect(wrapper.find('.progress').length).toEqual(1);
    });
});
