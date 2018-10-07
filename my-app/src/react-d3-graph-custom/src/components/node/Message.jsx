import React from 'react';

import CONST from './node.const';

import nodeHelper from './node.helper';

export default class Message extends React.Component {
    render() {
        const nodeProps = {
            cursor: this.props.cursor,
            opacity: this.props.opacity
        };

        const textProps = {
            dx: this.props.dx || CONST.NODE_LABEL_DX,
            dy: CONST.NODE_LABEL_DY,
            fill: this.props.fontColor,
            fontSize: this.props.fontSize,
            fontWeight: this.props.fontWeight,
            opacity: this.props.opacity
        };

        const size = this.props.size;
        let gtx = this.props.cx;
        let gty = this.props.cy;
        let label;
        let node;

        nodeProps.d = nodeHelper.buildSvgSymbol(size, this.props.type);
        nodeProps.fill = this.props.fill;
        nodeProps.stroke = this.props.stroke;
        nodeProps.strokeWidth = this.props.strokeWidth;

        label = <text {...textProps}>{this.props.label}</text>;
        node = <path {...nodeProps} />;

        const gProps = {
            className: this.props.className,
            cx: this.props.cx,
            cy: this.props.cy,
            id: this.props.id,
            transform: `translate(${gtx},${gty})`
        };

        return (
            <g {...gProps}>
                {node}
                {this.props.renderLabel && label}
            </g>
        );
    }
}
