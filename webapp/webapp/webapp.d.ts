/// <reference path="./bridge.d.ts" />

declare namespace app {
    interface App {
    }
    interface AppFunc extends Function {
        prototype: App;
        MyCanvasAction: app.App.MyCanvasActionFunc;
        new (): App;
        Main(): void;
        LoadRes(webgl: Bridge.WebGL.WebGLRenderingContext | null): void;
    }
    var App: AppFunc;
    module App {
        interface MyCanvasAction extends lighttool.canvasAction {
            ondraw(c: lighttool.spriteCanvas | null): void;
            onpointevent(c: lighttool.spriteCanvas | null, e: lighttool.canvaspointevent, x: number, y: number): boolean;
            onresize(c: lighttool.spriteCanvas | null): void;
        }
        interface MyCanvasActionFunc extends Function {
            prototype: MyCanvasAction;
            new (): MyCanvasAction;
        }
    }

}

declare namespace lighttool {
    interface atlasMgr {
        reg(name: string | null, urlatlas: string | null, urlatalstex: string | null, urlatalstex_add: string | null): void;
        unreg(name: string | null, disposetex: boolean): void;
        regDirect(name: string | null, atlas: lighttool.spriteAtlas | null): void;
        unload(name: string | null, disposetex: boolean): void;
        load(webgl: Bridge.WebGL.WebGLRenderingContext | null, name: string | null): lighttool.spriteAtlas | null;
    }
    interface atlasMgrFunc extends Function {
        prototype: atlasMgr;
        new (): atlasMgr;
        Instance(): lighttool.atlasMgr | null;
    }
    var atlasMgr: atlasMgrFunc;

    interface textureMgr {
        reg(url: string | null, urladd: string | null, format: lighttool.textureformat, mipmap: boolean, linear: boolean): void;
        regDirect(url: string | null, tex: lighttool.spriteTexture | null): void;
        unreg(url: string | null): void;
        unload(url: string | null): void;
        load(webgl: Bridge.WebGL.WebGLRenderingContext | null, url: string | null): lighttool.spriteTexture | null;
    }
    interface textureMgrFunc extends Function {
        prototype: textureMgr;
        new (): textureMgr;
        Instance(): lighttool.textureMgr | null;
    }
    var textureMgr: textureMgrFunc;

    enum textureformat {
        RGBA = 1,
        RGB = 2,
        GRAY = 3
    }

    interface texReader {
        width: number;
        height: number;
        data: Uint8Array | null;
        gray: boolean;
        getPixel(u: number, v: number): any | null;
    }
    interface texReaderFunc extends Function {
        prototype: texReader;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, texRGBA: Bridge.WebGL.WebGLTexture | null, width: number, height: number, gray: boolean): texReader;
    }
    var texReader: texReaderFunc;

    interface stateRecorder {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        DEPTH_WRITEMASK: boolean;
        DEPTH_TEST: boolean;
        DEPTH_FUNC: number;
        BLEND: boolean;
        BLEND_EQUATION: number;
        BLEND_SRC_RGB: number;
        BLEND_SRC_ALPHA: number;
        BLEND_DST_RGB: number;
        BLEND_DST_ALPHA: number;
        CURRENT_PROGRAM: Bridge.WebGL.WebGLProgram | null;
        ARRAY_BUFFER: Bridge.WebGL.WebGLBuffer | null;
        ACTIVE_TEXTURE: number;
        TEXTURE_BINDING_2D: Bridge.WebGL.WebGLTexture | null;
        record(): void;
        restore(): void;
    }
    interface stateRecorderFunc extends Function {
        prototype: stateRecorder;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null): stateRecorder;
    }
    var stateRecorder: stateRecorderFunc;

    interface spriteTexture {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        img: HTMLImageElement | null;
        loaded: boolean;
        texture: Bridge.WebGL.WebGLTexture | null;
        format: lighttool.textureformat;
        width: number;
        height: number;
        mat: lighttool.spriteMat | null;
        reader: lighttool.texReader | null;
        disposeit: boolean;
        pointbuf: lighttool.spritePoint[] | null;
        getReader(redOnly: boolean): lighttool.texReader | null;
        dispose(): void;
        draw(spriteBatcher: lighttool.spriteBatcher | null, uv: lighttool.spriteRect, rect: lighttool.spriteRect, c: lighttool.spriteColor | null): void;
        drawCustom(spriteBatcher: lighttool.spriteBatcher | null, _mat: lighttool.spriteMat | null, uv: lighttool.spriteRect, rect: lighttool.spriteRect, c: lighttool.spriteColor | null, c2: lighttool.spriteColor | null): void;
    }
    interface spriteTextureFunc extends Function {
        prototype: spriteTexture;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, url: string | null, format: lighttool.textureformat, mipmap: boolean, linear: boolean): spriteTexture;
        fromRaw(webgl: Bridge.WebGL.WebGLRenderingContext | null, img: HTMLImageElement | null, format?: lighttool.textureformat, mipmap?: boolean, linear?: boolean): lighttool.spriteTexture | null;
    }
    var spriteTexture: spriteTextureFunc;

    interface spriteRect {
        x: number;
        y: number;
        w: number;
        h: number;
        getHashCode(): number;
        equals(o: lighttool.spriteRect): boolean;
        $clone(to: lighttool.spriteRect): lighttool.spriteRect;
    }
    interface spriteRectFunc extends Function {
        prototype: spriteRect;
        $ctor1: {
            new (x: number, y: number, w: number, h: number): spriteRect
        };
        new (): spriteRect;
        ctor: {
            new (): spriteRect
        };
        one: lighttool.spriteRect;
        zero: lighttool.spriteRect;
    }
    var spriteRect: spriteRectFunc;

    interface spritePoint {
        x: number;
        y: number;
        z: number;
        r: number;
        g: number;
        b: number;
        a: number;
        r2: number;
        g2: number;
        b2: number;
        a2: number;
        u: number;
        v: number;
    }
    interface spritePointFunc extends Function {
        prototype: spritePoint;
        new (): spritePoint;
    }
    var spritePoint: spritePointFunc;

    interface spriteMat {
        shader: string | null;
        transparent: boolean;
        tex0: lighttool.spriteTexture | null;
        tex1: lighttool.spriteTexture | null;
        col0: lighttool.spriteColor | null;
        col1: lighttool.spriteColor | null;
    }
    interface spriteMatFunc extends Function {
        prototype: spriteMat;
        new (): spriteMat;
    }
    var spriteMat: spriteMatFunc;

    interface spriteFont {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        texture: lighttool.spriteTexture | null;
        mat: lighttool.spriteMat | null;
        cmap: any | null;
        fontname: string | null;
        pointSize: number;
        padding: number;
        lineHeight: number;
        baseline: number;
        atlasWidth: number;
        atlasHeight: number;
        _parse(txt: string | null): void;
        draw(sb: lighttool.spriteBatcher | null, r: lighttool.charinfo | null, rect: lighttool.spriteRect, c?: lighttool.spriteColor | null, colorBorder?: lighttool.spriteColor | null): void;
        drawChar(sb: lighttool.spriteBatcher | null, cname: string | null, rect: lighttool.spriteRect, c?: lighttool.spriteColor | null, colorBorder?: lighttool.spriteColor | null): void;
    }
    interface spriteFontFunc extends Function {
        prototype: spriteFont;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, urlconfig: string | null, texture: lighttool.spriteTexture | null): spriteFont;
        fromRaw(webgl: Bridge.WebGL.WebGLRenderingContext | null, txt: string | null, texture?: lighttool.spriteTexture | null): lighttool.spriteFont | null;
    }
    var spriteFont: spriteFontFunc;

    interface spriteColor {
        r: number;
        g: number;
        b: number;
        a: number;
    }
    interface spriteColorFunc extends Function {
        prototype: spriteColor;
        new (r: number, g: number, b: number, a: number): spriteColor;
        black: lighttool.spriteColor | null;
        gray: lighttool.spriteColor | null;
        white: lighttool.spriteColor | null;
    }
    var spriteColor: spriteColorFunc;

    interface spriteCanvas {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        width: number;
        height: number;
        spriteBatcher: lighttool.spriteBatcher | null;
        drawTexture(texture: lighttool.spriteTexture | null, rect: lighttool.spriteRect, uvrect: lighttool.spriteRect, color?: lighttool.spriteColor | null): void;
        drawTextureCustom(texture: lighttool.spriteTexture | null, _mat: lighttool.spriteMat | null, rect: lighttool.spriteRect, uvrect: lighttool.spriteRect, color?: lighttool.spriteColor | null, color2?: lighttool.spriteColor | null): void;
        drawSprite(atlas: string | null, sprite: string | null, rect: lighttool.spriteRect, color?: lighttool.spriteColor | null): void;
        drawSpriteCustom(atlas: string | null, sprite: string | null, _mat: lighttool.spriteMat | null, rect: lighttool.spriteRect, color?: lighttool.spriteColor | null, color2?: lighttool.spriteColor | null): void;
        drawSprite9(atlas: string | null, sprite: string | null, rect: lighttool.spriteRect, border: lighttool.spriteBorder | null, color?: lighttool.spriteColor | null): void;
        drawSprite9Custom(atlas: string | null, sprite: string | null, _mat: lighttool.spriteMat | null, rect: lighttool.spriteRect, border: lighttool.spriteBorder | null, color?: lighttool.spriteColor | null, color2?: lighttool.spriteColor | null): void;
        drawText(font: string | null, text: string | null, rect: lighttool.spriteRect, color?: lighttool.spriteColor | null, color2?: lighttool.spriteColor | null): void;
    }
    interface spriteCanvasFunc extends Function {
        prototype: spriteCanvas;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, width: number, height: number): spriteCanvas;
    }
    var spriteCanvas: spriteCanvasFunc;

    interface spriteBorder {
        l: number;
        t: number;
        r: number;
        b: number;
    }
    interface spriteBorderFunc extends Function {
        prototype: spriteBorder;
        new (l: number, t: number, r: number, b: number): spriteBorder;
        zero: lighttool.spriteBorder | null;
    }
    var spriteBorder: spriteBorderFunc;

    interface spriteBatcher {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        shaderparser: lighttool.shaderParser | null;
        vbo: Bridge.WebGL.WebGLBuffer | null;
        matrix: Float32Array | null;
        ztest: boolean;
        recorder: lighttool.stateRecorder | null;
        shadercode: lighttool.shadercode | null;
        mat: lighttool.spriteMat | null;
        rectClip: lighttool.spriteRect | null;
        begindraw(): void;
        enddraw(): void;
        setMat(mat: lighttool.spriteMat | null): void;
        endbatch(): void;
        addQuad(ps: lighttool.spritePoint[] | null): void;
        addTri(ps: lighttool.spritePoint[] | null): void;
        addRect(ps: lighttool.spritePoint[] | null): void;
        setRectClip(rect: lighttool.spriteRect): void;
        closeRectClip(): void;
    }
    interface spriteBatcherFunc extends Function {
        prototype: spriteBatcher;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, shaderparser: lighttool.shaderParser | null): spriteBatcher;
    }
    var spriteBatcher: spriteBatcherFunc;

    interface texutreMgrItem {
        tex: lighttool.spriteTexture | null;
        url: string | null;
        urladd: string | null;
        format: lighttool.textureformat;
        mipmap: boolean;
        linear: boolean;
    }
    interface texutreMgrItemFunc extends Function {
        prototype: texutreMgrItem;
        new (): texutreMgrItem;
    }
    var texutreMgrItem: texutreMgrItemFunc;

    interface sprite {
        x: number;
        y: number;
        w: number;
        h: number;
        xsize: number;
        ysize: number;
        ToRect(): lighttool.spriteRect;
    }
    interface spriteFunc extends Function {
        prototype: sprite;
        new (): sprite;
    }
    var sprite: spriteFunc;

    interface shaderParser {
        mapshader: System.Collections.Generic.Dictionary$2<string,lighttool.shadercode> | null;
        parseUrl(webgl: Bridge.WebGL.WebGLRenderingContext | null, url: string | null): void;
        parseDirect(webgl: Bridge.WebGL.WebGLRenderingContext | null, txt: string | null): void;
    }
    interface shaderParserFunc extends Function {
        prototype: shaderParser;
        new (): shaderParser;
    }
    var shaderParser: shaderParserFunc;

    interface shaderMgr {
    }
    interface shaderMgrFunc extends Function {
        prototype: shaderMgr;
        new (): shaderMgr;
        parserInstance(): lighttool.shaderParser | null;
    }
    var shaderMgr: shaderMgrFunc;

    interface shadercode {
        vscode: string | null;
        fscode: string | null;
        vs: Bridge.WebGL.WebGLShader | null;
        fs: Bridge.WebGL.WebGLShader | null;
        program: Bridge.WebGL.WebGLProgram | null;
        posPos: number;
        posColor: number;
        posColor2: number;
        posUV: number;
        uniMatrix: Bridge.WebGL.WebGLUniformLocation | null;
        uniTex0: Bridge.WebGL.WebGLUniformLocation | null;
        uniTex1: Bridge.WebGL.WebGLUniformLocation | null;
        uniCol0: Bridge.WebGL.WebGLUniformLocation | null;
        uniCol1: Bridge.WebGL.WebGLUniformLocation | null;
        compile(webgl: Bridge.WebGL.WebGLRenderingContext | null): void;
    }
    interface shadercodeFunc extends Function {
        prototype: shadercode;
        new (): shadercode;
    }
    var shadercode: shadercodeFunc;

    interface loadTool {
    }
    interface loadToolFunc extends Function {
        prototype: loadTool;
        new (): loadTool;
        loadText(url: string | null, fun: {(arg1: string, arg2: Error): void} | null): void;
        loadArrayBuffer(url: string | null, fun: {(arg1: ArrayBuffer, arg2: Error): void} | null): void;
        loadBlob(url: string | null, fun: {(arg1: Blob, arg2: Error): void} | null): void;
    }
    var loadTool: loadToolFunc;

    interface fontMgrItem {
        font: lighttool.spriteFont | null;
        url: string | null;
        urlatalstex: string | null;
        urlatalstex_add: string | null;
    }
    interface fontMgrItemFunc extends Function {
        prototype: fontMgrItem;
        new (): fontMgrItem;
    }
    var fontMgrItem: fontMgrItemFunc;

    interface fontMgr {
        reg(name: string | null, urlfont: string | null, urlatalstex: string | null, urlatalstex_add: string | null): void;
        regDirect(name: string | null, font: lighttool.spriteFont | null): void;
        unreg(name: string | null, disposetex: boolean): void;
        unload(name: string | null, disposetex: boolean): void;
        load(webgl: Bridge.WebGL.WebGLRenderingContext | null, name: string | null): lighttool.spriteFont | null;
    }
    interface fontMgrFunc extends Function {
        prototype: fontMgr;
        new (): fontMgr;
        Instance(): lighttool.fontMgr | null;
    }
    var fontMgr: fontMgrFunc;

    interface charinfo {
        x: number;
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;
        yOffset: number;
        xAddvance: number;
    }
    interface charinfoFunc extends Function {
        prototype: charinfo;
        new (): charinfo;
    }
    var charinfo: charinfoFunc;

    enum canvaspointevent {
        NONE = 0,
        POINT_DOWN = 1,
        POINT_UP = 2,
        POINT_MOVE = 3
    }

    interface atlasMgrItem {
        atals: lighttool.spriteAtlas | null;
        url: string | null;
        urlatalstex: string | null;
        urlatalstex_add: string | null;
    }
    interface atlasMgrItemFunc extends Function {
        prototype: atlasMgrItem;
        new (): atlasMgrItem;
    }
    var atlasMgrItem: atlasMgrItemFunc;

    interface canvasAction {
        lighttool$canvasAction$onresize(c: lighttool.spriteCanvas | null): void;
        onresize(c: lighttool.spriteCanvas | null): void;
        lighttool$canvasAction$ondraw(c: lighttool.spriteCanvas | null): void;
        ondraw(c: lighttool.spriteCanvas | null): void;
        lighttool$canvasAction$onpointevent(c: lighttool.spriteCanvas | null, e: lighttool.canvaspointevent, x: number, yk: number): boolean;
        onpointevent(c: lighttool.spriteCanvas | null, e: lighttool.canvaspointevent, x: number, yk: number): boolean;
    }

    interface spriteAtlas {
        webgl: Bridge.WebGL.WebGLRenderingContext | null;
        textureurl: string | null;
        texturewidth: number;
        textureheight: number;
        texture: lighttool.spriteTexture | null;
        sprites: System.Collections.Generic.Dictionary$2<string,lighttool.sprite> | null;
        drawByTexture(sb: lighttool.spriteBatcher | null, sname: string | null, rect: lighttool.spriteRect, c: lighttool.spriteColor | null): void;
    }
    interface spriteAtlasFunc extends Function {
        prototype: spriteAtlas;
        new (webgl: Bridge.WebGL.WebGLRenderingContext | null, atlasurl: string | null, texture: lighttool.spriteTexture | null): spriteAtlas;
        fromRaw(webgl: Bridge.WebGL.WebGLRenderingContext | null, txt: string | null, texture?: lighttool.spriteTexture | null): lighttool.spriteAtlas | null;
    }
    var spriteAtlas: spriteAtlasFunc;

}

declare namespace lighttool.Native {
    interface canvasAdapter {
    }
    interface canvasAdapterFunc extends Function {
        prototype: canvasAdapter;
        new (): canvasAdapter;
        CreateScreenCanvas(webgl: Bridge.WebGL.WebGLRenderingContext | null, useraction: lighttool.canvasAction | null): lighttool.spriteCanvas | null;
    }
    var canvasAdapter: canvasAdapterFunc;
}
