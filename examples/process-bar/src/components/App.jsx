// Copyright 2017 Quip
/* @flow */

import quip from "quip";
import React from "react";
import cx from "classnames";

import Styles from "./App.less";

import Step from "./Step.jsx";

export default class App extends React.Component {
    static propTypes = {
        rootRecord: React.PropTypes.instanceOf(quip.apps.RootRecord).isRequired,
        steps: React.PropTypes.instanceOf(quip.apps.RecordList).isRequired,
        color: React.PropTypes.string.isRequired,
        selected: React.PropTypes.string,
    };

    setSelected = record => {
        this.props.rootRecord.set("selected", record.getId());
    };

    deleteStep = record => {
        const {steps, selected} = this.props;
        const next = record.getPreviousSibling() || record.getNextSibling();
        const isSelected = record.getId() === selected;

        steps.remove(record);

        if (isSelected && next) {
            this.setSelected(next);
        }

        quip.apps.recordQuipMetric("delete_step");
    };

    componentDidMount() {
        quip.apps.addEventListener(
            quip.apps.EventType.CONTAINER_SIZE_UPDATE,
            this.onContainerResize_);
    }

    componentWillUnmount() {
        quip.apps.removeEventListener(
            quip.apps.EventType.CONTAINER_SIZE_UPDATE,
            this.onContainerResize_);
    }

    render() {
        const {steps, selected, color} = this.props;
        const inGridLayout = quip.apps.inGridLayout && quip.apps.inGridLayout();
        let stepWidth;
        if (inGridLayout) {
            stepWidth = quip.apps.getContainerWidth() / steps.count();
        }

        return <div
            tabIndex="0"
            className={cx(Styles.container, {
                [Styles.fixedWidth]: !inGridLayout,
            })}>
            {steps
                .getRecords()
                .map(step => <Step
                    color={color}
                    selected={selected === step.getId()}
                    key={step.getId()}
                    record={step}
                    width={stepWidth}
                    onSelected={this.setSelected}
                    onDelete={this.deleteStep}/>)}
        </div>;
    }

    onContainerResize_ = () => {
        this.forceUpdate();
    };
}
