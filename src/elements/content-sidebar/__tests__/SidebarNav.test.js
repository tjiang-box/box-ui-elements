import * as React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { BoxAiLogo } from '@box/blueprint-web-assets/icons/Logo';
import AdditionalTabPlaceholder from '../additional-tabs/AdditionalTabPlaceholder';
import AdditionalTabs from '../additional-tabs';
import AdditionalTabsLoading from '../additional-tabs/AdditionalTabsLoading';
import FeatureProvider from '../../common/feature-checking/FeatureProvider';
import DocGenIcon from '../../../icon/fill/DocGenIcon';
import IconChatRound from '../../../icons/general/IconChatRound';
import IconDocInfo from '../../../icons/general/IconDocInfo';
import IconMagicWand from '../../../icons/general/IconMagicWand';
import IconMetadataThick from '../../../icons/general/IconMetadataThick';
import SidebarNav from '../SidebarNav';
import SidebarNavButton from '../SidebarNavButton';
import SidebarNavSignButton from '../SidebarNavSignButton';

describe('elements/content-sidebar/SidebarNav', () => {
    const getWrapper = (props = {}, active = '', features = {}) =>
        mount(
            <MemoryRouter initialEntries={[`/${active}`]}>
                <FeatureProvider features={features}>
                    <SidebarNav {...props} />
                </FeatureProvider>
            </MemoryRouter>,
        )
            .find('SidebarNav')
            .at(1);

    test('should render skills tab', () => {
        const props = {
            hasSkills: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render details tab', () => {
        const props = {
            hasDetails: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(1);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render activity tab', () => {
        const props = {
            hasActivity: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
    });

    test('should render metadata tab', () => {
        const props = {
            hasMetadata: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should render box ai tab', () => {
        const props = {
            hasBoxAI: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(1);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
    });

    test('should have multiple tabs', () => {
        const props = {
            hasActivity: true,
            hasBoxAI: true,
            hasMetadata: true,
            hasSkills: true,
        };
        const wrapper = getWrapper(props, 'activity');
        expect(wrapper.find(IconMagicWand)).toHaveLength(1);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(1);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(1);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(1);
        expect(wrapper.find(SidebarNavButton)).toHaveLength(4);
    });

    test('should render the additional tabs loading state', () => {
        const props = {
            additionalTabs: [],
            hasAdditionalTabs: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(AdditionalTabs)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabsLoading)).toHaveLength(1);
        expect(wrapper.find(AdditionalTabPlaceholder)).toHaveLength(5);
    });

    test('should render the Box Sign entry point if its feature is enabled', () => {
        const features = {
            boxSign: {
                enabled: true,
                onClick: () => {},
            },
        };
        const wrapper = getWrapper({}, 'activity', features);
        expect(wrapper.exists(SidebarNavSignButton)).toBe(true);
    });

    test('should not render the Box Sign entry point if its feature is not enabled', () => {
        const wrapper = getWrapper();
        expect(wrapper.exists(SidebarNavSignButton)).toBe(false);
    });
    test('should render docgen tab', () => {
        const props = {
            hasDocGen: true,
        };
        const wrapper = getWrapper(props);
        expect(wrapper.find(IconMagicWand)).toHaveLength(0);
        expect(wrapper.find(IconMetadataThick)).toHaveLength(0);
        expect(wrapper.find(IconDocInfo)).toHaveLength(0);
        expect(wrapper.find(IconChatRound)).toHaveLength(0);
        expect(wrapper.find(BoxAiLogo)).toHaveLength(0);
        expect(wrapper.find(DocGenIcon)).toHaveLength(1);
    });
});
