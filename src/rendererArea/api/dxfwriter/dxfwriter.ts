export class DXFWriter {
    private layers: Layer[] = [];
    private components: IDXFWriterGeometryComponent[] = [];
    private styles: StyleBase<StyleType>[] = [];  // 스타일 목록

    // Register a new layer
    registerLayer(layer: Layer): void {
        this.layers.push(layer);
    }

    // Register a new Text style
    registerTextStyle(style: TextStyle): void {
        // 중복 등록 방지를 위해 스타일 목록에 없는 경우에만 추가
        if (!this.styles.some(s => s.styleName === style.styleName)) {
            this.styles.push(style);
        }
    }

    // Register a new Text style
    registerLineStyle(style: LineStyle): void {
        // 중복 등록 방지를 위해 스타일 목록에 없는 경우에만 추가
        if (!this.styles.some(s => s.styleName === style.styleName)) {
            this.styles.push(style);
        }
    }

    // Add a geometry component (Line, Text, etc.)
    addComponent(component: IDXFWriterGeometryComponent): void {
        this.components.push(component);
    }

    // Serialize the DXF content to a string
    serialize(): string {
        return [
            this.serializeHeader(),
            this.serializeTables(),
            this.serializeEntities(),
            '0\nEOF\n'  // EOF ensures the file ends properly
        ].join('\n');
    }

    // Serialize the HEADER section with AutoCAD version
    private serializeHeader(): string {
        return [
            '0', 'SECTION',
            '2', 'HEADER',
            '0', 'ENDSEC'
        ].join('\n');
    }

    // Serialize the TABLES section with LAYER and required APPID table
    private serializeTables(): string {
        const tables = [
            '0', 'SECTION', '2', 'TABLES',
        ];

        // LAYER table start
        tables.push('0', 'TABLE', '2', 'LAYER');
    
        // Add each layer's serialization
        for (const layer of this.layers) {
            tables.push(layer.serialize());
        }

        // Layer table end
        tables.push('0', 'ENDTAB');

        // Style table start
        tables.push('0', 'TABLE', '2', 'STYLE');

        // Add each style's serialization
        console.log(this.styles);
        for (const style of this.styles) {
            if(style.styleType == StyleType.TextStyle) {
                tables.push(style.serialize());
            }
        }
        
        // End of LAYER table
        tables.push('0', 'ENDTAB');  
    
        // End of TABLES section
        tables.push('0', 'ENDSEC');  
        return tables.join('\n');
    }

    // Serialize the ENTITIES section
    private serializeEntities(): string {
        if (this.components.length === 0) return '';  // If no entities, skip this section

        const entities = [
            '0', 'SECTION', '2', 'ENTITIES'
        ];

        for (const component of this.components) {
            entities.push(component.serialize());
        }

        entities.push('0', 'ENDSEC');  // End of ENTITIES section
        return entities.join('\n');
    }

    // Export as DXF file and trigger download
    exportAsDXFFile(fileName = 'drawing.dxf'): void {
        const dxfContent = this.serialize();
        const blob = new Blob([dxfContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    static testNoEntityWithLayers() {
        const writer = new DXFWriter();

        // Create layers
        const layerA = new Layer('LayerA', 1);  // 빨간색 레이어
        const layerB = new Layer('LayerB', 2);  // 노란색 레이어

        // Register layers
        writer.registerLayer(layerA);
        writer.registerLayer(layerB);

        // Serialize and download as DXF file (no entities, only layers)
        writer.exportAsDXFFile('test_no_entity_with_layers.dxf');
    }

    static testTextEntityWithLayers() {
        const writer = new DXFWriter();

        // Create layers
        const layerA = new Layer('LayerA', 1);  // 빨간색 레이어
        const layerB = new Layer('LayerB', 2);  // 노란색 레이어

        // Register layers
        writer.registerLayer(layerA);
        writer.registerLayer(layerB);
        

        // Create text style
        const textStyleA = new TextStyle('TextStyleA', 'malgun', 'malgun.ttf', 500);

        // Register text style
        writer.registerTextStyle(textStyleA);

        const textA = new Text('TestA', 0, 0, 0, 500, layerA, -1, 'left', textStyleA);
        writer.addComponent(textA);
        const line1 = new Line({x: 0, y: 0, z: 0}, {x: 50, y: 50, z: 0}, layerB);
        writer.addComponent(line1);
        const line2 = new Line({x: 0, y: 50, z: 0}, {x: 50, y: 50, z: 0}, layerB, 4);
        writer.addComponent(line2);

        // Create Cylinder
        const cylinder = new Cylinder({x: 0, y: 0, z: 0}, 1000, 8000, 64, layerA);
        writer.addComponent(cylinder);

        // Serialize and download as DXF file (no entities, only layers)
        writer.exportAsDXFFile('test_entity_styled.dxf');
    }
}


// Non-geometry Items
export class Layer {
    constructor(
        public name: string,
        public color: number = 0,
        public lineStyle: string = 'CONTINUOUS'
    ) {}

    toString(): string {
        return this.name;
    }

    serialize(): string {
        return [
            '0',
            'LAYER',
            '2', this.name, // Layer Name
            '70', '0', // Layer Flag (Status)
            '62', this.color.toString(), // Layer Color (Negative means layer is off);
            '6', this.lineStyle,
        ].join('\n');
    }
}

export class Block {
    public entities: IDXFWriterGeometryComponent[] = [];

    constructor(
        public name: string,
        public basePoint: { x: number, y: number, z: number } = { x: 0, y: 0, z: 0 }
    ) {}

    // Add an entity to the block
    addEntity(entity: IDXFWriterGeometryComponent): void {
        this.entities.push(entity);
    }

    serialize(): string {
        let dxfString = `0\nBLOCK\n8\n0\n2\n${this.name}\n10\n${this.basePoint.x}\n20\n${this.basePoint.y}\n30\n${this.basePoint.z}\n`;

        // Serialize all entities in the block
        for (const entity of this.entities) {
            dxfString += entity.serialize();
        }

        // End block definition
        dxfString += `0\nENDBLK\n`;
        return dxfString;
    }
}

export class BlockInsert {
    constructor(
        public blockName: string,
        public position: { x: number, y: number, z: number },
        public scale: { x: number, y: number, z: number } = { x: 1, y: 1, z: 1 },
        public rotation: number = 0
    ) {}

    serialize(): string {
        return `0\nINSERT\n8\n0\n2\n${this.blockName}\n10\n${this.position.x}\n20\n${this.position.y}\n30\n${this.position.z}\n41\n${this.scale.x}\n42\n${this.scale.y}\n43\n${this.scale.z}\n50\n${this.rotation}\n`;
    }
}

enum StyleType {
    LineType = 'LineType',
    TextStyle = 'TextStyle',
}

interface StyleBase<T extends StyleType> {
    styleType: T;
    styleName: string;
    serialize(): string;
}

export class TextStyle implements StyleBase<StyleType.TextStyle> {
    readonly styleType = StyleType.TextStyle;
    styleName: string;

    public font: string;  // 폰트 파일 이름 또는 경로
    public bigfont: string;  // 폰트 파일 이름 또는 경로
    public height: number; // 고정된 텍스트 높이 (0일 경우 자유 높이)
    public widthFactor: number; // 텍스트 폭 비율 (기본값 1.0)
    
    constructor(
        styleName: string,  // 스타일 이름
        font: string,  // 폰트 파일 이름 또는 경로
        bigfont: string,
        height = 0.0, // 고정된 텍스트 높이 (0일 경우 자유 높이)
        widthFactor = 1.0 // 텍스트 폭 비율 (기본값 1.0)
    ) {
        this.styleName = styleName;
        this.font = font;
        this.bigfont = bigfont;
        this.height = height;
        this.widthFactor = widthFactor;
    }

    // 직렬화 메서드
    serialize(): string {
        return [
            '0', 'STYLE',
            '2', this.styleName,            // Style name
            '70', '0',                      // Flag
            '40', `0.0`,                    // Text height
            '41', `${this.widthFactor}`,    // Width factor
            '50', `0.0`,                    // Oblique angle
            '71', `0`,                      // Text generation flag
            '42', `${this.height}`,         // Last height used
            '3', this.font,                 // Font name
        '4', this.bigfont,                  // Big font name
        ].join('\n');
    }
}

export class LineStyle implements StyleBase<StyleType.LineType> {
    readonly styleType: StyleType.LineType;
    public styleName: string;

    lineType: string;
    serialize(): string {
        throw new Error("Method not implemented.");
    }

    constructor(
        styleName = 'Default',
        lineType = 'CONTINUOUS',
    ) {
        this.styleName = styleName;
        this.lineType = lineType
    }
}


// Geometry Items
export interface IDXFWriterGeometryComponent {
    layer: Layer,
    color: number,
    serialize(): string;
}

export class Text implements IDXFWriterGeometryComponent {
    public content: string;
    public x: number;
    public y: number;
    public z: number;
    public height: number;
    public layer: Layer;
    public style: TextStyle;
    public color = -1;
    public textAlignment: 'left'|'center'|'right'|'aligned'|'middle'|'fit';
    
    constructor(
        content: string,
        x: number,
        y: number,
        z: number,
        height: number,
        layer: Layer,
        color = -1,
        textAlignment:'left'|'center'|'right'|'aligned'|'middle'|'fit',
        style?: TextStyle
    ) {
        this.content = content;
        this.x = x;
        this.y = y;
        this.z = z;
        this.height = height;
        this.layer = layer;
        this.color = color;
        this.textAlignment = textAlignment;
        this.style = style;
    }

    serialize(): string {
        const colorIndex = this.color > -1 ? this.color : this.layer.color;
        let alignIndex: number;
        switch(this.textAlignment) {
            case 'left':
                alignIndex = 0;
                break;
            case 'center':
                alignIndex = 1;
                break;
            case 'right':
                alignIndex = 2;
                break;
            case 'aligned':
                alignIndex = 3;
                break;
            case 'middle':
                alignIndex = 4;
                break;
            case 'fit':
                alignIndex = 5;
                break;
        }

        const prop = [
            '0', 'TEXT',
            '8', `${this.layer}`,  // 레이어
            '62', `${colorIndex}`, // 색상
            '10', `${this.x}`,     // X 좌표
            '20', `${this.y}`,     // Y 좌표
            '40', `${this.height}`,// 텍스트 높이
            '1', `${this.content}`,// 텍스트 내용
            '72', `${alignIndex}`,
        ];
        
        if(this.style) {
            prop.push('7', this.style.styleName);
        }

        const serialized = prop.join('\n');

        return serialized;
    }
}

export class Line implements IDXFWriterGeometryComponent {
    constructor(
        public ptStart: {x: number, y: number, z: number},
        public ptEnd: {x: number, y: number, z: number},
        public layer: Layer,
        public color = -1
    ) {}

    serialize(): string {
        const props = [
            '0',
            'LINE',
            '8', `${this.layer}`,
            '10', `${this.ptStart.x}`,
            '20', `${this.ptStart.y}`,
            '30', `${this.ptStart.z}`,
            '11', `${this.ptEnd.x}`,
            '21', `${this.ptEnd.y}`,
            '31', `${this.ptEnd.z}`
        ];
        if(this.color > -1) {
            props.push('62');
            props.push(this.color.toString());
        }
        
        return props.join('\n');
    }
}

export class Polyline implements IDXFWriterGeometryComponent {
    constructor(
        public pts: { x: number, y: number, z: number }[], // 다각선의 꼭지점들
        public layer: Layer, // 레이어
        public color = -1 // 색상 (기본값 -1)
    ) {
        if (pts.length < 2) {
            throw new Error('Polyline should contain more than 2 points.');
        }
    }

    serialize(): string {
        const colorIndex = this.color > -1 ? this.color : this.layer.color;

        // POLYLINE 객체 헤더 부분
        const dxfArray = [
            '0', 'POLYLINE',
            '8', `${this.layer}`,  // 레이어 이름
            '62', `${colorIndex}`, // 색상 (개체 색상 또는 레이어 색상)
            '66', '1',             // 다음에 VERTEX를 기대함
            '70', '0'              // 플래그 (0으로 기본)
        ];

        // 각 꼭지점 (VERTEX) 직렬화
        for (const pt of this.pts) {
            dxfArray.push(
                '0', 'VERTEX',
                '8', `${this.layer}`, // 레이어 이름
                '10', `${pt.x}`,      // X 좌표
                '20', `${pt.y}`,      // Y 좌표
                '30', `${pt.z}`       // Z 좌표
            );
        }

        // SEQEND로 폴리라인 마무리
        dxfArray.push('0', 'SEQEND');

        // 배열을 join하여 하나의 문자열로 직렬화
        return dxfArray.join('\n');
    }
}

export class Cylinder implements IDXFWriterGeometryComponent {
    constructor(
        public center: { x: number, y: number, z: number },
        public radius: number,
        public height: number,
        public segments: number = 64,
        public layer: Layer,
        public color = -1
    ) {
        if (segments < 3) {
            throw new Error('Cylinder should have at least 3 segments.');
        }
    }

    private generateCirclePoints(z: number): { x: number, y: number, z: number }[] {
        return Array.from({ length: this.segments }, (_, i) => {
            const angle = (i / this.segments) * Math.PI * 2;
            return {
                x: this.center.x + this.radius * Math.cos(angle),
                y: this.center.y + this.radius * Math.sin(angle),
                z: z
            };
        });
    }

    serialize(): string {
        const colorIndex = this.color > -1 ? this.color : this.layer.color;
        const bottomCircle = this.generateCirclePoints(this.center.z);
        const topCircle = this.generateCirclePoints(this.center.z + this.height);
    
        const dxfArray: string[] = [];
    
        // Bottom circle polyline
        dxfArray.push(...this.serializePolyline(bottomCircle, colorIndex));
    
        // Top circle polyline
        dxfArray.push(...this.serializePolyline(topCircle, colorIndex));
    
        // Side faces
        for (let i = 0; i < this.segments; i++) {
            const next = (i + 1) % this.segments;
            dxfArray.push(...this.serialize3DFace([
                bottomCircle[i], topCircle[i], topCircle[next], bottomCircle[next]
            ], colorIndex));
        }
    
        // Bottom cap (첫 번째와 마지막 삼각형을 포함)
        for (let i = 0; i < this.segments - 1; i++) {
            dxfArray.push(...this.serialize3DFace([
                { ...this.center },
                bottomCircle[i],
                bottomCircle[i + 1],
                bottomCircle[i + 1],
            ], colorIndex));
        }
    
        // 마지막 삼각형 추가 (첫 번째 점과 마지막 점 연결)
        dxfArray.push(...this.serialize3DFace([
            { ...this.center },
            bottomCircle[this.segments - 1],
            bottomCircle[0],
            bottomCircle[0],
        ], colorIndex));
    
        // Top cap (첫 번째와 마지막 삼각형을 포함)
        for (let i = 0; i < this.segments - 1; i++) {
            dxfArray.push(...this.serialize3DFace([
                { ...this.center, z: this.center.z + this.height },
                topCircle[i],
                topCircle[i + 1],
                topCircle[i + 1],
            ], colorIndex));
        }
    
        // 마지막 삼각형 추가 (첫 번째 점과 마지막 점 연결)
        dxfArray.push(...this.serialize3DFace([
            { ...this.center, z: this.center.z + this.height },
            topCircle[this.segments - 1],
            topCircle[0],
            topCircle[0],
        ], colorIndex));
    
        return dxfArray.join('\n');
    }

    private serializePolyline(points: { x: number, y: number, z: number }[], colorIndex: number): string[] {
        const dxfArray = [
            '0', 'POLYLINE',
            '8', `${this.layer.name}`,
            '62', `${colorIndex}`,
            '66', '1',
            '70', '0'
        ];

        for (const pt of points) {
            dxfArray.push(
                '0', 'VERTEX',
                '8', `${this.layer.name}`,
                '10', `${pt.x}`,
                '20', `${pt.y}`,
                '30', `${pt.z}`
            );
        }

        dxfArray.push('0', 'SEQEND');

        return dxfArray;
    }

    private serialize3DFace(points: { x: number, y: number, z: number }[], colorIndex: number): string[] {
        return [
            '0', '3DFACE',
            '8', `${this.layer.name}`,
            '62', `${colorIndex}`,
            '10', `${points[0].x}`, '20', `${points[0].y}`, '30', `${points[0].z}`,
            '11', `${points[1].x}`, '21', `${points[1].y}`, '31', `${points[1].z}`,
            '12', `${points[2].x}`, '22', `${points[2].y}`, '32', `${points[2].z}`,
            '13', `${points[3].x}`, '23', `${points[3].y}`, '33', `${points[3].z}`
        ];
    }
}