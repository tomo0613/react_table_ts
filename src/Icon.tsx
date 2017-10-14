import * as React from 'react';

const icons = {
    close: `
        M672 256l-160 160-160-160-96 96 160 160-160 160 96 96 160-160 160 160 96-96-160-160 160-160z
        M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512z
        M512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416z
    `,
    enlarger: `
        M406 598c106 0 192-86 192-192s-86-192-192-192-192 86-192 192 86 192 192 192z
        M662 598l212 212-64 64-212-212v-34l-12-12c-48 42-112 66-180 66-154 0-278-122-278-276s124-278 278-278 276 124 276 278c0 68-24 132-66 180l12 12h34z
    `,
    arrowUp: `M298 598l214-214 214 214h-428z`,
    arrowDown: `M298 426h428l-214 214z`,
};

interface Props {
    icon: string,
    size?: number,
    color?: string,
}

class Icon extends React.Component<Props> {
    static defaultProps = {
        size: 24,
    };

    render() {
        const size = this.props.size;
        const containerStyle = {
            display: 'inline-block',
            verticalAlign: 'middle',
        };
        const pathStyle = {
            fill: this.props.color,
        };

        return (
            <svg style={containerStyle} width={size + 'px'} height={size + 'px'} viewBox="0 0 1024 1024">
                <path style={pathStyle} d={icons[this.props.icon]} />
            </svg>
        );
    }
}

export default Icon;
