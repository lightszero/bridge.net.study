/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2018
 * @compiler Bridge.NET 17.4.0
 */
Bridge.assembly("webapp", function ($asm, globals) {
    "use strict";

    Bridge.define("app.App", {
        main: function Main () {

            System.Console.WriteLine("Welcome to Bridge.NET 2018");

            var canvas = Bridge.as(document.getElementById("renderCanvas"), HTMLCanvasElement);
            app.App.webgl = canvas.getContext("webgl");
            if (app.App.webgl == null) {
                app.App.webgl = canvas.getContext("experimental-webgl");
            }

            app.App.LoadRes(app.App.webgl);

            lighttool.Native.canvasAdapter.CreateScreenCanvas(app.App.webgl, new app.App.MyCanvasAction());
        },
        statics: {
            fields: {
                webgl: null
            },
            methods: {
                LoadRes: function (webgl) {
                    lighttool.loadTool.loadText("shader/test.shader.txt?" + System.Double.format(Math.random()), function (txt, err) {
                        lighttool.shaderMgr.parserInstance().parseDirect(webgl, txt);
                    });



                    var img = new Image();
                    img.src = "tex/1.jpg";
                    img.onload = function (e) {
                        var _spimg = lighttool.spriteTexture.fromRaw(webgl, img, lighttool.textureformat.RGBA, true, true);
                        lighttool.textureMgr.Instance().regDirect("tex/1.jpg", _spimg);
                    };

                    lighttool.atlasMgr.Instance().reg("2", "atlas/2.json.txt?" + System.Double.format(Math.random()), "tex/2.png", "?" + System.Double.format(Math.random()));


                    var img2 = new Image();
                    img2.src = "tex/1.png?" + System.Double.format(Math.random());
                    img2.onload = function (e) {
                        var _spimg2 = lighttool.spriteTexture.fromRaw(webgl, img2, lighttool.textureformat.RGBA, true, true);
                        lighttool.textureMgr.Instance().regDirect("tex/1.png", _spimg2);

                        lighttool.loadTool.loadText("atlas/1.json.txt?" + System.Double.format(Math.random()), function (txt, err) {
                            var _atlas = lighttool.spriteAtlas.fromRaw(webgl, txt, _spimg2);
                            lighttool.atlasMgr.Instance().regDirect("1", _atlas);
                        });
                    };
                    var img3 = new Image();
                    img3.src = "tex/STXINGKA.font.png?" + System.Double.format(Math.random());
                    img3.onload = function (e) {
                        var _spimg3 = lighttool.spriteTexture.fromRaw(webgl, img3, lighttool.textureformat.RGBA, true, true);
                        lighttool.textureMgr.Instance().regDirect("tex/STXINGKA.font.png", _spimg3);
                        lighttool.loadTool.loadText("font/STXINGKA.font.json.txt", function (txt, err) {
                            var _font = lighttool.spriteFont.fromRaw(webgl, txt, _spimg3);
                            lighttool.fontMgr.Instance().regDirect("f1", _font);
                        });
                    };

                }
            }
        }
    });

    Bridge.define("lighttool.canvasAction", {
        $kind: "interface"
    });

    Bridge.define("lighttool.atlasMgr", {
        statics: {
            fields: {
                g_this: null
            },
            methods: {
                Instance: function () {
                    if (lighttool.atlasMgr.g_this == null) {
                        lighttool.atlasMgr.g_this = new lighttool.atlasMgr();
                    }

                    return lighttool.atlasMgr.g_this;
                }
            }
        },
        fields: {
            mapInfo: null
        },
        ctors: {
            init: function () {
                this.mapInfo = new (System.Collections.Generic.Dictionary$2(System.String,lighttool.atlasMgrItem))();
            }
        },
        methods: {
            reg: function (name, urlatlas, urlatalstex, urlatalstex_add) {
                if (this.mapInfo.containsKey(name)) {
                    throw new System.Exception("you can't reg the same name");
                }
                var item = new lighttool.atlasMgrItem();

                this.mapInfo.set(name, item);
                item.url = urlatlas;
                item.urlatalstex = urlatalstex;
                item.urlatalstex_add = urlatalstex_add;
            },
            unreg: function (name, disposetex) {
                var item = this.mapInfo.get(name);
                if (Bridge.referenceEquals(item, undefined)) {
                    return;
                }
                this.unload(name, disposetex);

                this.mapInfo.remove(name);

            },
            regDirect: function (name, atlas) {
                if (this.mapInfo.containsKey(name)) {
                    throw new System.Exception("you can't reg the same name");
                }
                var item = new lighttool.atlasMgrItem();

                this.mapInfo.set(name, item);
                item.atals = atlas;
            },
            unload: function (name, disposetex) {
                if (this.mapInfo.containsKey(name) === false) {
                    return;
                }
                var item = this.mapInfo.get(name);

                if (disposetex) {
                    item.atals.texture.dispose();
                    item.atals.texture = null;
                }
                item.atals = null;
            },
            load: function (webgl, name) {
                if (this.mapInfo.containsKey(name) === false) {
                    return null;
                }
                var item = this.mapInfo.get(name);
                if (item.atals == null) {
                    var tex = lighttool.textureMgr.Instance().load(webgl, item.urlatalstex);
                    if (Bridge.referenceEquals(tex, undefined)) {
                        lighttool.textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.RGBA, false, true);

                        tex = lighttool.textureMgr.Instance().load(webgl, item.urlatalstex);
                    }
                    item.atals = new lighttool.spriteAtlas(webgl, item.url, tex);
                }
                return item.atals;

            }
        }
    });

    Bridge.define("lighttool.atlasMgrItem", {
        fields: {
            atals: null,
            url: null,
            urlatalstex: null,
            urlatalstex_add: null
        }
    });

    Bridge.define("lighttool.canvaspointevent", {
        $kind: "enum",
        statics: {
            fields: {
                NONE: 0,
                POINT_DOWN: 1,
                POINT_UP: 2,
                POINT_MOVE: 3
            }
        }
    });

    Bridge.define("lighttool.charinfo", {
        fields: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            xSize: 0,
            ySize: 0,
            xOffset: 0,
            yOffset: 0,
            xAddvance: 0
        }
    });

    Bridge.define("lighttool.fontMgr", {
        statics: {
            fields: {
                g_this: null
            },
            methods: {
                Instance: function () {
                    if (lighttool.fontMgr.g_this == null) {
                        lighttool.fontMgr.g_this = new lighttool.fontMgr();
                    }

                    return lighttool.fontMgr.g_this;
                }
            }
        },
        fields: {
            mapInfo: null
        },
        ctors: {
            init: function () {
                this.mapInfo = new (System.Collections.Generic.Dictionary$2(System.String,lighttool.fontMgrItem))();
            }
        },
        methods: {
            reg: function (name, urlfont, urlatalstex, urlatalstex_add) {
                var item = this.mapInfo.get(name);
                if (!Bridge.referenceEquals(item, undefined)) {
                    throw new System.Exception("you can't reg the same name");
                }
                item = new lighttool.fontMgrItem();

                this.mapInfo.set(name, item);
                item.url = urlfont;
                item.urlatalstex = urlatalstex;
                item.urlatalstex_add = urlatalstex_add;
            },
            regDirect: function (name, font) {
                if (this.mapInfo.containsKey(name)) {
                    throw new System.Exception("you can't reg the same name");
                }
                var item = new lighttool.fontMgrItem();

                this.mapInfo.set(name, item);
                item.font = font;
            },
            unreg: function (name, disposetex) {
                if (this.mapInfo.containsKey(name) === false) {
                    return;
                }
                var item = this.mapInfo.get(name);
                this.unload(name, disposetex);

                this.mapInfo.remove(name);

            },
            unload: function (name, disposetex) {
                if (this.mapInfo.containsKey(name) === false) {
                    return;
                }

                var item = this.mapInfo.get(name);

                if (disposetex) {
                    item.font.texture.dispose();
                    item.font.texture = null;
                }
                item.font = null;
            },
            load: function (webgl, name) {
                if (this.mapInfo.containsKey(name) === false) {
                    return null;
                }

                var item = this.mapInfo.get(name);
                if (item.font == null) {
                    var tex = lighttool.textureMgr.Instance().load(webgl, item.urlatalstex);
                    if (Bridge.referenceEquals(tex, undefined)) {
                        lighttool.textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add, lighttool.textureformat.GRAY, false, true);

                        tex = lighttool.textureMgr.Instance().load(webgl, item.urlatalstex);
                    }
                    item.font = new lighttool.spriteFont(webgl, item.url, tex);
                }
                return item.font;

            }
        }
    });

    Bridge.define("lighttool.fontMgrItem", {
        fields: {
            font: null,
            url: null,
            urlatalstex: null,
            urlatalstex_add: null
        }
    });

    Bridge.define("lighttool.loadTool", {
        statics: {
            methods: {
                loadText: function (url, fun) {
                    var req = new XMLHttpRequest();
                    req.open("GET", url);
                    req.onreadystatechange = function () {
                        if (req.readyState === 4) {
                            fun(req.responseText, null);
                        }
                    };
                    req.onerror = function (e) {
                        var err = new Error();
                        err.Message = "onerr in req:";
                        fun(null, err);
                    };
                    req.send();
                },
                loadArrayBuffer: function (url, fun) {
                    var req = new XMLHttpRequest();

                    req.open("GET", url);
                    req.responseType = "arraybuffer";
                    req.onreadystatechange = function () {
                        if (req.readyState === 4) {
                            fun(Bridge.as(req.response, ArrayBuffer), null);
                        }
                    };
                    req.onerror = function (e) {
                        var err = new Error();
                        err.Message = "onerr in req:";
                        fun(null, err);
                    };
                    req.send();
                },
                loadBlob: function (url, fun) {
                    var req = new XMLHttpRequest();

                    req.open("GET", url);
                    req.responseType = "blob";
                    req.onreadystatechange = function () {
                        if (req.readyState === 4) {
                            fun(Bridge.as(req.response, Blob), null);
                        }
                    };
                    req.onerror = function (e) {
                        var err = new Error();
                        err.Message = "onerr in req:";
                        fun(null, err);
                    };
                    req.send();
                }
            }
        }
    });

    Bridge.define("lighttool.Native.canvasAdapter", {
        statics: {
            methods: {
                CreateScreenCanvas: function (webgl, useraction) {
                    var el = webgl.canvas;
                    el.width = el.clientWidth;
                    el.height = el.clientHeight;

                    var c = new lighttool.spriteCanvas(webgl, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
                    c.spriteBatcher.matrix = new Float32Array(System.Array.init([2.0 / c.width, 0, 0, 0, 0, -2 / c.height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1], System.Single));
                    c.spriteBatcher.ztest = false;

                    var ua = useraction;
                    window.setInterval(function () {
                        webgl.viewport(0, 0, webgl.drawingBufferWidth, webgl.drawingBufferHeight);
                        webgl.clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
                        webgl.clearColor(1.0, 0.0, 1.0, 1.0);

                        c.spriteBatcher.begindraw();

                        ua.lighttool$canvasAction$ondraw(c);

                        c.spriteBatcher.enddraw();

                        var _webgl = webgl;
                        _webgl.flush();

                    }, 20);
                    window.addEventListener("resize", function () {
                        var sel = webgl.canvas;
                        sel.width = sel.clientWidth;
                        sel.height = sel.clientHeight;
                        sel.width = sel.clientWidth;
                        sel.height = sel.clientHeight;

                        c.width = sel.width;
                        c.height = sel.height;
                        c.spriteBatcher.matrix = new Float32Array(System.Array.init([2.0 / c.width, 0, 0, 0, 0, -2.0 / c.height, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1], System.Single));
                        ua.lighttool$canvasAction$onresize(c);
                    });


                    el.onmousemove = function (ev) {
                        ua.lighttool$canvasAction$onpointevent(c, lighttool.canvaspointevent.POINT_MOVE, System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetX, System.Single), System.Single)), System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetY, System.Single), System.Single)));
                    };
                    el.onmouseup = function (ev) {
                        ua.lighttool$canvasAction$onpointevent(c, lighttool.canvaspointevent.POINT_UP, System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetX, System.Single), System.Single)), System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetY, System.Single), System.Single)));
                    };
                    el.onmousedown = function (ev) {
                        ua.lighttool$canvasAction$onpointevent(c, lighttool.canvaspointevent.POINT_DOWN, System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetX, System.Single), System.Single)), System.Nullable.getValue(Bridge.cast(Bridge.unbox(ev.offsetY, System.Single), System.Single)));
                    };




                    return c;
                }
            }
        }
    });

    Bridge.define("lighttool.shadercode", {
        fields: {
            vscode: null,
            fscode: null,
            vs: null,
            fs: null,
            program: null,
            posPos: 0,
            posColor: 0,
            posColor2: 0,
            posUV: 0,
            uniMatrix: null,
            uniTex0: null,
            uniTex1: null,
            uniCol0: null,
            uniCol1: null
        },
        ctors: {
            init: function () {
                this.posPos = -1;
                this.posColor = -1;
                this.posColor2 = -1;
                this.posUV = -1;
            }
        },
        methods: {
            compile: function (webgl) {
                this.vs = webgl.createShader(webgl.VERTEX_SHADER);
                this.fs = webgl.createShader(webgl.FRAGMENT_SHADER);

                webgl.shaderSource(this.vs, this.vscode);
                webgl.compileShader(this.vs);
                var r1 = webgl.getShaderParameter(this.vs, webgl.COMPILE_STATUS);
                if (r1 === false) {
                    this.alert(webgl.getShaderInfoLog(this.vs));
                }
                webgl.shaderSource(this.fs, this.fscode);
                webgl.compileShader(this.fs);
                var r2 = webgl.getShaderParameter(this.fs, webgl.COMPILE_STATUS);
                if (r2 === false) {
                    this.alert(webgl.getShaderInfoLog(this.fs));
                }

                this.program = webgl.createProgram();

                webgl.attachShader(this.program, this.vs);
                webgl.attachShader(this.program, this.fs);

                webgl.linkProgram(this.program);
                var r3 = webgl.getProgramParameter(this.program, webgl.LINK_STATUS);
                if (r3 === false) {
                    this.alert(webgl.getProgramInfoLog(this.program));
                }


                this.posPos = webgl.getAttribLocation(this.program, "position");
                this.posColor = webgl.getAttribLocation(this.program, "color");
                this.posColor2 = webgl.getAttribLocation(this.program, "color2");

                this.posUV = webgl.getAttribLocation(this.program, "uv");

                this.uniMatrix = webgl.getUniformLocation(this.program, "matrix");
                this.uniTex0 = webgl.getUniformLocation(this.program, "tex0");
                this.uniTex1 = webgl.getUniformLocation(this.program, "tex1");
                this.uniCol0 = webgl.getUniformLocation(this.program, "col0");
                this.uniCol1 = webgl.getUniformLocation(this.program, "col1");


            },
            alert: function (p) {
                throw new System.NotImplementedException.ctor();
            }
        }
    });

    Bridge.define("lighttool.shaderMgr", {
        statics: {
            fields: {
                g_shaderParser: null
            },
            methods: {
                parserInstance: function () {
                    if (lighttool.shaderMgr.g_shaderParser == null) {
                        lighttool.shaderMgr.g_shaderParser = new lighttool.shaderParser();
                    }
                    return lighttool.shaderMgr.g_shaderParser;
                }
            }
        }
    });

    Bridge.define("lighttool.shaderParser", {
        fields: {
            mapshader: null
        },
        ctors: {
            init: function () {
                this.mapshader = new (System.Collections.Generic.Dictionary$2(System.String,lighttool.shadercode))();
            }
        },
        methods: {
            _parser: function (txt) {
                var s1 = System.String.split(txt, System.Array.init(["<--"], System.String), null, 1);
                for (var i = 0; i < s1.length; i = (i + 1) | 0) {
                    var s2 = s1[System.Array.index(i, s1)].split("-->");
                    var stag = s2[System.Array.index(0, s2)].split(" ");
                    var sshader = s2[System.Array.index(1, s2)];
                    var lastname = "";
                    var lasttag = 0;

                    for (var j = 0; j < stag.length; j = (j + 1) | 0) {
                        var t = stag[System.Array.index(j, stag)];
                        if (t.length === 0) {
                            continue;
                        }
                        if (Bridge.referenceEquals(t, "vs")) {
                            lasttag = 1;
                        } else if (Bridge.referenceEquals(t, "fs")) {
                            lasttag = 2;
                        } else {
                            lastname = t.substr(1, ((t.length - 2) | 0));
                        }
                    }
                    if (lastname.length === 0) {
                        continue;
                    }
                    if (this.mapshader.containsKey(lastname) === false) {
                        this.mapshader.set(lastname, new lighttool.shadercode());
                    }
                    if (lasttag === 1) {
                        this.mapshader.get(lastname).vscode = sshader;
                    } else {
                        if (lasttag === 2) {
                            this.mapshader.get(lastname).fscode = sshader;
                        }
                    }

                }
            },
            parseUrl: function (webgl, url) {
                lighttool.loadTool.loadText(url, Bridge.fn.bind(this, function (txt, err) {
                    this._parser(txt);
                    this.compile(webgl);
                }));
            },
            parseDirect: function (webgl, txt) {
                this._parser(txt);
                this.compile(webgl);
            },
            dump: function () {
                var $t;
                $t = Bridge.getEnumerator(this.mapshader.getKeys(), System.String);
                try {
                    while ($t.moveNext()) {
                        var name = $t.Current;
                        System.Console.WriteLine("shadername:" + (name || ""));
                        System.Console.WriteLine("vs:" + (this.mapshader.get(name).vscode || ""));
                        System.Console.WriteLine("fs:" + (this.mapshader.get(name).fscode || ""));
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }

            },
            compile: function (webgl) {
                var $t;
                $t = Bridge.getEnumerator(this.mapshader.getKeys(), System.String);
                try {
                    while ($t.moveNext()) {
                        var name = $t.Current;
                        this.mapshader.get(name).compile(webgl);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
            }
        }
    });

    Bridge.define("lighttool.sprite", {
        fields: {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            xsize: 0,
            ysize: 0
        },
        methods: {
            ToRect: function () {
                return new lighttool.spriteRect.$ctor1(this.x, this.y, this.w, this.h);
            }
        }
    });

    Bridge.define("lighttool.spriteAtlas", {
        statics: {
            methods: {
                fromRaw: function (webgl, txt, texture) {
                    if (texture === void 0) { texture = null; }
                    var sa = new lighttool.spriteAtlas(webgl, null, texture);
                    sa._parse(txt);

                    return sa;
                }
            }
        },
        fields: {
            webgl: null,
            textureurl: null,
            texturewidth: 0,
            textureheight: 0,
            texture: null,
            sprites: null
        },
        ctors: {
            init: function () {
                this.sprites = new (System.Collections.Generic.Dictionary$2(System.String,lighttool.sprite))();
            },
            ctor: function (webgl, atlasurl, texture) {
                if (atlasurl === void 0) { atlasurl = null; }
                if (texture === void 0) { texture = null; }

                this.$initialize();
                this.webgl = webgl;
                if (atlasurl == null) {
                } else {
                    lighttool.loadTool.loadText(atlasurl, Bridge.fn.bind(this, function (txt, err) {
                        this._parse(txt);
                    }));
                }
                this.texture = texture;
            }
        },
        methods: {
            _parse: function (txt) {
                var json = JSON.parse(txt);
                this.textureurl = json.t;
                this.texturewidth = json.w;
                this.textureheight = json.h;
                var s = Bridge.cast(json.s, System.Array.type(System.Object));

                for (var i = 0; i < s.length; i = (i + 1) | 0) {
                    var ss = Bridge.cast(s[System.Array.index(i, s)], System.Array.type(System.Object));
                    var r = new lighttool.sprite();
                    r.x = (System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(1, ss)], System.Single), System.Single)) + 0.5) / this.texturewidth;
                    r.y = (System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(2, ss)], System.Single), System.Single)) + 0.5) / this.textureheight;
                    r.w = (System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(3, ss)], System.Single), System.Single)) - 1.0) / this.texturewidth;
                    r.h = (System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(4, ss)], System.Single), System.Single)) - 1.0) / this.textureheight;
                    r.xsize = System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(3, ss)], System.Single), System.Single));
                    r.ysize = System.Nullable.getValue(Bridge.cast(Bridge.unbox(ss[System.Array.index(4, ss)], System.Single), System.Single));
                    this.sprites.set(Bridge.cast(ss[System.Array.index(0, ss)], System.String), r);
                }

            },
            drawByTexture: function (sb, sname, rect, c) {
                if (this.texture == null) {
                    return;
                }
                var r = this.sprites.get(sname);
                if (Bridge.referenceEquals(r, undefined)) {
                    return;
                }

                this.texture.draw(sb, r.ToRect(), rect.$clone(), c);
            }
        }
    });

    Bridge.define("lighttool.spriteBatcher", {
        fields: {
            webgl: null,
            shaderparser: null,
            vbo: null,
            matrix: null,
            ztest: false,
            recorder: null,
            shadercode: null,
            mat: null,
            array: null,
            dataseek: 0,
            rectClip: null
        },
        ctors: {
            init: function () {
                this.ztest = true;
                this.array = new Float32Array(13312);
                this.dataseek = 0;
            },
            ctor: function (webgl, shaderparser) {
                this.$initialize();
                this.webgl = webgl;
                this.shaderparser = shaderparser;
                this.vbo = webgl.createBuffer();
                var asp = (((Bridge.Int.div(this.webgl.drawingBufferWidth, this.webgl.drawingBufferHeight)) | 0));
                var array = System.Array.init([
                    1.0 / asp, 
                    0, 
                    0, 
                    0, 
                    0, 
                    1, 
                    0, 
                    0, 
                    0, 
                    0, 
                    1, 
                    0, 
                    0, 
                    0, 
                    0, 
                    1
                ], System.Single);
                this.matrix = new Float32Array(array);

                this.recorder = new lighttool.stateRecorder(webgl);
            }
        },
        methods: {
            begindraw: function () {
                this.recorder.record();
            },
            enddraw: function () {
                this.endbatch();

                this.recorder.restore();
            },
            setMat: function (mat) {
                if (Bridge.referenceEquals(mat, this.mat)) {
                    return;
                }
                this.endbatch();

                this.webgl.disable(this.webgl.CULL_FACE);

                this.mat = mat;
                if (this.shaderparser.mapshader.containsKey(this.mat.shader) === false) {
                    return;
                }
                this.shadercode = this.shaderparser.mapshader.get(this.mat.shader);

                this.webgl.depthMask(false);

                if (this.ztest) {
                    this.webgl.enable(this.webgl.DEPTH_TEST);
                    this.webgl.depthFunc(this.webgl.LEQUAL);
                } else {
                    this.webgl.disable(this.webgl.DEPTH_TEST);
                }

                if (this.mat.transparent) {
                    this.webgl.enable(this.webgl.BLEND);
                    this.webgl.blendEquation(this.webgl.FUNC_ADD);
                    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA, this.webgl.SRC_ALPHA, this.webgl.ONE);
                } else {
                    this.webgl.disable(this.webgl.BLEND);
                }

                this.webgl.useProgram(this.shadercode.program);
                this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vbo);



                if (this.shadercode.posPos >= 0) {
                    this.webgl.enableVertexAttribArray(this.shadercode.posPos);
                    this.webgl.vertexAttribPointer(this.shadercode.posPos, 3, this.webgl.FLOAT, false, 52, 0);
                }
                if (this.shadercode.posColor >= 0) {
                    this.webgl.enableVertexAttribArray(this.shadercode.posColor);
                    this.webgl.vertexAttribPointer(this.shadercode.posColor, 4, this.webgl.FLOAT, false, 52, 12);
                }
                if (this.shadercode.posColor2 >= 0) {
                    this.webgl.enableVertexAttribArray(this.shadercode.posColor2);
                    this.webgl.vertexAttribPointer(this.shadercode.posColor2, 4, this.webgl.FLOAT, false, 52, 28);
                }
                if (this.shadercode.posUV >= 0) {
                    this.webgl.enableVertexAttribArray(this.shadercode.posUV);
                    this.webgl.vertexAttribPointer(this.shadercode.posUV, 2, this.webgl.FLOAT, false, 52, 44);
                }

                if (this.shadercode.uniMatrix != null) {
                    this.webgl.uniformMatrix4fv(this.shadercode.uniMatrix, false, Bridge.cast(this.matrix, Array));
                }
                if (this.shadercode.uniTex0 != null) {
                    this.webgl.activeTexture(this.webgl.TEXTURE0);
                    var tex = this.mat.tex0;
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                    this.webgl.uniform1i(this.shadercode.uniTex0, 0);
                }
                if (this.shadercode.uniTex1 != null) {
                    this.webgl.activeTexture(this.webgl.TEXTURE1);
                    var tex1 = this.mat.tex1;
                    this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex1 == null ? null : tex1.texture);
                    this.webgl.uniform1i(this.shadercode.uniTex1, 1);
                }
                if (this.shadercode.uniCol0 != null) {
                    this.webgl.uniform4f(this.shadercode.uniCol0, mat.col0.r, mat.col0.g, mat.col0.b, mat.col0.a);
                }
                if (this.shadercode.uniCol1 != null) {
                    this.webgl.uniform4f(this.shadercode.uniCol1, mat.col1.r, mat.col1.g, mat.col1.b, mat.col1.a);
                }

            },
            endbatch: function () {
                this.mat = null;
                if (this.dataseek === 0) {
                    return;
                }
                this.webgl.bufferData(this.webgl.ARRAY_BUFFER, this.array, this.webgl.DYNAMIC_DRAW);
                this.webgl.drawArrays(this.webgl.TRIANGLES, 0, this.dataseek);

                this.dataseek = 0;
            },
            addQuad: function (ps) {
                if (this.shadercode == null) {
                    return;
                }

                for (var jc = 0; jc < 6; jc = (jc + 1) | 0) {
                    var j = jc < 3 ? jc : ((6 - jc) | 0);

                    var i = Bridge.Int.mul(this.dataseek, 13);

                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].x;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].y;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].z;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r2;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g2;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b2;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a2;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].u;
                    this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].v;

                    this.dataseek = (this.dataseek + 1) | 0;
                }

                if (this.dataseek >= 1000) {
                    this.endbatch();
                }
            },
            addTri: function (ps) {
                if (this.shadercode == null) {
                    return;
                }

                {
                    for (var j = 0; j < 3; j = (j + 1) | 0) {
                        var i = Bridge.Int.mul(this.dataseek, 13);
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].x;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].y;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].z;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].u;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].v;

                        this.dataseek = (this.dataseek + 1) | 0;

                    }
                }
                if (this.dataseek >= 1000) {
                    this.endbatch();
                }

            },
            addRect: function (ps) {
                if (Bridge.referenceEquals(this.shadercode, undefined)) {
                    return;
                }

                if (this.rectClip != null) {
                    var xmin = ps[System.Array.index(0, ps)].x;
                    var xmax = ps[System.Array.index(3, ps)].x;
                    var ymin = ps[System.Array.index(0, ps)].y;
                    var ymax = ps[System.Array.index(3, ps)].y;
                    var umin = ps[System.Array.index(0, ps)].u;
                    var umax = ps[System.Array.index(3, ps)].u;
                    var vmin = ps[System.Array.index(0, ps)].v;
                    var vmax = ps[System.Array.index(3, ps)].v;
                    var wsize = xmax - xmin;
                    var hsize = ymax - ymin;
                    var usize = umax - umin;
                    var vsize = vmax - vmin;
                    var xl = Math.max(xmin, System.Nullable.getValue(this.rectClip).x);
                    var xr = Math.min(xmax, System.Nullable.getValue(this.rectClip).x + System.Nullable.getValue(this.rectClip).w);
                    var yt = Math.max(ymin, System.Nullable.getValue(this.rectClip).y);
                    var yb = Math.min(ymax, System.Nullable.getValue(this.rectClip).y + System.Nullable.getValue(this.rectClip).h);
                    var lf = (xl - xmin) / wsize;
                    var tf = (yt - ymin) / hsize;
                    var rf = (xr - xmax) / wsize;
                    var bf = (yb - ymax) / hsize;
                    umin = umin + lf * usize;
                    vmin = vmin + tf * vsize;
                    umax = umax + rf * usize;
                    vmax = vmax + bf * vsize;
                    for (var jc = 0; jc < 6; jc = (jc + 1) | 0) {
                        var j = jc < 3 ? jc : ((6 - jc) | 0);

                        var i = Bridge.Int.mul(this.dataseek, 13);

                        var x = ps[System.Array.index(j, ps)].x;
                        if (x < xl) {
                            x = xl;
                        }
                        if (x > xr) {
                            x = xr;
                        }
                        var y = ps[System.Array.index(j, ps)].y;
                        if (y < yt) {
                            y = yt;
                        }
                        if (y > yb) {
                            y = yb;
                        }
                        var u = ps[System.Array.index(j, ps)].u;
                        if (u < umin) {
                            u = umin;
                        }
                        if (u > umax) {
                            u = umax;
                        }
                        var v = ps[System.Array.index(j, ps)].v;
                        if (v < vmin) {
                            v = vmin;
                        }
                        if (v > vmax) {
                            v = vmax;
                        }
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = x;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = y;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].z;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].r2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].g2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].b2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = ps[System.Array.index(j, ps)].a2;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = u;
                        this.array[Bridge.identity(i, (i = (i + 1) | 0))] = v;

                        this.dataseek = (this.dataseek + 1) | 0;
                    }
                } else {
                    for (var jc1 = 0; jc1 < 6; jc1 = (jc1 + 1) | 0) {
                        var j1 = jc1 < 3 ? jc1 : ((6 - jc1) | 0);

                        var i1 = Bridge.Int.mul(this.dataseek, 13);

                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].x;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].y;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].z;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].r;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].g;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].b;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].a;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].r2;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].g2;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].b2;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].a2;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].u;
                        this.array[Bridge.identity(i1, (i1 = (i1 + 1) | 0))] = ps[System.Array.index(j1, ps)].v;

                        this.dataseek = (this.dataseek + 1) | 0;
                    }
                }
                if (this.dataseek >= 1000) {
                    this.endbatch();
                }
            },
            setRectClip: function (rect) {
                this.rectClip = rect.$clone();
            },
            closeRectClip: function () {
                this.rectClip = null;
            }
        }
    });

    Bridge.define("lighttool.spriteBorder", {
        statics: {
            fields: {
                zero: null
            },
            ctors: {
                init: function () {
                    this.zero = new lighttool.spriteBorder(0, 0, 0, 0);
                }
            }
        },
        fields: {
            l: 0,
            t: 0,
            r: 0,
            b: 0
        },
        ctors: {
            ctor: function (l, t, r, b) {
                if (l === void 0) { l = 0.0; }
                if (t === void 0) { t = 0.0; }
                if (r === void 0) { r = 0.0; }
                if (b === void 0) { b = 0.0; }

                this.$initialize();
                this.l = l;
                this.t = t;
                this.r = r;
                this.b = b;
            }
        }
    });

    Bridge.define("lighttool.spriteCanvas", {
        fields: {
            webgl: null,
            width: 0,
            height: 0,
            spriteBatcher: null,
            uvrect: null,
            trect: null
        },
        ctors: {
            init: function () {
                this.uvrect = new lighttool.spriteRect();
                this.trect = new lighttool.spriteRect();
            },
            ctor: function (webgl, width, height) {
                this.$initialize();
                this.webgl = webgl;
                this.width = width;
                this.height = height;
                this.spriteBatcher = new lighttool.spriteBatcher(webgl, lighttool.shaderMgr.parserInstance());
            }
        },
        methods: {
            drawTexture: function (texture, rect, uvrect, color) {
                if (color === void 0) { color = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                texture.draw(this.spriteBatcher, uvrect.$clone(), rect.$clone(), color);
            },
            drawTextureCustom: function (texture, _mat, rect, uvrect, color, color2) {
                if (color === void 0) { color = null; }
                if (color2 === void 0) { color2 = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                if (color2 == null) {
                    color2 = lighttool.spriteColor.white;
                }
                texture.drawCustom(this.spriteBatcher, _mat, uvrect.$clone(), rect.$clone(), color, color2);
            },
            drawSprite: function (atlas, sprite, rect, color) {
                if (color === void 0) { color = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }

                var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
                if (a == null) {
                    return;
                }
                var r = a.sprites.get(sprite);
                if (Bridge.referenceEquals(r, undefined)) {
                    return;
                }
                if (a.texture == null) {
                    return;
                }

                a.texture.draw(this.spriteBatcher, r.ToRect(), rect.$clone(), color);
            },
            drawSpriteCustom: function (atlas, sprite, _mat, rect, color, color2) {
                if (color === void 0) { color = null; }
                if (color2 === void 0) { color2 = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                if (color2 == null) {
                    color2 = lighttool.spriteColor.white;
                }
                var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
                if (a == null) {
                    return;
                }
                var r = a.sprites.get(sprite);
                if (Bridge.referenceEquals(r, undefined)) {
                    return;
                }
                if (a.texture == null) {
                    return;
                }

                a.texture.drawCustom(this.spriteBatcher, _mat, r.ToRect(), rect.$clone(), color, color2);
            },
            drawSprite9: function (atlas, sprite, rect, border, color) {
                if (color === void 0) { color = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
                if (a == null) {
                    return;
                }
                var _r = a.sprites.get(sprite);
                if (Bridge.referenceEquals(_r, undefined)) {
                    return;
                }

                var l = (border.l - 1) / a.texturewidth;
                var r = (border.r - 1) / a.texturewidth;
                var t = (border.t - 1) / a.textureheight;
                var b = (border.b - 1) / a.textureheight;
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y;
                this.uvrect.w = l;
                this.uvrect.h = t;

                this.trect.x = rect.x;
                this.trect.y = rect.y;
                this.trect.w = border.l;
                this.trect.h = border.t;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);

                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = t;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.t;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y;
                this.uvrect.w = r;
                this.uvrect.h = t;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y;
                this.trect.w = border.r;
                this.trect.h = border.t;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + border.t;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = r;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.r;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);

                this.uvrect.x = _r.x;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = l;
                this.uvrect.h = b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.l;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = r;
                this.uvrect.h = b;
                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.r;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect.$clone(), this.trect.$clone(), color);

            },
            drawSprite9Custom: function (atlas, sprite, _mat, rect, border, color, color2) {
                if (color === void 0) { color = null; }
                if (color2 === void 0) { color2 = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                if (color2 == null) {
                    color2 = lighttool.spriteColor.white;
                }
                var a = lighttool.atlasMgr.Instance().load(this.webgl, atlas);
                if (a == null) {
                    return;
                }
                var _r = a.sprites.get(sprite);
                if (Bridge.referenceEquals(_r, undefined)) {
                    return;
                }

                var l = (border.l - 1) / a.texturewidth;
                var r = (border.r - 1) / a.texturewidth;
                var t = (border.t - 1) / a.textureheight;
                var b = (border.b - 1) / a.textureheight;
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y;
                this.uvrect.w = l;
                this.uvrect.h = t;

                this.trect.x = rect.x;
                this.trect.y = rect.y;
                this.trect.w = border.l;
                this.trect.h = border.t;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);

                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = t;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.t;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y;
                this.uvrect.w = r;
                this.uvrect.h = t;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y;
                this.trect.w = border.r;
                this.trect.h = border.t;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + border.t;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = r;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.r;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);

                this.uvrect.x = _r.x;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = l;
                this.uvrect.h = b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.l;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = r;
                this.uvrect.h = b;
                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.r;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect.$clone(), this.trect.$clone(), color, color2);

            },
            drawText: function (font, text, rect, color, color2) {
                if (color === void 0) { color = null; }
                if (color2 === void 0) { color2 = null; }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                if (color2 == null) {
                    color2 = lighttool.spriteColor.black;
                }
                var f = lighttool.fontMgr.Instance().load(this.webgl, font);
                if (f == null) {
                    return;
                }
                if (Bridge.referenceEquals(f.cmap, undefined)) {
                    return;
                }
                var xadd = 0;
                for (var i = 0; i < text.length; i = (i + 1) | 0) {
                    var c = text.charAt(i);
                    var cinfo = f.cmap[c];
                    if (Bridge.referenceEquals(cinfo, undefined)) {
                        continue;
                    }
                    var s = rect.h / f.lineHeight;

                    this.trect.x = rect.x + xadd + cinfo.xOffset * s;

                    this.trect.y = rect.y - cinfo.yOffset * s + f.baseline * s;


                    this.trect.h = s * cinfo.ySize;
                    this.trect.w = s * cinfo.xSize;

                    xadd = (xadd + (cinfo.xAddvance * s)) | 0;
                    if (xadd >= rect.w) {
                        break;
                    }
                    f.draw(this.spriteBatcher, cinfo, this.trect.$clone(), color, color2);
                }
            }
        }
    });

    Bridge.define("lighttool.spriteColor", {
        statics: {
            fields: {
                black: null,
                gray: null
            },
            props: {
                white: {
                    get: function () {
                        return new lighttool.spriteColor(1, 1, 1, 1);
                    }
                }
            },
            ctors: {
                init: function () {
                    this.black = new lighttool.spriteColor(0, 0, 0, 1);
                    this.gray = new lighttool.spriteColor(0.5, 0.5, 0.5, 1);
                }
            }
        },
        fields: {
            r: 0,
            g: 0,
            b: 0,
            a: 0
        },
        ctors: {
            ctor: function (r, g, b, a) {
                if (r === void 0) { r = 1.0; }
                if (g === void 0) { g = 1.0; }
                if (b === void 0) { b = 1.0; }
                if (a === void 0) { a = 1.0; }

                this.$initialize();
                this.r = r;
                this.g = g;
                this.b = b;
                this.a = a;
            }
        }
    });

    Bridge.define("lighttool.spriteFont", {
        statics: {
            methods: {
                fromRaw: function (webgl, txt, texture) {
                    if (texture === void 0) { texture = null; }
                    var sf = new lighttool.spriteFont(webgl, null, texture);
                    sf._parse(txt);
                    return sf;
                }
            }
        },
        fields: {
            webgl: null,
            texture: null,
            mat: null,
            cmap: null,
            fontname: null,
            pointSize: 0,
            padding: 0,
            lineHeight: 0,
            baseline: 0,
            atlasWidth: 0,
            atlasHeight: 0,
            pointbuf: null
        },
        ctors: {
            init: function () {
                var $t;
                this.pointbuf = System.Array.init([
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t)
                ], lighttool.spritePoint);
            },
            ctor: function (webgl, urlconfig, texture) {
                this.$initialize();
                this.webgl = webgl;
                if (urlconfig != null) {
                    lighttool.loadTool.loadText(urlconfig, Bridge.fn.bind(this, function (txt, err) {
                        this._parse(txt);
                    }));
                }
                this.texture = texture;
                this.mat = new lighttool.spriteMat();
                this.mat.shader = "spritefont";
                this.mat.tex0 = this.texture;
                this.mat.transparent = true;
            }
        },
        methods: {
            _parse: function (txt) {
                var $t, $t1, $t2, $t3, $t4, $t5, $t6, $t7, $t8, $t9;
                var d1 = new Date().valueOf();
                var json = JSON.parse(txt);

                var font = Bridge.cast(json.font, System.Array.type(System.Object));
                this.fontname = Bridge.cast(font[System.Array.index(0, font)], System.String);
                this.pointSize = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(1, font)], System.Single), System.Single));
                this.padding = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(2, font)], System.Single), System.Single));
                this.lineHeight = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(3, font)], System.Single), System.Single));
                this.baseline = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(4, font)], System.Single), System.Single));
                this.atlasWidth = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(5, font)], System.Single), System.Single));
                this.atlasHeight = System.Nullable.getValue(Bridge.cast(Bridge.unbox(font[System.Array.index(6, font)], System.Single), System.Single));

                this.cmap = { };
                var map = json.map;
                $t = Bridge.getEnumerator(Object.getOwnPropertyNames(Bridge.unbox(map)));
                try {
                    while ($t.moveNext()) {
                        var c = $t.Current;
                        var finfo = new lighttool.charinfo();
                        this.cmap[c] = finfo;
                        finfo.x = ($t1 = Bridge.unbox(map[c]))[System.Array.index(0, $t1)] / this.atlasWidth;
                        finfo.y = ($t2 = Bridge.unbox(map[c]))[System.Array.index(1, $t2)] / this.atlasHeight;
                        finfo.w = ($t3 = Bridge.unbox(map[c]))[System.Array.index(2, $t3)] / this.atlasWidth;
                        finfo.h = ($t4 = Bridge.unbox(map[c]))[System.Array.index(3, $t4)] / this.atlasHeight;
                        finfo.xSize = ($t5 = Bridge.unbox(map[c]))[System.Array.index(2, $t5)];
                        finfo.ySize = ($t6 = Bridge.unbox(map[c]))[System.Array.index(3, $t6)];
                        finfo.xOffset = ($t7 = Bridge.unbox(map[c]))[System.Array.index(4, $t7)];
                        finfo.yOffset = ($t8 = Bridge.unbox(map[c]))[System.Array.index(5, $t8)];
                        finfo.xAddvance = ($t9 = Bridge.unbox(map[c]))[System.Array.index(6, $t9)];
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }
                map = null;
                json = null;


                var d2 = new Date().valueOf();
                var n = d2 - d1;
                System.Console.WriteLine("json time=" + System.Double.format(n));

            },
            draw: function (sb, r, rect, c, colorBorder) {
                if (c === void 0) { c = null; }
                if (colorBorder === void 0) { colorBorder = null; }
                if (c == null) {
                    c = lighttool.spriteColor.white;
                }
                if (colorBorder == null) {
                    colorBorder = new lighttool.spriteColor(0.0, 0.0, 0.0, 0.5);
                }
                {
                    var p = this.pointbuf[System.Array.index(0, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = r.x;
                    p.v = r.y + r.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(1, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = r.x + r.w;
                    p.v = r.y + r.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(2, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = r.x;
                    p.v = r.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(3, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = r.x + r.w;
                    p.v = r.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;
                }
                sb.setMat(this.mat);
                sb.addRect(this.pointbuf);
            },
            drawChar: function (sb, cname, rect, c, colorBorder) {
                if (c === void 0) { c = null; }
                if (colorBorder === void 0) { colorBorder = null; }
                var r = this.cmap[cname];
                if (Bridge.referenceEquals(r, undefined)) {
                    return;
                }
                if (c == null) {
                    c = lighttool.spriteColor.white;
                }
                if (colorBorder == null) {
                    colorBorder = new lighttool.spriteColor(0.0, 0.0, 0.0, 0.5);
                }
                {
                    var p = this.pointbuf[System.Array.index(0, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = r.x;
                    p.v = r.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(1, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = r.x + r.w;
                    p.v = r.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(2, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = r.x;
                    p.v = r.y + r.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                    p = this.pointbuf[System.Array.index(3, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = r.x + r.w;
                    p.v = r.y + r.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                    p.r2 = colorBorder.r;
                    p.g2 = colorBorder.g;
                    p.b2 = colorBorder.b;
                    p.a2 = colorBorder.a;

                }
                sb.setMat(this.mat);
                sb.addRect(this.pointbuf);
            }
        }
    });

    Bridge.define("lighttool.spriteMat", {
        fields: {
            shader: null,
            transparent: false,
            tex0: null,
            tex1: null,
            col0: null,
            col1: null
        }
    });

    Bridge.define("lighttool.spritePoint", {
        fields: {
            x: 0,
            y: 0,
            z: 0,
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            r2: 0,
            g2: 0,
            b2: 0,
            a2: 0,
            u: 0,
            v: 0
        }
    });

    Bridge.define("lighttool.spriteRect", {
        $kind: "struct",
        statics: {
            fields: {
                one: null,
                zero: null
            },
            ctors: {
                init: function () {
                    this.one = new lighttool.spriteRect();
                    this.zero = new lighttool.spriteRect();
                    this.one = new lighttool.spriteRect.$ctor1(0, 0, 1, 1);
                    this.zero = new lighttool.spriteRect.$ctor1(0, 0, 0, 0);
                }
            },
            methods: {
                getDefaultValue: function () { return new lighttool.spriteRect(); }
            }
        },
        fields: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        },
        ctors: {
            $ctor1: function (x, y, w, h) {
                if (x === void 0) { x = 0.0; }
                if (y === void 0) { y = 0.0; }
                if (w === void 0) { w = 0.0; }
                if (h === void 0) { h = 0.0; }

                this.$initialize();
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([3469036106, this.x, this.y, this.w, this.h]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, lighttool.spriteRect)) {
                    return false;
                }
                return Bridge.equals(this.x, o.x) && Bridge.equals(this.y, o.y) && Bridge.equals(this.w, o.w) && Bridge.equals(this.h, o.h);
            },
            $clone: function (to) {
                var s = to || new lighttool.spriteRect();
                s.x = this.x;
                s.y = this.y;
                s.w = this.w;
                s.h = this.h;
                return s;
            }
        }
    });

    Bridge.define("lighttool.spriteTexture", {
        statics: {
            methods: {
                fromRaw: function (webgl, img, format, mipmap, linear) {
                    if (format === void 0) { format = 1; }
                    if (mipmap === void 0) { mipmap = false; }
                    if (linear === void 0) { linear = true; }
                    var st = new lighttool.spriteTexture(webgl, null, format, mipmap, linear);
                    st.texture = webgl.createTexture();
                    st.img = img;
                    st._loadimg(mipmap, linear);

                    return st;

                }
            }
        },
        fields: {
            webgl: null,
            img: null,
            loaded: false,
            texture: null,
            format: 0,
            width: 0,
            height: 0,
            mat: null,
            reader: null,
            disposeit: false,
            pointbuf: null
        },
        ctors: {
            init: function () {
                var $t;
                this.loaded = false;
                this.width = 0;
                this.height = 0;
                this.disposeit = false;
                this.pointbuf = System.Array.init([
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t), 
                    ($t = new lighttool.spritePoint(), $t.x = 0, $t.y = 0, $t.z = 0, $t.r = 0, $t.g = 0, $t.b = 0, $t.a = 0, $t.r2 = 0, $t.g2 = 0, $t.b2 = 0, $t.a2 = 0, $t.u = 0, $t.v = 0, $t)
                ], lighttool.spritePoint);
            },
            ctor: function (webgl, url, format, mipmap, linear) {
                if (url === void 0) { url = null; }
                if (format === void 0) { format = 1; }
                if (mipmap === void 0) { mipmap = false; }
                if (linear === void 0) { linear = true; }

                this.$initialize();
                this.webgl = webgl;
                this.format = format;

                this.mat = new lighttool.spriteMat();
                this.mat.tex0 = this;
                this.mat.transparent = true;
                this.mat.shader = "spritedefault";

                if (url == null) {
                    return;
                }
                this.texture = webgl.createTexture();

                this.img = new Image();
                this.img.src = url;
                this.img.onload = Bridge.fn.bind(this, function (e) {
                    if (this.disposeit) {
                        this.img = null;
                        return;
                    }
                    this._loadimg(mipmap, linear);
                });

            }
        },
        methods: {
            _loadimg: function (mipmap, linear) {
                this.width = this.img.width;
                this.height = this.img.height;
                this.loaded = true;
                this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
                this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);


                this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
                var formatGL = this.webgl.RGBA;
                if (this.format === lighttool.textureformat.RGB) {
                    formatGL = this.webgl.RGB;
                } else {
                    if (this.format === lighttool.textureformat.GRAY) {
                        formatGL = this.webgl.LUMINANCE;
                    }
                }
                this.webgl.texImage2D(this.webgl.TEXTURE_2D, 0, formatGL, formatGL, this.webgl.UNSIGNED_BYTE, this.img);

                if (mipmap) {
                    this.webgl.generateMipmap(this.webgl.TEXTURE_2D);

                    if (linear) {
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                    } else {
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

                    }
                } else {
                    if (linear) {
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                    } else {
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                        this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

                    }
                }
                this.img = null;



            },
            getReader: function (redOnly) {
                if (this.reader != null) {
                    if (this.reader.gray !== redOnly) {
                        throw new System.Exception("get param diff with this.reader");
                    }
                    return this.reader;
                }
                if (this.format !== lighttool.textureformat.RGBA) {
                    throw new System.Exception("only rgba texture can read");
                }
                if (this.texture == null) {
                    return null;
                }
                if (this.reader == null) {
                    this.reader = new lighttool.texReader(this.webgl, this.texture, this.width, this.height, redOnly);
                }

                return this.reader;
            },
            dispose: function () {
                if (this.texture == null && this.img != null) {
                    this.disposeit = true;
                }

                if (this.texture != null) {
                    this.webgl.deleteTexture(this.texture);
                }
            },
            draw: function (spriteBatcher, uv, rect, c) {

                {


                    var p = this.pointbuf[System.Array.index(0, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = uv.x;
                    p.v = uv.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(1, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = uv.x + uv.w;
                    p.v = uv.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(2, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = uv.x;
                    p.v = uv.y + uv.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(3, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = uv.x + uv.w;
                    p.v = uv.y + uv.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                }
                spriteBatcher.setMat(this.mat);
                spriteBatcher.addRect(this.pointbuf);

            },
            drawCustom: function (spriteBatcher, _mat, uv, rect, c, c2) {
                _mat.tex0 = this;
                {
                    var p = this.pointbuf[System.Array.index(0, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = uv.x;
                    p.v = uv.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(1, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y;
                    p.z = 0;
                    p.u = uv.x + uv.w;
                    p.v = uv.y;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(2, this.pointbuf)];
                    p.x = rect.x;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = uv.x;
                    p.v = uv.y + uv.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;

                    p = this.pointbuf[System.Array.index(3, this.pointbuf)];
                    p.x = rect.x + rect.w;
                    p.y = rect.y + rect.h;
                    p.z = 0;
                    p.u = uv.x + uv.w;
                    p.v = uv.y + uv.h;
                    p.r = c.r;
                    p.g = c.g;
                    p.b = c.b;
                    p.a = c.a;
                }
                spriteBatcher.setMat(_mat);
                spriteBatcher.addRect(this.pointbuf);

            }
        }
    });

    Bridge.define("lighttool.stateRecorder", {
        fields: {
            webgl: null,
            DEPTH_WRITEMASK: false,
            DEPTH_TEST: false,
            DEPTH_FUNC: 0,
            BLEND: false,
            BLEND_EQUATION: 0,
            BLEND_SRC_RGB: 0,
            BLEND_SRC_ALPHA: 0,
            BLEND_DST_RGB: 0,
            BLEND_DST_ALPHA: 0,
            CURRENT_PROGRAM: null,
            ARRAY_BUFFER: null,
            ACTIVE_TEXTURE: 0,
            TEXTURE_BINDING_2D: null
        },
        ctors: {
            ctor: function (webgl) {
                this.$initialize();
                this.webgl = webgl;
            }
        },
        methods: {
            record: function () {

                this.DEPTH_WRITEMASK = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.DEPTH_WRITEMASK), System.Boolean), System.Boolean));
                this.DEPTH_TEST = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.DEPTH_TEST), System.Boolean), System.Boolean));
                this.DEPTH_FUNC = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.DEPTH_FUNC), System.Int32), System.Int32));
                this.BLEND = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND), System.Boolean), System.Boolean));
                this.BLEND_EQUATION = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND_EQUATION), System.Int32), System.Int32));
                this.BLEND_SRC_RGB = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND_SRC_RGB), System.Int32), System.Int32));
                this.BLEND_SRC_ALPHA = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND_SRC_ALPHA), System.Int32), System.Int32));
                this.BLEND_DST_RGB = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND_DST_RGB), System.Int32), System.Int32));
                this.BLEND_DST_ALPHA = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.BLEND_DST_ALPHA), System.Int32), System.Int32));

                var p = this.webgl.getParameter(this.webgl.CURRENT_PROGRAM);
                this.CURRENT_PROGRAM = Bridge.unbox(p);

                var pb = this.webgl.getParameter(this.webgl.ARRAY_BUFFER_BINDING);
                this.ARRAY_BUFFER = Bridge.unbox(pb);

                this.ACTIVE_TEXTURE = System.Nullable.getValue(Bridge.cast(Bridge.unbox(this.webgl.getParameter(this.webgl.ACTIVE_TEXTURE), System.Int32), System.Int32));
                this.TEXTURE_BINDING_2D = Bridge.unbox(this.webgl.getParameter(this.webgl.TEXTURE_BINDING_2D));

            },
            restore: function () {
                this.webgl.depthMask(this.DEPTH_WRITEMASK);
                if (this.DEPTH_TEST) {
                    this.webgl.enable(this.webgl.DEPTH_TEST);
                } else {
                    this.webgl.disable(this.webgl.DEPTH_TEST);
                }
                this.webgl.depthFunc(this.DEPTH_FUNC);

                if (this.BLEND) {
                    this.webgl.enable(this.webgl.BLEND);
                } else {
                    this.webgl.disable(this.webgl.BLEND);
                }
                this.webgl.blendEquation(this.BLEND_EQUATION);

                this.webgl.blendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB, this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);

                this.webgl.useProgram(this.CURRENT_PROGRAM);
                this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.ARRAY_BUFFER);

                this.webgl.activeTexture(this.ACTIVE_TEXTURE);
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.TEXTURE_BINDING_2D);

            }
        }
    });

    Bridge.define("lighttool.texReader", {
        fields: {
            width: 0,
            height: 0,
            data: null,
            gray: false
        },
        ctors: {
            ctor: function (webgl, texRGBA, width, height, gray) {
                if (gray === void 0) { gray = true; }

                this.$initialize();
                this.gray = gray;
                this.width = width;
                this.height = height;

                var fbo = webgl.createFramebuffer();
                var fbold = Bridge.as(webgl.getParameter(webgl.FRAMEBUFFER_BINDING), Bridge.WebGL.WebGLFramebuffer);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
                webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D, texRGBA, 0);

                var readData = new Uint8Array(Bridge.Int.mul(Bridge.Int.mul(this.width, this.height), 4));
                readData[0] = 2;
                webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE, readData);
                webgl.deleteFramebuffer(fbo);
                webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);

                if (gray) {
                    this.data = new Uint8Array(Bridge.Int.mul(this.width, this.height));
                    for (var i = 0; i < Bridge.Int.mul(width, height); i = (i + 1) | 0) {
                        this.data[i] = readData[Bridge.Int.mul(i, 4)];
                    }
                } else {
                    this.data = readData;
                }
            }
        },
        methods: {
            getPixel: function (u, v) {
                var x = Bridge.Int.clip32(u * this.width);
                var y = Bridge.Int.clip32(v * this.height);
                if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                    return Bridge.box(0, System.Int32);
                }
                if (this.gray) {
                    return Bridge.box(this.data[((Bridge.Int.mul(y, this.width) + x) | 0)], System.Byte);
                } else {
                    var i = Bridge.Int.mul((((Bridge.Int.mul(y, this.width) + x) | 0)), 4);
                    return new lighttool.spriteColor(this.data[i], this.data[((i + 1) | 0)], this.data[((i + 2) | 0)], this.data[((i + 3) | 0)]);
                }
            }
        }
    });

    Bridge.define("lighttool.textureformat", {
        $kind: "enum",
        statics: {
            fields: {
                RGBA: 1,
                RGB: 2,
                GRAY: 3
            }
        }
    });

    Bridge.define("lighttool.textureMgr", {
        statics: {
            fields: {
                g_this: null
            },
            methods: {
                Instance: function () {
                    if (lighttool.textureMgr.g_this == null) {
                        lighttool.textureMgr.g_this = new lighttool.textureMgr();
                    }

                    return lighttool.textureMgr.g_this;
                }
            }
        },
        fields: {
            mapInfo: null
        },
        ctors: {
            init: function () {
                this.mapInfo = new (System.Collections.Generic.Dictionary$2(System.String,lighttool.texutreMgrItem))();
            }
        },
        methods: {
            reg: function (url, urladd, format, mipmap, linear) {
                if (this.mapInfo.containsKey(url)) {
                    throw new System.Exception("you can't reg the same name");
                }
                var item = new lighttool.texutreMgrItem();

                this.mapInfo.set(url, item);
                item.url = url;
                item.urladd = urladd;
                item.format = format;
                item.mipmap = mipmap;
                item.linear = linear;
            },
            regDirect: function (url, tex) {
                if (this.mapInfo.containsKey(url)) {
                    throw new System.Exception("you can't reg the same name");
                }
                var item = new lighttool.texutreMgrItem();

                this.mapInfo.set(url, item);
                item.url = url;
                item.tex = tex;
            },
            unreg: function (url) {
                if (this.mapInfo.containsKey(url) === false) {
                    return;
                }
                this.unload(url);

                this.mapInfo.set(url, null);
            },
            unload: function (url) {
                if (this.mapInfo.containsKey(url) === false) {
                    return;
                }

                var item = this.mapInfo.get(url);

                item.tex.dispose();
                item.tex = null;
            },
            load: function (webgl, url) {
                if (this.mapInfo.containsKey(url) === false) {
                    return null;
                }

                var item = this.mapInfo.get(url);
                if (item.tex == null) {
                    item.tex = new lighttool.spriteTexture(webgl, (item.url || "") + (item.urladd || ""), item.format, item.mipmap, item.linear);
                }
                return item.tex;
            }
        }
    });

    Bridge.define("lighttool.texutreMgrItem", {
        fields: {
            tex: null,
            url: null,
            urladd: null,
            format: 0,
            mipmap: false,
            linear: false
        }
    });

    Bridge.define("app.App.MyCanvasAction", {
        inherits: [lighttool.canvasAction],
        $kind: "nested class",
        fields: {
            trect: null,
            spritenames: null,
            timer: 0,
            trectBtn: null,
            btndown: false,
            showtxt: null
        },
        alias: [
            "ondraw", "lighttool$canvasAction$ondraw",
            "onpointevent", "lighttool$canvasAction$onpointevent",
            "onresize", "lighttool$canvasAction$onresize"
        ],
        ctors: {
            init: function () {
                this.trect = new lighttool.spriteRect();
                this.trectBtn = new lighttool.spriteRect();
                this.spritenames = new (System.Collections.Generic.List$1(System.String)).ctor();
                this.timer = 0;
                this.trectBtn = new lighttool.spriteRect.$ctor1(50, 150, 200, 50);
                this.btndown = false;
                this.showtxt = "";
            }
        },
        methods: {
            ondraw: function (c) {
                var $t;
                this.timer += 0.015;
                if (this.timer > 2.0) {
                    this.timer -= 2.0;
                }
                if (this.spritenames.Count === 0) {
                    var atlas = lighttool.atlasMgr.Instance().load(c.webgl, "1");
                    if (atlas != null) {
                        $t = Bridge.getEnumerator(atlas.sprites.getKeys(), System.String);
                        try {
                            while ($t.moveNext()) {
                                var iname = $t.Current;
                                this.spritenames.add(iname);
                            }
                        } finally {
                            if (Bridge.is($t, System.IDisposable)) {
                                $t.System$IDisposable$Dispose();
                            }
                        }

                    }
                }

                var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/1.jpg");
                if (t != null) {
                    this.trect.x = 0;
                    this.trect.y = 0;
                    this.trect.w = c.width;
                    this.trect.h = c.height;
                    c.drawTexture(t, this.trect.$clone(), lighttool.spriteRect.one.$clone(), new lighttool.spriteColor(1, 1, 1, 1.0));
                }

                if (this.spritenames.Count > 0) {
                    for (var i = 0; i < 30; i = (i + 1) | 0) {
                        var x = Math.random() * 500;
                        var y = Math.random() * 500;
                        var si = Bridge.Int.clip32(Math.random() * this.spritenames.Count);
                        this.trect.x = x;
                        this.trect.y = y;
                        this.trect.w = 100;
                        this.trect.h = 100;
                        c.drawSprite("1", this.spritenames.getItem(si), this.trect.$clone());
                    }
                }

                var font = lighttool.fontMgr.Instance().load(c.webgl, "f1");
                if (font != null && font.cmap != null) {
                    this.trect.x = 50;
                    this.trect.y = 50;
                    this.trect.w = 50;
                    this.trect.h = 50;
                    font.drawChar(c.spriteBatcher, "古", this.trect.$clone(), lighttool.spriteColor.white, lighttool.spriteColor.gray);
                    this.trect.x = 100;
                    this.trect.y = 50;
                    font.drawChar(c.spriteBatcher, "老", this.trect.$clone(), new lighttool.spriteColor(0.1, 0.8, 0.2, 0.8), new lighttool.spriteColor(1, 1, 1, 0));
                }

                this.trect.x = 50;
                this.trect.y = 150;
                this.trect.w = 200;
                this.trect.h = 50;
                if (t != null) {
                    c.drawTexture(t, this.trectBtn.$clone(), lighttool.spriteRect.one.$clone(), this.btndown ? lighttool.spriteColor.white : new lighttool.spriteColor(1, 1, 1, 0.5));
                }
                c.drawText("f1", "this is Btn", this.trectBtn.$clone(), this.btndown ? new lighttool.spriteColor(1, 0, 0, 1) : lighttool.spriteColor.white);

                this.trect.x = 0;
                this.trect.y = 0;
                this.trect.w = 500;
                this.trect.h = 25;
                c.drawText("f1", this.showtxt, this.trect.$clone());
            },
            onpointevent: function (c, e, x, y) {
                var skipevent = false;

                this.showtxt = "point=   " + System.Single.format(x) + " |,| " + System.Single.format(y);
                if (x > this.trectBtn.x && y > this.trectBtn.y && x < (this.trectBtn.x + this.trectBtn.w) && y < (this.trectBtn.y + this.trectBtn.h)) {
                    this.btndown = true;
                } else {
                    this.btndown = false;
                }
                return skipevent;
            },
            onresize: function (c) { }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJ3ZWJhcHAuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyIsImNhbnZhcy9yZXNtZ3IuY3MiLCJjYW52YXMvc3ByaXRlYmF0Y2hlci5jcyIsImNhbnZhcy9jYW52YXNBZGFwdGVyX05hdGl2ZS5jcyIsImNhbnZhcy9jYW52YXMuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O1lBZ0JZQTs7WUFFQUEsYUFBYUE7WUFDYkEsZ0JBQVlBLEFBQXVCQTtZQUNuQ0EsSUFBSUEsaUJBQVNBO2dCQUNUQSxnQkFBUUEsQUFBdUJBOzs7WUFFbkNBLGdCQUFRQTs7WUFFUkEsa0RBQWtEQSxlQUFPQSxJQUFJQTs7Ozs7OzttQ0FJdENBO29CQU12QkEsNEJBQTRCQSxpREFBNEJBLGdCQUFlQSxBQUFzREEsVUFBQ0EsS0FBS0E7d0JBRS9IQSxpREFBaURBLE9BQU9BOzs7OztvQkFXNURBLFVBQVVBO29CQUNWQTtvQkFDQUEsYUFBYUEsVUFBQ0E7d0JBRVZBLGFBQWFBLGdDQUFnQ0EsT0FBT0EsS0FBS0E7d0JBQ3pEQSx1REFBdURBOzs7b0JBSTNEQSx1Q0FBdUNBLDJDQUFzQkEsNkJBQTRCQSwyQkFBTUE7OztvQkFHL0ZBLFdBQVdBO29CQUNYQSxXQUFXQSxvQ0FBZUE7b0JBQzFCQSxjQUFjQSxVQUFDQTt3QkFFWEEsY0FBY0EsZ0NBQWdDQSxPQUFPQSxNQUFNQTt3QkFDM0RBLHVEQUF1REE7O3dCQUV2REEsNEJBQTRCQSwyQ0FBc0JBLGdCQUFlQSxBQUFzREEsVUFBQ0EsS0FBS0E7NEJBRXpIQSxhQUFhQSw4QkFBOEJBLE9BQU9BLEtBQUtBOzRCQUN2REEsNkNBQTZDQTs7O29CQU1yREEsV0FBV0E7b0JBQ1hBLFdBQVdBLGdEQUEyQkE7b0JBQ3RDQSxjQUFjQSxVQUFDQTt3QkFFWEEsY0FBY0EsZ0NBQWdDQSxPQUFPQSxNQUFNQTt3QkFDM0RBLG1FQUFtRUE7d0JBQ25FQSwyREFBMkRBLEFB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IEJyaWRnZS5IdG1sNTtcclxudXNpbmcgTmV3dG9uc29mdC5Kc29uO1xyXG51c2luZyBTeXN0ZW07XHJcbnVzaW5nIGxpZ2h0dG9vbDtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgYXBwXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBBcHBcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTWFpbigpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgLy8gV3JpdGUgYSBtZXNzYWdlIHRvIHRoZSBDb25zb2xlXHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwiV2VsY29tZSB0byBCcmlkZ2UuTkVUIDIwMThcIik7XHJcblxyXG4gICAgICAgICAgICB2YXIgY2FudmFzID0gQnJpZGdlLkh0bWw1LkRvY3VtZW50LkdldEVsZW1lbnRCeUlkKFwicmVuZGVyQ2FudmFzXCIpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgICAgICBBcHAud2ViZ2wgPSAoV2ViR0xSZW5kZXJpbmdDb250ZXh0KWNhbnZhcy5HZXRDb250ZXh0KFwid2ViZ2xcIik7XHJcbiAgICAgICAgICAgIGlmICh3ZWJnbCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgd2ViZ2wgPSAoV2ViR0xSZW5kZXJpbmdDb250ZXh0KWNhbnZhcy5HZXRDb250ZXh0KFwiZXhwZXJpbWVudGFsLXdlYmdsXCIpO1xyXG5cclxuICAgICAgICAgICAgTG9hZFJlcyh3ZWJnbCk7XHJcblxyXG4gICAgICAgICAgICBsaWdodHRvb2wuTmF0aXZlLmNhbnZhc0FkYXB0ZXIuQ3JlYXRlU2NyZWVuQ2FudmFzKHdlYmdsLCBuZXcgTXlDYW52YXNBY3Rpb24oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0YXRpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBMb2FkUmVzKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbClcclxuICAgICAgICB7ICAgICAgICAgIC8vd2ViZ2xDYW52YXMg5L2/55So5rWB56iLXHJcbiAgICAgICAgICAgIC8vMDEu5Yid5aeL5YyW5p2Q6LSo77yM6L+Z5Liq5paH5Lu26YeM6YWN572u5LqG5omA5pyJ546w6Zi25q615L2/55So55qEc2hhZGVy77yM5Lmf5Y+v5Lul5pS+5Zyo5LiN5ZCM55qE5paH5Lu25Lit77yM5aSa5omn6KGM5Yeg5qyhcGFyc2VVcmzlsLHooYzkuoZcclxuICAgICAgICAgICAgLy/liJ3lp4vljJbmnZDotKhcclxuICAgICAgICAgICAgLy9saWdodHRvb2wuc2hhZGVyTWdyLnBhcnNlckluc3RhbmNlKCkucGFyc2VVcmwod2ViZ2wsIFwic2hhZGVyL3Rlc3Quc2hhZGVyLnR4dD9cIiArIE1hdGgucmFuZG9tKCkpO1xyXG4gICAgICAgICAgICAvL+aJi+WKqOWKoOi9veaOpeWPo1xyXG4gICAgICAgICAgICBsaWdodHRvb2wubG9hZFRvb2wubG9hZFRleHQoXCJzaGFkZXIvdGVzdC5zaGFkZXIudHh0P1wiICsgTWF0aC5SYW5kb20oKSwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaWdodHRvb2wuc2hhZGVyTWdyLnBhcnNlckluc3RhbmNlKCkucGFyc2VEaXJlY3Qod2ViZ2wsIHR4dCk7XHJcbiAgICAgICAgICAgIH1cclxuKSAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAvLzAyLuWIneWni+WMlui1hOa6kO+8jOi/memHjOWPquazqOWGjOS4gOS4quWFs+ezu++8jOWIsOeUqOWIsOeahOaXtuWAmeaJjeS8muecn+eahOWOu+WKoOi9vVxyXG4gICAgICAgICAgICAvL+azqOWGjOi0tOWbvlxyXG4gICAgICAgICAgICAvL+i0tOWbvueUqCB1cmwg5L2c5Li65ZCN5a2X77yM5o+Q5L6b5LiA5LiqIHVybGFkZO+8jOWmguaenOS9oOaDs+imgeS7t+agvHJhbmRvbSDllaXnmoRcclxuICAgICAgICAgICAgLy9saWdodHRvb2wudGV4dHVyZU1nci5JbnN0YW5jZSgpLnJlZyhcInRleC8xLmpwZ1wiLCBcIj9cIiArIE1hdGgucmFuZG9tKCksIGxpZ2h0dG9vbC50ZXh0dXJlZm9ybWF0LlJHQkEsIHRydWUsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgLy9saWdodHRvb2wudGV4dHVyZU1nci5JbnN0YW5jZSgpLnJlZyhcInRleC8xLmpwZ1wiLCBcIlwiLCBsaWdodHRvb2wudGV4dHVyZWZvcm1hdC5SR0JBLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWcgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpOy8vIEltYWdlKCk7XHJcbiAgICAgICAgICAgIGltZy5TcmMgPSBcInRleC8xLmpwZ1wiO1xyXG4gICAgICAgICAgICBpbWcuT25Mb2FkID0gKGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBfc3BpbWcgPSBsaWdodHRvb2wuc3ByaXRlVGV4dHVyZS5mcm9tUmF3KHdlYmdsLCBpbWcsIGxpZ2h0dG9vbC50ZXh0dXJlZm9ybWF0LlJHQkEsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbGlnaHR0b29sLnRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWdEaXJlY3QoXCJ0ZXgvMS5qcGdcIiwgX3NwaW1nKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8v5rOo5YaM5Zu+6ZuGKOWvueW6lOeahOi0tOWbvuS8muiHquWKqOazqOWGjOWIsHRleHR1cmVNZ3IpLOWbvumbhuS9v+eUqOS4gOS4quaMh+WumueahOWQjeWtl++8jOS9oOazqOWGjOe7meS7luWVpeWQjeWtl++8jOWQjumdouWwseeUqOi/meS4quWQjeWtl+WOu+S9v+eUqFxyXG4gICAgICAgICAgICBsaWdodHRvb2wuYXRsYXNNZ3IuSW5zdGFuY2UoKS5yZWcoXCIyXCIsIFwiYXRsYXMvMi5qc29uLnR4dD9cIiArIE1hdGguUmFuZG9tKCksIFwidGV4LzIucG5nXCIsIFwiP1wiICsgTWF0aC5SYW5kb20oKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIGltZzIgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpbWcyLlNyYyA9IFwidGV4LzEucG5nP1wiICsgTWF0aC5SYW5kb20oKTtcclxuICAgICAgICAgICAgaW1nMi5PbkxvYWQgPSAoZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9zcGltZzIgPSBsaWdodHRvb2wuc3ByaXRlVGV4dHVyZS5mcm9tUmF3KHdlYmdsLCBpbWcyLCBsaWdodHRvb2wudGV4dHVyZWZvcm1hdC5SR0JBLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC50ZXh0dXJlTWdyLkluc3RhbmNlKCkucmVnRGlyZWN0KFwidGV4LzEucG5nXCIsIF9zcGltZzIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC5sb2FkVG9vbC5sb2FkVGV4dChcImF0bGFzLzEuanNvbi50eHQ/XCIgKyBNYXRoLlJhbmRvbSgpLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPHN0cmluZywgZ2xvYmFsOjpCcmlkZ2UuRXJyb3I+KSgodHh0LCBlcnIpID0+XHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hdGxhcyA9IGxpZ2h0dG9vbC5zcHJpdGVBdGxhcy5mcm9tUmF3KHdlYmdsLCB0eHQsIF9zcGltZzIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC5hdGxhc01nci5JbnN0YW5jZSgpLnJlZ0RpcmVjdChcIjFcIiwgX2F0bGFzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuKSAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvL+azqOWGjOWtl+S9kyjlr7nlupTnmoTotLTlm77kvJroh6rliqjms6jlhozliLB0ZXh0dXJlTWdyKSzlrZfkvZPkvb/nlKjkuIDkuKrmjIflrprnmoTlkI3lrZfvvIzkvaDms6jlhoznu5nku5bllaXlkI3lrZfvvIzlkI7pnaLlsLHnlKjov5nkuKrlkI3lrZfljrvkvb/nlKhcclxuICAgICAgICAgICAgLy9saWdodHRvb2wuZm9udE1nci5JbnN0YW5jZSgpLnJlZyhcImYxXCIsIFwiZm9udC9TVFhJTkdLQS5mb250Lmpzb24udHh0XCIsIFwidGV4L1NUWElOR0tBLmZvbnQucG5nXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICB2YXIgaW1nMyA9IG5ldyBIVE1MSW1hZ2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGltZzMuU3JjID0gXCJ0ZXgvU1RYSU5HS0EuZm9udC5wbmc/XCIgKyBNYXRoLlJhbmRvbSgpO1xyXG4gICAgICAgICAgICBpbWczLk9uTG9hZCA9IChlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3NwaW1nMyA9IGxpZ2h0dG9vbC5zcHJpdGVUZXh0dXJlLmZyb21SYXcod2ViZ2wsIGltZzMsIGxpZ2h0dG9vbC50ZXh0dXJlZm9ybWF0LlJHQkEsIHRydWUsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgbGlnaHR0b29sLnRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWdEaXJlY3QoXCJ0ZXgvU1RYSU5HS0EuZm9udC5wbmdcIiwgX3NwaW1nMyk7XHJcbiAgICAgICAgICAgICAgICBsaWdodHRvb2wubG9hZFRvb2wubG9hZFRleHQoXCJmb250L1NUWElOR0tBLmZvbnQuanNvbi50eHRcIiwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfZm9udCA9IGxpZ2h0dG9vbC5zcHJpdGVGb250LmZyb21SYXcod2ViZ2wsIHR4dCwgX3NwaW1nMyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlnaHR0b29sLmZvbnRNZ3IuSW5zdGFuY2UoKS5yZWdEaXJlY3QoXCJmMVwiLCBfZm9udCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbikgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNsYXNzIE15Q2FudmFzQWN0aW9uIDogbGlnaHR0b29sLmNhbnZhc0FjdGlvblxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGlnaHR0b29sLnNwcml0ZVJlY3QgdHJlY3QgPSBuZXcgc3ByaXRlUmVjdCgpO1xyXG4gICAgICAgICAgICBMaXN0PHN0cmluZz4gc3ByaXRlbmFtZXMgPSBuZXcgTGlzdDxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIGZsb2F0IHRpbWVyID0gMDtcclxuICAgICAgICAgICAgbGlnaHR0b29sLnNwcml0ZVJlY3QgdHJlY3RCdG4gPSBuZXcgbGlnaHR0b29sLnNwcml0ZVJlY3QoNTAsIDE1MCwgMjAwLCA1MCk7XHJcbiAgICAgICAgICAgIGJvb2wgYnRuZG93biA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzdHJpbmcgc2hvd3R4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHB1YmxpYyB2b2lkIG9uZHJhdyhzcHJpdGVDYW52YXMgYylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lciArPSAwLjAxNWY7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50aW1lciA+IDIuMGYpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50aW1lciAtPSAyLjBmO1xyXG4gICAgICAgICAgICAgICAgLy9nZXQgYWxsIHNwcml0ZSBpbiBhdGxhcyB3aG8gbmFtZWQgXCIxXCJcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNwcml0ZW5hbWVzLkNvdW50ID09IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0bGFzID0gbGlnaHR0b29sLmF0bGFzTWdyLkluc3RhbmNlKCkubG9hZChjLndlYmdsLCBcIjFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0bGFzICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgaW5hbWUgaW4gYXRsYXMuc3ByaXRlcy5LZXlzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZW5hbWVzLkFkZChpbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vaW5pdCBmb3IgZHJhd2VyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZm9yICh2YXIgY2MgPSAwOyBjYyA8IDEwOyBjYysrKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5jZERyYXdlci5wdXNoKG5ldyBjb29sRG93bkRyYXdlcihhdGxhcywgdGhpcy5zcHJpdGVuYW1lc1tjY10pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgdGhpcy5jZERyYXdlcltjY10uc2V0RGVzdFJlY3QobmV3IGxpZ2h0dG9vbC5zcHJpdGVSZWN0KDUwICogY2MsIDUwLCA1MCwgNTApKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy99XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0ID0gbGlnaHR0b29sLnRleHR1cmVNZ3IuSW5zdGFuY2UoKS5sb2FkKGMud2ViZ2wsIFwidGV4LzEuanBnXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYy53aWR0aDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBjLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICBjLmRyYXdUZXh0dXJlKHQsIHRoaXMudHJlY3QsIGxpZ2h0dG9vbC5zcHJpdGVSZWN0Lm9uZSwgbmV3IGxpZ2h0dG9vbC5zcHJpdGVDb2xvcigxLCAxLCAxLCAxLjBmKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9kcmF3IGF0bGFzXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zcHJpdGVuYW1lcy5Db3VudCA+IDApXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLnNwcml0ZUJhdGNoZXIuYmVnaW5kcmF3KHRoaXMuYXRsYXMubWF0KTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDMwOyBpKyspXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IChmbG9hdClNYXRoLlJhbmRvbSgpICogNTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IChmbG9hdClNYXRoLlJhbmRvbSgpICogNTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2kgPSAoaW50KShNYXRoLlJhbmRvbSgpICogdGhpcy5zcHJpdGVuYW1lcy5Db3VudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NhbnZhcyDlgZrms5VcclxuICAgICAgICAgICAgICAgICAgICAgICAgYy5kcmF3U3ByaXRlKFwiMVwiLCB0aGlzLnNwcml0ZW5hbWVzW3NpXSwgdGhpcy50cmVjdCk7IC8v562J5ZCM5LqO5LiL6Z2i55qE5Lik6KGMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy92YXIgYXRsYXMgPSBsaWdodHRvb2wuYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKGMud2ViZ2wsIFwiMVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2F0bGFzLmRyYXcoYy5zcHJpdGVCYXRjaGVyLCB0aGlzLnNwcml0ZW5hbWVzW3NpXSwgdGhpcy50cmVjdCwgdGhpcy53aGl0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vZHJhdyBmb25077yI5bqV5bGC5pa55rOV77yJXHJcbiAgICAgICAgICAgICAgICB2YXIgZm9udCA9IGxpZ2h0dG9vbC5mb250TWdyLkluc3RhbmNlKCkubG9hZChjLndlYmdsLCBcImYxXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvbnQgIT0gbnVsbCAmJiBmb250LmNtYXAgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnggPSA1MDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSA1MDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LncgPSA1MDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LmggPSA1MDtcclxuICAgICAgICAgICAgICAgICAgICBmb250LmRyYXdDaGFyKGMuc3ByaXRlQmF0Y2hlciwgXCLlj6RcIiwgdGhpcy50cmVjdCwgbGlnaHR0b29sLnNwcml0ZUNvbG9yLndoaXRlLCBsaWdodHRvb2wuc3ByaXRlQ29sb3IuZ3JheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gMTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IDUwO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQuZHJhd0NoYXIoYy5zcHJpdGVCYXRjaGVyLCBcIuiAgVwiLCB0aGlzLnRyZWN0LCBuZXcgbGlnaHR0b29sLnNwcml0ZUNvbG9yKDAuMWYsIDAuOGYsIDAuMmYsIDAuOGYpLCBuZXcgbGlnaHR0b29sLnNwcml0ZUNvbG9yKDEsIDEsIDEsIDApKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2RyYXdmb250IGNhbnZhcyDmlrnms5VcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IDUwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gMTUwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gMjAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gNTA7XHJcbiAgICAgICAgICAgICAgICBpZiAodCAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIGMuZHJhd1RleHR1cmUodCwgdGhpcy50cmVjdEJ0biwgbGlnaHR0b29sLnNwcml0ZVJlY3Qub25lLCB0aGlzLmJ0bmRvd24gPyBsaWdodHRvb2wuc3ByaXRlQ29sb3Iud2hpdGUgOiBuZXcgbGlnaHR0b29sLnNwcml0ZUNvbG9yKDEsIDEsIDEsIDAuNWYpKTtcclxuICAgICAgICAgICAgICAgIGMuZHJhd1RleHQoXCJmMVwiLCBcInRoaXMgaXMgQnRuXCIsIHRoaXMudHJlY3RCdG4sIHRoaXMuYnRuZG93biA/IG5ldyBsaWdodHRvb2wuc3ByaXRlQ29sb3IoMSwgMCwgMCwgMSkgOiBsaWdodHRvb2wuc3ByaXRlQ29sb3Iud2hpdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gNTAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gMjU7XHJcbiAgICAgICAgICAgICAgICBjLmRyYXdUZXh0KFwiZjFcIiwgdGhpcy5zaG93dHh0LCB0aGlzLnRyZWN0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHVibGljIGJvb2wgb25wb2ludGV2ZW50KHNwcml0ZUNhbnZhcyBjLCBjYW52YXNwb2ludGV2ZW50IGUsIGZsb2F0IHgsIGZsb2F0IHkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGJvb2wgc2tpcGV2ZW50ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93dHh0ID0gXCJwb2ludD0gICBcIiArIHggKyBcIiB8LHwgXCIgKyB5O1xyXG4gICAgICAgICAgICAgICAgaWYgKHggPiB0aGlzLnRyZWN0QnRuLnggJiYgeSA+IHRoaXMudHJlY3RCdG4ueSAmJiB4IDwgKHRoaXMudHJlY3RCdG4ueCArIHRoaXMudHJlY3RCdG4udylcclxuICAgICAgICAgICAgICAgICAgICAmJiB5IDwgKHRoaXMudHJlY3RCdG4ueSArIHRoaXMudHJlY3RCdG4uaCkpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5kb3duID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJ0bmRvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBza2lwZXZlbnQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyB2b2lkIG9ucmVzaXplKHNwcml0ZUNhbnZhcyBjKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL3Rocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZS5XZWJHTDtcclxuXHJcbi8vdjAuNFxyXG5uYW1lc3BhY2UgbGlnaHR0b29sXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyB0ZXh1dHJlTWdySXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlIHRleDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybGFkZDtcclxuICAgICAgICBwdWJsaWMgdGV4dHVyZWZvcm1hdCBmb3JtYXQ7XHJcbiAgICAgICAgcHVibGljIGJvb2wgbWlwbWFwO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGxpbmVhcjtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyB0ZXh0dXJlTWdyXHJcbiAgICB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHRleHR1cmVNZ3IgZ190aGlzO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdGV4dHVyZU1nciBJbnN0YW5jZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGV4dHVyZU1nci5nX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRleHR1cmVNZ3IuZ190aGlzID0gbmV3IHRleHR1cmVNZ3IoKTsvL25lc3NcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0dXJlTWdyLmdfdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIHRleHV0cmVNZ3JJdGVtPiBtYXBJbmZvID0gbmV3IFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkRpY3Rpb25hcnk8c3RyaW5nLCB0ZXh1dHJlTWdySXRlbT4oKTtcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgcmVnKHN0cmluZyB1cmwsIHN0cmluZyB1cmxhZGQsIHRleHR1cmVmb3JtYXQgZm9ybWF0LCBib29sIG1pcG1hcCwgYm9vbCBsaW5lYXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+mHjeWkjeazqOWGjOWkhOeQhlxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KHVybCkpXHJcbiAgICAgICAgICAgIC8vdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bdXJsXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSAhPSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwieW91IGNhbid0IHJlZyB0aGUgc2FtZSBuYW1lXCIpOy8vbmVzc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IHRleHV0cmVNZ3JJdGVtKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcEluZm9bdXJsXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0udXJsID0gdXJsO1xyXG4gICAgICAgICAgICBpdGVtLnVybGFkZCA9IHVybGFkZDtcclxuICAgICAgICAgICAgaXRlbS5mb3JtYXQgPSBmb3JtYXQ7XHJcbiAgICAgICAgICAgIGl0ZW0ubWlwbWFwID0gbWlwbWFwO1xyXG4gICAgICAgICAgICBpdGVtLmxpbmVhciA9IGxpbmVhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgcmVnRGlyZWN0KHN0cmluZyB1cmwsIHNwcml0ZVRleHR1cmUgdGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleSh1cmwpKVxyXG4gICAgICAgICAgICAvL3ZhciBpdGVtID0gdGhpcy5tYXBJbmZvW3VybF07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gIT0gU2NyaXB0LlVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcInlvdSBjYW4ndCByZWcgdGhlIHNhbWUgbmFtZVwiKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyB0ZXh1dHJlTWdySXRlbSgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW3VybF0gPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgaXRlbS50ZXggPSB0ZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVucmVnKHN0cmluZyB1cmwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KHVybCkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIC8vdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bdXJsXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudW5sb2FkKHVybCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcEluZm9bdXJsXSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVubG9hZChzdHJpbmcgdXJsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleSh1cmwpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bdXJsXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpdGVtLnRleC5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgIGl0ZW0udGV4ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVRleHR1cmUgbG9hZChXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHN0cmluZyB1cmwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KHVybCkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW3VybF07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLnRleCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLnRleCA9IG5ldyBzcHJpdGVUZXh0dXJlKHdlYmdsLCBpdGVtLnVybCArIGl0ZW0udXJsYWRkLCBpdGVtLmZvcm1hdCwgaXRlbS5taXBtYXAsIGl0ZW0ubGluZWFyKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS50ZXg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIGF0bGFzTWdySXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVBdGxhcyBhdGFscztcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybGF0YWxzdGV4O1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdXJsYXRhbHN0ZXhfYWRkO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIGF0bGFzTWdyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYXRsYXNNZ3IgZ190aGlzO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXRsYXNNZ3IgSW5zdGFuY2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGF0bGFzTWdyLmdfdGhpcyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgYXRsYXNNZ3IuZ190aGlzID0gbmV3IGF0bGFzTWdyKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYXRsYXNNZ3IuZ190aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIGF0bGFzTWdySXRlbT4gbWFwSW5mbyA9IG5ldyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5EaWN0aW9uYXJ5PHN0cmluZywgYXRsYXNNZ3JJdGVtPigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCByZWcoc3RyaW5nIG5hbWUsIHN0cmluZyB1cmxhdGxhcywgc3RyaW5nIHVybGF0YWxzdGV4LCBzdHJpbmcgdXJsYXRhbHN0ZXhfYWRkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/ph43lpI3ms6jlhozlpITnkIZcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleShuYW1lKSlcclxuICAgICAgICAgICAgLy92YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSAhPSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwieW91IGNhbid0IHJlZyB0aGUgc2FtZSBuYW1lXCIpOy8vbmVzc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IGF0bGFzTWdySXRlbSgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW25hbWVdID0gaXRlbTtcclxuICAgICAgICAgICAgaXRlbS51cmwgPSB1cmxhdGxhcztcclxuICAgICAgICAgICAgaXRlbS51cmxhdGFsc3RleCA9IHVybGF0YWxzdGV4O1xyXG4gICAgICAgICAgICBpdGVtLnVybGF0YWxzdGV4X2FkZCA9IHVybGF0YWxzdGV4X2FkZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgdW5yZWcoc3RyaW5nIG5hbWUsIGJvb2wgZGlzcG9zZXRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudW5sb2FkKG5hbWUsIGRpc3Bvc2V0ZXgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvLlJlbW92ZShuYW1lKTtcclxuICAgICAgICAgICAgLy90aGlzLm1hcEluZm9bbmFtZV0gPSBTY3JpcHQuVW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgcmVnRGlyZWN0KHN0cmluZyBuYW1lLCBzcHJpdGVBdGxhcyBhdGxhcylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkpXHJcbiAgICAgICAgICAgIC8vICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtICE9IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJ5b3UgY2FuJ3QgcmVnIHRoZSBzYW1lIG5hbWVcIik7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgYXRsYXNNZ3JJdGVtKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcEluZm9bbmFtZV0gPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLmF0YWxzID0gYXRsYXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVubG9hZChzdHJpbmcgbmFtZSwgYm9vbCBkaXNwb3NldGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleShuYW1lKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bbmFtZV07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaWYgKGRpc3Bvc2V0ZXgpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uYXRhbHMudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmF0YWxzLnRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW0uYXRhbHMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHNwcml0ZUF0bGFzIGxvYWQoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bbmFtZV07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGlmIChpdGVtLmF0YWxzID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0ZXh0dXJlTWdyLkluc3RhbmNlKCkubG9hZCh3ZWJnbCwgaXRlbS51cmxhdGFsc3RleCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4ID09IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZU1nci5JbnN0YW5jZSgpLnJlZyhpdGVtLnVybGF0YWxzdGV4LCBpdGVtLnVybGF0YWxzdGV4X2FkZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlnaHR0b29sLnRleHR1cmVmb3JtYXQuUkdCQSwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0ZXggPSB0ZXh0dXJlTWdyLkluc3RhbmNlKCkubG9hZCh3ZWJnbCwgaXRlbS51cmxhdGFsc3RleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtLmF0YWxzID0gbmV3IHNwcml0ZUF0bGFzKHdlYmdsLCBpdGVtLnVybCwgdGV4KTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaXRlbS5hdGFscztcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIGZvbnRNZ3JJdGVtXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUZvbnQgZm9udDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybGF0YWxzdGV4O1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdXJsYXRhbHN0ZXhfYWRkO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIGZvbnRNZ3JcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmb250TWdyIGdfdGhpcztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGZvbnRNZ3IgSW5zdGFuY2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGZvbnRNZ3IuZ190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBmb250TWdyLmdfdGhpcyA9IG5ldyBmb250TWdyKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZm9udE1nci5nX3RoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5EaWN0aW9uYXJ5PHN0cmluZywgZm9udE1nckl0ZW0+IG1hcEluZm8gPSBuZXcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIGZvbnRNZ3JJdGVtPigpO1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCByZWcoc3RyaW5nIG5hbWUsIHN0cmluZyB1cmxmb250LCBzdHJpbmcgdXJsYXRhbHN0ZXgsIHN0cmluZyB1cmxhdGFsc3RleF9hZGQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL+mHjeWkjeazqOWGjOWkhOeQhlxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gIT0gU2NyaXB0LlVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcInlvdSBjYW4ndCByZWcgdGhlIHNhbWUgbmFtZVwiKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpdGVtID0gbmV3IGZvbnRNZ3JJdGVtKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcEluZm9bbmFtZV0gPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLnVybCA9IHVybGZvbnQ7XHJcbiAgICAgICAgICAgIGl0ZW0udXJsYXRhbHN0ZXggPSB1cmxhdGFsc3RleDtcclxuICAgICAgICAgICAgaXRlbS51cmxhdGFsc3RleF9hZGQgPSB1cmxhdGFsc3RleF9hZGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlZ0RpcmVjdChzdHJpbmcgbmFtZSwgc3ByaXRlRm9udCBmb250KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KG5hbWUpKVxyXG4gICAgICAgICAgICAvL3ZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtICE9IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJ5b3UgY2FuJ3QgcmVnIHRoZSBzYW1lIG5hbWVcIik7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgZm9udE1nckl0ZW0oKTsvL25lc3NcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mb1tuYW1lXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0uZm9udCA9IGZvbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVucmVnKHN0cmluZyBuYW1lLCBib29sIGRpc3Bvc2V0ZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KG5hbWUpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudW5sb2FkKG5hbWUsIGRpc3Bvc2V0ZXgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvLlJlbW92ZShuYW1lKTtcclxuICAgICAgICAgICAgLy90aGlzLm1hcEluZm9bbmFtZV0gPSBTY3JpcHQuVW5kZWZpbmVkO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVubG9hZChzdHJpbmcgbmFtZSwgYm9vbCBkaXNwb3NldGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleShuYW1lKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChkaXNwb3NldGV4KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmZvbnQudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmZvbnQudGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbS5mb250ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVGb250IGxvYWQoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgbmFtZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5mb250ID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0ZXh0dXJlTWdyLkluc3RhbmNlKCkubG9hZCh3ZWJnbCwgaXRlbS51cmxhdGFsc3RleCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4ID09IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dHVyZU1nci5JbnN0YW5jZSgpLnJlZyhpdGVtLnVybGF0YWxzdGV4LCBpdGVtLnVybGF0YWxzdGV4X2FkZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlnaHR0b29sLnRleHR1cmVmb3JtYXQuR1JBWSwgZmFsc2UsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0ZXggPSB0ZXh0dXJlTWdyLkluc3RhbmNlKCkubG9hZCh3ZWJnbCwgaXRlbS51cmxhdGFsc3RleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtLmZvbnQgPSBuZXcgc3ByaXRlRm9udCh3ZWJnbCwgaXRlbS51cmwsIHRleCk7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uZm9udDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNoYWRlck1nclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGxpZ2h0dG9vbC5zaGFkZXJQYXJzZXIgZ19zaGFkZXJQYXJzZXI7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBsaWdodHRvb2wuc2hhZGVyUGFyc2VyIHBhcnNlckluc3RhbmNlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChzaGFkZXJNZ3IuZ19zaGFkZXJQYXJzZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHNoYWRlck1nci5nX3NoYWRlclBhcnNlciA9IG5ldyBsaWdodHRvb2wuc2hhZGVyUGFyc2VyKCk7Ly9uZXNzXHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXJNZ3IuZ19zaGFkZXJQYXJzZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcclxudXNpbmcgU3lzdGVtLkxpbnE7XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBCcmlkZ2UuV2ViR0w7XHJcblxyXG5uYW1lc3BhY2UgbGlnaHR0b29sXHJcbntcclxuICAgIC8v5Yqg6L295bel5YW3XHJcblxyXG4gICAgcHVibGljIGNsYXNzIGxvYWRUb29sXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIGxvYWRUZXh0KHN0cmluZyB1cmwsIEFjdGlvbjxzdHJpbmcsIEJyaWRnZS5FcnJvcj4gZnVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOy8vbmVzc1xyXG4gICAgICAgICAgICByZXEuT3BlbihcIkdFVFwiLCB1cmwpO1xyXG4gICAgICAgICAgICByZXEuT25SZWFkeVN0YXRlQ2hhbmdlID0gKCkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcS5SZWFkeVN0YXRlID09IEJyaWRnZS5IdG1sNS5BamF4UmVhZHlTdGF0ZS5Eb25lKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bihyZXEuUmVzcG9uc2VUZXh0LCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxLk9uRXJyb3IgPSAoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IG5ldyBCcmlkZ2UuRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyci5NZXNzYWdlID0gXCJvbmVyciBpbiByZXE6XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW4obnVsbCwgZXJyKTsvL25lc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxLlNlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgbG9hZEFycmF5QnVmZmVyKHN0cmluZyB1cmwsIEFjdGlvbjxCcmlkZ2UuSHRtbDUuQXJyYXlCdWZmZXIsIEJyaWRnZS5FcnJvcj4gZnVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgcmVxLk9wZW4oXCJHRVRcIiwgdXJsKTtcclxuICAgICAgICAgICAgcmVxLlJlc3BvbnNlVHlwZSA9IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlLkFycmF5QnVmZmVyOy8vIFwiYXJyYXlidWZmZXJcIjsvL2llIOS4gOWumuimgeWcqG9wZW7kuYvlkI7kv67mlLlyZXNwb25zZVR5cGVcclxuICAgICAgICAgICAgcmVxLk9uUmVhZHlTdGF0ZUNoYW5nZSA9ICgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXEuUmVhZHlTdGF0ZSA9PSBBamF4UmVhZHlTdGF0ZS5Eb25lKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnb3QgYmluOlwiICsgdHlwZW9mIChyZXEucmVzcG9uc2UpICsgcmVxLnJlc3BvbnNlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuKHJlcS5SZXNwb25zZSBhcyBBcnJheUJ1ZmZlciwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcS5PbkVycm9yID0gKGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVyci5NZXNzYWdlID0gXCJvbmVyciBpbiByZXE6XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bihudWxsLCBlcnIpOy8vbmVzc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcS5TZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgbG9hZEJsb2Ioc3RyaW5nIHVybCwgQWN0aW9uPEJsb2IsIEVycm9yPiBmdW4pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICByZXEuT3BlbihcIkdFVFwiLCB1cmwpO1xyXG4gICAgICAgICAgICByZXEuUmVzcG9uc2VUeXBlID0gWE1MSHR0cFJlcXVlc3RSZXNwb25zZVR5cGUuQmxvYjsvLyBcImJsb2JcIjsvL2llIOS4gOWumuimgeWcqG9wZW7kuYvlkI7kv67mlLlyZXNwb25zZVR5cGVcclxuICAgICAgICAgICAgcmVxLk9uUmVhZHlTdGF0ZUNoYW5nZSA9ICgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXEuUmVhZHlTdGF0ZSA9PSBBamF4UmVhZHlTdGF0ZS5Eb25lKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJnb3QgX2Jsb2I6XCIgKyB0eXBlb2YgKHJlcS5yZXNwb25zZSkgKyByZXEucmVzcG9uc2VUeXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBmdW4ocmVxLlJlc3BvbnNlIGFzIEJsb2IsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXEuT25FcnJvciA9IChlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIuTWVzc2FnZSA9IFwib25lcnIgaW4gcmVxOlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW4obnVsbCwgZXJyKTsvL25lc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXEuU2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgfVxyXG4gICAgLy9zaGFkZXJcclxuICAgIHB1YmxpYyBjbGFzcyBzaGFkZXJjb2RlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB2c2NvZGU7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyBmc2NvZGU7XHJcbiAgICAgICAgcHVibGljIFdlYkdMU2hhZGVyIHZzO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFNoYWRlciBmcztcclxuICAgICAgICBwdWJsaWMgV2ViR0xQcm9ncmFtIHByb2dyYW07XHJcblxyXG4gICAgICAgIHB1YmxpYyBpbnQgcG9zUG9zID0gLTE7XHJcbiAgICAgICAgcHVibGljIGludCBwb3NDb2xvciA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgcG9zQ29sb3IyID0gLTE7XHJcbiAgICAgICAgcHVibGljIGludCBwb3NVViA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB1bmlNYXRyaXggPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB1bmlUZXgwID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgV2ViR0xVbmlmb3JtTG9jYXRpb24gdW5pVGV4MSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIFdlYkdMVW5pZm9ybUxvY2F0aW9uIHVuaUNvbDAgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB1bmlDb2wxID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdm9pZCBjb21waWxlKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMudnMgPSB3ZWJnbC5DcmVhdGVTaGFkZXIod2ViZ2wuVkVSVEVYX1NIQURFUik7XHJcbiAgICAgICAgICAgIHRoaXMuZnMgPSB3ZWJnbC5DcmVhdGVTaGFkZXIod2ViZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuXHJcbiAgICAgICAgICAgIC8v5YiG5Yir57yW6K+Rc2hhZGVyXHJcbiAgICAgICAgICAgIHdlYmdsLlNoYWRlclNvdXJjZSh0aGlzLnZzLCB0aGlzLnZzY29kZSk7XHJcbiAgICAgICAgICAgIHdlYmdsLkNvbXBpbGVTaGFkZXIodGhpcy52cyk7XHJcbiAgICAgICAgICAgIHZhciByMSA9IHdlYmdsLkdldFNoYWRlclBhcmFtZXRlcih0aGlzLnZzLCB3ZWJnbC5DT01QSUxFX1NUQVRVUyk7XHJcbiAgICAgICAgICAgIGlmIChyMS5Bczxib29sPigpID09IGZhbHNlKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBhbGVydCh3ZWJnbC5HZXRTaGFkZXJJbmZvTG9nKHRoaXMudnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICB3ZWJnbC5TaGFkZXJTb3VyY2UodGhpcy5mcywgdGhpcy5mc2NvZGUpO1xyXG4gICAgICAgICAgICB3ZWJnbC5Db21waWxlU2hhZGVyKHRoaXMuZnMpO1xyXG4gICAgICAgICAgICB2YXIgcjIgPSB3ZWJnbC5HZXRTaGFkZXJQYXJhbWV0ZXIodGhpcy5mcywgd2ViZ2wuQ09NUElMRV9TVEFUVVMpO1xyXG4gICAgICAgICAgICBpZiAocjIuQXM8Ym9vbD4oKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQod2ViZ2wuR2V0U2hhZGVySW5mb0xvZyh0aGlzLmZzKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vcHJvZ3JhbSBsaW5rXHJcbiAgICAgICAgICAgIHRoaXMucHJvZ3JhbSA9IHdlYmdsLkNyZWF0ZVByb2dyYW0oKS5BczxXZWJHTFByb2dyYW0+KCk7XHJcblxyXG4gICAgICAgICAgICB3ZWJnbC5BdHRhY2hTaGFkZXIodGhpcy5wcm9ncmFtLCB0aGlzLnZzKTtcclxuICAgICAgICAgICAgd2ViZ2wuQXR0YWNoU2hhZGVyKHRoaXMucHJvZ3JhbSwgdGhpcy5mcyk7XHJcblxyXG4gICAgICAgICAgICB3ZWJnbC5MaW5rUHJvZ3JhbSh0aGlzLnByb2dyYW0pO1xyXG4gICAgICAgICAgICB2YXIgcjMgPSB3ZWJnbC5HZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMucHJvZ3JhbSwgd2ViZ2wuTElOS19TVEFUVVMpO1xyXG4gICAgICAgICAgICBpZiAocjMuQXM8Ym9vbD4oKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQod2ViZ2wuR2V0UHJvZ3JhbUluZm9Mb2codGhpcy5wcm9ncmFtKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvL+e7keWumnZib+WSjHNoYWRlcumhtueCueagvOW8j++8jOi/memDqOWIhuW6lOivpeimgeWMuuWIhuadkOi0qOaUueWPmOS4juWPguaVsOaUueWPmO+8jOWPr+S7peWwkeWIh+aNouS4gOS6m+eKtuaAgVxyXG4gICAgICAgICAgICB0aGlzLnBvc1BvcyA9IHdlYmdsLkdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJwb3NpdGlvblwiKTtcclxuICAgICAgICAgICAgdGhpcy5wb3NDb2xvciA9IHdlYmdsLkdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJjb2xvclwiKTtcclxuICAgICAgICAgICAgdGhpcy5wb3NDb2xvcjIgPSB3ZWJnbC5HZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sIFwiY29sb3IyXCIpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wb3NVViA9IHdlYmdsLkdldEF0dHJpYkxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1dlwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudW5pTWF0cml4ID0gd2ViZ2wuR2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJtYXRyaXhcIik7XHJcbiAgICAgICAgICAgIHRoaXMudW5pVGV4MCA9IHdlYmdsLkdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidGV4MFwiKTtcclxuICAgICAgICAgICAgdGhpcy51bmlUZXgxID0gd2ViZ2wuR2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ0ZXgxXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaUNvbDAgPSB3ZWJnbC5HZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcImNvbDBcIik7XHJcbiAgICAgICAgICAgIHRoaXMudW5pQ29sMSA9IHdlYmdsLkdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwiY29sMVwiKTtcclxuXHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIGFsZXJ0KHN0cmluZyBwKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IE5vdEltcGxlbWVudGVkRXhjZXB0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNoYWRlclBhcnNlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PHN0cmluZywgc2hhZGVyY29kZT4gbWFwc2hhZGVyID0gbmV3IERpY3Rpb25hcnk8c3RyaW5nLCBzaGFkZXJjb2RlPigpO1xyXG4gICAgICAgIC8vICAgIG1hcHNoYWRlcjogeyBbaWQ6IHN0cmluZ106IHNoYWRlcmNvZGVcclxuICAgICAgICAvL30gPSB7fTtcclxuICAgICAgICB2b2lkIF9wYXJzZXIoc3RyaW5nIHR4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzMSA9IHR4dC5TcGxpdChuZXdbXSB7IFwiPC0tXCIgfSwgU3RyaW5nU3BsaXRPcHRpb25zLlJlbW92ZUVtcHR5RW50cmllcyk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgczEuTGVuZ3RoOyBpKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBzMiA9IHMxW2ldLlNwbGl0KFwiLS0+XCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHN0YWcgPSBzMlswXS5TcGxpdChcIiBcIik7Ly90YWdzO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNzaGFkZXIgPSBzMlsxXTsvL+ato+aWh1xyXG4gICAgICAgICAgICAgICAgdmFyIGxhc3RuYW1lID0gXCJcIjtcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0dGFnID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHN0YWcuTGVuZ3RoOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHQgPSBzdGFnW2pdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0Lkxlbmd0aCA9PSAwKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodCA9PSBcInZzXCIpLy92ZWN0ZXhzaGFkZXJcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3R0YWcgPSAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmICh0ID09IFwiZnNcIikvL2ZyYWdtZW50c2hhZGVyXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0dGFnID0gMjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdG5hbWUgPSB0LlN1YnN0cmluZygxLCB0Lkxlbmd0aCAtIDIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsYXN0bmFtZS5MZW5ndGggPT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tYXBzaGFkZXIuQ29udGFpbnNLZXkobGFzdG5hbWUpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwc2hhZGVyW2xhc3RuYW1lXSA9IG5ldyBzaGFkZXJjb2RlKCk7Ly9uZXNzXHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdHRhZyA9PSAxKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwc2hhZGVyW2xhc3RuYW1lXS52c2NvZGUgPSBzc2hhZGVyO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAobGFzdHRhZyA9PSAyKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWFwc2hhZGVyW2xhc3RuYW1lXS5mc2NvZGUgPSBzc2hhZGVyO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBwYXJzZVVybChXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHN0cmluZyB1cmwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBsaWdodHRvb2wubG9hZFRvb2wubG9hZFRleHQodXJsLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPHN0cmluZywgZ2xvYmFsOjpCcmlkZ2UuRXJyb3I+KSgodHh0LCBlcnIpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlcih0eHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21waWxlKHdlYmdsKTtcclxuICAgICAgICAgICAgICAgIC8vc3ByaXRlQmF0Y2hlclxyXG4gICAgICAgICAgICB9XHJcbikgICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBwYXJzZURpcmVjdChXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHN0cmluZyB0eHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJzZXIodHh0KTtcclxuICAgICAgICAgICAgdGhpcy5jb21waWxlKHdlYmdsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdm9pZCBkdW1wKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBuYW1lIGluIHRoaXMubWFwc2hhZGVyLktleXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwic2hhZGVybmFtZTpcIiArIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJ2czpcIiArIHRoaXMubWFwc2hhZGVyW25hbWVdLnZzY29kZSk7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcImZzOlwiICsgdGhpcy5tYXBzaGFkZXJbbmFtZV0uZnNjb2RlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdm9pZCBjb21waWxlKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBuYW1lIGluIHRoaXMubWFwc2hhZGVyLktleXMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWFwc2hhZGVyW25hbWVdLmNvbXBpbGUod2ViZ2wpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy9zcHJpdGUg5Z+65pys5pWw5o2u57uT5p6EXHJcbiAgICBwdWJsaWMgc3RydWN0IHNwcml0ZVJlY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlUmVjdChmbG9hdCB4ID0gMCwgZmxvYXQgeSA9IDAsIGZsb2F0IHcgPSAwLCBmbG9hdCBoID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICAgICAgICAgIHRoaXMuaCA9IGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB3O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgc3ByaXRlUmVjdCBvbmUgPSBuZXcgc3ByaXRlUmVjdCgwLCAwLCAxLCAxKTsvL25lc3NcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZVJlY3QgemVybyA9IG5ldyBzcHJpdGVSZWN0KDAsIDAsIDAsIDApOy8vbmVzc1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZUJvcmRlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVCb3JkZXIoZmxvYXQgbCA9IDAsIGZsb2F0IHQgPSAwLCBmbG9hdCByID0gMCwgZmxvYXQgYiA9IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmwgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnQgPSB0O1xyXG4gICAgICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgbDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZUJvcmRlciB6ZXJvID0gbmV3IHNwcml0ZUJvcmRlcigwLCAwLCAwLCAwKTsvL25lc3NcclxuXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlQ29sb3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQ29sb3IoZmxvYXQgciA9IDEsIGZsb2F0IGcgPSAxLCBmbG9hdCBiID0gMSwgZmxvYXQgYSA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNwcml0ZUNvbG9yIHdoaXRlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzcHJpdGVDb2xvcigxLCAxLCAxLCAxKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZUNvbG9yIGJsYWNrID0gbmV3IHNwcml0ZUNvbG9yKDAsIDAsIDAsIDEpOy8vbmVzc1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgc3ByaXRlQ29sb3IgZ3JheSA9IG5ldyBzcHJpdGVDb2xvcigwLjVmLCAwLjVmLCAwLjVmLCAxKTsvL25lc3NcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVQb2ludFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB6O1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYTtcclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IHIyO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBnMjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjI7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGEyO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgdTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9zcHJpdGXmnZDotKhcclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVNYXRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHNoYWRlcjtcclxuICAgICAgICBwdWJsaWMgYm9vbCB0cmFuc3BhcmVudDtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlVGV4dHVyZSB0ZXgwO1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlIHRleDE7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUNvbG9yIGNvbDA7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUNvbG9yIGNvbDE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3RhdGVSZWNvcmRlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgcHVibGljIHN0YXRlUmVjb3JkZXIoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbCA9IHdlYmdsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBERVBUSF9XUklURU1BU0s7XHJcbiAgICAgICAgcHVibGljIGJvb2wgREVQVEhfVEVTVDtcclxuICAgICAgICBwdWJsaWMgaW50IERFUFRIX0ZVTkM7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQkxFTkQ7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9FUVVBVElPTjtcclxuICAgICAgICBwdWJsaWMgaW50IEJMRU5EX1NSQ19SR0I7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9TUkNfQUxQSEE7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9EU1RfUkdCO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQkxFTkRfRFNUX0FMUEhBO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFByb2dyYW0gQ1VSUkVOVF9QUk9HUkFNO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTEJ1ZmZlciBBUlJBWV9CVUZGRVI7XHJcbiAgICAgICAgcHVibGljIGludCBBQ1RJVkVfVEVYVFVSRTtcclxuICAgICAgICBwdWJsaWMgV2ViR0xUZXh0dXJlIFRFWFRVUkVfQklORElOR18yRDtcclxuICAgICAgICBwdWJsaWMgdm9pZCByZWNvcmQoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8v6K6w5b2V54q25oCBXHJcbiAgICAgICAgICAgIHRoaXMuREVQVEhfV1JJVEVNQVNLID0gKGJvb2wpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5ERVBUSF9XUklURU1BU0spO1xyXG4gICAgICAgICAgICB0aGlzLkRFUFRIX1RFU1QgPSAoYm9vbCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICB0aGlzLkRFUFRIX0ZVTkMgPSAoaW50KXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuREVQVEhfRlVOQyk7XHJcbiAgICAgICAgICAgIC8vYWxwaGFibGVuZCDvvIzot5/nnYBtYXTotbBcclxuICAgICAgICAgICAgdGhpcy5CTEVORCA9IChib29sKXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQkxFTkQpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX0VRVUFUSU9OID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX0VRVUFUSU9OKTtcclxuICAgICAgICAgICAgdGhpcy5CTEVORF9TUkNfUkdCID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX1NSQ19SR0IpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX1NSQ19BTFBIQSA9IChpbnQpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5CTEVORF9TUkNfQUxQSEEpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX0RTVF9SR0IgPSAoaW50KXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQkxFTkRfRFNUX1JHQik7XHJcbiAgICAgICAgICAgIHRoaXMuQkxFTkRfRFNUX0FMUEhBID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX0RTVF9BTFBIQSk7XHJcbiAgICAgICAgICAgIC8vICAgIHRoaXMud2ViZ2wuYmxlbmRGdW5jU2VwYXJhdGUodGhpcy53ZWJnbC5PTkUsIHRoaXMud2ViZ2wuT05FX01JTlVTX1NSQ19BTFBIQSxcclxuICAgICAgICAgICAgLy8gICAgICAgIHRoaXMud2ViZ2wuU1JDX0FMUEhBLCB0aGlzLndlYmdsLk9ORSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQ1VSUkVOVF9QUk9HUkFNKTtcclxuICAgICAgICAgICAgdGhpcy5DVVJSRU5UX1BST0dSQU0gPSBwLkFzPFdlYkdMUHJvZ3JhbT4oKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYiA9IHRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSX0JJTkRJTkcpO1xyXG4gICAgICAgICAgICB0aGlzLkFSUkFZX0JVRkZFUiA9IHBiLkFzPFdlYkdMQnVmZmVyPigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5BQ1RJVkVfVEVYVFVSRSA9IChpbnQpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5BQ1RJVkVfVEVYVFVSRSk7XHJcbiAgICAgICAgICAgIHRoaXMuVEVYVFVSRV9CSU5ESU5HXzJEID0gdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5URVhUVVJFX0JJTkRJTkdfMkQpLkFzPFdlYkdMVGV4dHVyZT4oKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlc3RvcmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/mgaLlpI3nirbmgIFcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EZXB0aE1hc2sodGhpcy5ERVBUSF9XUklURU1BU0spO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ERVBUSF9URVNUKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5ERVBUSF9URVNUKTsvL+i/meaYr3p0ZXN0XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRGlzYWJsZSh0aGlzLndlYmdsLkRFUFRIX1RFU1QpOy8v6L+Z5pivenRlc3RcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EZXB0aEZ1bmModGhpcy5ERVBUSF9GVU5DKTsvL+i/meaYr3p0ZXN05pa55rOVXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5CTEVORClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEVxdWF0aW9uKHRoaXMuQkxFTkRfRVFVQVRJT04pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEZ1bmNTZXBhcmF0ZSh0aGlzLkJMRU5EX1NSQ19SR0IsIHRoaXMuQkxFTkRfRFNUX1JHQixcclxuICAgICAgICAgICAgICAgIHRoaXMuQkxFTkRfU1JDX0FMUEhBLCB0aGlzLkJMRU5EX0RTVF9BTFBIQSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndlYmdsLlVzZVByb2dyYW0odGhpcy5DVVJSRU5UX1BST0dSQU0pO1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsLkJpbmRCdWZmZXIodGhpcy53ZWJnbC5BUlJBWV9CVUZGRVIsIHRoaXMuQVJSQVlfQlVGRkVSKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLkFDVElWRV9URVhUVVJFKTtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMuVEVYVFVSRV9CSU5ESU5HXzJEKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZUJhdGNoZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsO1xyXG4gICAgICAgIHB1YmxpYyBzaGFkZXJQYXJzZXIgc2hhZGVycGFyc2VyO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTEJ1ZmZlciB2Ym87XHJcbiAgICAgICAgLy9kYXRhOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBGbG9hdDMyQXJyYXkgbWF0cml4O1xyXG4gICAgICAgIHB1YmxpYyBib29sIHp0ZXN0ID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGVSZWNvcmRlciByZWNvcmRlcjtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQmF0Y2hlcihXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHNoYWRlclBhcnNlciBzaGFkZXJwYXJzZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVycGFyc2VyID0gc2hhZGVycGFyc2VyO1xyXG4gICAgICAgICAgICB0aGlzLnZibyA9IHdlYmdsLkNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICB2YXIgYXNwID0gKHRoaXMud2ViZ2wuRHJhd2luZ0J1ZmZlcldpZHRoIC8gdGhpcy53ZWJnbC5EcmF3aW5nQnVmZmVySGVpZ2h0KTtcclxuICAgICAgICAgICAgLy90aGlzLm1hdHJpeD1cclxuICAgICAgICAgICAgZmxvYXRbXSBhcnJheSA9e1xyXG4gICAgICAgICAgICAgICAgMS4wZiAvIGFzcCwgMCwgMCwgMCwvL+WOu+aOiWFzcOeahOW9seWTjVxyXG4gICAgICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgICAgIH07Ly9uZXNzXHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShhcnJheSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyID0gbmV3IHN0YXRlUmVjb3JkZXIod2ViZ2wpOy8vbmVzc1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBiZWdpbmRyYXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRlci5yZWNvcmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgZW5kZHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmVuZGJhdGNoKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyLnJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNoYWRlcmNvZGUgc2hhZGVyY29kZSA9IG51bGw7XHJcbiAgICAgICAgLy9iZWdpbmRyYXcg5ZKMIHNldG1hdCDliLDlupXopoHkuI3opoHliIblvIDvvIzov5nmmK/pnIDopoHlho3mgJ3ogIPkuIDkuIvnmoRcclxuICAgICAgICBwdWJsaWMgc3ByaXRlTWF0IG1hdDtcclxuICAgICAgICBwdWJsaWMgdm9pZCBzZXRNYXQoc3ByaXRlTWF0IG1hdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXQgPT0gdGhpcy5tYXQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EaXNhYmxlKHRoaXMud2ViZ2wuQ1VMTF9GQUNFKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF0ID0gbWF0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJwYXJzZXIubWFwc2hhZGVyLkNvbnRhaW5zS2V5KHRoaXMubWF0LnNoYWRlcikgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyY29kZSA9IHRoaXMuc2hhZGVycGFyc2VyLm1hcHNoYWRlclt0aGlzLm1hdC5zaGFkZXJdO1xyXG4gICAgICAgICAgICAvL2lmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAvL+aMh+WumnNoYWRlcuWSjHZib1xyXG5cclxuICAgICAgICAgICAgLy/lhbPkuo7mt7HluqYg77yM6Lef552Ac3ByaXRlYmF0Y2hlcui1sFxyXG4gICAgICAgICAgICB0aGlzLndlYmdsLkRlcHRoTWFzayhmYWxzZSk7Ly/ov5nmmK96d3JpdGVcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnp0ZXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkVuYWJsZSh0aGlzLndlYmdsLkRFUFRIX1RFU1QpOy8v6L+Z5pivenRlc3RcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRGVwdGhGdW5jKHRoaXMud2ViZ2wuTEVRVUFMKTsvL+i/meaYr3p0ZXN05pa55rOVXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5ERVBUSF9URVNUKTsvL+i/meaYr3p0ZXN0XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdC50cmFuc3BhcmVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9hbHBoYWJsZW5kIO+8jOi3n+edgG1hdOi1sFxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkJsZW5kRXF1YXRpb24odGhpcy53ZWJnbC5GVU5DX0FERCk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMud2ViZ2wuYmxlbmRGdW5jKHRoaXMud2ViZ2wuT05FLCB0aGlzLndlYmdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEZ1bmNTZXBhcmF0ZSh0aGlzLndlYmdsLk9ORSwgdGhpcy53ZWJnbC5PTkVfTUlOVVNfU1JDX0FMUEhBLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuU1JDX0FMUEhBLCB0aGlzLndlYmdsLk9ORSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuVXNlUHJvZ3JhbSh0aGlzLnNoYWRlcmNvZGUucHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuQmluZEJ1ZmZlcih0aGlzLndlYmdsLkFSUkFZX0JVRkZFUiwgdGhpcy52Ym8pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8v5oyH5a6a5Zu65a6a55qE5pWw5o2u57uT5p6E77yM54S25ZCO5qC55o2u5a2Y5ZyocHJvZ3JhbeeahOaVsOaNruWOu+e7keWumuWSr+OAglxyXG5cclxuICAgICAgICAgICAgLy/nu5Hlrpp2Ym/lkoxzaGFkZXLpobbngrnmoLzlvI/vvIzov5npg6jliIblupTor6XopoHljLrliIbmnZDotKjmlLnlj5jkuI7lj4LmlbDmlLnlj5jvvIzlj6/ku6XlsJHliIfmjaLkuIDkupvnirbmgIFcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS5wb3NQb3MgPj0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnNoYWRlcmNvZGUucG9zUG9zKTtcclxuICAgICAgICAgICAgICAgIC8vMjgg5piv5pWw5o2u5q2l6ZW/KOWtl+iKginvvIzlsLHmmK/mlbDmja7nu5PmnoTnmoTplb/luqZcclxuICAgICAgICAgICAgICAgIC8vMTIg5piv5pWw5o2u5YGP56e777yI5a2X6IqC77yJXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc1BvcywgMywgdGhpcy53ZWJnbC5GTE9BVCwgZmFsc2UsIDUyLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlcmNvZGUucG9zQ29sb3IsIDQsIHRoaXMud2ViZ2wuRkxPQVQsIGZhbHNlLCA1MiwgMTIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUucG9zQ29sb3IyID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yMiwgNCwgdGhpcy53ZWJnbC5GTE9BVCwgZmFsc2UsIDUyLCAyOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS5wb3NVViA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuc2hhZGVyY29kZS5wb3NVVik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc1VWLCAyLCB0aGlzLndlYmdsLkZMT0FULCBmYWxzZSwgNTIsIDQ0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlNYXRyaXggIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5Vbmlmb3JtTWF0cml4NGZ2KHRoaXMuc2hhZGVyY29kZS51bmlNYXRyaXgsIGZhbHNlLCAoQXJyYXkpKG9iamVjdCl0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlUZXgwICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkUwKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzLm1hdC50ZXgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRleCA9PSBudWxsID8gbnVsbCA6IHRleC50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTFpKHRoaXMuc2hhZGVyY29kZS51bmlUZXgwLCAwKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlUZXgxICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkUxKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzLm1hdC50ZXgxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRleCA9PSBudWxsID8gbnVsbCA6IHRleC50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTFpKHRoaXMuc2hhZGVyY29kZS51bmlUZXgxLCAxKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlDb2wwICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTRmKHRoaXMuc2hhZGVyY29kZS51bmlDb2wwLCBtYXQuY29sMC5yLCBtYXQuY29sMC5nLCBtYXQuY29sMC5iLCBtYXQuY29sMC5hKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlDb2wxICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTRmKHRoaXMuc2hhZGVyY29kZS51bmlDb2wxLCBtYXQuY29sMS5yLCBtYXQuY29sMS5nLCBtYXQuY29sMS5iLCBtYXQuY29sMS5hKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIEZsb2F0MzJBcnJheSBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoMTAyNCAqIDEzKTsvL25lc3NcclxuICAgICAgICBpbnQgZGF0YXNlZWsgPSAwO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIGVuZGJhdGNoKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy/loavlhYV2Ym9cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CdWZmZXJEYXRhKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmFycmF5LCB0aGlzLndlYmdsLkRZTkFNSUNfRFJBVyk7XHJcbiAgICAgICAgICAgIC8v57uY5Yi2XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuRHJhd0FycmF5cyh0aGlzLndlYmdsLlRSSUFOR0xFUywgMCwgdGhpcy5kYXRhc2Vlayk7XHJcbiAgICAgICAgICAgIC8v5riF55CG54q25oCB77yM5Y+v5Lul5LiN5bmyXHJcbiAgICAgICAgICAgIC8vdGhpcy53ZWJnbC5iaW5kQnVmZmVyKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5kYXRhLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBhZGRRdWFkKHNwcml0ZVBvaW50W10gcHMpLy/mt7vliqDlm5vovrnlvaLvvIzlv4XpobvmmK/lm5vnmoTlgI3mlbDvvIzkuI3mjqXlj5foo4HliapcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgamMgPSAwOyBqYyA8IDY7IGpjKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBqID0gamMgPCAzID8gamMgOiA2IC0gamM7Ly8gMC0+MCAxLT4xIDItPjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGogPiAyKSBqID0gNiAtIGpjOyAvLyAzLT4zIDQtPjIgNS0+MVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpID0gdGhpcy5kYXRhc2VlayAqIDEzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uejtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5yMjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmcyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5hMjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGFkZFRyaShzcHJpdGVQb2ludFtdIHBzKS8v5re75Yqg5LiJ6KeS5b2i77yM5b+F6aG75piv5LiJ55qE5YCN5pWwICzkuInop5LlvaLkuI3mlK/mjIHnoazoo4HliapcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmRhdGFzZWVrICogMTM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9mb3IgKHZhciBlIGluIHBzW2pdKVxyXG4gICAgICAgICAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdW2VdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ueTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS56O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZzI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0udTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFzZWVrKys7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS54KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0ueik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5yKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0uYik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5hKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0uZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5iKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLmEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0udSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS52KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/ov5nkuKrmjqXlj6PmjqXlj5foo4HliapcclxuICAgICAgICBwdWJsaWMgdm9pZCBhZGRSZWN0KHNwcml0ZVBvaW50W10gcHMpIC8v5re75Yqg5Zub6L655b2i77yM5b+F6aG75piv5Zub55qE5YCN5pWwXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJjb2RlID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY3RDbGlwICE9IG51bGwpIC8v5L2/55So6KOB5YmqXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB4bWluID0gcHNbMF0ueDtcclxuICAgICAgICAgICAgICAgIHZhciB4bWF4ID0gcHNbM10ueDtcclxuICAgICAgICAgICAgICAgIHZhciB5bWluID0gcHNbMF0ueTtcclxuICAgICAgICAgICAgICAgIHZhciB5bWF4ID0gcHNbM10ueTtcclxuICAgICAgICAgICAgICAgIHZhciB1bWluID0gcHNbMF0udTtcclxuICAgICAgICAgICAgICAgIHZhciB1bWF4ID0gcHNbM10udTtcclxuICAgICAgICAgICAgICAgIHZhciB2bWluID0gcHNbMF0udjtcclxuICAgICAgICAgICAgICAgIHZhciB2bWF4ID0gcHNbM10udjtcclxuICAgICAgICAgICAgICAgIHZhciB3c2l6ZSA9IHhtYXggLSB4bWluO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhzaXplID0geW1heCAtIHltaW47XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNpemUgPSB1bWF4IC0gdW1pbjtcclxuICAgICAgICAgICAgICAgIHZhciB2c2l6ZSA9IHZtYXggLSB2bWluO1xyXG4gICAgICAgICAgICAgICAgdmFyIHhsID0gTWF0aC5NYXgoeG1pbiwgdGhpcy5yZWN0Q2xpcC5WYWx1ZS54KTtcclxuICAgICAgICAgICAgICAgIHZhciB4ciA9IE1hdGguTWluKHhtYXgsIHRoaXMucmVjdENsaXAuVmFsdWUueCArIHRoaXMucmVjdENsaXAuVmFsdWUudyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgeXQgPSBNYXRoLk1heCh5bWluLCB0aGlzLnJlY3RDbGlwLlZhbHVlLnkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHliID0gTWF0aC5NaW4oeW1heCwgdGhpcy5yZWN0Q2xpcC5WYWx1ZS55ICsgdGhpcy5yZWN0Q2xpcC5WYWx1ZS5oKTtcclxuICAgICAgICAgICAgICAgIHZhciBsZiA9ICh4bCAtIHhtaW4pIC8gd3NpemU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGYgPSAoeXQgLSB5bWluKSAvIGhzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJmID0gKHhyIC0geG1heCkgLyB3c2l6ZTtcclxuICAgICAgICAgICAgICAgIHZhciBiZiA9ICh5YiAtIHltYXgpIC8gaHNpemU7XHJcbiAgICAgICAgICAgICAgICB1bWluID0gdW1pbiArIGxmICogdXNpemU7XHJcbiAgICAgICAgICAgICAgICB2bWluID0gdm1pbiArIHRmICogdnNpemU7XHJcbiAgICAgICAgICAgICAgICB1bWF4ID0gdW1heCArIHJmICogdXNpemU7XHJcbiAgICAgICAgICAgICAgICB2bWF4ID0gdm1heCArIGJmICogdnNpemU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqYyA9IDA7IGpjIDwgNjsgamMrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IGpjIDwgMyA/IGpjIDogNiAtIGpjOy8vIDAtPjAgMS0+MSAyLT4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoaiA+IDIpIGogPSA2IC0gamM7IC8vIDMtPjMgNC0+MiA1LT4xXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gdGhpcy5kYXRhc2VlayAqIDEzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggPCB4bCkgeCA9IHhsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID4geHIpIHggPSB4cjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IHBzW2pdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkgPCB5dCkgeSA9IHl0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh5ID4geWIpIHkgPSB5YjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdSA9IHBzW2pdLnU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHUgPCB1bWluKSB1ID0gdW1pbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodSA+IHVtYXgpIHUgPSB1bWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gcHNbal0udjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodiA8IHZtaW4pIHYgPSB2bWluO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2ID4gdm1heCkgdiA9IHZtYXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0geDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLno7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5yMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5hMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSB1O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHY7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGpjID0gMDsgamMgPCA2OyBqYysrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gamMgPCAzID8gamMgOiA2IC0gamM7Ly8gMC0+MCAxLT4xIDItPjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChqID4gMikgaiA9IDYgLSBqYzsgLy8gMy0+MyA0LT4yIDUtPjFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmRhdGFzZWVrICogMTM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ueTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS56O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZzI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0udTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFzZWVrKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3ByaXRlUmVjdD8gcmVjdENsaXAgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIHNldFJlY3RDbGlwKHNwcml0ZVJlY3QgcmVjdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdENsaXAgPSByZWN0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBjbG9zZVJlY3RDbGlwKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdENsaXAgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL3RleHR1cmVcclxuICAgIHB1YmxpYyBlbnVtIHRleHR1cmVmb3JtYXRcclxuICAgIHtcclxuICAgICAgICBSR0JBID0gMSwvLyBXZWJHTFJlbmRlcmluZ0NvbnRleHQuUkdCQSxcclxuICAgICAgICBSR0IgPSAyLC8vV2ViR0xSZW5kZXJpbmdDb250ZXh0LlJHQixcclxuICAgICAgICBHUkFZID0gMywvL1dlYkdMUmVuZGVyaW5nQ29udGV4dC5MVU1JTkFOQ0UsXHJcbiAgICAgICAgLy9BTFBIQSA9IHRoaXMud2ViZ2wuQUxQSEEsXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3MgdGV4UmVhZGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHRleFJlYWRlcihXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIFdlYkdMVGV4dHVyZSB0ZXhSR0JBLCBpbnQgd2lkdGgsIGludCBoZWlnaHQsIGJvb2wgZ3JheSA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXkgPSBncmF5O1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgdmFyIGZibyA9IHdlYmdsLkNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgICAgIFdlYkdMRnJhbWVidWZmZXIgZmJvbGQgPSB3ZWJnbC5HZXRQYXJhbWV0ZXIod2ViZ2wuRlJBTUVCVUZGRVJfQklORElORykgYXMgV2ViR0xGcmFtZWJ1ZmZlcjtcclxuICAgICAgICAgICAgd2ViZ2wuQmluZEZyYW1lYnVmZmVyKHdlYmdsLkZSQU1FQlVGRkVSLCBmYm8pO1xyXG4gICAgICAgICAgICB3ZWJnbC5GcmFtZWJ1ZmZlclRleHR1cmUyRCh3ZWJnbC5GUkFNRUJVRkZFUiwgd2ViZ2wuQ09MT1JfQVRUQUNITUVOVDAsIHdlYmdsLlRFWFRVUkVfMkQsXHJcbiAgICAgICAgICAgICAgICB0ZXhSR0JBLCAwKTtcclxuXHJcbiAgICAgICAgICAgIHZhciByZWFkRGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCAqIDQpO1xyXG4gICAgICAgICAgICByZWFkRGF0YVswXSA9IDI7XHJcbiAgICAgICAgICAgIHdlYmdsLlJlYWRQaXhlbHMoMCwgMCwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHdlYmdsLlJHQkEsIHdlYmdsLlVOU0lHTkVEX0JZVEUsXHJcbiAgICAgICAgICAgICAgICByZWFkRGF0YSk7XHJcbiAgICAgICAgICAgIHdlYmdsLkRlbGV0ZUZyYW1lYnVmZmVyKGZibyk7XHJcbiAgICAgICAgICAgIHdlYmdsLkJpbmRGcmFtZWJ1ZmZlcih3ZWJnbC5GUkFNRUJVRkZFUiwgZmJvbGQpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGdyYXkpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMud2lkdGggKiB0aGlzLmhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHdpZHRoICogaGVpZ2h0OyBpKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gcmVhZERhdGFbaSAqIDRdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gcmVhZERhdGE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGludCB3aWR0aDtcclxuICAgICAgICBwdWJsaWMgaW50IGhlaWdodDtcclxuICAgICAgICBwdWJsaWMgVWludDhBcnJheSBkYXRhO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGdyYXk7XHJcbiAgICAgICAgcHVibGljIG9iamVjdCBnZXRQaXhlbChmbG9hdCB1LCBmbG9hdCB2KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaW50IHggPSAoaW50KSh1ICogdGhpcy53aWR0aCk7XHJcbiAgICAgICAgICAgIGludCB5ID0gKGludCkodiAqIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKHggPCAwIHx8IHggPj0gdGhpcy53aWR0aCB8fCB5IDwgMCB8fCB5ID49IHRoaXMuaGVpZ2h0KSByZXR1cm4gMDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ3JheSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVt5ICogdGhpcy53aWR0aCArIHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGkgPSAoeSAqIHRoaXMud2lkdGggKyB4KSAqIDQ7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IHNwcml0ZUNvbG9yKHRoaXMuZGF0YVtpXSwgdGhpcy5kYXRhW2kgKyAxXSwgdGhpcy5kYXRhW2kgKyAyXSwgdGhpcy5kYXRhW2kgKyAzXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlVGV4dHVyZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIHVybCA9IG51bGwsIHRleHR1cmVmb3JtYXQgZm9ybWF0ID0gdGV4dHVyZWZvcm1hdC5SR0JBLCBib29sIG1pcG1hcCA9IGZhbHNlLCBib29sIGxpbmVhciA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuZm9ybWF0ID0gZm9ybWF0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXQgPSBuZXcgc3ByaXRlTWF0KCk7Ly9uZXNzXHJcbiAgICAgICAgICAgIHRoaXMubWF0LnRleDAgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm1hdC50cmFuc3BhcmVudCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMubWF0LnNoYWRlciA9IFwic3ByaXRlZGVmYXVsdFwiO1xyXG5cclxuICAgICAgICAgICAgaWYgKHVybCA9PSBudWxsKS8v5LiN57uZ5a6adXJsIOWImSB0ZXh0dXJlIOS4jeWKoOi9vVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmUgPSB3ZWJnbC5DcmVhdGVUZXh0dXJlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IG5ldyBCcmlkZ2UuSHRtbDUuSFRNTEltYWdlRWxlbWVudCgpOy8vIEltYWdlKCk7Ly8gSFRNTEltYWdlRWxlbWVudCgpOyAvL25lc3NcclxuICAgICAgICAgICAgdGhpcy5pbWcuU3JjID0gdXJsO1xyXG4gICAgICAgICAgICB0aGlzLmltZy5PbkxvYWQgPSAoZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlzcG9zZWl0KVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sb2FkaW1nKG1pcG1hcCwgbGluZWFyKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBfbG9hZGltZyhib29sIG1pcG1hcCwgYm9vbCBsaW5lYXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndpZHRoID0gdGhpcy5pbWcuV2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5pbWcuSGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuUGl4ZWxTdG9yZWkodGhpcy53ZWJnbC5VTlBBQ0tfUFJFTVVMVElQTFlfQUxQSEFfV0VCR0wsIDEpO1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsLlBpeGVsU3RvcmVpKHRoaXMud2ViZ2wuVU5QQUNLX0ZMSVBfWV9XRUJHTCwgMCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHZhciBmb3JtYXRHTCA9IHRoaXMud2ViZ2wuUkdCQTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZm9ybWF0ID09IHRleHR1cmVmb3JtYXQuUkdCKVxyXG4gICAgICAgICAgICAgICAgZm9ybWF0R0wgPSB0aGlzLndlYmdsLlJHQjtcclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5mb3JtYXQgPT0gdGV4dHVyZWZvcm1hdC5HUkFZKVxyXG4gICAgICAgICAgICAgICAgZm9ybWF0R0wgPSB0aGlzLndlYmdsLkxVTUlOQU5DRTtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhJbWFnZTJEKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIDAsXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRHTCxcclxuICAgICAgICAgICAgICAgIGZvcm1hdEdMLFxyXG4gICAgICAgICAgICAgICAgLy/mnIDlkI7ov5nkuKp0eXBl77yM5Y+v5Lul566h5qC85byPXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlVOU0lHTkVEX0JZVEVcclxuICAgICAgICAgICAgICAgICwgdGhpcy5pbWcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG1pcG1hcClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy/nlJ/miJBtaXBtYXBcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuR2VuZXJhdGVNaXBtYXAodGhpcy53ZWJnbC5URVhUVVJFXzJEKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobGluZWFyKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLndlYmdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMud2ViZ2wuTElORUFSX01JUE1BUF9MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLndlYmdsLk5FQVJFU1QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLndlYmdsLk5FQVJFU1RfTUlQTUFQX05FQVJFU1QpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaW5lYXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMud2ViZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlRleFBhcmFtZXRlcmkodGhpcy53ZWJnbC5URVhUVVJFXzJELCB0aGlzLndlYmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy53ZWJnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCB0aGlzLndlYmdsLk5FQVJFU1QpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLndlYmdsLk5FQVJFU1QpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmltZyA9IG51bGw7XHJcblxyXG5cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgcHVibGljIEhUTUxJbWFnZUVsZW1lbnQgaW1nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBsb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgV2ViR0xUZXh0dXJlIHRleHR1cmU7XHJcbiAgICAgICAgcHVibGljIHRleHR1cmVmb3JtYXQgZm9ybWF0O1xyXG4gICAgICAgIHB1YmxpYyBpbnQgd2lkdGggPSAwO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgaGVpZ2h0ID0gMDtcclxuICAgICAgICBzdGF0aWMgcHVibGljIHNwcml0ZVRleHR1cmUgZnJvbVJhdyhXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIEhUTUxJbWFnZUVsZW1lbnQgaW1nLCB0ZXh0dXJlZm9ybWF0IGZvcm1hdCA9IHRleHR1cmVmb3JtYXQuUkdCQSwgYm9vbCBtaXBtYXAgPSBmYWxzZSwgYm9vbCBsaW5lYXIgPSB0cnVlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHN0ID0gbmV3IHNwcml0ZVRleHR1cmUod2ViZ2wsIG51bGwsIGZvcm1hdCwgbWlwbWFwLCBsaW5lYXIpO1xyXG4gICAgICAgICAgICBzdC50ZXh0dXJlID0gd2ViZ2wuQ3JlYXRlVGV4dHVyZSgpO1xyXG4gICAgICAgICAgICBzdC5pbWcgPSBpbWc7XHJcbiAgICAgICAgICAgIHN0Ll9sb2FkaW1nKG1pcG1hcCwgbGluZWFyKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVNYXQgbWF0ID0gbnVsbDtcclxuICAgICAgICAvL+WIm+W7uuivu+WPluWZqO+8jOacieWPr+iDveWksei0pVxyXG4gICAgICAgIHB1YmxpYyB0ZXhSZWFkZXIgcmVhZGVyO1xyXG4gICAgICAgIHB1YmxpYyB0ZXhSZWFkZXIgZ2V0UmVhZGVyKGJvb2wgcmVkT25seSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlYWRlciAhPSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZWFkZXIuZ3JheSAhPSByZWRPbmx5KVxyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeXN0ZW0uRXhjZXB0aW9uKFwiZ2V0IHBhcmFtIGRpZmYgd2l0aCB0aGlzLnJlYWRlclwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtYXQgIT0gdGV4dHVyZWZvcm1hdC5SR0JBKVxyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5c3RlbS5FeGNlcHRpb24oXCJvbmx5IHJnYmEgdGV4dHVyZSBjYW4gcmVhZFwiKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dHVyZSA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVhZGVyID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYWRlciA9IG5ldyB0ZXhSZWFkZXIodGhpcy53ZWJnbCwgdGhpcy50ZXh0dXJlLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgcmVkT25seSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWFkZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBib29sIGRpc3Bvc2VpdCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRpc3Bvc2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dHVyZSA9PSBudWxsICYmIHRoaXMuaW1nICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3Bvc2VpdCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0dXJlICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRGVsZXRlVGV4dHVyZSh0aGlzLnRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVQb2ludFtdIHBvaW50YnVmID0ge1xyXG4gICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnQoKXsgeD0wLCB5PSAwLCB6PSAwLCByPSAwLCBnPTAsIGI9IDAsIGE9IDAsIHIyPTAsIGcyPTAsIGIyPSAwLCBhMj0gMCwgdT0wLCB2PTAgfSxcclxuICAgICAgICAgICAgbmV3IHNwcml0ZVBvaW50KCl7IHg9IDAsIHk9IDAsIHo9IDAsIHI9IDAsIGc9IDAsIGI9IDAsIGE9IDAsIHIyPTAsIGcyPSAwLCBiMj0gMCwgYTI9IDAsIHU9MCwgdj0wIH0sXHJcbiAgICAgICAgICAgIG5ldyBzcHJpdGVQb2ludCgpeyB4PTAsIHk9IDAsIHo9IDAsIHI9IDAsIGc9IDAsIGI9IDAsIGE9IDAsIHIyPSAwLCBnMj0gMCwgYjI9IDAsIGEyPSAwLCB1PTAsIHY9IDAgfSxcclxuICAgICAgICAgICAgbmV3IHNwcml0ZVBvaW50KCl7IHg9MCwgeT0wLCB6PTAsIHI9IDAsIGc9IDAsIGI9IDAsIGE9IDAsIHIyPSAwLCBnMj0wLCBiMj0gMCwgYTI9MCwgdT0wLCB2PSAwIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgZHJhdyhzcHJpdGVCYXRjaGVyIHNwcml0ZUJhdGNoZXIsIHNwcml0ZVJlY3QgdXYsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlQ29sb3IgYylcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICB7XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5wb2ludGJ1ZlswXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueDsgcC55ID0gcmVjdC55OyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gdXYueDsgcC52ID0gdXYueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlsxXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueCArIHJlY3QudzsgcC55ID0gcmVjdC55OyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gdXYueCArIHV2Lnc7IHAudiA9IHV2Lnk7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbMl07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0Lng7IHAueSA9IHJlY3QueSArIHJlY3QuaDsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHV2Lng7IHAudiA9IHV2LnkgKyB1di5oO1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzNdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54ICsgdXYudzsgcC52ID0gdXYueSArIHV2Lmg7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3ByaXRlQmF0Y2hlci5zZXRNYXQodGhpcy5tYXQpO1xyXG4gICAgICAgICAgICBzcHJpdGVCYXRjaGVyLmFkZFJlY3QodGhpcy5wb2ludGJ1Zik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgZHJhd0N1c3RvbShzcHJpdGVCYXRjaGVyIHNwcml0ZUJhdGNoZXIsIHNwcml0ZU1hdCBfbWF0LCBzcHJpdGVSZWN0IHV2LCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUNvbG9yIGMsIHNwcml0ZUNvbG9yIGMyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgX21hdC50ZXgwID0gdGhpcztcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBvaW50YnVmWzBdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54OyBwLnYgPSB1di55O1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzFdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54ICsgdXYudzsgcC52ID0gdXYueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlsyXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueDsgcC55ID0gcmVjdC55ICsgcmVjdC5oOyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gdXYueDsgcC52ID0gdXYueSArIHV2Lmg7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbM107XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0LnggKyByZWN0Lnc7IHAueSA9IHJlY3QueSArIHJlY3QuaDsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHV2LnggKyB1di53OyBwLnYgPSB1di55ICsgdXYuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcHJpdGVCYXRjaGVyLnNldE1hdChfbWF0KTtcclxuICAgICAgICAgICAgc3ByaXRlQmF0Y2hlci5hZGRSZWN0KHRoaXMucG9pbnRidWYpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZS8vIDogc3ByaXRlUmVjdFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB3O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4c2l6ZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeXNpemU7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVJlY3QgVG9SZWN0KClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgc3ByaXRlUmVjdCh4LCB5LCB3LCBoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvL2F0bGFzXHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlQXRsYXNcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsO1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVBdGxhcyhXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHN0cmluZyBhdGxhc3VybCA9IG51bGwsIHNwcml0ZVRleHR1cmUgdGV4dHVyZSA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIGlmIChhdGxhc3VybCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBsaWdodHRvb2wubG9hZFRvb2wubG9hZFRleHQoYXRsYXN1cmwsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248c3RyaW5nLCBnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKCh0eHQsIGVycikgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4pICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzcHJpdGVBdGxhcyBmcm9tUmF3KFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIHR4dCwgc3ByaXRlVGV4dHVyZSB0ZXh0dXJlID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzYSA9IG5ldyBzcHJpdGVBdGxhcyh3ZWJnbCwgbnVsbCwgdGV4dHVyZSk7XHJcbiAgICAgICAgICAgIHNhLl9wYXJzZSh0eHQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHNhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHRleHR1cmV1cmw7XHJcbiAgICAgICAgcHVibGljIGludCB0ZXh0dXJld2lkdGg7XHJcbiAgICAgICAgcHVibGljIGludCB0ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlIHRleHR1cmU7XHJcbiAgICAgICAgcHVibGljIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkRpY3Rpb25hcnk8c3RyaW5nLCBzcHJpdGU+IHNwcml0ZXMgPSBuZXcgRGljdGlvbmFyeTxzdHJpbmcsIHNwcml0ZT4oKTtcclxuICAgICAgICBwcml2YXRlIHZvaWQgX3BhcnNlKHN0cmluZyB0eHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IEpTT04uUGFyc2UodHh0KS5Ub0R5bmFtaWMoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJldXJsID0ganNvbltcInRcIl07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXdpZHRoID0ganNvbltcIndcIl07XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZWhlaWdodCA9IGpzb25bXCJoXCJdO1xyXG4gICAgICAgICAgICB2YXIgcyA9IChvYmplY3RbXSlqc29uW1wic1wiXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcy5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNzID0gKG9iamVjdFtdKXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgciA9IG5ldyBzcHJpdGUoKTsvL25lc3NcclxuICAgICAgICAgICAgICAgIHIueCA9ICgoZmxvYXQpc3NbMV0gKyAwLjVmKSAvIHRoaXMudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICAgICAgci55ID0gKChmbG9hdClzc1syXSArIDAuNWYpIC8gdGhpcy50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgci53ID0gKChmbG9hdClzc1szXSAtIDFmKSAvIHRoaXMudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICAgICAgci5oID0gKChmbG9hdClzc1s0XSAtIDFmKSAvIHRoaXMudGV4dHVyZWhlaWdodDtcclxuICAgICAgICAgICAgICAgIHIueHNpemUgPSAoZmxvYXQpc3NbM107XHJcbiAgICAgICAgICAgICAgICByLnlzaXplID0gKGZsb2F0KXNzWzRdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVzWyhzdHJpbmcpc3NbMF1dID0gcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgZHJhd0J5VGV4dHVyZShzcHJpdGVCYXRjaGVyIHNiLCBzdHJpbmcgc25hbWUsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlQ29sb3IgYylcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHR1cmUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgciA9IHRoaXMuc3ByaXRlc1tzbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChyID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZS5kcmF3KHNiLCByLlRvUmVjdCgpLCByZWN0LCBjKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vZm9udFxyXG4gICAgcHVibGljIGNsYXNzIGNoYXJpbmZvXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHg7Ly91dlxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB3O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4U2l6ZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeVNpemU7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHhPZmZzZXQ7Ly/lgY/np7tcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeU9mZnNldDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeEFkZHZhbmNlOy8v5a2X56ym5a695bqmXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlRm9udFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVRleHR1cmUgdGV4dHVyZTtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlTWF0IG1hdDtcclxuXHJcbiAgICAgICAgcHVibGljIGR5bmFtaWMgY21hcDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIGZvbnRuYW1lO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBwb2ludFNpemU7Ly/lg4/ntKDlsLrlr7hcclxuICAgICAgICBwdWJsaWMgZmxvYXQgcGFkZGluZzsvL+mXtOmalFxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBsaW5lSGVpZ2h0Oy8v6KGM6auYXHJcbiAgICAgICAgcHVibGljIGZsb2F0IGJhc2VsaW5lOy8v5Z+657q/XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGF0bGFzV2lkdGg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGF0bGFzSGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVGb250KFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIHVybGNvbmZpZywgc3ByaXRlVGV4dHVyZSB0ZXh0dXJlKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbCA9IHdlYmdsO1xyXG4gICAgICAgICAgICBpZiAodXJsY29uZmlnICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC5sb2FkVG9vbC5sb2FkVGV4dCh1cmxjb25maWcsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248c3RyaW5nLCBnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKCh0eHQsIGVycikgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZSh0eHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4pICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlID0gdGV4dHVyZTtcclxuICAgICAgICAgICAgdGhpcy5tYXQgPSBuZXcgc3ByaXRlTWF0KCk7Ly9uZXNzXHJcbiAgICAgICAgICAgIHRoaXMubWF0LnNoYWRlciA9IFwic3ByaXRlZm9udFwiO1xyXG4gICAgICAgICAgICB0aGlzLm1hdC50ZXgwID0gdGhpcy50ZXh0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLm1hdC50cmFuc3BhcmVudCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3ByaXRlRm9udCBmcm9tUmF3KFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIHR4dCwgc3ByaXRlVGV4dHVyZSB0ZXh0dXJlID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBzZiA9IG5ldyBzcHJpdGVGb250KHdlYmdsLCBudWxsLCB0ZXh0dXJlKTtcclxuICAgICAgICAgICAgc2YuX3BhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgX3BhcnNlKHN0cmluZyB0eHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZDEgPSBuZXcgRGF0ZSgpLlZhbHVlT2YoKTtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSBKU09OLlBhcnNlKHR4dCk7XHJcblxyXG4gICAgICAgICAgICAvL3BhcnNlIGZvbnRpbmZvXHJcbiAgICAgICAgICAgIHZhciBmb250ID0gKG9iamVjdFtdKWpzb25bXCJmb250XCJdO1xyXG4gICAgICAgICAgICB0aGlzLmZvbnRuYW1lID0gKHN0cmluZylmb250WzBdO1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50U2l6ZSA9IChmbG9hdClmb250WzFdO1xyXG4gICAgICAgICAgICB0aGlzLnBhZGRpbmcgPSAoZmxvYXQpZm9udFsyXTtcclxuICAgICAgICAgICAgdGhpcy5saW5lSGVpZ2h0ID0gKGZsb2F0KWZvbnRbM107XHJcbiAgICAgICAgICAgIHRoaXMuYmFzZWxpbmUgPSAoZmxvYXQpZm9udFs0XTtcclxuICAgICAgICAgICAgdGhpcy5hdGxhc1dpZHRoID0gKGZsb2F0KWZvbnRbNV07XHJcbiAgICAgICAgICAgIHRoaXMuYXRsYXNIZWlnaHQgPSAoZmxvYXQpZm9udFs2XTtcclxuXHJcbiAgICAgICAgICAgIC8vcGFyc2UgY2hhciBtYXBcclxuICAgICAgICAgICAgdGhpcy5jbWFwID0gbmV3IG9iamVjdCgpO1xyXG4gICAgICAgICAgICB2YXIgbWFwID0ganNvbltcIm1hcFwiXTtcclxuICAgICAgICAgICAgZm9yZWFjaCAodmFyIGMgaW4gU2NyaXB0LkdldE93blByb3BlcnR5TmFtZXMobWFwKSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbmZvID0gbmV3IGNoYXJpbmZvKCk7Ly9uZXNzXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNtYXBbY10gPSBmaW5mbztcclxuICAgICAgICAgICAgICAgIGZpbmZvLnggPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVswXSAvIHRoaXMuYXRsYXNXaWR0aDtcclxuICAgICAgICAgICAgICAgIGZpbmZvLnkgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVsxXSAvIHRoaXMuYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBmaW5mby53ID0gbWFwW2NdLkFzPGZsb2F0W10+KClbMl0gLyB0aGlzLmF0bGFzV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBmaW5mby5oID0gbWFwW2NdLkFzPGZsb2F0W10+KClbM10gLyB0aGlzLmF0bGFzSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgZmluZm8ueFNpemUgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVsyXTtcclxuICAgICAgICAgICAgICAgIGZpbmZvLnlTaXplID0gbWFwW2NdLkFzPGZsb2F0W10+KClbM107XHJcbiAgICAgICAgICAgICAgICBmaW5mby54T2Zmc2V0ID0gbWFwW2NdLkFzPGZsb2F0W10+KClbNF07XHJcbiAgICAgICAgICAgICAgICBmaW5mby55T2Zmc2V0ID0gbWFwW2NdLkFzPGZsb2F0W10+KClbNV07XHJcbiAgICAgICAgICAgICAgICBmaW5mby54QWRkdmFuY2UgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVs2XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXAgPSBudWxsO1xyXG4gICAgICAgICAgICBqc29uID0gbnVsbDtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgZDIgPSBuZXcgRGF0ZSgpLlZhbHVlT2YoKTtcclxuICAgICAgICAgICAgdmFyIG4gPSBkMiAtIGQxO1xyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcImpzb24gdGltZT1cIiArIG4pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgc3ByaXRlUG9pbnRbXSBwb2ludGJ1ZiA9IHtcclxuICAgICAgICAgICAgICAgICAgbmV3IHNwcml0ZVBvaW50ICB7IHg9MCwgeT0gMCwgej0gMCwgcj0gMCwgZz0wLCBiPTAsIGE9MCwgcjI9MCwgZzI9IDAsIGIyPTAsIGEyPTAsIHU9MCx2ID0gMCB9LFxyXG4gICAgICAgICAgICAgbmV3IHNwcml0ZVBvaW50eyB4PSAwLCB5PTAsIHo9MCwgcj0wLCBnPSAwLCBiPSAwLCBhPTAsIHIyPTAsIGcyPSAwLCBiMj0gMCwgYTI9MCwgdT0wLCB2PSAwIH0sXHJcbiAgICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnR7IHg9IDAsIHk9IDAsIHo9IDAsIHI9IDAsIGc9IDAsIGI9IDAsIGE9IDAsIHIyPSAwLCBnMj0gMCwgYjI9IDAsIGEyPSAwLCB1PSAwLCB2PSAwIH0sXHJcbiAgICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnR7IHg9IDAsIHk9IDAsIHo9MCwgcj0gMCwgZz0wLCBiPSAwLCBhPSAwLCByMj0gMCwgZzI9IDAsIGIyPTAsIGEyPSAwLCB1PSAwLCB2PSAwIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3KHNwcml0ZUJhdGNoZXIgc2IsIGNoYXJpbmZvIHIsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlQ29sb3IgYyA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yQm9yZGVyID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvckJvcmRlciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3JCb3JkZXIgPSBuZXcgc3ByaXRlQ29sb3IoMGYsIDBmLCAwZiwgMC41Zik7XHJcbiAgICAgICAgICAgIC8vaWYgKHI9PW51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBwID0gdGhpcy5wb2ludGJ1ZlswXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueDsgcC55ID0gcmVjdC55ICsgcmVjdC5oOyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gci54OyBwLnYgPSByLnkgKyByLmg7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcbiAgICAgICAgICAgICAgICBwLnIyID0gY29sb3JCb3JkZXIucjsgcC5nMiA9IGNvbG9yQm9yZGVyLmc7IHAuYjIgPSBjb2xvckJvcmRlci5iOyBwLmEyID0gY29sb3JCb3JkZXIuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlsxXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueCArIHJlY3QudzsgcC55ID0gcmVjdC55ICsgcmVjdC5oOyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gci54ICsgci53OyBwLnYgPSByLnkgKyByLmg7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcbiAgICAgICAgICAgICAgICBwLnIyID0gY29sb3JCb3JkZXIucjsgcC5nMiA9IGNvbG9yQm9yZGVyLmc7IHAuYjIgPSBjb2xvckJvcmRlci5iOyBwLmEyID0gY29sb3JCb3JkZXIuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlsyXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueDsgcC55ID0gcmVjdC55OyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gci54OyBwLnYgPSByLnk7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcbiAgICAgICAgICAgICAgICBwLnIyID0gY29sb3JCb3JkZXIucjsgcC5nMiA9IGNvbG9yQm9yZGVyLmc7IHAuYjIgPSBjb2xvckJvcmRlci5iOyBwLmEyID0gY29sb3JCb3JkZXIuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlszXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueCArIHJlY3QudzsgcC55ID0gcmVjdC55OyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gci54ICsgci53OyBwLnYgPSByLnk7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcbiAgICAgICAgICAgICAgICBwLnIyID0gY29sb3JCb3JkZXIucjsgcC5nMiA9IGNvbG9yQm9yZGVyLmc7IHAuYjIgPSBjb2xvckJvcmRlci5iOyBwLmEyID0gY29sb3JCb3JkZXIuYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzYi5zZXRNYXQodGhpcy5tYXQpO1xyXG4gICAgICAgICAgICBzYi5hZGRSZWN0KHRoaXMucG9pbnRidWYpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgZHJhd0NoYXIoc3ByaXRlQmF0Y2hlciBzYiwgc3RyaW5nIGNuYW1lLCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUNvbG9yIGMgPSBudWxsLCBzcHJpdGVDb2xvciBjb2xvckJvcmRlciA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgciA9IHRoaXMuY21hcFtjbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChyID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGMgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yQm9yZGVyID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb2xvckJvcmRlciA9IG5ldyBzcHJpdGVDb2xvcigwZiwgMGYsIDBmLCAwLjVmKTtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBvaW50YnVmWzBdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLng7IHAudiA9IHIueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzFdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLnggKyByLnc7IHAudiA9IHIueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzJdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLng7IHAudiA9IHIueSArIHIuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzNdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLnggKyByLnc7IHAudiA9IHIueSArIHIuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzYi5zZXRNYXQodGhpcy5tYXQpO1xyXG4gICAgICAgICAgICBzYi5hZGRSZWN0KHRoaXMucG9pbnRidWYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZS5XZWJHTDtcclxuXHJcbm5hbWVzcGFjZSBsaWdodHRvb2wuTmF0aXZlXHJcbntcclxuICAgIHB1YmxpYyBjbGFzcyBjYW52YXNBZGFwdGVyXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzcHJpdGVDYW52YXMgQ3JlYXRlU2NyZWVuQ2FudmFzKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgY2FudmFzQWN0aW9uIHVzZXJhY3Rpb24pXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgZWwgPSB3ZWJnbC5DYW52YXM7XHJcbiAgICAgICAgICAgIGVsLldpZHRoID0gZWwuQ2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgIGVsLkhlaWdodCA9IGVsLkNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHZhciBjID0gbmV3IHNwcml0ZUNhbnZhcyh3ZWJnbCwgd2ViZ2wuRHJhd2luZ0J1ZmZlcldpZHRoLCB3ZWJnbC5EcmF3aW5nQnVmZmVySGVpZ2h0KTtcclxuICAgICAgICAgICAgLy92YXIgYXNwID0gcmFuZ2Uud2lkdGggLyByYW5nZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGMuc3ByaXRlQmF0Y2hlci5tYXRyaXggPSBuZXcgRmxvYXQzMkFycmF5KG5ldyBmbG9hdFtdIHtcclxuICAgICAgICAgICAgICAgICAgICAxLjBmICogMiAvIGMud2lkdGgsIDAsIDAsIDAsLy/ljrvmjolhc3DnmoTlvbHlk41cclxuICAgICAgICAgICAgICAgICAgICAwLCAxICogLTEgKiAyIC8gYy5oZWlnaHQsIDAsIDAsXHJcbiAgICAgICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgICAgICAtMSwgMSwgMCwgMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYy5zcHJpdGVCYXRjaGVyLnp0ZXN0ID0gZmFsc2U7Ly/mnIDliY3kuI3pnIDopoF6dGVzdFxyXG5cclxuICAgICAgICAgICAgdmFyIHVhID0gdXNlcmFjdGlvbjtcclxuICAgICAgICAgICAgQnJpZGdlLkh0bWw1LldpbmRvdy5TZXRJbnRlcnZhbCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICB3ZWJnbC5WaWV3cG9ydCgwLCAwLCB3ZWJnbC5EcmF3aW5nQnVmZmVyV2lkdGgsIHdlYmdsLkRyYXdpbmdCdWZmZXJIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgd2ViZ2wuQ2xlYXIod2ViZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHdlYmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xyXG4gICAgICAgICAgICAgICAgICAgd2ViZ2wuQ2xlYXJDb2xvcigxLjAsIDAuMCwgMS4wLCAxLjApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIGMuc3ByaXRlQmF0Y2hlci5iZWdpbmRyYXcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICB1YS5vbmRyYXcoYyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgYy5zcHJpdGVCYXRjaGVyLmVuZGRyYXcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICBkeW5hbWljIF93ZWJnbCA9IHdlYmdsO1xyXG4gICAgICAgICAgICAgICAgICAgX3dlYmdsLmZsdXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAvL3dlYmdsLkZsdXNoKCk7XHJcblxyXG4gICAgICAgICAgICAgICB9KSwgMjApO1xyXG4gICAgICAgICAgICBXaW5kb3cuQWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uKSgoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsID0gd2ViZ2wuQ2FudmFzO1xyXG4gICAgICAgICAgICAgICAgc2VsLldpZHRoID0gc2VsLkNsaWVudFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgc2VsLkhlaWdodCA9IHNlbC5DbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBzZWwuV2lkdGggPSBzZWwuQ2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgICAgICBzZWwuSGVpZ2h0ID0gc2VsLkNsaWVudEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBjLndpZHRoID0gc2VsLldpZHRoO1xyXG4gICAgICAgICAgICAgICAgYy5oZWlnaHQgPSBzZWwuSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgYy5zcHJpdGVCYXRjaGVyLm1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkobmV3IGZsb2F0W117XHJcbiAgICAgICAgICAgICAgICAxLjBmICogMiAvIGMud2lkdGgsIDAsIDAsIDAsLy/ljrvmjolhc3DnmoTlvbHlk41cclxuICAgICAgICAgICAgICAgIDAsIDEuMGYgKiAtMSAqIDIgLyBjLmhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAtMSwgMSwgMCwgMVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vLy9kbyByZXNpemUgZnVuY1xyXG4gICAgICAgICAgICAgICAgdWEub25yZXNpemUoYyk7XHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcblxyXG4gICAgICAgICAgICBlbC5Pbk1vdXNlTW92ZSA9IChldikgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdWEub25wb2ludGV2ZW50KGMsIGNhbnZhc3BvaW50ZXZlbnQuUE9JTlRfTU9WRSwoZmxvYXQpIGV2W1wib2Zmc2V0WFwiXSwgKGZsb2F0KWV2W1wib2Zmc2V0WVwiXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGVsLk9uTW91c2VVcCA9ICggTW91c2VFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4gZXYpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHVhLm9ucG9pbnRldmVudChjLCBjYW52YXNwb2ludGV2ZW50LlBPSU5UX1VQLCAoZmxvYXQpZXZbXCJvZmZzZXRYXCJdLCAoZmxvYXQpZXZbXCJvZmZzZXRZXCJdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWwuT25Nb3VzZURvd24gPSAoTW91c2VFdmVudDxIVE1MQ2FudmFzRWxlbWVudD4gZXYpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHVhLm9ucG9pbnRldmVudChjLCBjYW52YXNwb2ludGV2ZW50LlBPSU5UX0RPV04sIChmbG9hdClldltcIm9mZnNldFhcIl0sIChmbG9hdClldltcIm9mZnNldFlcIl0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvL3NjZW5lLm9uUG9pbnRlck9ic2VydmFibGUuYWRkKChwaW5mbzogQkFCWUxPTi5Qb2ludGVySW5mbywgc3RhdGU6IEJBQllMT04uRXZlbnRTdGF0ZSkgPT5cclxuICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgIC8vICAgIHZhciByYW5nZSA9IHNjZW5lLmdldEVuZ2luZSgpLmdldFJlbmRlcmluZ0NhbnZhc0NsaWVudFJlY3QoKTtcclxuICAgICAgICAgICAgLy8gICAgLy/ovpPlhaVcclxuICAgICAgICAgICAgLy8gICAgdmFyIGU6IGxpZ2h0dG9vbC5jYW52YXNwb2ludGV2ZW50ID0gbGlnaHR0b29sLmNhbnZhc3BvaW50ZXZlbnQuTk9ORTtcclxuICAgICAgICAgICAgLy8gICAgaWYgKHBpbmZvLnR5cGUgPT0gQkFCWUxPTi5Qb2ludGVyRXZlbnRUeXBlcy5QT0lOVEVSRE9XTilcclxuICAgICAgICAgICAgLy8gICAgICAgIGUgPSBsaWdodHRvb2wuY2FudmFzcG9pbnRldmVudC5QT0lOVF9ET1dOO1xyXG4gICAgICAgICAgICAvLyAgICBpZiAocGluZm8udHlwZSA9PSBCQUJZTE9OLlBvaW50ZXJFdmVudFR5cGVzLlBPSU5URVJNT1ZFKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgZSA9IGxpZ2h0dG9vbC5jYW52YXNwb2ludGV2ZW50LlBPSU5UX01PVkU7XHJcbiAgICAgICAgICAgIC8vICAgIGlmIChwaW5mby50eXBlID09IEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUlVQKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgZSA9IGxpZ2h0dG9vbC5jYW52YXNwb2ludGV2ZW50LlBPSU5UX1VQO1xyXG5cclxuICAgICAgICAgICAgLy8gICAgLy/nvKnmlL7liLBjYW52YXMgc2l6ZVxyXG4gICAgICAgICAgICAvLyAgICB2YXIgeCA9IHBpbmZvLmV2ZW50Lm9mZnNldFggLyByYW5nZS53aWR0aCAqIGMud2lkdGg7XHJcbiAgICAgICAgICAgIC8vICAgIHZhciB5ID0gcGluZm8uZXZlbnQub2Zmc2V0WSAvIHJhbmdlLmhlaWdodCAqIGMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgLy8gICAgdmFyIHNraXA6IGJvb2xlYW4gPSB1YS5vbnBvaW50ZXZlbnQoYywgZSwgeCwgeSk7XHJcbiAgICAgICAgICAgIC8vICAgIC8v5a+5IGJhYnlsb27vvIzmnaXor7QgMmTlnKjov5nph4zovpPlhaXvvIwzZCDopoEgcGljayDku6XlkI7lkq9cclxuXHJcbiAgICAgICAgICAgIC8vICAgIHN0YXRlLnNraXBOZXh0T2JzZXJ2ZXJzID0gc2tpcDsvL+aYr+WQpuS4reaWreS6i+S7tlxyXG4gICAgICAgICAgICAvL31cclxuICAgICAgICAgICAgLy8pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGM7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICB9XHJcblxyXG59IiwidXNpbmcgQnJpZGdlO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIEJyaWRnZS5XZWJHTDtcclxuLy92MC42XHJcbm5hbWVzcGFjZSBsaWdodHRvb2xcclxue1xyXG4gICAgcHVibGljIGVudW0gY2FudmFzcG9pbnRldmVudFxyXG4gICAge1xyXG4gICAgICAgIE5PTkUsXHJcbiAgICAgICAgUE9JTlRfRE9XTixcclxuICAgICAgICBQT0lOVF9VUCxcclxuICAgICAgICBQT0lOVF9NT1ZFLFxyXG4gICAgfVxyXG4gICAgcHVibGljIGludGVyZmFjZSBjYW52YXNBY3Rpb25cclxuICAgIHtcclxuICAgICAgICAvL3Jlc2l6ZSDkuovku7ZcclxuICAgICAgICB2b2lkIG9ucmVzaXplKHNwcml0ZUNhbnZhcyBjKTtcclxuICAgICAgICB2b2lkIG9uZHJhdyhzcHJpdGVDYW52YXMgYyk7XHJcbiAgICAgICAgYm9vbCBvbnBvaW50ZXZlbnQoc3ByaXRlQ2FudmFzIGMsIGNhbnZhc3BvaW50ZXZlbnQgZSwgZmxvYXQgeCwgZmxvYXQgeWspO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZUNhbnZhc1xyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgLy9wYW5lbCBzaXplXHJcbiAgICAgICAgcHVibGljIGZsb2F0IHdpZHRoO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoZWlnaHQ7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUNhbnZhcyhXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIGZsb2F0IHdpZHRoLCBmbG9hdCBoZWlnaHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlQmF0Y2hlciA9IG5ldyBzcHJpdGVCYXRjaGVyKHdlYmdsLCBsaWdodHRvb2wuc2hhZGVyTWdyLnBhcnNlckluc3RhbmNlKCkpOy8vbmVzc1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3ByaXRlQmF0Y2hlciBzcHJpdGVCYXRjaGVyO1xyXG5cclxuICAgICAgICAvL2RyYXcgdG9vbHNcclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3VGV4dHVyZShzcHJpdGVUZXh0dXJlIHRleHR1cmUsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlUmVjdCB1dnJlY3QgLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2lmICh1dnJlY3QgPT0gbnVsbClcclxuICAgICAgICAgICAgLy8gICAgdXZyZWN0ID0gc3ByaXRlUmVjdC5vbmU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgdGV4dHVyZS5kcmF3KHRoaXMuc3ByaXRlQmF0Y2hlciwgdXZyZWN0LCByZWN0LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdUZXh0dXJlQ3VzdG9tKHNwcml0ZVRleHR1cmUgdGV4dHVyZSwgc3ByaXRlTWF0IF9tYXQsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlUmVjdCB1dnJlY3QgLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yMiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvL2lmICh1dnJlY3QgPT0gbnVsbClcclxuICAgICAgICAgICAgLy8gICAgdXZyZWN0ID0gc3ByaXRlUmVjdC5vbmU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yMiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IyID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHV2cmVjdCwgcmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGUoc3RyaW5nIGF0bGFzLCBzdHJpbmcgc3ByaXRlLCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUNvbG9yIGNvbG9yID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgciA9IGEuc3ByaXRlc1tzcHJpdGVdO1xyXG4gICAgICAgICAgICBpZiAociA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChhLnRleHR1cmUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCByLlRvUmVjdCgpLCByZWN0LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGVDdXN0b20oc3RyaW5nIGF0bGFzLCBzdHJpbmcgc3ByaXRlLCBzcHJpdGVNYXQgX21hdCwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yMiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvcjIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yMiA9IHNwcml0ZUNvbG9yLndoaXRlO1xyXG4gICAgICAgICAgICB2YXIgYSA9IGF0bGFzTWdyLkluc3RhbmNlKCkubG9hZCh0aGlzLndlYmdsLCBhdGxhcyk7XHJcbiAgICAgICAgICAgIGlmIChhID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHIgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKHIgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0dXJlID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3Q3VzdG9tKHRoaXMuc3ByaXRlQmF0Y2hlciwgX21hdCwgci5Ub1JlY3QoKSwgcmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGU5KHN0cmluZyBhdGxhcywgc3RyaW5nIHNwcml0ZSwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVCb3JkZXIgYm9yZGVyLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgX3IgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKF9yID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBsID0gKGJvcmRlci5sIC0gMSkgLyBhLnRleHR1cmV3aWR0aDtcclxuICAgICAgICAgICAgdmFyIHIgPSAoYm9yZGVyLnIgLSAxKSAvIGEudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdCA9IChib3JkZXIudCAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYiA9IChib3JkZXIuYiAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAvL2xlZnQgdG9wXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG5cclxuICAgICAgICAgICAgLy90b3BcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IF9yLncgLSByIC0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IHQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0IHRvcFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIF9yLncgLSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgcmVjdC53IC0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueTtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci50O1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vbGVmdFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vY2VudGVyXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gX3IudyAtIHIgLSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gX3IuaCAtIHQgLSBiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueSArIGJvcmRlci50O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vcmlnaHRcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgKyBib3JkZXIudDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IHJlY3QuaCAtIGJvcmRlci50IC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3KHRoaXMuc3ByaXRlQmF0Y2hlciwgdGhpcy51dnJlY3QsIHRoaXMudHJlY3QsIGNvbG9yKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGVmdCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLng7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL2JvdHRvbVxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBfci53IC0gciAtIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueSArIHJlY3QuaCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0IGJvdHRvbVxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIF9yLncgLSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IuaCArIF9yLnkgLSBiO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IGI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgKyByZWN0LmggLSBib3JkZXIuYjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3U3ByaXRlOUN1c3RvbShzdHJpbmcgYXRsYXMsIHN0cmluZyBzcHJpdGUsIHNwcml0ZU1hdCBfbWF0LCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUJvcmRlciBib3JkZXIsIHNwcml0ZUNvbG9yIGNvbG9yID0gbnVsbCwgc3ByaXRlQ29sb3IgY29sb3IyID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yMiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IyID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgX3IgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKF9yID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBsID0gKGJvcmRlci5sIC0gMSkgLyBhLnRleHR1cmV3aWR0aDtcclxuICAgICAgICAgICAgdmFyIHIgPSAoYm9yZGVyLnIgLSAxKSAvIGEudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdCA9IChib3JkZXIudCAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYiA9IChib3JkZXIuYiAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAvL2xlZnQgdG9wXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcblxyXG4gICAgICAgICAgICAvL3RvcFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci55O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gX3IudyAtIHIgLSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci50O1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9yaWdodCB0b3BcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnk7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgICAgIC8vbGVmdFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9jZW50ZXJcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueSArIHQ7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBfci53IC0gciAtIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBfci5oIC0gdCAtIGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IHJlY3QuaCAtIGJvcmRlci50IC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3Q3VzdG9tKHRoaXMuc3ByaXRlQmF0Y2hlciwgX21hdCwgdGhpcy51dnJlY3QsIHRoaXMudHJlY3QsIGNvbG9yLCBjb2xvcjIpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgX3IudyAtIHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci55ICsgdDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBfci5oIC0gdCAtIGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyByZWN0LncgLSBib3JkZXIucjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGVmdCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLng7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgICAgIC8vYm90dG9tXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLmggKyBfci55IC0gYjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IF9yLncgLSByIC0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9yaWdodCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLmggKyBfci55IC0gYjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBiO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyByZWN0LncgLSBib3JkZXIucjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzcHJpdGVSZWN0IHV2cmVjdCA9IG5ldyBzcHJpdGVSZWN0KCk7XHJcblxyXG4gICAgICAgIHNwcml0ZVJlY3QgdHJlY3QgPSBuZXcgc3ByaXRlUmVjdCgpOy8vbmVzc1xyXG5cclxuICAgICAgICAvL+e7mOWItuWtl+S9k++8jOWPqueUu+S4gOihjO+8jOWtl+S9k+ayv+edgOW3puS4iuinkuWvuem9kO+8jOWmgumcgOWFtuS7lu+8jOWPguiAg+a6kOeggeiHquWItlxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdUZXh0KHN0cmluZyBmb250ICwgc3RyaW5nIHRleHQgLCBzcHJpdGVSZWN0IHJlY3QgLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yMiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvcjIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yMiA9IHNwcml0ZUNvbG9yLmJsYWNrO1xyXG4gICAgICAgICAgICB2YXIgZiA9IGZvbnRNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGZvbnQpO1xyXG4gICAgICAgICAgICBpZiAoZiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChmLmNtYXAgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgeGFkZCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0ZXh0LkNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHZhciBjaW5mbyA9IGYuY21hcFtjXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaW5mbyA9PSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSByZWN0LmggLyBmLmxpbmVIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgeGFkZCArIGNpbmZvLnhPZmZzZXQgKiBzOy8veGFkZCDmqKrnp7vvvIxjaW5mby54T2Zmc2V0ICogcyDlgY/np7tcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgLSBjaW5mby55T2Zmc2V0ICogcyArIGYuYmFzZWxpbmUgKiBzO1xyXG4gICAgICAgICAgICAgICAgLy9jaW5mby55T2Zmc2V0ICogcyDlgY/np7tcclxuICAgICAgICAgICAgICAgIC8vZi5iYXNlbGluZSAqIHPlrZfkvZPln7rnur/vvIzkuI3nrqHlrZfkvZPln7rnur/lrZfkvZPnmoTpm7bpm7bngrnlnKjlrZfkvZPlt6bkuIvop5LvvIznjrDlnKjpnIDopoHlt6bkuIrohJrvvIzpnIDopoHlhbbku5blr7npvZDmlrnlvI/lj6bor7RcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gcyAqIGNpbmZvLnlTaXplO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gcyAqIGNpbmZvLnhTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIHhhZGQgKz0gY2luZm8ueEFkZHZhbmNlICogcztcclxuICAgICAgICAgICAgICAgIGlmICh4YWRkID49IHJlY3QudylcclxuICAgICAgICAgICAgICAgICAgICBicmVhazsvL+i2heWHuue7mOWItumZkOWumuahhu+8jOS4jeeUu+S6hlxyXG4gICAgICAgICAgICAgICAgZi5kcmF3KHRoaXMuc3ByaXRlQmF0Y2hlciwgY2luZm8sIHRoaXMudHJlY3QsIGNvbG9yLCBjb2xvcjIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdCn0K
