import * as React from 'react';

import Shield16 from '../../icon/line/Shield16';
import LabelPill, { LabelPillStatus, LabelPillSize } from './LabelPill';
import notes from './LabelPill.stories.md';

export const withText = () => (
    <LabelPill.Pill type={LabelPillStatus.DEFAULT} size={LabelPillSize.REGULAR}>
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const withIcon = () => (
    <LabelPill.Pill type={LabelPillStatus.DEFAULT} size={LabelPillSize.REGULAR}>
        <LabelPill.Icon Component={Shield16} />
    </LabelPill.Pill>
);

export const withBoth = () => (
    <LabelPill.Pill type={LabelPillStatus.DEFAULT} size={LabelPillSize.REGULAR}>
        <LabelPill.Icon Component={Shield16} />
        <LabelPill.Text>TEST TEXT</LabelPill.Text>
    </LabelPill.Pill>
);

export const severalComponents = () => (
    <div style={{ textAlign: 'center' }}>
        <LabelPill.Pill type={LabelPillStatus.WARNING} size={LabelPillSize.REGULAR}>
            <LabelPill.Text>BETA</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.INFO} size={LabelPillSize.REGULAR}>
            <LabelPill.Text>IN PROGRESS</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.WARNING} size={LabelPillSize.REGULAR}>
            <LabelPill.Icon Component={Shield16} />
            <LabelPill.Text>CONFIDENTIAL</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.FTUX} size={LabelPillSize.REGULAR}>
            <LabelPill.Text>NEW</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.ALERT} size={LabelPillSize.REGULAR}>
            <LabelPill.Text>DUE JUL 9 AT 11:59 PM</LabelPill.Text>
        </LabelPill.Pill>{' '}
        <LabelPill.Pill type={LabelPillStatus.SUCCESS} size={LabelPillSize.REGULAR}>
            <LabelPill.Text>SUCCESS</LabelPill.Text>
        </LabelPill.Pill>{' '}
    </div>
);

export default {
    title: 'Components/LabelPill',
    subcomponents: {
        'LabelPill.Pill': LabelPill.Pill,
        'LabelPill.Text': LabelPill.Text,
        'LabePill.Icon': LabelPill.Icon,
    },
    parameters: {
        notes,
    },
};
