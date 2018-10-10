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

    Bridge.define("lighttool.spriteRect", {
        statics: {
            fields: {
                one: null,
                zero: null
            },
            ctors: {
                init: function () {
                    this.one = new lighttool.spriteRect(0, 0, 1, 1);
                    this.zero = new lighttool.spriteRect(0, 0, 0, 0);
                }
            }
        },
        fields: {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        },
        ctors: {
            ctor: function (x, y, w, h) {
                if (x === void 0) { x = 0.0; }
                if (y === void 0) { y = 0.0; }
                if (w === void 0) { w = 0.0; }
                if (h === void 0) { h = 0.0; }

                this.$initialize();
                this.x = x;
                this.y = y;
                this.w = w;
                this.h = h;
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

                this.texture.draw(sb, r, rect, c);
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
                    var xl = Math.max(xmin, this.rectClip.x);
                    var xr = Math.min(xmax, this.rectClip.x + this.rectClip.w);
                    var yt = Math.max(ymin, this.rectClip.y);
                    var yb = Math.min(ymax, this.rectClip.y + this.rectClip.h);
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
                this.rectClip = rect;
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
                if (uvrect === void 0) { uvrect = null; }
                if (color === void 0) { color = null; }
                if (uvrect == null) {
                    uvrect = lighttool.spriteRect.one;
                }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                texture.draw(this.spriteBatcher, uvrect, rect, color);
            },
            drawTextureCustom: function (texture, _mat, rect, uvrect, color, color2) {
                if (uvrect === void 0) { uvrect = null; }
                if (color === void 0) { color = null; }
                if (color2 === void 0) { color2 = null; }
                if (uvrect == null) {
                    uvrect = lighttool.spriteRect.one;
                }
                if (color == null) {
                    color = lighttool.spriteColor.white;
                }
                if (color2 == null) {
                    color2 = lighttool.spriteColor.white;
                }
                texture.drawCustom(this.spriteBatcher, _mat, uvrect, rect, color, color2);
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

                a.texture.draw(this.spriteBatcher, r, rect, color);
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

                a.texture.drawCustom(this.spriteBatcher, _mat, r, rect, color, color2);
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
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = t;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.t;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y;
                this.uvrect.w = r;
                this.uvrect.h = t;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y;
                this.trect.w = border.r;
                this.trect.h = border.t;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + border.t;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = r;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.r;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

                this.uvrect.x = _r.x;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = l;
                this.uvrect.h = b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.l;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = r;
                this.uvrect.h = b;
                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.r;
                this.trect.h = border.b;
                a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

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
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = t;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.t;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y;
                this.uvrect.w = r;
                this.uvrect.h = t;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y;
                this.trect.w = border.r;
                this.trect.h = border.t;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + border.t;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.y + t;
                this.uvrect.w = r;
                this.uvrect.h = _r.h - t - b;

                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + border.t;
                this.trect.w = border.r;
                this.trect.h = rect.h - border.t - border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

                this.uvrect.x = _r.x;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = l;
                this.uvrect.h = b;

                this.trect.x = rect.x;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.l;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x + l;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = _r.w - r - l;
                this.uvrect.h = b;

                this.trect.x = rect.x + border.l;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = rect.w - border.r - border.l;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
                this.uvrect.x = _r.x + _r.w - r;
                this.uvrect.y = _r.h + _r.y - b;
                this.uvrect.w = r;
                this.uvrect.h = b;
                this.trect.x = rect.x + rect.w - border.r;
                this.trect.y = rect.y + rect.h - border.b;
                this.trect.w = border.r;
                this.trect.h = border.b;
                a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

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
                    f.draw(this.spriteBatcher, cinfo, this.trect, color, color2);
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
                this.spritenames = new (System.Collections.Generic.List$1(System.String)).ctor();
                this.timer = 0;
                this.trectBtn = new lighttool.spriteRect(50, 150, 200, 50);
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
                    c.drawTexture(t, this.trect, lighttool.spriteRect.one, new lighttool.spriteColor(1, 1, 1, 1.0));
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
                        c.drawSprite("1", this.spritenames.getItem(si), this.trect);
                    }
                }

                var font = lighttool.fontMgr.Instance().load(c.webgl, "f1");
                if (font != null && font.cmap != null) {
                    this.trect.x = 50;
                    this.trect.y = 50;
                    this.trect.w = 50;
                    this.trect.h = 50;
                    font.drawChar(c.spriteBatcher, "古", this.trect, lighttool.spriteColor.white, lighttool.spriteColor.gray);
                    this.trect.x = 100;
                    this.trect.y = 50;
                    font.drawChar(c.spriteBatcher, "老", this.trect, new lighttool.spriteColor(0.1, 0.8, 0.2, 0.8), new lighttool.spriteColor(1, 1, 1, 0));
                }

                this.trect.x = 50;
                this.trect.y = 150;
                this.trect.w = 200;
                this.trect.h = 50;
                if (t != null) {
                    c.drawTexture(t, this.trectBtn, lighttool.spriteRect.one, this.btndown ? lighttool.spriteColor.white : new lighttool.spriteColor(1, 1, 1, 0.5));
                }
                c.drawText("f1", "this is Btn", this.trectBtn, this.btndown ? new lighttool.spriteColor(1, 0, 0, 1) : lighttool.spriteColor.white);

                this.trect.x = 0;
                this.trect.y = 0;
                this.trect.w = 500;
                this.trect.h = 25;
                c.drawText("f1", this.showtxt, this.trect);
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

    Bridge.define("lighttool.sprite", {
        inherits: [lighttool.spriteRect],
        fields: {
            xsize: 0,
            ysize: 0
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJ3ZWJhcHAuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIkFwcC5jcyIsImNhbnZhcy9yZXNtZ3IuY3MiLCJjYW52YXMvc3ByaXRlYmF0Y2hlci5jcyIsImNhbnZhcy9jYW52YXNBZGFwdGVyX05hdGl2ZS5jcyIsImNhbnZhcy9jYW52YXMuY3MiXSwKICAibmFtZXMiOiBbIiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7O1lBZ0JZQTs7WUFFQUEsYUFBYUE7WUFDYkEsZ0JBQVlBLEFBQXVCQTtZQUNuQ0EsSUFBSUEsaUJBQVNBO2dCQUNUQSxnQkFBUUEsQUFBdUJBOzs7WUFFbkNBLGdCQUFRQTs7WUFFUkEsa0RBQWtEQSxlQUFPQSxJQUFJQTs7Ozs7OzttQ0FJdENBO29CQU12QkEsNEJBQTRCQSxpREFBNEJBLGdCQUFlQSxBQUFzREEsVUFBQ0EsS0FBS0E7d0JBRS9IQSxpREFBaURBLE9BQU9BOzs7OztvQkFXNURBLFVBQVVBO29CQUNWQTtvQkFDQUEsYUFBYUEsVUFBQ0E7d0JBRVZBLGFBQWFBLGdDQUFnQ0EsT0FBT0EsS0FBS0E7d0JBQ3pEQSx1REFBdURBOzs7b0JBSTNEQSx1Q0FBdUNBLDJDQUFzQkEsNkJBQTRCQSwyQkFBTUE7OztvQkFHL0ZBLFdBQVdBO29CQUNYQSxXQUFXQSxvQ0FBZUE7b0JBQzFCQSxjQUFjQSxVQUFDQTt3QkFFWEEsY0FBY0EsZ0NBQWdDQSxPQUFPQSxNQUFNQTt3QkFDM0RBLHVEQUF1REE7O3dCQUV2REEsNEJBQTRCQSwyQ0FBc0JBLGdCQUFlQSxBQUFzREEsVUFBQ0EsS0FBS0E7NEJBRXpIQSxhQUFhQSw4QkFBOEJBLE9BQU9BLEtBQUtBOzRCQUN2REEsNkNBQTZDQTs7O29CQU1yREEsV0FBV0E7b0JBQ1hBLFdBQVdBLGdEQUEyQkE7b0JBQ3RDQSxjQUFjQSxVQUFDQTt3QkFFWEEsY0FBY0EsZ0NBQWdDQSxPQUFPQSxNQUFNQTt3QkFDM0RBLG1FQUFtRUE7d0JBQ25FQSwyREFBMkRBLEFB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QWVBO29CQUNmQSxjQUFjQSxHQUFHQSxZQUFZQSwwQkFBMEJBLElBQUlBOzs7Z0JBSS9EQSxJQUFJQTtvQkFHQUEsS0FBS0EsV0FBV0EsUUFBUUE7d0JBRXBCQSxRQUFRQSxBQUFPQTt3QkFDZkEsUUFBUUEsQUFBT0E7d0JBQ2ZBLFNBQVNBLGtCQUFLQSxBQUFDQSxnQkFBZ0JBO3dCQUMvQkEsZUFBZUE7d0JBQ2ZBLGVBQWVBO3dCQUNmQTt3QkFDQUE7d0JBRUFBLGtCQUFrQkEseUJBQWlCQSxLQUFLQTs7OztnQkFPaERBLFdBQVdBLGtDQUFrQ0E7Z0JBQzdDQSxJQUFJQSxRQUFRQSxRQUFRQSxhQUFhQTtvQkFFN0JBO29CQUNBQTtvQkFDQUE7b0JBQ0FBO29CQUNBQSxjQUFjQSxzQkFBc0JBLFlBQVlBLDZCQUE2QkE7b0JBQzdFQTtvQkFDQUE7b0JBQ0FBLGNBQWNBLHNCQUFzQkEsWUFBWUEsSUFBSUEsMkNBQStDQSxJQUFJQTs7O2dCQUkzR0E7Z0JBQ0FBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBLElBQUlBLEtBQUtBO29CQUNMQSxjQUFjQSxHQUFHQSxlQUFlQSwwQkFBMEJBLGVBQWVBLDhCQUE4QkEsSUFBSUE7O2dCQUMvR0EsZ0NBQWdDQSxlQUFlQSxlQUFlQSxJQUFJQSxvQ0FBb0NBOztnQkFFdEdBO2dCQUNBQTtnQkFDQUE7Z0JBQ0FBO2dCQUNBQSxpQkFBaUJBLGNBQWNBOztvQ0FHVkEsR0FBZ0JBLEdBQW9CQSxHQUFTQTtnQkFFbEVBOztnQkFFQUEsZUFBZUEsbUNBQWNBLG9DQUFjQTtnQkFDM0NBLElBQUlBLElBQUlBLG1CQUFtQkEsSUFBSUEsbUJBQW1CQSxJQUFJQSxDQUFDQSxrQkFBa0JBLG9CQUNsRUEsSUFBSUEsQ0FBQ0Esa0JBQWtCQTtvQkFFMUJBOztvQkFJQUE7O2dCQUVKQSxPQUFPQTs7Z0NBR1VBIiwKICAic291cmNlc0NvbnRlbnQiOiBbInVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLldlYkdMO1xyXG51c2luZyBCcmlkZ2UuSHRtbDU7XHJcbnVzaW5nIE5ld3RvbnNvZnQuSnNvbjtcclxudXNpbmcgU3lzdGVtO1xyXG51c2luZyBsaWdodHRvb2w7XHJcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xyXG5cclxubmFtZXNwYWNlIGFwcFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgQXBwXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1haW4oKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFdyaXRlIGEgbWVzc2FnZSB0byB0aGUgQ29uc29sZVxyXG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcIldlbGNvbWUgdG8gQnJpZGdlLk5FVCAyMDE4XCIpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNhbnZhcyA9IEJyaWRnZS5IdG1sNS5Eb2N1bWVudC5HZXRFbGVtZW50QnlJZChcInJlbmRlckNhbnZhc1wiKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgICAgICAgICAgQXBwLndlYmdsID0gKFdlYkdMUmVuZGVyaW5nQ29udGV4dCljYW52YXMuR2V0Q29udGV4dChcIndlYmdsXCIpO1xyXG4gICAgICAgICAgICBpZiAod2ViZ2wgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHdlYmdsID0gKFdlYkdMUmVuZGVyaW5nQ29udGV4dCljYW52YXMuR2V0Q29udGV4dChcImV4cGVyaW1lbnRhbC13ZWJnbFwiKTtcclxuXHJcbiAgICAgICAgICAgIExvYWRSZXMod2ViZ2wpO1xyXG5cclxuICAgICAgICAgICAgbGlnaHR0b29sLk5hdGl2ZS5jYW52YXNBZGFwdGVyLkNyZWF0ZVNjcmVlbkNhbnZhcyh3ZWJnbCwgbmV3IE15Q2FudmFzQWN0aW9uKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdGF0aWMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHZvaWQgTG9hZFJlcyhXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wpXHJcbiAgICAgICAgeyAgICAgICAgICAvL3dlYmdsQ2FudmFzIOS9v+eUqOa1geeoi1xyXG4gICAgICAgICAgICAvLzAxLuWIneWni+WMluadkOi0qO+8jOi/meS4quaWh+S7tumHjOmFjee9ruS6huaJgOacieeOsOmYtuauteS9v+eUqOeahHNoYWRlcu+8jOS5n+WPr+S7peaUvuWcqOS4jeWQjOeahOaWh+S7tuS4re+8jOWkmuaJp+ihjOWHoOasoXBhcnNlVXJs5bCx6KGM5LqGXHJcbiAgICAgICAgICAgIC8v5Yid5aeL5YyW5p2Q6LSoXHJcbiAgICAgICAgICAgIC8vbGlnaHR0b29sLnNoYWRlck1nci5wYXJzZXJJbnN0YW5jZSgpLnBhcnNlVXJsKHdlYmdsLCBcInNoYWRlci90ZXN0LnNoYWRlci50eHQ/XCIgKyBNYXRoLnJhbmRvbSgpKTtcclxuICAgICAgICAgICAgLy/miYvliqjliqDovb3mjqXlj6NcclxuICAgICAgICAgICAgbGlnaHR0b29sLmxvYWRUb29sLmxvYWRUZXh0KFwic2hhZGVyL3Rlc3Quc2hhZGVyLnR4dD9cIiArIE1hdGguUmFuZG9tKCksIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248c3RyaW5nLCBnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKCh0eHQsIGVycikgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGlnaHR0b29sLnNoYWRlck1nci5wYXJzZXJJbnN0YW5jZSgpLnBhcnNlRGlyZWN0KHdlYmdsLCB0eHQpO1xyXG4gICAgICAgICAgICB9XHJcbikgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8wMi7liJ3lp4vljJbotYTmupDvvIzov5nph4zlj6rms6jlhozkuIDkuKrlhbPns7vvvIzliLDnlKjliLDnmoTml7blgJnmiY3kvJrnnJ/nmoTljrvliqDovb1cclxuICAgICAgICAgICAgLy/ms6jlhozotLTlm75cclxuICAgICAgICAgICAgLy/otLTlm77nlKggdXJsIOS9nOS4uuWQjeWtl++8jOaPkOS+m+S4gOS4qiB1cmxhZGTvvIzlpoLmnpzkvaDmg7PopoHku7fmoLxyYW5kb20g5ZWl55qEXHJcbiAgICAgICAgICAgIC8vbGlnaHR0b29sLnRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWcoXCJ0ZXgvMS5qcGdcIiwgXCI/XCIgKyBNYXRoLnJhbmRvbSgpLCBsaWdodHRvb2wudGV4dHVyZWZvcm1hdC5SR0JBLCB0cnVlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGlnaHR0b29sLnRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWcoXCJ0ZXgvMS5qcGdcIiwgXCJcIiwgbGlnaHR0b29sLnRleHR1cmVmb3JtYXQuUkdCQSwgdHJ1ZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW1nID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTsvLyBJbWFnZSgpO1xyXG4gICAgICAgICAgICBpbWcuU3JjID0gXCJ0ZXgvMS5qcGdcIjtcclxuICAgICAgICAgICAgaW1nLk9uTG9hZCA9IChlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgX3NwaW1nID0gbGlnaHR0b29sLnNwcml0ZVRleHR1cmUuZnJvbVJhdyh3ZWJnbCwgaW1nLCBsaWdodHRvb2wudGV4dHVyZWZvcm1hdC5SR0JBLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC50ZXh0dXJlTWdyLkluc3RhbmNlKCkucmVnRGlyZWN0KFwidGV4LzEuanBnXCIsIF9zcGltZyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvL+azqOWGjOWbvumbhijlr7nlupTnmoTotLTlm77kvJroh6rliqjms6jlhozliLB0ZXh0dXJlTWdyKSzlm77pm4bkvb/nlKjkuIDkuKrmjIflrprnmoTlkI3lrZfvvIzkvaDms6jlhoznu5nku5bllaXlkI3lrZfvvIzlkI7pnaLlsLHnlKjov5nkuKrlkI3lrZfljrvkvb/nlKhcclxuICAgICAgICAgICAgbGlnaHR0b29sLmF0bGFzTWdyLkluc3RhbmNlKCkucmVnKFwiMlwiLCBcImF0bGFzLzIuanNvbi50eHQ/XCIgKyBNYXRoLlJhbmRvbSgpLCBcInRleC8yLnBuZ1wiLCBcIj9cIiArIE1hdGguUmFuZG9tKCkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBpbWcyID0gbmV3IEhUTUxJbWFnZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgaW1nMi5TcmMgPSBcInRleC8xLnBuZz9cIiArIE1hdGguUmFuZG9tKCk7XHJcbiAgICAgICAgICAgIGltZzIuT25Mb2FkID0gKGUpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBfc3BpbWcyID0gbGlnaHR0b29sLnNwcml0ZVRleHR1cmUuZnJvbVJhdyh3ZWJnbCwgaW1nMiwgbGlnaHR0b29sLnRleHR1cmVmb3JtYXQuUkdCQSwgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBsaWdodHRvb2wudGV4dHVyZU1nci5JbnN0YW5jZSgpLnJlZ0RpcmVjdChcInRleC8xLnBuZ1wiLCBfc3BpbWcyKTtcclxuXHJcbiAgICAgICAgICAgICAgICBsaWdodHRvb2wubG9hZFRvb2wubG9hZFRleHQoXCJhdGxhcy8xLmpzb24udHh0P1wiICsgTWF0aC5SYW5kb20oKSwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfYXRsYXMgPSBsaWdodHRvb2wuc3ByaXRlQXRsYXMuZnJvbVJhdyh3ZWJnbCwgdHh0LCBfc3BpbWcyKTtcclxuICAgICAgICAgICAgICAgICAgICBsaWdodHRvb2wuYXRsYXNNZ3IuSW5zdGFuY2UoKS5yZWdEaXJlY3QoXCIxXCIsIF9hdGxhcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbikgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy/ms6jlhozlrZfkvZMo5a+55bqU55qE6LS05Zu+5Lya6Ieq5Yqo5rOo5YaM5YiwdGV4dHVyZU1nciks5a2X5L2T5L2/55So5LiA5Liq5oyH5a6a55qE5ZCN5a2X77yM5L2g5rOo5YaM57uZ5LuW5ZWl5ZCN5a2X77yM5ZCO6Z2i5bCx55So6L+Z5Liq5ZCN5a2X5Y675L2/55SoXHJcbiAgICAgICAgICAgIC8vbGlnaHR0b29sLmZvbnRNZ3IuSW5zdGFuY2UoKS5yZWcoXCJmMVwiLCBcImZvbnQvU1RYSU5HS0EuZm9udC5qc29uLnR4dFwiLCBcInRleC9TVFhJTkdLQS5mb250LnBuZ1wiLCBcIlwiKTtcclxuICAgICAgICAgICAgdmFyIGltZzMgPSBuZXcgSFRNTEltYWdlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBpbWczLlNyYyA9IFwidGV4L1NUWElOR0tBLmZvbnQucG5nP1wiICsgTWF0aC5SYW5kb20oKTtcclxuICAgICAgICAgICAgaW1nMy5PbkxvYWQgPSAoZSkgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIF9zcGltZzMgPSBsaWdodHRvb2wuc3ByaXRlVGV4dHVyZS5mcm9tUmF3KHdlYmdsLCBpbWczLCBsaWdodHRvb2wudGV4dHVyZWZvcm1hdC5SR0JBLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC50ZXh0dXJlTWdyLkluc3RhbmNlKCkucmVnRGlyZWN0KFwidGV4L1NUWElOR0tBLmZvbnQucG5nXCIsIF9zcGltZzMpO1xyXG4gICAgICAgICAgICAgICAgbGlnaHR0b29sLmxvYWRUb29sLmxvYWRUZXh0KFwiZm9udC9TVFhJTkdLQS5mb250Lmpzb24udHh0XCIsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb248c3RyaW5nLCBnbG9iYWw6OkJyaWRnZS5FcnJvcj4pKCh0eHQsIGVycikgPT5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX2ZvbnQgPSBsaWdodHRvb2wuc3ByaXRlRm9udC5mcm9tUmF3KHdlYmdsLCB0eHQsIF9zcGltZzMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC5mb250TWdyLkluc3RhbmNlKCkucmVnRGlyZWN0KFwiZjFcIiwgX2ZvbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4pICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjbGFzcyBNeUNhbnZhc0FjdGlvbiA6IGxpZ2h0dG9vbC5jYW52YXNBY3Rpb25cclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGxpZ2h0dG9vbC5zcHJpdGVSZWN0IHRyZWN0ID0gbmV3IHNwcml0ZVJlY3QoKTtcclxuICAgICAgICAgICAgTGlzdDxzdHJpbmc+IHNwcml0ZW5hbWVzID0gbmV3IExpc3Q8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICBmbG9hdCB0aW1lciA9IDA7XHJcbiAgICAgICAgICAgIGxpZ2h0dG9vbC5zcHJpdGVSZWN0IHRyZWN0QnRuID0gbmV3IGxpZ2h0dG9vbC5zcHJpdGVSZWN0KDUwLCAxNTAsIDIwMCwgNTApO1xyXG4gICAgICAgICAgICBib29sIGJ0bmRvd24gPSBmYWxzZTtcclxuICAgICAgICAgICAgc3RyaW5nIHNob3d0eHQgPSBcIlwiO1xyXG4gICAgICAgICAgICBwdWJsaWMgdm9pZCBvbmRyYXcoc3ByaXRlQ2FudmFzIGMpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZXIgKz0gMC4wMTVmO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGltZXIgPiAyLjBmKVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXIgLT0gMi4wZjtcclxuICAgICAgICAgICAgICAgIC8vZ2V0IGFsbCBzcHJpdGUgaW4gYXRsYXMgd2hvIG5hbWVkIFwiMVwiXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zcHJpdGVuYW1lcy5Db3VudCA9PSAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhdGxhcyA9IGxpZ2h0dG9vbC5hdGxhc01nci5JbnN0YW5jZSgpLmxvYWQoYy53ZWJnbCwgXCIxXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdGxhcyAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIGluYW1lIGluIGF0bGFzLnNwcml0ZXMuS2V5cylcclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcHJpdGVuYW1lcy5BZGQoaW5hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2luaXQgZm9yIGRyYXdlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2ZvciAodmFyIGNjID0gMDsgY2MgPCAxMDsgY2MrKylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy97XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuY2REcmF3ZXIucHVzaChuZXcgY29vbERvd25EcmF3ZXIoYXRsYXMsIHRoaXMuc3ByaXRlbmFtZXNbY2NdKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuY2REcmF3ZXJbY2NdLnNldERlc3RSZWN0KG5ldyBsaWdodHRvb2wuc3ByaXRlUmVjdCg1MCAqIGNjLCA1MCwgNTAsIDUwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdCA9IGxpZ2h0dG9vbC50ZXh0dXJlTWdyLkluc3RhbmNlKCkubG9hZChjLndlYmdsLCBcInRleC8xLmpwZ1wiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGMud2lkdGg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gYy5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgYy5kcmF3VGV4dHVyZSh0LCB0aGlzLnRyZWN0LCBsaWdodHRvb2wuc3ByaXRlUmVjdC5vbmUsIG5ldyBsaWdodHRvb2wuc3ByaXRlQ29sb3IoMSwgMSwgMSwgMS4wZikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vZHJhdyBhdGxhc1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3ByaXRlbmFtZXMuQ291bnQgPiAwKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5zcHJpdGVCYXRjaGVyLmJlZ2luZHJhdyh0aGlzLmF0bGFzLm1hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzMDsgaSsrKVxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHggPSAoZmxvYXQpTWF0aC5SYW5kb20oKSAqIDUwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHkgPSAoZmxvYXQpTWF0aC5SYW5kb20oKSAqIDUwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNpID0gKGludCkoTWF0aC5SYW5kb20oKSAqIHRoaXMuc3ByaXRlbmFtZXMuQ291bnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnggPSB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LncgPSAxMDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9jYW52YXMg5YGa5rOVXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGMuZHJhd1Nwcml0ZShcIjFcIiwgdGhpcy5zcHJpdGVuYW1lc1tzaV0sIHRoaXMudHJlY3QpOyAvL+etieWQjOS6juS4i+mdoueahOS4pOihjFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdmFyIGF0bGFzID0gbGlnaHR0b29sLmF0bGFzTWdyLkluc3RhbmNlKCkubG9hZChjLndlYmdsLCBcIjFcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9hdGxhcy5kcmF3KGMuc3ByaXRlQmF0Y2hlciwgdGhpcy5zcHJpdGVuYW1lc1tzaV0sIHRoaXMudHJlY3QsIHRoaXMud2hpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvL2RyYXcgZm9udO+8iOW6leWxguaWueazle+8iVxyXG4gICAgICAgICAgICAgICAgdmFyIGZvbnQgPSBsaWdodHRvb2wuZm9udE1nci5JbnN0YW5jZSgpLmxvYWQoYy53ZWJnbCwgXCJmMVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChmb250ICE9IG51bGwgJiYgZm9udC5jbWFwICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gNTA7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC5kcmF3Q2hhcihjLnNwcml0ZUJhdGNoZXIsIFwi5Y+kXCIsIHRoaXMudHJlY3QsIGxpZ2h0dG9vbC5zcHJpdGVDb2xvci53aGl0ZSwgbGlnaHR0b29sLnNwcml0ZUNvbG9yLmdyYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IDEwMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSA1MDtcclxuICAgICAgICAgICAgICAgICAgICBmb250LmRyYXdDaGFyKGMuc3ByaXRlQmF0Y2hlciwgXCLogIFcIiwgdGhpcy50cmVjdCwgbmV3IGxpZ2h0dG9vbC5zcHJpdGVDb2xvcigwLjFmLCAwLjhmLCAwLjJmLCAwLjhmKSwgbmV3IGxpZ2h0dG9vbC5zcHJpdGVDb2xvcigxLCAxLCAxLCAwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy9kcmF3Zm9udCBjYW52YXMg5pa55rOVXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnggPSA1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IDE1MDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IDIwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IDUwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHQgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgICAgICBjLmRyYXdUZXh0dXJlKHQsIHRoaXMudHJlY3RCdG4sIGxpZ2h0dG9vbC5zcHJpdGVSZWN0Lm9uZSwgdGhpcy5idG5kb3duID8gbGlnaHR0b29sLnNwcml0ZUNvbG9yLndoaXRlIDogbmV3IGxpZ2h0dG9vbC5zcHJpdGVDb2xvcigxLCAxLCAxLCAwLjVmKSk7XHJcbiAgICAgICAgICAgICAgICBjLmRyYXdUZXh0KFwiZjFcIiwgXCJ0aGlzIGlzIEJ0blwiLCB0aGlzLnRyZWN0QnRuLCB0aGlzLmJ0bmRvd24gPyBuZXcgbGlnaHR0b29sLnNwcml0ZUNvbG9yKDEsIDAsIDAsIDEpIDogbGlnaHR0b29sLnNwcml0ZUNvbG9yLndoaXRlKTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IDUwMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IDI1O1xyXG4gICAgICAgICAgICAgICAgYy5kcmF3VGV4dChcImYxXCIsIHRoaXMuc2hvd3R4dCwgdGhpcy50cmVjdCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHB1YmxpYyBib29sIG9ucG9pbnRldmVudChzcHJpdGVDYW52YXMgYywgY2FudmFzcG9pbnRldmVudCBlLCBmbG9hdCB4LCBmbG9hdCB5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBib29sIHNraXBldmVudCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd3R4dCA9IFwicG9pbnQ9ICAgXCIgKyB4ICsgXCIgfCx8IFwiICsgeTtcclxuICAgICAgICAgICAgICAgIGlmICh4ID4gdGhpcy50cmVjdEJ0bi54ICYmIHkgPiB0aGlzLnRyZWN0QnRuLnkgJiYgeCA8ICh0aGlzLnRyZWN0QnRuLnggKyB0aGlzLnRyZWN0QnRuLncpXHJcbiAgICAgICAgICAgICAgICAgICAgJiYgeSA8ICh0aGlzLnRyZWN0QnRuLnkgKyB0aGlzLnRyZWN0QnRuLmgpKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnRuZG93biA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idG5kb3duID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2tpcGV2ZW50O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwdWJsaWMgdm9pZCBvbnJlc2l6ZShzcHJpdGVDYW52YXMgYylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy90aHJvdyBuZXcgTm90SW1wbGVtZW50ZWRFeGNlcHRpb24oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XHJcbnVzaW5nIEJyaWRnZTtcclxudXNpbmcgQnJpZGdlLkh0bWw1O1xyXG51c2luZyBCcmlkZ2UuV2ViR0w7XHJcblxyXG4vL3YwLjRcclxubmFtZXNwYWNlIGxpZ2h0dG9vbFxyXG57XHJcbiAgICBwdWJsaWMgY2xhc3MgdGV4dXRyZU1nckl0ZW1cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlVGV4dHVyZSB0ZXg7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmw7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmxhZGQ7XHJcbiAgICAgICAgcHVibGljIHRleHR1cmVmb3JtYXQgZm9ybWF0O1xyXG4gICAgICAgIHB1YmxpYyBib29sIG1pcG1hcDtcclxuICAgICAgICBwdWJsaWMgYm9vbCBsaW5lYXI7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3MgdGV4dHVyZU1nclxyXG4gICAge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB0ZXh0dXJlTWdyIGdfdGhpcztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRleHR1cmVNZ3IgSW5zdGFuY2UoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRleHR1cmVNZ3IuZ190aGlzID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlTWdyLmdfdGhpcyA9IG5ldyB0ZXh0dXJlTWdyKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dHVyZU1nci5nX3RoaXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkRpY3Rpb25hcnk8c3RyaW5nLCB0ZXh1dHJlTWdySXRlbT4gbWFwSW5mbyA9IG5ldyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYy5EaWN0aW9uYXJ5PHN0cmluZywgdGV4dXRyZU1nckl0ZW0+KCk7XHJcblxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlZyhzdHJpbmcgdXJsLCBzdHJpbmcgdXJsYWRkLCB0ZXh0dXJlZm9ybWF0IGZvcm1hdCwgYm9vbCBtaXBtYXAsIGJvb2wgbGluZWFyKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/ph43lpI3ms6jlhozlpITnkIZcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleSh1cmwpKVxyXG4gICAgICAgICAgICAvL3ZhciBpdGVtID0gdGhpcy5tYXBJbmZvW3VybF07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gIT0gU2NyaXB0LlVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcInlvdSBjYW4ndCByZWcgdGhlIHNhbWUgbmFtZVwiKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyB0ZXh1dHJlTWdySXRlbSgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW3VybF0gPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLnVybCA9IHVybDtcclxuICAgICAgICAgICAgaXRlbS51cmxhZGQgPSB1cmxhZGQ7XHJcbiAgICAgICAgICAgIGl0ZW0uZm9ybWF0ID0gZm9ybWF0O1xyXG4gICAgICAgICAgICBpdGVtLm1pcG1hcCA9IG1pcG1hcDtcclxuICAgICAgICAgICAgaXRlbS5saW5lYXIgPSBsaW5lYXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlZ0RpcmVjdChzdHJpbmcgdXJsLCBzcHJpdGVUZXh0dXJlIHRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkodXJsKSlcclxuICAgICAgICAgICAgLy92YXIgaXRlbSA9IHRoaXMubWFwSW5mb1t1cmxdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtICE9IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJ5b3UgY2FuJ3QgcmVnIHRoZSBzYW1lIG5hbWVcIik7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSBuZXcgdGV4dXRyZU1nckl0ZW0oKTsvL25lc3NcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mb1t1cmxdID0gaXRlbTtcclxuICAgICAgICAgICAgaXRlbS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgIGl0ZW0udGV4ID0gdGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCB1bnJlZyhzdHJpbmcgdXJsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleSh1cmwpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAvL3ZhciBpdGVtID0gdGhpcy5tYXBJbmZvW3VybF07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVubG9hZCh1cmwpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW3VybF0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCB1bmxvYWQoc3RyaW5nIHVybClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkodXJsKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW3VybF07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgaXRlbS50ZXguZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICBpdGVtLnRleCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlIGxvYWQoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdXJsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleSh1cmwpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1t1cmxdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS50ZXggPT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXRlbS50ZXggPSBuZXcgc3ByaXRlVGV4dHVyZSh3ZWJnbCwgaXRlbS51cmwgKyBpdGVtLnVybGFkZCwgaXRlbS5mb3JtYXQsIGl0ZW0ubWlwbWFwLCBpdGVtLmxpbmVhcik7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0udGV4O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBhdGxhc01nckl0ZW1cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQXRsYXMgYXRhbHM7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmw7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmxhdGFsc3RleDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybGF0YWxzdGV4X2FkZDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBhdGxhc01nclxyXG4gICAge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGF0bGFzTWdyIGdfdGhpcztcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGF0bGFzTWdyIEluc3RhbmNlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChhdGxhc01nci5nX3RoaXMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGF0bGFzTWdyLmdfdGhpcyA9IG5ldyBhdGxhc01ncigpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGF0bGFzTWdyLmdfdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkRpY3Rpb25hcnk8c3RyaW5nLCBhdGxhc01nckl0ZW0+IG1hcEluZm8gPSBuZXcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIGF0bGFzTWdySXRlbT4oKTtcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgcmVnKHN0cmluZyBuYW1lLCBzdHJpbmcgdXJsYXRsYXMsIHN0cmluZyB1cmxhdGFsc3RleCwgc3RyaW5nIHVybGF0YWxzdGV4X2FkZClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIC8v6YeN5aSN5rOo5YaM5aSE55CGXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkpXHJcbiAgICAgICAgICAgIC8vdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bbmFtZV07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gIT0gU2NyaXB0LlVuZGVmaW5lZClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbihcInlvdSBjYW4ndCByZWcgdGhlIHNhbWUgbmFtZVwiKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBhdGxhc01nckl0ZW0oKTsvL25lc3NcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mb1tuYW1lXSA9IGl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0udXJsID0gdXJsYXRsYXM7XHJcbiAgICAgICAgICAgIGl0ZW0udXJsYXRhbHN0ZXggPSB1cmxhdGFsc3RleDtcclxuICAgICAgICAgICAgaXRlbS51cmxhdGFsc3RleF9hZGQgPSB1cmxhdGFsc3RleF9hZGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHVucmVnKHN0cmluZyBuYW1lLCBib29sIGRpc3Bvc2V0ZXgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVubG9hZChuYW1lLCBkaXNwb3NldGV4KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mby5SZW1vdmUobmFtZSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5tYXBJbmZvW25hbWVdID0gU2NyaXB0LlVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlZ0RpcmVjdChzdHJpbmcgbmFtZSwgc3ByaXRlQXRsYXMgYXRsYXMpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KG5hbWUpKVxyXG4gICAgICAgICAgICAvLyAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSAhPSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwieW91IGNhbid0IHJlZyB0aGUgc2FtZSBuYW1lXCIpOy8vbmVzc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IGF0bGFzTWdySXRlbSgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW25hbWVdID0gaXRlbTtcclxuICAgICAgICAgICAgaXRlbS5hdGFscyA9IGF0bGFzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCB1bmxvYWQoc3RyaW5nIG5hbWUsIGJvb2wgZGlzcG9zZXRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmIChkaXNwb3NldGV4KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmF0YWxzLnRleHR1cmUuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5hdGFscy50ZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpdGVtLmF0YWxzID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVBdGxhcyBsb2FkKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KG5hbWUpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5tYXBJbmZvW25hbWVdO1xyXG4gICAgICAgICAgICAvL2lmIChpdGVtID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAoaXRlbS5hdGFscyA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4ID0gdGV4dHVyZU1nci5JbnN0YW5jZSgpLmxvYWQod2ViZ2wsIGl0ZW0udXJsYXRhbHN0ZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleCA9PSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWcoaXRlbS51cmxhdGFsc3RleCwgaXRlbS51cmxhdGFsc3RleF9hZGQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC50ZXh0dXJlZm9ybWF0LlJHQkEsIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4ID0gdGV4dHVyZU1nci5JbnN0YW5jZSgpLmxvYWQod2ViZ2wsIGl0ZW0udXJsYXRhbHN0ZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbS5hdGFscyA9IG5ldyBzcHJpdGVBdGxhcyh3ZWJnbCwgaXRlbS51cmwsIHRleCk7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uYXRhbHM7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBmb250TWdySXRlbVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVGb250IGZvbnQ7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmw7XHJcbiAgICAgICAgcHVibGljIHN0cmluZyB1cmxhdGFsc3RleDtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHVybGF0YWxzdGV4X2FkZDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBmb250TWdyXHJcbiAgICB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZm9udE1nciBnX3RoaXM7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBmb250TWdyIEluc3RhbmNlKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChmb250TWdyLmdfdGhpcyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgZm9udE1nci5nX3RoaXMgPSBuZXcgZm9udE1ncigpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZvbnRNZ3IuZ190aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIGZvbnRNZ3JJdGVtPiBtYXBJbmZvID0gbmV3IFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljLkRpY3Rpb25hcnk8c3RyaW5nLCBmb250TWdySXRlbT4oKTtcclxuXHJcbiAgICAgICAgcHVibGljIHZvaWQgcmVnKHN0cmluZyBuYW1lLCBzdHJpbmcgdXJsZm9udCwgc3RyaW5nIHVybGF0YWxzdGV4LCBzdHJpbmcgdXJsYXRhbHN0ZXhfYWRkKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/ph43lpI3ms6jlhozlpITnkIZcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChpdGVtICE9IFNjcmlwdC5VbmRlZmluZWQpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oXCJ5b3UgY2FuJ3QgcmVnIHRoZSBzYW1lIG5hbWVcIik7Ly9uZXNzXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaXRlbSA9IG5ldyBmb250TWdySXRlbSgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgdGhpcy5tYXBJbmZvW25hbWVdID0gaXRlbTtcclxuICAgICAgICAgICAgaXRlbS51cmwgPSB1cmxmb250O1xyXG4gICAgICAgICAgICBpdGVtLnVybGF0YWxzdGV4ID0gdXJsYXRhbHN0ZXg7XHJcbiAgICAgICAgICAgIGl0ZW0udXJsYXRhbHN0ZXhfYWRkID0gdXJsYXRhbHN0ZXhfYWRkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCByZWdEaXJlY3Qoc3RyaW5nIG5hbWUsIHNwcml0ZUZvbnQgZm9udClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMubWFwSW5mby5Db250YWluc0tleShuYW1lKSlcclxuICAgICAgICAgICAgLy92YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSAhPSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKFwieW91IGNhbid0IHJlZyB0aGUgc2FtZSBuYW1lXCIpOy8vbmVzc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IGZvbnRNZ3JJdGVtKCk7Ly9uZXNzXHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hcEluZm9bbmFtZV0gPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLmZvbnQgPSBmb250O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCB1bnJlZyhzdHJpbmcgbmFtZSwgYm9vbCBkaXNwb3NldGV4KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWFwSW5mby5Db250YWluc0tleShuYW1lKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLm1hcEluZm9bbmFtZV07XHJcbiAgICAgICAgICAgIC8vaWYgKGl0ZW0gPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVubG9hZChuYW1lLCBkaXNwb3NldGV4KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWFwSW5mby5SZW1vdmUobmFtZSk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5tYXBJbmZvW25hbWVdID0gU2NyaXB0LlVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCB1bmxvYWQoc3RyaW5nIG5hbWUsIGJvb2wgZGlzcG9zZXRleClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcEluZm8uQ29udGFpbnNLZXkobmFtZSkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzcG9zZXRleClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5mb250LnRleHR1cmUuZGlzcG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgaXRlbS5mb250LnRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGl0ZW0uZm9udCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3ByaXRlRm9udCBsb2FkKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIG5hbWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXBJbmZvLkNvbnRhaW5zS2V5KG5hbWUpID09IGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMubWFwSW5mb1tuYW1lXTtcclxuICAgICAgICAgICAgLy9pZiAoaXRlbSA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGl0ZW0uZm9udCA9PSBudWxsKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4ID0gdGV4dHVyZU1nci5JbnN0YW5jZSgpLmxvYWQod2ViZ2wsIGl0ZW0udXJsYXRhbHN0ZXgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRleCA9PSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHR1cmVNZ3IuSW5zdGFuY2UoKS5yZWcoaXRlbS51cmxhdGFsc3RleCwgaXRlbS51cmxhdGFsc3RleF9hZGQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC50ZXh0dXJlZm9ybWF0LkdSQVksIGZhbHNlLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4ID0gdGV4dHVyZU1nci5JbnN0YW5jZSgpLmxvYWQod2ViZ2wsIGl0ZW0udXJsYXRhbHN0ZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaXRlbS5mb250ID0gbmV3IHNwcml0ZUZvbnQod2ViZ2wsIGl0ZW0udXJsLCB0ZXgpOy8vbmVzc1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtLmZvbnQ7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzaGFkZXJNZ3JcclxuICAgIHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBsaWdodHRvb2wuc2hhZGVyUGFyc2VyIGdfc2hhZGVyUGFyc2VyO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbGlnaHR0b29sLnNoYWRlclBhcnNlciBwYXJzZXJJbnN0YW5jZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoc2hhZGVyTWdyLmdfc2hhZGVyUGFyc2VyID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBzaGFkZXJNZ3IuZ19zaGFkZXJQYXJzZXIgPSBuZXcgbGlnaHR0b29sLnNoYWRlclBhcnNlcigpOy8vbmVzc1xyXG4gICAgICAgICAgICByZXR1cm4gc2hhZGVyTWdyLmdfc2hhZGVyUGFyc2VyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsInVzaW5nIFN5c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcbnVzaW5nIFN5c3RlbS5MaW5xO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLldlYkdMO1xyXG5cclxubmFtZXNwYWNlIGxpZ2h0dG9vbFxyXG57XHJcbiAgICAvL+WKoOi9veW3peWFt1xyXG5cclxuICAgIHB1YmxpYyBjbGFzcyBsb2FkVG9vbFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBsb2FkVGV4dChzdHJpbmcgdXJsLCBBY3Rpb248c3RyaW5nLCBCcmlkZ2UuRXJyb3I+IGZ1bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTsvL25lc3NcclxuICAgICAgICAgICAgcmVxLk9wZW4oXCJHRVRcIiwgdXJsKTtcclxuICAgICAgICAgICAgcmVxLk9uUmVhZHlTdGF0ZUNoYW5nZSA9ICgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXEuUmVhZHlTdGF0ZSA9PSBCcmlkZ2UuSHRtbDUuQWpheFJlYWR5U3RhdGUuRG9uZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBmdW4ocmVxLlJlc3BvbnNlVGV4dCwgbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcS5PbkVycm9yID0gKGUpID0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgQnJpZGdlLkVycm9yKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIuTWVzc2FnZSA9IFwib25lcnIgaW4gcmVxOlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuKG51bGwsIGVycik7Ly9uZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcS5TZW5kKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIGxvYWRBcnJheUJ1ZmZlcihzdHJpbmcgdXJsLCBBY3Rpb248QnJpZGdlLkh0bWw1LkFycmF5QnVmZmVyLCBCcmlkZ2UuRXJyb3I+IGZ1bilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTsvL25lc3NcclxuXHJcbiAgICAgICAgICAgIHJlcS5PcGVuKFwiR0VUXCIsIHVybCk7XHJcbiAgICAgICAgICAgIHJlcS5SZXNwb25zZVR5cGUgPSBYTUxIdHRwUmVxdWVzdFJlc3BvbnNlVHlwZS5BcnJheUJ1ZmZlcjsvLyBcImFycmF5YnVmZmVyXCI7Ly9pZSDkuIDlrpropoHlnKhvcGVu5LmL5ZCO5L+u5pS5cmVzcG9uc2VUeXBlXHJcbiAgICAgICAgICAgIHJlcS5PblJlYWR5U3RhdGVDaGFuZ2UgPSAoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxLlJlYWR5U3RhdGUgPT0gQWpheFJlYWR5U3RhdGUuRG9uZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ290IGJpbjpcIiArIHR5cGVvZiAocmVxLnJlc3BvbnNlKSArIHJlcS5yZXNwb25zZVR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZ1bihyZXEuUmVzcG9uc2UgYXMgQXJyYXlCdWZmZXIsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXEuT25FcnJvciA9IChlKSA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnIuTWVzc2FnZSA9IFwib25lcnIgaW4gcmVxOlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmdW4obnVsbCwgZXJyKTsvL25lc3NcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXEuU2VuZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIGxvYWRCbG9iKHN0cmluZyB1cmwsIEFjdGlvbjxCbG9iLCBFcnJvcj4gZnVuKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpOy8vbmVzc1xyXG5cclxuICAgICAgICAgICAgcmVxLk9wZW4oXCJHRVRcIiwgdXJsKTtcclxuICAgICAgICAgICAgcmVxLlJlc3BvbnNlVHlwZSA9IFhNTEh0dHBSZXF1ZXN0UmVzcG9uc2VUeXBlLkJsb2I7Ly8gXCJibG9iXCI7Ly9pZSDkuIDlrpropoHlnKhvcGVu5LmL5ZCO5L+u5pS5cmVzcG9uc2VUeXBlXHJcbiAgICAgICAgICAgIHJlcS5PblJlYWR5U3RhdGVDaGFuZ2UgPSAoKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxLlJlYWR5U3RhdGUgPT0gQWpheFJlYWR5U3RhdGUuRG9uZSlcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZ290IF9ibG9iOlwiICsgdHlwZW9mIChyZXEucmVzcG9uc2UpICsgcmVxLnJlc3BvbnNlVHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuKHJlcS5SZXNwb25zZSBhcyBCbG9iLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxLk9uRXJyb3IgPSAoZSkgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyLk1lc3NhZ2UgPSBcIm9uZXJyIGluIHJlcTpcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnVuKG51bGwsIGVycik7Ly9uZXNzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmVxLlNlbmQoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8vc2hhZGVyXHJcbiAgICBwdWJsaWMgY2xhc3Mgc2hhZGVyY29kZVxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdnNjb2RlO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZnNjb2RlO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFNoYWRlciB2cztcclxuICAgICAgICBwdWJsaWMgV2ViR0xTaGFkZXIgZnM7XHJcbiAgICAgICAgcHVibGljIFdlYkdMUHJvZ3JhbSBwcm9ncmFtO1xyXG5cclxuICAgICAgICBwdWJsaWMgaW50IHBvc1BvcyA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgcG9zQ29sb3IgPSAtMTtcclxuICAgICAgICBwdWJsaWMgaW50IHBvc0NvbG9yMiA9IC0xO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgcG9zVVYgPSAtMTtcclxuICAgICAgICBwdWJsaWMgV2ViR0xVbmlmb3JtTG9jYXRpb24gdW5pTWF0cml4ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgV2ViR0xVbmlmb3JtTG9jYXRpb24gdW5pVGV4MCA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIFdlYkdMVW5pZm9ybUxvY2F0aW9uIHVuaVRleDEgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFVuaWZvcm1Mb2NhdGlvbiB1bmlDb2wwID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgV2ViR0xVbmlmb3JtTG9jYXRpb24gdW5pQ29sMSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHZvaWQgY29tcGlsZShXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnZzID0gd2ViZ2wuQ3JlYXRlU2hhZGVyKHdlYmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICB0aGlzLmZzID0gd2ViZ2wuQ3JlYXRlU2hhZGVyKHdlYmdsLkZSQUdNRU5UX1NIQURFUik7XHJcblxyXG4gICAgICAgICAgICAvL+WIhuWIq+e8luivkXNoYWRlclxyXG4gICAgICAgICAgICB3ZWJnbC5TaGFkZXJTb3VyY2UodGhpcy52cywgdGhpcy52c2NvZGUpO1xyXG4gICAgICAgICAgICB3ZWJnbC5Db21waWxlU2hhZGVyKHRoaXMudnMpO1xyXG4gICAgICAgICAgICB2YXIgcjEgPSB3ZWJnbC5HZXRTaGFkZXJQYXJhbWV0ZXIodGhpcy52cywgd2ViZ2wuQ09NUElMRV9TVEFUVVMpO1xyXG4gICAgICAgICAgICBpZiAocjEuQXM8Ym9vbD4oKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQod2ViZ2wuR2V0U2hhZGVySW5mb0xvZyh0aGlzLnZzKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgd2ViZ2wuU2hhZGVyU291cmNlKHRoaXMuZnMsIHRoaXMuZnNjb2RlKTtcclxuICAgICAgICAgICAgd2ViZ2wuQ29tcGlsZVNoYWRlcih0aGlzLmZzKTtcclxuICAgICAgICAgICAgdmFyIHIyID0gd2ViZ2wuR2V0U2hhZGVyUGFyYW1ldGVyKHRoaXMuZnMsIHdlYmdsLkNPTVBJTEVfU1RBVFVTKTtcclxuICAgICAgICAgICAgaWYgKHIyLkFzPGJvb2w+KCkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KHdlYmdsLkdldFNoYWRlckluZm9Mb2codGhpcy5mcykpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvL3Byb2dyYW0gbGlua1xyXG4gICAgICAgICAgICB0aGlzLnByb2dyYW0gPSB3ZWJnbC5DcmVhdGVQcm9ncmFtKCkuQXM8V2ViR0xQcm9ncmFtPigpO1xyXG5cclxuICAgICAgICAgICAgd2ViZ2wuQXR0YWNoU2hhZGVyKHRoaXMucHJvZ3JhbSwgdGhpcy52cyk7XHJcbiAgICAgICAgICAgIHdlYmdsLkF0dGFjaFNoYWRlcih0aGlzLnByb2dyYW0sIHRoaXMuZnMpO1xyXG5cclxuICAgICAgICAgICAgd2ViZ2wuTGlua1Byb2dyYW0odGhpcy5wcm9ncmFtKTtcclxuICAgICAgICAgICAgdmFyIHIzID0gd2ViZ2wuR2V0UHJvZ3JhbVBhcmFtZXRlcih0aGlzLnByb2dyYW0sIHdlYmdsLkxJTktfU1RBVFVTKTtcclxuICAgICAgICAgICAgaWYgKHIzLkFzPGJvb2w+KCkgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KHdlYmdsLkdldFByb2dyYW1JbmZvTG9nKHRoaXMucHJvZ3JhbSkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy/nu5Hlrpp2Ym/lkoxzaGFkZXLpobbngrnmoLzlvI/vvIzov5npg6jliIblupTor6XopoHljLrliIbmnZDotKjmlLnlj5jkuI7lj4LmlbDmlLnlj5jvvIzlj6/ku6XlsJHliIfmjaLkuIDkupvnirbmgIFcclxuICAgICAgICAgICAgdGhpcy5wb3NQb3MgPSB3ZWJnbC5HZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sIFwicG9zaXRpb25cIik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zQ29sb3IgPSB3ZWJnbC5HZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sIFwiY29sb3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMucG9zQ29sb3IyID0gd2ViZ2wuR2V0QXR0cmliTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcImNvbG9yMlwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucG9zVVYgPSB3ZWJnbC5HZXRBdHRyaWJMb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidXZcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVuaU1hdHJpeCA9IHdlYmdsLkdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwibWF0cml4XCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaVRleDAgPSB3ZWJnbC5HZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInRleDBcIik7XHJcbiAgICAgICAgICAgIHRoaXMudW5pVGV4MSA9IHdlYmdsLkdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidGV4MVwiKTtcclxuICAgICAgICAgICAgdGhpcy51bmlDb2wwID0gd2ViZ2wuR2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJjb2wwXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnVuaUNvbDEgPSB3ZWJnbC5HZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcImNvbDFcIik7XHJcblxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgdm9pZCBhbGVydChzdHJpbmcgcClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBOb3RJbXBsZW1lbnRlZEV4Y2VwdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzaGFkZXJQYXJzZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgRGljdGlvbmFyeTxzdHJpbmcsIHNoYWRlcmNvZGU+IG1hcHNoYWRlciA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgc2hhZGVyY29kZT4oKTtcclxuICAgICAgICAvLyAgICBtYXBzaGFkZXI6IHsgW2lkOiBzdHJpbmddOiBzaGFkZXJjb2RlXHJcbiAgICAgICAgLy99ID0ge307XHJcbiAgICAgICAgdm9pZCBfcGFyc2VyKHN0cmluZyB0eHQpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgczEgPSB0eHQuU3BsaXQobmV3W10geyBcIjwtLVwiIH0sIFN0cmluZ1NwbGl0T3B0aW9ucy5SZW1vdmVFbXB0eUVudHJpZXMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHMxLkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgczIgPSBzMVtpXS5TcGxpdChcIi0tPlwiKTtcclxuICAgICAgICAgICAgICAgIHZhciBzdGFnID0gczJbMF0uU3BsaXQoXCIgXCIpOy8vdGFncztcclxuICAgICAgICAgICAgICAgIHZhciBzc2hhZGVyID0gczJbMV07Ly/mraPmlodcclxuICAgICAgICAgICAgICAgIHZhciBsYXN0bmFtZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGFzdHRhZyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzdGFnLkxlbmd0aDsgaisrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gc3RhZ1tqXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodC5MZW5ndGggPT0gMCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgPT0gXCJ2c1wiKS8vdmVjdGV4c2hhZGVyXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0dGFnID0gMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAodCA9PSBcImZzXCIpLy9mcmFnbWVudHNoYWRlclxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdHRhZyA9IDI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RuYW1lID0gdC5TdWJzdHJpbmcoMSwgdC5MZW5ndGggLSAyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGFzdG5hbWUuTGVuZ3RoID09IDApIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWFwc2hhZGVyLkNvbnRhaW5zS2V5KGxhc3RuYW1lKSA9PSBmYWxzZSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcHNoYWRlcltsYXN0bmFtZV0gPSBuZXcgc2hhZGVyY29kZSgpOy8vbmVzc1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhc3R0YWcgPT0gMSlcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcHNoYWRlcltsYXN0bmFtZV0udnNjb2RlID0gc3NoYWRlcjtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGxhc3R0YWcgPT0gMilcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcHNoYWRlcltsYXN0bmFtZV0uZnNjb2RlID0gc3NoYWRlcjtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgcGFyc2VVcmwoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdXJsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbGlnaHR0b29sLmxvYWRUb29sLmxvYWRUZXh0KHVybCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJzZXIodHh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcGlsZSh3ZWJnbCk7XHJcbiAgICAgICAgICAgICAgICAvL3Nwcml0ZUJhdGNoZXJcclxuICAgICAgICAgICAgfVxyXG4pICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgcGFyc2VEaXJlY3QoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdHh0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyc2VyKHR4dCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29tcGlsZSh3ZWJnbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvaWQgZHVtcCgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgbmFtZSBpbiB0aGlzLm1hcHNoYWRlci5LZXlzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZShcInNoYWRlcm5hbWU6XCIgKyBuYW1lKTtcclxuICAgICAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwidnM6XCIgKyB0aGlzLm1hcHNoYWRlcltuYW1lXS52c2NvZGUpO1xyXG4gICAgICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUoXCJmczpcIiArIHRoaXMubWFwc2hhZGVyW25hbWVdLmZzY29kZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZvaWQgY29tcGlsZShXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgbmFtZSBpbiB0aGlzLm1hcHNoYWRlci5LZXlzKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1hcHNoYWRlcltuYW1lXS5jb21waWxlKHdlYmdsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vc3ByaXRlIOWfuuacrOaVsOaNrue7k+aehFxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZVJlY3RcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlUmVjdChmbG9hdCB4ID0gMCwgZmxvYXQgeSA9IDAsIGZsb2F0IHcgPSAwLCBmbG9hdCBoID0gMClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgICAgIHRoaXMudyA9IHc7XHJcbiAgICAgICAgICAgIHRoaXMuaCA9IGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB3O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBoO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgc3ByaXRlUmVjdCBvbmUgPSBuZXcgc3ByaXRlUmVjdCgwLCAwLCAxLCAxKTsvL25lc3NcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZVJlY3QgemVybyA9IG5ldyBzcHJpdGVSZWN0KDAsIDAsIDAsIDApOy8vbmVzc1xyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZUJvcmRlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVCb3JkZXIoZmxvYXQgbCA9IDAsIGZsb2F0IHQgPSAwLCBmbG9hdCByID0gMCwgZmxvYXQgYiA9IDApXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmwgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnQgPSB0O1xyXG4gICAgICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgbDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZUJvcmRlciB6ZXJvID0gbmV3IHNwcml0ZUJvcmRlcigwLCAwLCAwLCAwKTsvL25lc3NcclxuXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlQ29sb3JcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQ29sb3IoZmxvYXQgciA9IDEsIGZsb2F0IGcgPSAxLCBmbG9hdCBiID0gMSwgZmxvYXQgYSA9IDEpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgICAgICB0aGlzLmcgPSBnO1xyXG4gICAgICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgICAgICAgICB0aGlzLmEgPSBhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNwcml0ZUNvbG9yIHdoaXRlXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBnZXRcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBzcHJpdGVDb2xvcigxLCAxLCAxLCAxKTsvL25lc3NcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IHNwcml0ZUNvbG9yIGJsYWNrID0gbmV3IHNwcml0ZUNvbG9yKDAsIDAsIDAsIDEpOy8vbmVzc1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgc3ByaXRlQ29sb3IgZ3JheSA9IG5ldyBzcHJpdGVDb2xvcigwLjVmLCAwLjVmLCAwLjVmLCAxKTsvL25lc3NcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVQb2ludFxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB6O1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgcjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgZztcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYTtcclxuXHJcbiAgICAgICAgcHVibGljIGZsb2F0IHIyO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBnMjtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYjI7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGEyO1xyXG5cclxuICAgICAgICBwdWJsaWMgZmxvYXQgdTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgdjtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy9zcHJpdGXmnZDotKhcclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVNYXRcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RyaW5nIHNoYWRlcjtcclxuICAgICAgICBwdWJsaWMgYm9vbCB0cmFuc3BhcmVudDtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlVGV4dHVyZSB0ZXgwO1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVUZXh0dXJlIHRleDE7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUNvbG9yIGNvbDA7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUNvbG9yIGNvbDE7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3RhdGVSZWNvcmRlclxyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgcHVibGljIHN0YXRlUmVjb3JkZXIoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbCA9IHdlYmdsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYm9vbCBERVBUSF9XUklURU1BU0s7XHJcbiAgICAgICAgcHVibGljIGJvb2wgREVQVEhfVEVTVDtcclxuICAgICAgICBwdWJsaWMgaW50IERFUFRIX0ZVTkM7XHJcbiAgICAgICAgcHVibGljIGJvb2wgQkxFTkQ7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9FUVVBVElPTjtcclxuICAgICAgICBwdWJsaWMgaW50IEJMRU5EX1NSQ19SR0I7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9TUkNfQUxQSEE7XHJcbiAgICAgICAgcHVibGljIGludCBCTEVORF9EU1RfUkdCO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgQkxFTkRfRFNUX0FMUEhBO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFByb2dyYW0gQ1VSUkVOVF9QUk9HUkFNO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTEJ1ZmZlciBBUlJBWV9CVUZGRVI7XHJcbiAgICAgICAgcHVibGljIGludCBBQ1RJVkVfVEVYVFVSRTtcclxuICAgICAgICBwdWJsaWMgV2ViR0xUZXh0dXJlIFRFWFRVUkVfQklORElOR18yRDtcclxuICAgICAgICBwdWJsaWMgdm9pZCByZWNvcmQoKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8v6K6w5b2V54q25oCBXHJcbiAgICAgICAgICAgIHRoaXMuREVQVEhfV1JJVEVNQVNLID0gKGJvb2wpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5ERVBUSF9XUklURU1BU0spO1xyXG4gICAgICAgICAgICB0aGlzLkRFUFRIX1RFU1QgPSAoYm9vbCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgICAgICB0aGlzLkRFUFRIX0ZVTkMgPSAoaW50KXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuREVQVEhfRlVOQyk7XHJcbiAgICAgICAgICAgIC8vYWxwaGFibGVuZCDvvIzot5/nnYBtYXTotbBcclxuICAgICAgICAgICAgdGhpcy5CTEVORCA9IChib29sKXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQkxFTkQpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX0VRVUFUSU9OID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX0VRVUFUSU9OKTtcclxuICAgICAgICAgICAgdGhpcy5CTEVORF9TUkNfUkdCID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX1NSQ19SR0IpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX1NSQ19BTFBIQSA9IChpbnQpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5CTEVORF9TUkNfQUxQSEEpO1xyXG4gICAgICAgICAgICB0aGlzLkJMRU5EX0RTVF9SR0IgPSAoaW50KXRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQkxFTkRfRFNUX1JHQik7XHJcbiAgICAgICAgICAgIHRoaXMuQkxFTkRfRFNUX0FMUEhBID0gKGludCl0aGlzLndlYmdsLkdldFBhcmFtZXRlcih0aGlzLndlYmdsLkJMRU5EX0RTVF9BTFBIQSk7XHJcbiAgICAgICAgICAgIC8vICAgIHRoaXMud2ViZ2wuYmxlbmRGdW5jU2VwYXJhdGUodGhpcy53ZWJnbC5PTkUsIHRoaXMud2ViZ2wuT05FX01JTlVTX1NSQ19BTFBIQSxcclxuICAgICAgICAgICAgLy8gICAgICAgIHRoaXMud2ViZ2wuU1JDX0FMUEhBLCB0aGlzLndlYmdsLk9ORSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcCA9IHRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQ1VSUkVOVF9QUk9HUkFNKTtcclxuICAgICAgICAgICAgdGhpcy5DVVJSRU5UX1BST0dSQU0gPSBwLkFzPFdlYkdMUHJvZ3JhbT4oKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBwYiA9IHRoaXMud2ViZ2wuR2V0UGFyYW1ldGVyKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSX0JJTkRJTkcpO1xyXG4gICAgICAgICAgICB0aGlzLkFSUkFZX0JVRkZFUiA9IHBiLkFzPFdlYkdMQnVmZmVyPigpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5BQ1RJVkVfVEVYVFVSRSA9IChpbnQpdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5BQ1RJVkVfVEVYVFVSRSk7XHJcbiAgICAgICAgICAgIHRoaXMuVEVYVFVSRV9CSU5ESU5HXzJEID0gdGhpcy53ZWJnbC5HZXRQYXJhbWV0ZXIodGhpcy53ZWJnbC5URVhUVVJFX0JJTkRJTkdfMkQpLkFzPFdlYkdMVGV4dHVyZT4oKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIHJlc3RvcmUoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgLy/mgaLlpI3nirbmgIFcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EZXB0aE1hc2sodGhpcy5ERVBUSF9XUklURU1BU0spO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ERVBUSF9URVNUKVxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5ERVBUSF9URVNUKTsvL+i/meaYr3p0ZXN0XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRGlzYWJsZSh0aGlzLndlYmdsLkRFUFRIX1RFU1QpOy8v6L+Z5pivenRlc3RcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EZXB0aEZ1bmModGhpcy5ERVBUSF9GVU5DKTsvL+i/meaYr3p0ZXN05pa55rOVXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5CTEVORClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEVxdWF0aW9uKHRoaXMuQkxFTkRfRVFVQVRJT04pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEZ1bmNTZXBhcmF0ZSh0aGlzLkJMRU5EX1NSQ19SR0IsIHRoaXMuQkxFTkRfRFNUX1JHQixcclxuICAgICAgICAgICAgICAgIHRoaXMuQkxFTkRfU1JDX0FMUEhBLCB0aGlzLkJMRU5EX0RTVF9BTFBIQSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndlYmdsLlVzZVByb2dyYW0odGhpcy5DVVJSRU5UX1BST0dSQU0pO1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsLkJpbmRCdWZmZXIodGhpcy53ZWJnbC5BUlJBWV9CVUZGRVIsIHRoaXMuQVJSQVlfQlVGRkVSKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLkFDVElWRV9URVhUVVJFKTtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMuVEVYVFVSRV9CSU5ESU5HXzJEKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHVibGljIGNsYXNzIHNwcml0ZUJhdGNoZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsO1xyXG4gICAgICAgIHB1YmxpYyBzaGFkZXJQYXJzZXIgc2hhZGVycGFyc2VyO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTEJ1ZmZlciB2Ym87XHJcbiAgICAgICAgLy9kYXRhOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBGbG9hdDMyQXJyYXkgbWF0cml4O1xyXG4gICAgICAgIHB1YmxpYyBib29sIHp0ZXN0ID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc3RhdGVSZWNvcmRlciByZWNvcmRlcjtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQmF0Y2hlcihXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2wsIHNoYWRlclBhcnNlciBzaGFkZXJwYXJzZXIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVycGFyc2VyID0gc2hhZGVycGFyc2VyO1xyXG4gICAgICAgICAgICB0aGlzLnZibyA9IHdlYmdsLkNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgICAgICAgICB2YXIgYXNwID0gKHRoaXMud2ViZ2wuRHJhd2luZ0J1ZmZlcldpZHRoIC8gdGhpcy53ZWJnbC5EcmF3aW5nQnVmZmVySGVpZ2h0KTtcclxuICAgICAgICAgICAgLy90aGlzLm1hdHJpeD1cclxuICAgICAgICAgICAgZmxvYXRbXSBhcnJheSA9e1xyXG4gICAgICAgICAgICAgICAgMS4wZiAvIGFzcCwgMCwgMCwgMCwvL+WOu+aOiWFzcOeahOW9seWTjVxyXG4gICAgICAgICAgICAgICAgMCwgMSwgMCwgMCxcclxuICAgICAgICAgICAgICAgIDAsIDAsIDEsIDAsXHJcbiAgICAgICAgICAgICAgICAwLCAwLCAwLCAxXHJcbiAgICAgICAgICAgIH07Ly9uZXNzXHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShhcnJheSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyID0gbmV3IHN0YXRlUmVjb3JkZXIod2ViZ2wpOy8vbmVzc1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBiZWdpbmRyYXcoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWNvcmRlci5yZWNvcmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZvaWQgZW5kZHJhdygpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLmVuZGJhdGNoKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnJlY29yZGVyLnJlc3RvcmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNoYWRlcmNvZGUgc2hhZGVyY29kZSA9IG51bGw7XHJcbiAgICAgICAgLy9iZWdpbmRyYXcg5ZKMIHNldG1hdCDliLDlupXopoHkuI3opoHliIblvIDvvIzov5nmmK/pnIDopoHlho3mgJ3ogIPkuIDkuIvnmoRcclxuICAgICAgICBwdWJsaWMgc3ByaXRlTWF0IG1hdDtcclxuICAgICAgICBwdWJsaWMgdm9pZCBzZXRNYXQoc3ByaXRlTWF0IG1hdClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChtYXQgPT0gdGhpcy5tYXQpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5EaXNhYmxlKHRoaXMud2ViZ2wuQ1VMTF9GQUNFKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubWF0ID0gbWF0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJwYXJzZXIubWFwc2hhZGVyLkNvbnRhaW5zS2V5KHRoaXMubWF0LnNoYWRlcikgPT0gZmFsc2UpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hhZGVyY29kZSA9IHRoaXMuc2hhZGVycGFyc2VyLm1hcHNoYWRlclt0aGlzLm1hdC5zaGFkZXJdO1xyXG4gICAgICAgICAgICAvL2lmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAvL+aMh+WumnNoYWRlcuWSjHZib1xyXG5cclxuICAgICAgICAgICAgLy/lhbPkuo7mt7HluqYg77yM6Lef552Ac3ByaXRlYmF0Y2hlcui1sFxyXG4gICAgICAgICAgICB0aGlzLndlYmdsLkRlcHRoTWFzayhmYWxzZSk7Ly/ov5nmmK96d3JpdGVcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnp0ZXN0KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkVuYWJsZSh0aGlzLndlYmdsLkRFUFRIX1RFU1QpOy8v6L+Z5pivenRlc3RcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRGVwdGhGdW5jKHRoaXMud2ViZ2wuTEVRVUFMKTsvL+i/meaYr3p0ZXN05pa55rOVXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5ERVBUSF9URVNUKTsvL+i/meaYr3p0ZXN0XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1hdC50cmFuc3BhcmVudClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgLy9hbHBoYWJsZW5kIO+8jOi3n+edgG1hdOi1sFxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkJsZW5kRXF1YXRpb24odGhpcy53ZWJnbC5GVU5DX0FERCk7XHJcbiAgICAgICAgICAgICAgICAvL3RoaXMud2ViZ2wuYmxlbmRGdW5jKHRoaXMud2ViZ2wuT05FLCB0aGlzLndlYmdsLk9ORV9NSU5VU19TUkNfQUxQSEEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CbGVuZEZ1bmNTZXBhcmF0ZSh0aGlzLndlYmdsLk9ORSwgdGhpcy53ZWJnbC5PTkVfTUlOVVNfU1JDX0FMUEhBLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuU1JDX0FMUEhBLCB0aGlzLndlYmdsLk9ORSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkRpc2FibGUodGhpcy53ZWJnbC5CTEVORCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuVXNlUHJvZ3JhbSh0aGlzLnNoYWRlcmNvZGUucHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuQmluZEJ1ZmZlcih0aGlzLndlYmdsLkFSUkFZX0JVRkZFUiwgdGhpcy52Ym8pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8v5oyH5a6a5Zu65a6a55qE5pWw5o2u57uT5p6E77yM54S25ZCO5qC55o2u5a2Y5ZyocHJvZ3JhbeeahOaVsOaNruWOu+e7keWumuWSr+OAglxyXG5cclxuICAgICAgICAgICAgLy/nu5Hlrpp2Ym/lkoxzaGFkZXLpobbngrnmoLzlvI/vvIzov5npg6jliIblupTor6XopoHljLrliIbmnZDotKjmlLnlj5jkuI7lj4LmlbDmlLnlj5jvvIzlj6/ku6XlsJHliIfmjaLkuIDkupvnirbmgIFcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS5wb3NQb3MgPj0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5FbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnNoYWRlcmNvZGUucG9zUG9zKTtcclxuICAgICAgICAgICAgICAgIC8vMjgg5piv5pWw5o2u5q2l6ZW/KOWtl+iKginvvIzlsLHmmK/mlbDmja7nu5PmnoTnmoTplb/luqZcclxuICAgICAgICAgICAgICAgIC8vMTIg5piv5pWw5o2u5YGP56e777yI5a2X6IqC77yJXHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc1BvcywgMywgdGhpcy53ZWJnbC5GTE9BVCwgZmFsc2UsIDUyLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnNoYWRlcmNvZGUucG9zQ29sb3IsIDQsIHRoaXMud2ViZ2wuRkxPQVQsIGZhbHNlLCA1MiwgMTIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUucG9zQ29sb3IyID49IDApXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuRW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yMik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc0NvbG9yMiwgNCwgdGhpcy53ZWJnbC5GTE9BVCwgZmFsc2UsIDUyLCAyOCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS5wb3NVViA+PSAwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLkVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMuc2hhZGVyY29kZS5wb3NVVik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5zaGFkZXJjb2RlLnBvc1VWLCAyLCB0aGlzLndlYmdsLkZMT0FULCBmYWxzZSwgNTIsIDQ0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlNYXRyaXggIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5Vbmlmb3JtTWF0cml4NGZ2KHRoaXMuc2hhZGVyY29kZS51bmlNYXRyaXgsIGZhbHNlLCAoQXJyYXkpKG9iamVjdCl0aGlzLm1hdHJpeCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlUZXgwICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkUwKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzLm1hdC50ZXgwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRleCA9PSBudWxsID8gbnVsbCA6IHRleC50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTFpKHRoaXMuc2hhZGVyY29kZS51bmlUZXgwLCAwKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlUZXgxICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuQWN0aXZlVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkUxKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZXggPSB0aGlzLm1hdC50ZXgxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5CaW5kVGV4dHVyZSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRleCA9PSBudWxsID8gbnVsbCA6IHRleC50ZXh0dXJlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTFpKHRoaXMuc2hhZGVyY29kZS51bmlUZXgxLCAxKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlDb2wwICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTRmKHRoaXMuc2hhZGVyY29kZS51bmlDb2wwLCBtYXQuY29sMC5yLCBtYXQuY29sMC5nLCBtYXQuY29sMC5iLCBtYXQuY29sMC5hKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hhZGVyY29kZS51bmlDb2wxICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVW5pZm9ybTRmKHRoaXMuc2hhZGVyY29kZS51bmlDb2wxLCBtYXQuY29sMS5yLCBtYXQuY29sMS5nLCBtYXQuY29sMS5iLCBtYXQuY29sMS5hKTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJzZXR0ZXhcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIEZsb2F0MzJBcnJheSBhcnJheSA9IG5ldyBGbG9hdDMyQXJyYXkoMTAyNCAqIDEzKTsvL25lc3NcclxuICAgICAgICBpbnQgZGF0YXNlZWsgPSAwO1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIGVuZGJhdGNoKClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0ID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgLy/loavlhYV2Ym9cclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5CdWZmZXJEYXRhKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLmFycmF5LCB0aGlzLndlYmdsLkRZTkFNSUNfRFJBVyk7XHJcbiAgICAgICAgICAgIC8v57uY5Yi2XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuRHJhd0FycmF5cyh0aGlzLndlYmdsLlRSSUFOR0xFUywgMCwgdGhpcy5kYXRhc2Vlayk7XHJcbiAgICAgICAgICAgIC8v5riF55CG54q25oCB77yM5Y+v5Lul5LiN5bmyXHJcbiAgICAgICAgICAgIC8vdGhpcy53ZWJnbC5iaW5kQnVmZmVyKHRoaXMud2ViZ2wuQVJSQVlfQlVGRkVSLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5kYXRhLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBhZGRRdWFkKHNwcml0ZVBvaW50W10gcHMpLy/mt7vliqDlm5vovrnlvaLvvIzlv4XpobvmmK/lm5vnmoTlgI3mlbDvvIzkuI3mjqXlj5foo4HliapcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgamMgPSAwOyBqYyA8IDY7IGpjKyspXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBqID0gamMgPCAzID8gamMgOiA2IC0gamM7Ly8gMC0+MCAxLT4xIDItPjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgKGogPiAyKSBqID0gNiAtIGpjOyAvLyAzLT4zIDQtPjIgNS0+MVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpID0gdGhpcy5kYXRhc2VlayAqIDEzO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS55O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uejtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5yMjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmcyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5hMjtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsrKztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGFkZFRyaShzcHJpdGVQb2ludFtdIHBzKS8v5re75Yqg5LiJ6KeS5b2i77yM5b+F6aG75piv5LiJ55qE5YCN5pWwICzkuInop5LlvaLkuI3mlK/mjIHnoazoo4HliapcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNoYWRlcmNvZGUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAzOyBqKyspXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmRhdGFzZWVrICogMTM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9mb3IgKHZhciBlIGluIHBzW2pdKVxyXG4gICAgICAgICAgICAgICAgICAgIC8ve1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdW2VdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ueTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS56O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZzI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0udTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFzZWVrKys7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS54KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0ueik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5yKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0uYik7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5hKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0uZyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS5iKTtcclxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuZGF0YS5wdXNoKHBzW2pdLmEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdGhpcy5kYXRhLnB1c2gocHNbal0udSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLmRhdGEucHVzaChwc1tqXS52KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy/ov5nkuKrmjqXlj6PmjqXlj5foo4HliapcclxuICAgICAgICBwdWJsaWMgdm9pZCBhZGRSZWN0KHNwcml0ZVBvaW50W10gcHMpIC8v5re75Yqg5Zub6L655b2i77yM5b+F6aG75piv5Zub55qE5YCN5pWwXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaGFkZXJjb2RlID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY3RDbGlwICE9IG51bGwpIC8v5L2/55So6KOB5YmqXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciB4bWluID0gcHNbMF0ueDtcclxuICAgICAgICAgICAgICAgIHZhciB4bWF4ID0gcHNbM10ueDtcclxuICAgICAgICAgICAgICAgIHZhciB5bWluID0gcHNbMF0ueTtcclxuICAgICAgICAgICAgICAgIHZhciB5bWF4ID0gcHNbM10ueTtcclxuICAgICAgICAgICAgICAgIHZhciB1bWluID0gcHNbMF0udTtcclxuICAgICAgICAgICAgICAgIHZhciB1bWF4ID0gcHNbM10udTtcclxuICAgICAgICAgICAgICAgIHZhciB2bWluID0gcHNbMF0udjtcclxuICAgICAgICAgICAgICAgIHZhciB2bWF4ID0gcHNbM10udjtcclxuICAgICAgICAgICAgICAgIHZhciB3c2l6ZSA9IHhtYXggLSB4bWluO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhzaXplID0geW1heCAtIHltaW47XHJcbiAgICAgICAgICAgICAgICB2YXIgdXNpemUgPSB1bWF4IC0gdW1pbjtcclxuICAgICAgICAgICAgICAgIHZhciB2c2l6ZSA9IHZtYXggLSB2bWluO1xyXG4gICAgICAgICAgICAgICAgdmFyIHhsID0gTWF0aC5NYXgoeG1pbiwgdGhpcy5yZWN0Q2xpcC54KTtcclxuICAgICAgICAgICAgICAgIHZhciB4ciA9IE1hdGguTWluKHhtYXgsIHRoaXMucmVjdENsaXAueCArIHRoaXMucmVjdENsaXAudyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgeXQgPSBNYXRoLk1heCh5bWluLCB0aGlzLnJlY3RDbGlwLnkpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHliID0gTWF0aC5NaW4oeW1heCwgdGhpcy5yZWN0Q2xpcC55ICsgdGhpcy5yZWN0Q2xpcC5oKTtcclxuICAgICAgICAgICAgICAgIHZhciBsZiA9ICh4bCAtIHhtaW4pIC8gd3NpemU7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGYgPSAoeXQgLSB5bWluKSAvIGhzaXplO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJmID0gKHhyIC0geG1heCkgLyB3c2l6ZTtcclxuICAgICAgICAgICAgICAgIHZhciBiZiA9ICh5YiAtIHltYXgpIC8gaHNpemU7XHJcbiAgICAgICAgICAgICAgICB1bWluID0gdW1pbiArIGxmICogdXNpemU7XHJcbiAgICAgICAgICAgICAgICB2bWluID0gdm1pbiArIHRmICogdnNpemU7XHJcbiAgICAgICAgICAgICAgICB1bWF4ID0gdW1heCArIHJmICogdXNpemU7XHJcbiAgICAgICAgICAgICAgICB2bWF4ID0gdm1heCArIGJmICogdnNpemU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqYyA9IDA7IGpjIDwgNjsgamMrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaiA9IGpjIDwgMyA/IGpjIDogNiAtIGpjOy8vIDAtPjAgMS0+MSAyLT4yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpZiAoaiA+IDIpIGogPSA2IC0gamM7IC8vIDMtPjMgNC0+MiA1LT4xXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gdGhpcy5kYXRhc2VlayAqIDEzO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgeCA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHggPCB4bCkgeCA9IHhsO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID4geHIpIHggPSB4cjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgeSA9IHBzW2pdLnk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHkgPCB5dCkgeSA9IHl0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh5ID4geWIpIHkgPSB5YjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdSA9IHBzW2pdLnU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHUgPCB1bWluKSB1ID0gdW1pbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodSA+IHVtYXgpIHUgPSB1bWF4O1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2ID0gcHNbal0udjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodiA8IHZtaW4pIHYgPSB2bWluO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2ID4gdm1heCkgdiA9IHZtYXg7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0geDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSB5O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLno7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5yMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5nMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5hMjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSB1O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHY7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YXNlZWsrKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGpjID0gMDsgamMgPCA2OyBqYysrKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBqID0gamMgPCAzID8gamMgOiA2IC0gamM7Ly8gMC0+MCAxLT4xIDItPjJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIChqID4gMikgaiA9IDYgLSBqYzsgLy8gMy0+MyA0LT4yIDUtPjFcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSB0aGlzLmRhdGFzZWVrICogMTM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLng7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ueTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS56O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLnI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZztcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS5iO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlbaSsrXSA9IHBzW2pdLmE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0ucjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uZzI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYjI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0uYTI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hcnJheVtpKytdID0gcHNbal0udTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFycmF5W2krK10gPSBwc1tqXS52O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFzZWVrKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YXNlZWsgPj0gMTAwMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbmRiYXRjaCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3ByaXRlUmVjdCByZWN0Q2xpcCA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHZvaWQgc2V0UmVjdENsaXAoc3ByaXRlUmVjdCByZWN0KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0Q2xpcCA9IHJlY3Q7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGNsb3NlUmVjdENsaXAoKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0Q2xpcCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vdGV4dHVyZVxyXG4gICAgcHVibGljIGVudW0gdGV4dHVyZWZvcm1hdFxyXG4gICAge1xyXG4gICAgICAgIFJHQkEgPSAxLC8vIFdlYkdMUmVuZGVyaW5nQ29udGV4dC5SR0JBLFxyXG4gICAgICAgIFJHQiA9IDIsLy9XZWJHTFJlbmRlcmluZ0NvbnRleHQuUkdCLFxyXG4gICAgICAgIEdSQVkgPSAzLC8vV2ViR0xSZW5kZXJpbmdDb250ZXh0LkxVTUlOQU5DRSxcclxuICAgICAgICAvL0FMUEhBID0gdGhpcy53ZWJnbC5BTFBIQSxcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyB0ZXhSZWFkZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgdGV4UmVhZGVyKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgV2ViR0xUZXh0dXJlIHRleFJHQkEsIGludCB3aWR0aCwgaW50IGhlaWdodCwgYm9vbCBncmF5ID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMuZ3JheSA9IGdyYXk7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmJvID0gd2ViZ2wuQ3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICAgICAgV2ViR0xGcmFtZWJ1ZmZlciBmYm9sZCA9IHdlYmdsLkdldFBhcmFtZXRlcih3ZWJnbC5GUkFNRUJVRkZFUl9CSU5ESU5HKSBhcyBXZWJHTEZyYW1lYnVmZmVyO1xyXG4gICAgICAgICAgICB3ZWJnbC5CaW5kRnJhbWVidWZmZXIod2ViZ2wuRlJBTUVCVUZGRVIsIGZibyk7XHJcbiAgICAgICAgICAgIHdlYmdsLkZyYW1lYnVmZmVyVGV4dHVyZTJEKHdlYmdsLkZSQU1FQlVGRkVSLCB3ZWJnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgd2ViZ2wuVEVYVFVSRV8yRCxcclxuICAgICAgICAgICAgICAgIHRleFJHQkEsIDApO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJlYWREYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0ICogNCk7XHJcbiAgICAgICAgICAgIHJlYWREYXRhWzBdID0gMjtcclxuICAgICAgICAgICAgd2ViZ2wuUmVhZFBpeGVscygwLCAwLCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgd2ViZ2wuUkdCQSwgd2ViZ2wuVU5TSUdORURfQllURSxcclxuICAgICAgICAgICAgICAgIHJlYWREYXRhKTtcclxuICAgICAgICAgICAgd2ViZ2wuRGVsZXRlRnJhbWVidWZmZXIoZmJvKTtcclxuICAgICAgICAgICAgd2ViZ2wuQmluZEZyYW1lYnVmZmVyKHdlYmdsLkZSQU1FQlVGRkVSLCBmYm9sZCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZ3JheSlcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy53aWR0aCAqIHRoaXMuaGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd2lkdGggKiBoZWlnaHQ7IGkrKylcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSByZWFkRGF0YVtpICogNF07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEgPSByZWFkRGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaW50IHdpZHRoO1xyXG4gICAgICAgIHB1YmxpYyBpbnQgaGVpZ2h0O1xyXG4gICAgICAgIHB1YmxpYyBVaW50OEFycmF5IGRhdGE7XHJcbiAgICAgICAgcHVibGljIGJvb2wgZ3JheTtcclxuICAgICAgICBwdWJsaWMgb2JqZWN0IGdldFBpeGVsKGZsb2F0IHUsIGZsb2F0IHYpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpbnQgeCA9IChpbnQpKHUgKiB0aGlzLndpZHRoKTtcclxuICAgICAgICAgICAgaW50IHkgPSAoaW50KSh2ICogdGhpcy5oZWlnaHQpO1xyXG4gICAgICAgICAgICBpZiAoeCA8IDAgfHwgeCA+PSB0aGlzLndpZHRoIHx8IHkgPCAwIHx8IHkgPj0gdGhpcy5oZWlnaHQpIHJldHVybiAwO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ncmF5KVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhW3kgKiB0aGlzLndpZHRoICsgeF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaSA9ICh5ICogdGhpcy53aWR0aCArIHgpICogNDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgc3ByaXRlQ29sb3IodGhpcy5kYXRhW2ldLCB0aGlzLmRhdGFbaSArIDFdLCB0aGlzLmRhdGFbaSArIDJdLCB0aGlzLmRhdGFbaSArIDNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVUZXh0dXJlXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVRleHR1cmUoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdXJsID0gbnVsbCwgdGV4dHVyZWZvcm1hdCBmb3JtYXQgPSB0ZXh0dXJlZm9ybWF0LlJHQkEsIGJvb2wgbWlwbWFwID0gZmFsc2UsIGJvb2wgbGluZWFyID0gdHJ1ZSlcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wgPSB3ZWJnbDtcclxuICAgICAgICAgICAgdGhpcy5mb3JtYXQgPSBmb3JtYXQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm1hdCA9IG5ldyBzcHJpdGVNYXQoKTsvL25lc3NcclxuICAgICAgICAgICAgdGhpcy5tYXQudGV4MCA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMubWF0LnRyYW5zcGFyZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5tYXQuc2hhZGVyID0gXCJzcHJpdGVkZWZhdWx0XCI7XHJcblxyXG4gICAgICAgICAgICBpZiAodXJsID09IG51bGwpLy/kuI3nu5nlrpp1cmwg5YiZIHRleHR1cmUg5LiN5Yqg6L29XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZSA9IHdlYmdsLkNyZWF0ZVRleHR1cmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gbmV3IEJyaWRnZS5IdG1sNS5IVE1MSW1hZ2VFbGVtZW50KCk7Ly8gSW1hZ2UoKTsvLyBIVE1MSW1hZ2VFbGVtZW50KCk7IC8vbmVzc1xyXG4gICAgICAgICAgICB0aGlzLmltZy5TcmMgPSB1cmw7XHJcbiAgICAgICAgICAgIHRoaXMuaW1nLk9uTG9hZCA9IChlKSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kaXNwb3NlaXQpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbWcgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xvYWRpbWcobWlwbWFwLCBsaW5lYXIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2b2lkIF9sb2FkaW1nKGJvb2wgbWlwbWFwLCBib29sIGxpbmVhcilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmltZy5XaWR0aDtcclxuICAgICAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmltZy5IZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy53ZWJnbC5QaXhlbFN0b3JlaSh0aGlzLndlYmdsLlVOUEFDS19QUkVNVUxUSVBMWV9BTFBIQV9XRUJHTCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wuUGl4ZWxTdG9yZWkodGhpcy53ZWJnbC5VTlBBQ0tfRkxJUF9ZX1dFQkdMLCAwKTtcclxuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndlYmdsLkJpbmRUZXh0dXJlKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy50ZXh0dXJlKTtcclxuICAgICAgICAgICAgdmFyIGZvcm1hdEdMID0gdGhpcy53ZWJnbC5SR0JBO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5mb3JtYXQgPT0gdGV4dHVyZWZvcm1hdC5SR0IpXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRHTCA9IHRoaXMud2ViZ2wuUkdCO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmZvcm1hdCA9PSB0ZXh0dXJlZm9ybWF0LkdSQVkpXHJcbiAgICAgICAgICAgICAgICBmb3JtYXRHTCA9IHRoaXMud2ViZ2wuTFVNSU5BTkNFO1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsLlRleEltYWdlMkQodGhpcy53ZWJnbC5URVhUVVJFXzJELFxyXG4gICAgICAgICAgICAgICAgMCxcclxuICAgICAgICAgICAgICAgIGZvcm1hdEdMLFxyXG4gICAgICAgICAgICAgICAgZm9ybWF0R0wsXHJcbiAgICAgICAgICAgICAgICAvL+acgOWQjui/meS4qnR5cGXvvIzlj6/ku6XnrqHmoLzlvI9cclxuICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVU5TSUdORURfQllURVxyXG4gICAgICAgICAgICAgICAgLCB0aGlzLmltZyk7XHJcblxyXG4gICAgICAgICAgICBpZiAobWlwbWFwKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAvL+eUn+aIkG1pcG1hcFxyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5HZW5lcmF0ZU1pcG1hcCh0aGlzLndlYmdsLlRFWFRVUkVfMkQpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChsaW5lYXIpXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMud2ViZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlRleFBhcmFtZXRlcmkodGhpcy53ZWJnbC5URVhUVVJFXzJELCB0aGlzLndlYmdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgdGhpcy53ZWJnbC5MSU5FQVJfTUlQTUFQX0xJTkVBUik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMud2ViZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMud2ViZ2wuTkVBUkVTVF9NSVBNQVBfTkVBUkVTVCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpbmVhcilcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndlYmdsLlRleFBhcmFtZXRlcmkodGhpcy53ZWJnbC5URVhUVVJFXzJELCB0aGlzLndlYmdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgdGhpcy53ZWJnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2ViZ2wuVGV4UGFyYW1ldGVyaSh0aGlzLndlYmdsLlRFWFRVUkVfMkQsIHRoaXMud2ViZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCB0aGlzLndlYmdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01BR19GSUxURVIsIHRoaXMud2ViZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5UZXhQYXJhbWV0ZXJpKHRoaXMud2ViZ2wuVEVYVFVSRV8yRCwgdGhpcy53ZWJnbC5URVhUVVJFX01JTl9GSUxURVIsIHRoaXMud2ViZ2wuTkVBUkVTVCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW1nID0gbnVsbDtcclxuXHJcblxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbDtcclxuICAgICAgICBwdWJsaWMgSFRNTEltYWdlRWxlbWVudCBpbWcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBib29sIGxvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFRleHR1cmUgdGV4dHVyZTtcclxuICAgICAgICBwdWJsaWMgdGV4dHVyZWZvcm1hdCBmb3JtYXQ7XHJcbiAgICAgICAgcHVibGljIGludCB3aWR0aCA9IDA7XHJcbiAgICAgICAgcHVibGljIGludCBoZWlnaHQgPSAwO1xyXG4gICAgICAgIHN0YXRpYyBwdWJsaWMgc3ByaXRlVGV4dHVyZSBmcm9tUmF3KFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgSFRNTEltYWdlRWxlbWVudCBpbWcsIHRleHR1cmVmb3JtYXQgZm9ybWF0ID0gdGV4dHVyZWZvcm1hdC5SR0JBLCBib29sIG1pcG1hcCA9IGZhbHNlLCBib29sIGxpbmVhciA9IHRydWUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB2YXIgc3QgPSBuZXcgc3ByaXRlVGV4dHVyZSh3ZWJnbCwgbnVsbCwgZm9ybWF0LCBtaXBtYXAsIGxpbmVhcik7XHJcbiAgICAgICAgICAgIHN0LnRleHR1cmUgPSB3ZWJnbC5DcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgICAgIHN0LmltZyA9IGltZztcclxuICAgICAgICAgICAgc3QuX2xvYWRpbWcobWlwbWFwLCBsaW5lYXIpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0O1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNwcml0ZU1hdCBtYXQgPSBudWxsO1xyXG4gICAgICAgIC8v5Yib5bu66K+75Y+W5Zmo77yM5pyJ5Y+v6IO95aSx6LSlXHJcbiAgICAgICAgcHVibGljIHRleFJlYWRlciByZWFkZXI7XHJcbiAgICAgICAgcHVibGljIHRleFJlYWRlciBnZXRSZWFkZXIoYm9vbCByZWRPbmx5KVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmVhZGVyICE9IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnJlYWRlci5ncmF5ICE9IHJlZE9ubHkpXHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5c3RlbS5FeGNlcHRpb24oXCJnZXQgcGFyYW0gZGlmZiB3aXRoIHRoaXMucmVhZGVyXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVhZGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZvcm1hdCAhPSB0ZXh0dXJlZm9ybWF0LlJHQkEpXHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3lzdGVtLkV4Y2VwdGlvbihcIm9ubHkgcmdiYSB0ZXh0dXJlIGNhbiByZWFkXCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0dXJlID09IG51bGwpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZWFkZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMucmVhZGVyID0gbmV3IHRleFJlYWRlcih0aGlzLndlYmdsLCB0aGlzLnRleHR1cmUsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCByZWRPbmx5KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGJvb2wgZGlzcG9zZWl0ID0gZmFsc2U7XHJcbiAgICAgICAgcHVibGljIHZvaWQgZGlzcG9zZSgpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0dXJlID09IG51bGwgJiYgdGhpcy5pbWcgIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcG9zZWl0ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHR1cmUgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy53ZWJnbC5EZWxldGVUZXh0dXJlKHRoaXMudGV4dHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVBvaW50W10gcG9pbnRidWYgPSB7XHJcbiAgICAgICAgICAgIG5ldyBzcHJpdGVQb2ludCgpeyB4PTAsIHk9IDAsIHo9IDAsIHI9IDAsIGc9MCwgYj0gMCwgYT0gMCwgcjI9MCwgZzI9MCwgYjI9IDAsIGEyPSAwLCB1PTAsIHY9MCB9LFxyXG4gICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnQoKXsgeD0gMCwgeT0gMCwgej0gMCwgcj0gMCwgZz0gMCwgYj0gMCwgYT0gMCwgcjI9MCwgZzI9IDAsIGIyPSAwLCBhMj0gMCwgdT0wLCB2PTAgfSxcclxuICAgICAgICAgICAgbmV3IHNwcml0ZVBvaW50KCl7IHg9MCwgeT0gMCwgej0gMCwgcj0gMCwgZz0gMCwgYj0gMCwgYT0gMCwgcjI9IDAsIGcyPSAwLCBiMj0gMCwgYTI9IDAsIHU9MCwgdj0gMCB9LFxyXG4gICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnQoKXsgeD0wLCB5PTAsIHo9MCwgcj0gMCwgZz0gMCwgYj0gMCwgYT0gMCwgcjI9IDAsIGcyPTAsIGIyPSAwLCBhMj0wLCB1PTAsIHY9IDAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3KHNwcml0ZUJhdGNoZXIgc3ByaXRlQmF0Y2hlciwgc3ByaXRlUmVjdCB1diwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVDb2xvciBjKVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIHtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBvaW50YnVmWzBdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54OyBwLnYgPSB1di55O1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzFdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54ICsgdXYudzsgcC52ID0gdXYueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlsyXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueDsgcC55ID0gcmVjdC55ICsgcmVjdC5oOyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gdXYueDsgcC52ID0gdXYueSArIHV2Lmg7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbM107XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0LnggKyByZWN0Lnc7IHAueSA9IHJlY3QueSArIHJlY3QuaDsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHV2LnggKyB1di53OyBwLnYgPSB1di55ICsgdXYuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzcHJpdGVCYXRjaGVyLnNldE1hdCh0aGlzLm1hdCk7XHJcbiAgICAgICAgICAgIHNwcml0ZUJhdGNoZXIuYWRkUmVjdCh0aGlzLnBvaW50YnVmKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3Q3VzdG9tKHNwcml0ZUJhdGNoZXIgc3ByaXRlQmF0Y2hlciwgc3ByaXRlTWF0IF9tYXQsIHNwcml0ZVJlY3QgdXYsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlQ29sb3IgYywgc3ByaXRlQ29sb3IgYzIpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBfbWF0LnRleDAgPSB0aGlzO1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMucG9pbnRidWZbMF07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0Lng7IHAueSA9IHJlY3QueTsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHV2Lng7IHAudiA9IHV2Lnk7XHJcbiAgICAgICAgICAgICAgICBwLnIgPSBjLnI7IHAuZyA9IGMuZzsgcC5iID0gYy5iOyBwLmEgPSBjLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbMV07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0LnggKyByZWN0Lnc7IHAueSA9IHJlY3QueTsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHV2LnggKyB1di53OyBwLnYgPSB1di55O1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzJdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSB1di54OyBwLnYgPSB1di55ICsgdXYuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuXHJcbiAgICAgICAgICAgICAgICBwID0gdGhpcy5wb2ludGJ1ZlszXTtcclxuICAgICAgICAgICAgICAgIHAueCA9IHJlY3QueCArIHJlY3QudzsgcC55ID0gcmVjdC55ICsgcmVjdC5oOyBwLnogPSAwO1xyXG4gICAgICAgICAgICAgICAgcC51ID0gdXYueCArIHV2Lnc7IHAudiA9IHV2LnkgKyB1di5oO1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNwcml0ZUJhdGNoZXIuc2V0TWF0KF9tYXQpO1xyXG4gICAgICAgICAgICBzcHJpdGVCYXRjaGVyLmFkZFJlY3QodGhpcy5wb2ludGJ1Zik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlIDogc3ByaXRlUmVjdFxyXG4gICAge1xyXG4gICAgICAgIC8vcHVibGljIGZsb2F0IHg7XHJcbiAgICAgICAgLy9wdWJsaWMgZmxvYXQgeTtcclxuICAgICAgICAvL3B1YmxpYyBmbG9hdCB3O1xyXG4gICAgICAgIC8vcHVibGljIGZsb2F0IGg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHhzaXplO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5c2l6ZTtcclxuICAgIH1cclxuICAgIC8vYXRsYXNcclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVBdGxhc1xyXG4gICAge1xyXG4gICAgICAgIHB1YmxpYyBXZWJHTFJlbmRlcmluZ0NvbnRleHQgd2ViZ2w7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUF0bGFzKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgc3RyaW5nIGF0bGFzdXJsID0gbnVsbCwgc3ByaXRlVGV4dHVyZSB0ZXh0dXJlID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wgPSB3ZWJnbDtcclxuICAgICAgICAgICAgaWYgKGF0bGFzdXJsID09IG51bGwpXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGxpZ2h0dG9vbC5sb2FkVG9vbC5sb2FkVGV4dChhdGxhc3VybCwgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbikgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNwcml0ZUF0bGFzIGZyb21SYXcoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdHh0LCBzcHJpdGVUZXh0dXJlIHRleHR1cmUgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHNhID0gbmV3IHNwcml0ZUF0bGFzKHdlYmdsLCBudWxsLCB0ZXh0dXJlKTtcclxuICAgICAgICAgICAgc2EuX3BhcnNlKHR4dCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2E7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgdGV4dHVyZXVybDtcclxuICAgICAgICBwdWJsaWMgaW50IHRleHR1cmV3aWR0aDtcclxuICAgICAgICBwdWJsaWMgaW50IHRleHR1cmVoZWlnaHQ7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZVRleHR1cmUgdGV4dHVyZTtcclxuICAgICAgICBwdWJsaWMgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWMuRGljdGlvbmFyeTxzdHJpbmcsIHNwcml0ZT4gc3ByaXRlcyA9IG5ldyBEaWN0aW9uYXJ5PHN0cmluZywgc3ByaXRlPigpO1xyXG4gICAgICAgIHByaXZhdGUgdm9pZCBfcGFyc2Uoc3RyaW5nIHR4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gSlNPTi5QYXJzZSh0eHQpLlRvRHluYW1pYygpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmV1cmwgPSBqc29uW1widFwiXTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJld2lkdGggPSBqc29uW1wid1wiXTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlaGVpZ2h0ID0ganNvbltcImhcIl07XHJcbiAgICAgICAgICAgIHZhciBzID0gKG9iamVjdFtdKWpzb25bXCJzXCJdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzLkxlbmd0aDsgaSsrKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3MgPSAob2JqZWN0W10pc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciByID0gbmV3IHNwcml0ZSgpOy8vbmVzc1xyXG4gICAgICAgICAgICAgICAgci54ID0gKChmbG9hdClzc1sxXSArIDAuNWYpIC8gdGhpcy50ZXh0dXJld2lkdGg7XHJcbiAgICAgICAgICAgICAgICByLnkgPSAoKGZsb2F0KXNzWzJdICsgMC41ZikgLyB0aGlzLnRleHR1cmVoZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICByLncgPSAoKGZsb2F0KXNzWzNdIC0gMWYpIC8gdGhpcy50ZXh0dXJld2lkdGg7XHJcbiAgICAgICAgICAgICAgICByLmggPSAoKGZsb2F0KXNzWzRdIC0gMWYpIC8gdGhpcy50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgci54c2l6ZSA9IChmbG9hdClzc1szXTtcclxuICAgICAgICAgICAgICAgIHIueXNpemUgPSAoZmxvYXQpc3NbNF07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZXNbKHN0cmluZylzc1swXV0gPSByO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3QnlUZXh0dXJlKHNwcml0ZUJhdGNoZXIgc2IsIHN0cmluZyBzbmFtZSwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVDb2xvciBjKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dHVyZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5zcHJpdGVzW3NuYW1lXTtcclxuICAgICAgICAgICAgaWYgKHIgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlLmRyYXcoc2IsIHIsIHJlY3QsIGMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy9mb250XHJcbiAgICBwdWJsaWMgY2xhc3MgY2hhcmluZm9cclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeDsvL3V2XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHk7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHc7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHhTaXplO1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5U2l6ZTtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgeE9mZnNldDsvL+WBj+enu1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB5T2Zmc2V0O1xyXG4gICAgICAgIHB1YmxpYyBmbG9hdCB4QWRkdmFuY2U7Ly/lrZfnrKblrr3luqZcclxuICAgIH1cclxuICAgIHB1YmxpYyBjbGFzcyBzcHJpdGVGb250XHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbDtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlVGV4dHVyZSB0ZXh0dXJlO1xyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVNYXQgbWF0O1xyXG5cclxuICAgICAgICBwdWJsaWMgZHluYW1pYyBjbWFwO1xyXG4gICAgICAgIHB1YmxpYyBzdHJpbmcgZm9udG5hbWU7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IHBvaW50U2l6ZTsvL+WDj+e0oOWwuuWvuFxyXG4gICAgICAgIHB1YmxpYyBmbG9hdCBwYWRkaW5nOy8v6Ze06ZqUXHJcbiAgICAgICAgcHVibGljIGZsb2F0IGxpbmVIZWlnaHQ7Ly/ooYzpq5hcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYmFzZWxpbmU7Ly/ln7rnur9cclxuICAgICAgICBwdWJsaWMgZmxvYXQgYXRsYXNXaWR0aDtcclxuICAgICAgICBwdWJsaWMgZmxvYXQgYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgcHVibGljIHNwcml0ZUZvbnQoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdXJsY29uZmlnLCBzcHJpdGVUZXh0dXJlIHRleHR1cmUpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0aGlzLndlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgIGlmICh1cmxjb25maWcgIT0gbnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbGlnaHR0b29sLmxvYWRUb29sLmxvYWRUZXh0KHVybGNvbmZpZywgKGdsb2JhbDo6U3lzdGVtLkFjdGlvbjxzdHJpbmcsIGdsb2JhbDo6QnJpZGdlLkVycm9yPikoKHR4dCwgZXJyKSA9PlxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhcnNlKHR4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbikgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgICAgICAgICB0aGlzLm1hdCA9IG5ldyBzcHJpdGVNYXQoKTsvL25lc3NcclxuICAgICAgICAgICAgdGhpcy5tYXQuc2hhZGVyID0gXCJzcHJpdGVmb250XCI7XHJcbiAgICAgICAgICAgIHRoaXMubWF0LnRleDAgPSB0aGlzLnRleHR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMubWF0LnRyYW5zcGFyZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzcHJpdGVGb250IGZyb21SYXcoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBzdHJpbmcgdHh0LCBzcHJpdGVUZXh0dXJlIHRleHR1cmUgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdmFyIHNmID0gbmV3IHNwcml0ZUZvbnQod2ViZ2wsIG51bGwsIHRleHR1cmUpO1xyXG4gICAgICAgICAgICBzZi5fcGFyc2UodHh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHNmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBfcGFyc2Uoc3RyaW5nIHR4dClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBkMSA9IG5ldyBEYXRlKCkuVmFsdWVPZigpO1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IEpTT04uUGFyc2UodHh0KTtcclxuXHJcbiAgICAgICAgICAgIC8vcGFyc2UgZm9udGluZm9cclxuICAgICAgICAgICAgdmFyIGZvbnQgPSAob2JqZWN0W10panNvbltcImZvbnRcIl07XHJcbiAgICAgICAgICAgIHRoaXMuZm9udG5hbWUgPSAoc3RyaW5nKWZvbnRbMF07XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRTaXplID0gKGZsb2F0KWZvbnRbMV07XHJcbiAgICAgICAgICAgIHRoaXMucGFkZGluZyA9IChmbG9hdClmb250WzJdO1xyXG4gICAgICAgICAgICB0aGlzLmxpbmVIZWlnaHQgPSAoZmxvYXQpZm9udFszXTtcclxuICAgICAgICAgICAgdGhpcy5iYXNlbGluZSA9IChmbG9hdClmb250WzRdO1xyXG4gICAgICAgICAgICB0aGlzLmF0bGFzV2lkdGggPSAoZmxvYXQpZm9udFs1XTtcclxuICAgICAgICAgICAgdGhpcy5hdGxhc0hlaWdodCA9IChmbG9hdClmb250WzZdO1xyXG5cclxuICAgICAgICAgICAgLy9wYXJzZSBjaGFyIG1hcFxyXG4gICAgICAgICAgICB0aGlzLmNtYXAgPSBuZXcgb2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHZhciBtYXAgPSBqc29uW1wibWFwXCJdO1xyXG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgYyBpbiBTY3JpcHQuR2V0T3duUHJvcGVydHlOYW1lcyhtYXApKVxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmluZm8gPSBuZXcgY2hhcmluZm8oKTsvL25lc3NcclxuICAgICAgICAgICAgICAgIHRoaXMuY21hcFtjXSA9IGZpbmZvO1xyXG4gICAgICAgICAgICAgICAgZmluZm8ueCA9IG1hcFtjXS5BczxmbG9hdFtdPigpWzBdIC8gdGhpcy5hdGxhc1dpZHRoO1xyXG4gICAgICAgICAgICAgICAgZmluZm8ueSA9IG1hcFtjXS5BczxmbG9hdFtdPigpWzFdIC8gdGhpcy5hdGxhc0hlaWdodDtcclxuICAgICAgICAgICAgICAgIGZpbmZvLncgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVsyXSAvIHRoaXMuYXRsYXNXaWR0aDtcclxuICAgICAgICAgICAgICAgIGZpbmZvLmggPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVszXSAvIHRoaXMuYXRsYXNIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBmaW5mby54U2l6ZSA9IG1hcFtjXS5BczxmbG9hdFtdPigpWzJdO1xyXG4gICAgICAgICAgICAgICAgZmluZm8ueVNpemUgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVszXTtcclxuICAgICAgICAgICAgICAgIGZpbmZvLnhPZmZzZXQgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVs0XTtcclxuICAgICAgICAgICAgICAgIGZpbmZvLnlPZmZzZXQgPSBtYXBbY10uQXM8ZmxvYXRbXT4oKVs1XTtcclxuICAgICAgICAgICAgICAgIGZpbmZvLnhBZGR2YW5jZSA9IG1hcFtjXS5BczxmbG9hdFtdPigpWzZdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1hcCA9IG51bGw7XHJcbiAgICAgICAgICAgIGpzb24gPSBudWxsO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBkMiA9IG5ldyBEYXRlKCkuVmFsdWVPZigpO1xyXG4gICAgICAgICAgICB2YXIgbiA9IGQyIC0gZDE7XHJcbiAgICAgICAgICAgIENvbnNvbGUuV3JpdGVMaW5lKFwianNvbiB0aW1lPVwiICsgbik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzcHJpdGVQb2ludFtdIHBvaW50YnVmID0ge1xyXG4gICAgICAgICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnQgIHsgeD0wLCB5PSAwLCB6PSAwLCByPSAwLCBnPTAsIGI9MCwgYT0wLCByMj0wLCBnMj0gMCwgYjI9MCwgYTI9MCwgdT0wLHYgPSAwIH0sXHJcbiAgICAgICAgICAgICBuZXcgc3ByaXRlUG9pbnR7IHg9IDAsIHk9MCwgej0wLCByPTAsIGc9IDAsIGI9IDAsIGE9MCwgcjI9MCwgZzI9IDAsIGIyPSAwLCBhMj0wLCB1PTAsIHY9IDAgfSxcclxuICAgICAgICAgICAgIG5ldyBzcHJpdGVQb2ludHsgeD0gMCwgeT0gMCwgej0gMCwgcj0gMCwgZz0gMCwgYj0gMCwgYT0gMCwgcjI9IDAsIGcyPSAwLCBiMj0gMCwgYTI9IDAsIHU9IDAsIHY9IDAgfSxcclxuICAgICAgICAgICAgIG5ldyBzcHJpdGVQb2ludHsgeD0gMCwgeT0gMCwgej0wLCByPSAwLCBnPTAsIGI9IDAsIGE9IDAsIHIyPSAwLCBnMj0gMCwgYjI9MCwgYTI9IDAsIHU9IDAsIHY9IDAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXcoc3ByaXRlQmF0Y2hlciBzYiwgY2hhcmluZm8gciwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVDb2xvciBjID0gbnVsbCwgc3ByaXRlQ29sb3IgY29sb3JCb3JkZXIgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKGMgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGMgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yQm9yZGVyID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICBjb2xvckJvcmRlciA9IG5ldyBzcHJpdGVDb2xvcigwZiwgMGYsIDBmLCAwLjVmKTtcclxuICAgICAgICAgICAgLy9pZiAocj09bnVsbClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIHAgPSB0aGlzLnBvaW50YnVmWzBdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLng7IHAudiA9IHIueSArIHIuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzFdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0LnkgKyByZWN0Lmg7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLnggKyByLnc7IHAudiA9IHIueSArIHIuaDtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzJdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLng7IHAudiA9IHIueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG5cclxuICAgICAgICAgICAgICAgIHAgPSB0aGlzLnBvaW50YnVmWzNdO1xyXG4gICAgICAgICAgICAgICAgcC54ID0gcmVjdC54ICsgcmVjdC53OyBwLnkgPSByZWN0Lnk7IHAueiA9IDA7XHJcbiAgICAgICAgICAgICAgICBwLnUgPSByLnggKyByLnc7IHAudiA9IHIueTtcclxuICAgICAgICAgICAgICAgIHAuciA9IGMucjsgcC5nID0gYy5nOyBwLmIgPSBjLmI7IHAuYSA9IGMuYTtcclxuICAgICAgICAgICAgICAgIHAucjIgPSBjb2xvckJvcmRlci5yOyBwLmcyID0gY29sb3JCb3JkZXIuZzsgcC5iMiA9IGNvbG9yQm9yZGVyLmI7IHAuYTIgPSBjb2xvckJvcmRlci5hO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNiLnNldE1hdCh0aGlzLm1hdCk7XHJcbiAgICAgICAgICAgIHNiLmFkZFJlY3QodGhpcy5wb2ludGJ1Zik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3Q2hhcihzcHJpdGVCYXRjaGVyIHNiLCBzdHJpbmcgY25hbWUsIHNwcml0ZVJlY3QgcmVjdCwgc3ByaXRlQ29sb3IgYyA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yQm9yZGVyID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciByID0gdGhpcy5jbWFwW2NuYW1lXTtcclxuICAgICAgICAgICAgaWYgKHIgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoYyA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgYyA9IHNwcml0ZUNvbG9yLndoaXRlO1xyXG4gICAgICAgICAgICBpZiAoY29sb3JCb3JkZXIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yQm9yZGVyID0gbmV3IHNwcml0ZUNvbG9yKDBmLCAwZiwgMGYsIDAuNWYpO1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcCA9IHRoaXMucG9pbnRidWZbMF07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0Lng7IHAueSA9IHJlY3QueTsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHIueDsgcC52ID0gci55O1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG4gICAgICAgICAgICAgICAgcC5yMiA9IGNvbG9yQm9yZGVyLnI7IHAuZzIgPSBjb2xvckJvcmRlci5nOyBwLmIyID0gY29sb3JCb3JkZXIuYjsgcC5hMiA9IGNvbG9yQm9yZGVyLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbMV07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0LnggKyByZWN0Lnc7IHAueSA9IHJlY3QueTsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHIueCArIHIudzsgcC52ID0gci55O1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG4gICAgICAgICAgICAgICAgcC5yMiA9IGNvbG9yQm9yZGVyLnI7IHAuZzIgPSBjb2xvckJvcmRlci5nOyBwLmIyID0gY29sb3JCb3JkZXIuYjsgcC5hMiA9IGNvbG9yQm9yZGVyLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbMl07XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0Lng7IHAueSA9IHJlY3QueSArIHJlY3QuaDsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHIueDsgcC52ID0gci55ICsgci5oO1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG4gICAgICAgICAgICAgICAgcC5yMiA9IGNvbG9yQm9yZGVyLnI7IHAuZzIgPSBjb2xvckJvcmRlci5nOyBwLmIyID0gY29sb3JCb3JkZXIuYjsgcC5hMiA9IGNvbG9yQm9yZGVyLmE7XHJcblxyXG4gICAgICAgICAgICAgICAgcCA9IHRoaXMucG9pbnRidWZbM107XHJcbiAgICAgICAgICAgICAgICBwLnggPSByZWN0LnggKyByZWN0Lnc7IHAueSA9IHJlY3QueSArIHJlY3QuaDsgcC56ID0gMDtcclxuICAgICAgICAgICAgICAgIHAudSA9IHIueCArIHIudzsgcC52ID0gci55ICsgci5oO1xyXG4gICAgICAgICAgICAgICAgcC5yID0gYy5yOyBwLmcgPSBjLmc7IHAuYiA9IGMuYjsgcC5hID0gYy5hO1xyXG4gICAgICAgICAgICAgICAgcC5yMiA9IGNvbG9yQm9yZGVyLnI7IHAuZzIgPSBjb2xvckJvcmRlci5nOyBwLmIyID0gY29sb3JCb3JkZXIuYjsgcC5hMiA9IGNvbG9yQm9yZGVyLmE7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHNiLnNldE1hdCh0aGlzLm1hdCk7XHJcbiAgICAgICAgICAgIHNiLmFkZFJlY3QodGhpcy5wb2ludGJ1Zik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwidXNpbmcgU3lzdGVtO1xyXG51c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLldlYkdMO1xyXG5cclxubmFtZXNwYWNlIGxpZ2h0dG9vbC5OYXRpdmVcclxue1xyXG4gICAgcHVibGljIGNsYXNzIGNhbnZhc0FkYXB0ZXJcclxuICAgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNwcml0ZUNhbnZhcyBDcmVhdGVTY3JlZW5DYW52YXMoV2ViR0xSZW5kZXJpbmdDb250ZXh0IHdlYmdsLCBjYW52YXNBY3Rpb24gdXNlcmFjdGlvbilcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IHdlYmdsLkNhbnZhcztcclxuICAgICAgICAgICAgZWwuV2lkdGggPSBlbC5DbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgZWwuSGVpZ2h0ID0gZWwuQ2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgdmFyIGMgPSBuZXcgc3ByaXRlQ2FudmFzKHdlYmdsLCB3ZWJnbC5EcmF3aW5nQnVmZmVyV2lkdGgsIHdlYmdsLkRyYXdpbmdCdWZmZXJIZWlnaHQpO1xyXG4gICAgICAgICAgICAvL3ZhciBhc3AgPSByYW5nZS53aWR0aCAvIHJhbmdlLmhlaWdodDtcclxuICAgICAgICAgICAgYy5zcHJpdGVCYXRjaGVyLm1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkobmV3IGZsb2F0W10ge1xyXG4gICAgICAgICAgICAgICAgICAgIDEuMGYgKiAyIC8gYy53aWR0aCwgMCwgMCwgMCwvL+WOu+aOiWFzcOeahOW9seWTjVxyXG4gICAgICAgICAgICAgICAgICAgIDAsIDEgKiAtMSAqIDIgLyBjLmhlaWdodCwgMCwgMCxcclxuICAgICAgICAgICAgICAgICAgICAwLCAwLCAxLCAwLFxyXG4gICAgICAgICAgICAgICAgICAgIC0xLCAxLCAwLCAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjLnNwcml0ZUJhdGNoZXIuenRlc3QgPSBmYWxzZTsvL+acgOWJjeS4jemcgOimgXp0ZXN0XHJcblxyXG4gICAgICAgICAgICB2YXIgdWEgPSB1c2VyYWN0aW9uO1xyXG4gICAgICAgICAgICBCcmlkZ2UuSHRtbDUuV2luZG93LlNldEludGVydmFsKChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+XHJcbiAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgIHdlYmdsLlZpZXdwb3J0KDAsIDAsIHdlYmdsLkRyYXdpbmdCdWZmZXJXaWR0aCwgd2ViZ2wuRHJhd2luZ0J1ZmZlckhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICB3ZWJnbC5DbGVhcih3ZWJnbC5DT0xPUl9CVUZGRVJfQklUIHwgd2ViZ2wuREVQVEhfQlVGRkVSX0JJVCk7XHJcbiAgICAgICAgICAgICAgICAgICB3ZWJnbC5DbGVhckNvbG9yKDEuMCwgMC4wLCAxLjAsIDEuMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgYy5zcHJpdGVCYXRjaGVyLmJlZ2luZHJhdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIHVhLm9uZHJhdyhjKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICBjLnNwcml0ZUJhdGNoZXIuZW5kZHJhdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgIGR5bmFtaWMgX3dlYmdsID0gd2ViZ2w7XHJcbiAgICAgICAgICAgICAgICAgICBfd2ViZ2wuZmx1c2goKTtcclxuICAgICAgICAgICAgICAgICAgIC8vd2ViZ2wuRmx1c2goKTtcclxuXHJcbiAgICAgICAgICAgICAgIH0pLCAyMCk7XHJcbiAgICAgICAgICAgIFdpbmRvdy5BZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIChnbG9iYWw6OlN5c3RlbS5BY3Rpb24pKCgpID0+XHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWwgPSB3ZWJnbC5DYW52YXM7XHJcbiAgICAgICAgICAgICAgICBzZWwuV2lkdGggPSBzZWwuQ2xpZW50V2lkdGg7XHJcbiAgICAgICAgICAgICAgICBzZWwuSGVpZ2h0ID0gc2VsLkNsaWVudEhlaWdodDtcclxuICAgICAgICAgICAgICAgIHNlbC5XaWR0aCA9IHNlbC5DbGllbnRXaWR0aDtcclxuICAgICAgICAgICAgICAgIHNlbC5IZWlnaHQgPSBzZWwuQ2xpZW50SGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGMud2lkdGggPSBzZWwuV2lkdGg7XHJcbiAgICAgICAgICAgICAgICBjLmhlaWdodCA9IHNlbC5IZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBjLnNwcml0ZUJhdGNoZXIubWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShuZXcgZmxvYXRbXXtcclxuICAgICAgICAgICAgICAgIDEuMGYgKiAyIC8gYy53aWR0aCwgMCwgMCwgMCwvL+WOu+aOiWFzcOeahOW9seWTjVxyXG4gICAgICAgICAgICAgICAgMCwgMS4wZiAqIC0xICogMiAvIGMuaGVpZ2h0LCAwLCAwLFxyXG4gICAgICAgICAgICAgICAgMCwgMCwgMSwgMCxcclxuICAgICAgICAgICAgICAgIC0xLCAxLCAwLCAxXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8vL2RvIHJlc2l6ZSBmdW5jXHJcbiAgICAgICAgICAgICAgICB1YS5vbnJlc2l6ZShjKTtcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIGVsLk9uTW91c2VNb3ZlID0gKGV2KSA9PlxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB1YS5vbnBvaW50ZXZlbnQoYywgY2FudmFzcG9pbnRldmVudC5QT0lOVF9NT1ZFLChmbG9hdCkgZXZbXCJvZmZzZXRYXCJdLCAoZmxvYXQpZXZbXCJvZmZzZXRZXCJdKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZWwuT25Nb3VzZVVwID0gKCBNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50PiBldikgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdWEub25wb2ludGV2ZW50KGMsIGNhbnZhc3BvaW50ZXZlbnQuUE9JTlRfVVAsIChmbG9hdClldltcIm9mZnNldFhcIl0sIChmbG9hdClldltcIm9mZnNldFlcIl0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBlbC5Pbk1vdXNlRG93biA9IChNb3VzZUV2ZW50PEhUTUxDYW52YXNFbGVtZW50PiBldikgPT5cclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdWEub25wb2ludGV2ZW50KGMsIGNhbnZhc3BvaW50ZXZlbnQuUE9JTlRfRE9XTiwgKGZsb2F0KWV2W1wib2Zmc2V0WFwiXSwgKGZsb2F0KWV2W1wib2Zmc2V0WVwiXSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vc2NlbmUub25Qb2ludGVyT2JzZXJ2YWJsZS5hZGQoKHBpbmZvOiBCQUJZTE9OLlBvaW50ZXJJbmZvLCBzdGF0ZTogQkFCWUxPTi5FdmVudFN0YXRlKSA9PlxyXG4gICAgICAgICAgICAvL3tcclxuICAgICAgICAgICAgLy8gICAgdmFyIHJhbmdlID0gc2NlbmUuZ2V0RW5naW5lKCkuZ2V0UmVuZGVyaW5nQ2FudmFzQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAvLyAgICAvL+i+k+WFpVxyXG4gICAgICAgICAgICAvLyAgICB2YXIgZTogbGlnaHR0b29sLmNhbnZhc3BvaW50ZXZlbnQgPSBsaWdodHRvb2wuY2FudmFzcG9pbnRldmVudC5OT05FO1xyXG4gICAgICAgICAgICAvLyAgICBpZiAocGluZm8udHlwZSA9PSBCQUJZTE9OLlBvaW50ZXJFdmVudFR5cGVzLlBPSU5URVJET1dOKVxyXG4gICAgICAgICAgICAvLyAgICAgICAgZSA9IGxpZ2h0dG9vbC5jYW52YXNwb2ludGV2ZW50LlBPSU5UX0RPV047XHJcbiAgICAgICAgICAgIC8vICAgIGlmIChwaW5mby50eXBlID09IEJBQllMT04uUG9pbnRlckV2ZW50VHlwZXMuUE9JTlRFUk1PVkUpXHJcbiAgICAgICAgICAgIC8vICAgICAgICBlID0gbGlnaHR0b29sLmNhbnZhc3BvaW50ZXZlbnQuUE9JTlRfTU9WRTtcclxuICAgICAgICAgICAgLy8gICAgaWYgKHBpbmZvLnR5cGUgPT0gQkFCWUxPTi5Qb2ludGVyRXZlbnRUeXBlcy5QT0lOVEVSVVApXHJcbiAgICAgICAgICAgIC8vICAgICAgICBlID0gbGlnaHR0b29sLmNhbnZhc3BvaW50ZXZlbnQuUE9JTlRfVVA7XHJcblxyXG4gICAgICAgICAgICAvLyAgICAvL+e8qeaUvuWIsGNhbnZhcyBzaXplXHJcbiAgICAgICAgICAgIC8vICAgIHZhciB4ID0gcGluZm8uZXZlbnQub2Zmc2V0WCAvIHJhbmdlLndpZHRoICogYy53aWR0aDtcclxuICAgICAgICAgICAgLy8gICAgdmFyIHkgPSBwaW5mby5ldmVudC5vZmZzZXRZIC8gcmFuZ2UuaGVpZ2h0ICogYy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAvLyAgICB2YXIgc2tpcDogYm9vbGVhbiA9IHVhLm9ucG9pbnRldmVudChjLCBlLCB4LCB5KTtcclxuICAgICAgICAgICAgLy8gICAgLy/lr7kgYmFieWxvbu+8jOadpeivtCAyZOWcqOi/memHjOi+k+WFpe+8jDNkIOimgSBwaWNrIOS7peWQjuWSr1xyXG5cclxuICAgICAgICAgICAgLy8gICAgc3RhdGUuc2tpcE5leHRPYnNlcnZlcnMgPSBza2lwOy8v5piv5ZCm5Lit5pat5LqL5Lu2XHJcbiAgICAgICAgICAgIC8vfVxyXG4gICAgICAgICAgICAvLyk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgIH1cclxuXHJcbn0iLCJ1c2luZyBCcmlkZ2U7XHJcbnVzaW5nIEJyaWRnZS5IdG1sNTtcclxudXNpbmcgQnJpZGdlLldlYkdMO1xyXG4vL3YwLjZcclxubmFtZXNwYWNlIGxpZ2h0dG9vbFxyXG57XHJcbiAgICBwdWJsaWMgZW51bSBjYW52YXNwb2ludGV2ZW50XHJcbiAgICB7XHJcbiAgICAgICAgTk9ORSxcclxuICAgICAgICBQT0lOVF9ET1dOLFxyXG4gICAgICAgIFBPSU5UX1VQLFxyXG4gICAgICAgIFBPSU5UX01PVkUsXHJcbiAgICB9XHJcbiAgICBwdWJsaWMgaW50ZXJmYWNlIGNhbnZhc0FjdGlvblxyXG4gICAge1xyXG4gICAgICAgIC8vcmVzaXplIOS6i+S7tlxyXG4gICAgICAgIHZvaWQgb25yZXNpemUoc3ByaXRlQ2FudmFzIGMpO1xyXG4gICAgICAgIHZvaWQgb25kcmF3KHNwcml0ZUNhbnZhcyBjKTtcclxuICAgICAgICBib29sIG9ucG9pbnRldmVudChzcHJpdGVDYW52YXMgYywgY2FudmFzcG9pbnRldmVudCBlLCBmbG9hdCB4LCBmbG9hdCB5ayk7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgY2xhc3Mgc3ByaXRlQ2FudmFzXHJcbiAgICB7XHJcbiAgICAgICAgcHVibGljIFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbDtcclxuICAgICAgICAvL3BhbmVsIHNpemVcclxuICAgICAgICBwdWJsaWMgZmxvYXQgd2lkdGg7XHJcbiAgICAgICAgcHVibGljIGZsb2F0IGhlaWdodDtcclxuICAgICAgICBwdWJsaWMgc3ByaXRlQ2FudmFzKFdlYkdMUmVuZGVyaW5nQ29udGV4dCB3ZWJnbCwgZmxvYXQgd2lkdGgsIGZsb2F0IGhlaWdodClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHRoaXMud2ViZ2wgPSB3ZWJnbDtcclxuICAgICAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLmhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVCYXRjaGVyID0gbmV3IHNwcml0ZUJhdGNoZXIod2ViZ2wsIGxpZ2h0dG9vbC5zaGFkZXJNZ3IucGFyc2VySW5zdGFuY2UoKSk7Ly9uZXNzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzcHJpdGVCYXRjaGVyIHNwcml0ZUJhdGNoZXI7XHJcblxyXG4gICAgICAgIC8vZHJhdyB0b29sc1xyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdUZXh0dXJlKHNwcml0ZVRleHR1cmUgdGV4dHVyZSwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVSZWN0IHV2cmVjdCA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmICh1dnJlY3QgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIHV2cmVjdCA9IHNwcml0ZVJlY3Qub25lO1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHV2cmVjdCwgcmVjdCwgY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3VGV4dHVyZUN1c3RvbShzcHJpdGVUZXh0dXJlIHRleHR1cmUsIHNwcml0ZU1hdCBfbWF0LCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZVJlY3QgdXZyZWN0ID0gbnVsbCwgc3ByaXRlQ29sb3IgY29sb3IgPSBudWxsLCBzcHJpdGVDb2xvciBjb2xvcjIgPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWYgKHV2cmVjdCA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgdXZyZWN0ID0gc3ByaXRlUmVjdC5vbmU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yMiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IyID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHV2cmVjdCwgcmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGUoc3RyaW5nIGF0bGFzLCBzdHJpbmcgc3ByaXRlLCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUNvbG9yIGNvbG9yID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgciA9IGEuc3ByaXRlc1tzcHJpdGVdO1xyXG4gICAgICAgICAgICBpZiAociA9PSBTY3JpcHQuVW5kZWZpbmVkKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChhLnRleHR1cmUgPT0gbnVsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCByLCByZWN0LCBjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGVDdXN0b20oc3RyaW5nIGF0bGFzLCBzdHJpbmcgc3ByaXRlLCBzcHJpdGVNYXQgX21hdCwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yMiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvcjIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yMiA9IHNwcml0ZUNvbG9yLndoaXRlO1xyXG4gICAgICAgICAgICB2YXIgYSA9IGF0bGFzTWdyLkluc3RhbmNlKCkubG9hZCh0aGlzLndlYmdsLCBhdGxhcyk7XHJcbiAgICAgICAgICAgIGlmIChhID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHIgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKHIgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoYS50ZXh0dXJlID09IG51bGwpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3Q3VzdG9tKHRoaXMuc3ByaXRlQmF0Y2hlciwgX21hdCwgciwgcmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdTcHJpdGU5KHN0cmluZyBhdGxhcywgc3RyaW5nIHNwcml0ZSwgc3ByaXRlUmVjdCByZWN0LCBzcHJpdGVCb3JkZXIgYm9yZGVyLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgX3IgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKF9yID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBsID0gKGJvcmRlci5sIC0gMSkgLyBhLnRleHR1cmV3aWR0aDtcclxuICAgICAgICAgICAgdmFyIHIgPSAoYm9yZGVyLnIgLSAxKSAvIGEudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdCA9IChib3JkZXIudCAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYiA9IChib3JkZXIuYiAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAvL2xlZnQgdG9wXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG5cclxuICAgICAgICAgICAgLy90b3BcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IF9yLncgLSByIC0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IHQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0IHRvcFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIF9yLncgLSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgcmVjdC53IC0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueTtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci50O1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vbGVmdFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vY2VudGVyXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gX3IudyAtIHIgLSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gX3IuaCAtIHQgLSBiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueSArIGJvcmRlci50O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcbiAgICAgICAgICAgIC8vcmlnaHRcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgKyBib3JkZXIudDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IHJlY3QuaCAtIGJvcmRlci50IC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3KHRoaXMuc3ByaXRlQmF0Y2hlciwgdGhpcy51dnJlY3QsIHRoaXMudHJlY3QsIGNvbG9yKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGVmdCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLng7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL2JvdHRvbVxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBfci53IC0gciAtIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBiO1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueSA9IHJlY3QueSArIHJlY3QuaCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LncgPSByZWN0LncgLSBib3JkZXIuciAtIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXcodGhpcy5zcHJpdGVCYXRjaGVyLCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0IGJvdHRvbVxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIF9yLncgLSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IuaCArIF9yLnkgLSBiO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IGI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgKyByZWN0LmggLSBib3JkZXIuYjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gYm9yZGVyLnI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhdyh0aGlzLnNwcml0ZUJhdGNoZXIsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvcik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdm9pZCBkcmF3U3ByaXRlOUN1c3RvbShzdHJpbmcgYXRsYXMsIHN0cmluZyBzcHJpdGUsIHNwcml0ZU1hdCBfbWF0LCBzcHJpdGVSZWN0IHJlY3QsIHNwcml0ZUJvcmRlciBib3JkZXIsIHNwcml0ZUNvbG9yIGNvbG9yID0gbnVsbCwgc3ByaXRlQ29sb3IgY29sb3IyID0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlmIChjb2xvciA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IgPSBzcHJpdGVDb2xvci53aGl0ZTtcclxuICAgICAgICAgICAgaWYgKGNvbG9yMiA9PSBudWxsKVxyXG4gICAgICAgICAgICAgICAgY29sb3IyID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIHZhciBhID0gYXRsYXNNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGF0bGFzKTtcclxuICAgICAgICAgICAgaWYgKGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgX3IgPSBhLnNwcml0ZXNbc3ByaXRlXTtcclxuICAgICAgICAgICAgaWYgKF9yID09IFNjcmlwdC5VbmRlZmluZWQpIHJldHVybjtcclxuXHJcbiAgICAgICAgICAgIHZhciBsID0gKGJvcmRlci5sIC0gMSkgLyBhLnRleHR1cmV3aWR0aDtcclxuICAgICAgICAgICAgdmFyIHIgPSAoYm9yZGVyLnIgLSAxKSAvIGEudGV4dHVyZXdpZHRoO1xyXG4gICAgICAgICAgICB2YXIgdCA9IChib3JkZXIudCAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICB2YXIgYiA9IChib3JkZXIuYiAtIDEpIC8gYS50ZXh0dXJlaGVpZ2h0O1xyXG4gICAgICAgICAgICAvL2xlZnQgdG9wXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueTtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSB0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54O1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcblxyXG4gICAgICAgICAgICAvL3RvcFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueCArIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci55O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gX3IudyAtIHIgLSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci50O1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9yaWdodCB0b3BcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnk7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSByO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueCArIHJlY3QudyAtIGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0Lnk7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIudDtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgICAgIC8vbGVmdFxyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC54ID0gX3IueDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLnkgKyB0O1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC53ID0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IF9yLmggLSB0IC0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9jZW50ZXJcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC55ID0gX3IueSArIHQ7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBfci53IC0gciAtIGw7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBfci5oIC0gdCAtIGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IHJlY3QuaCAtIGJvcmRlci50IC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIGEudGV4dHVyZS5kcmF3Q3VzdG9tKHRoaXMuc3ByaXRlQmF0Y2hlciwgX21hdCwgdGhpcy51dnJlY3QsIHRoaXMudHJlY3QsIGNvbG9yLCBjb2xvcjIpO1xyXG4gICAgICAgICAgICAvL3JpZ2h0XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgX3IudyAtIHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci55ICsgdDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBfci5oIC0gdCAtIGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyByZWN0LncgLSBib3JkZXIucjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgYm9yZGVyLnQ7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSByZWN0LmggLSBib3JkZXIudCAtIGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuXHJcbiAgICAgICAgICAgIC8vbGVmdCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLng7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnkgPSBfci5oICsgX3IueSAtIGI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LncgPSBsO1xyXG4gICAgICAgICAgICB0aGlzLnV2cmVjdC5oID0gYjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QueCA9IHJlY3QueDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5sO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcbiAgICAgICAgICAgIC8vYm90dG9tXHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LnggPSBfci54ICsgbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLmggKyBfci55IC0gYjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IF9yLncgLSByIC0gbDtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QuaCA9IGI7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyBib3JkZXIubDtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IHJlY3QudyAtIGJvcmRlci5yIC0gYm9yZGVyLmw7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QuaCA9IGJvcmRlci5iO1xyXG4gICAgICAgICAgICBhLnRleHR1cmUuZHJhd0N1c3RvbSh0aGlzLnNwcml0ZUJhdGNoZXIsIF9tYXQsIHRoaXMudXZyZWN0LCB0aGlzLnRyZWN0LCBjb2xvciwgY29sb3IyKTtcclxuICAgICAgICAgICAgLy9yaWdodCBib3R0b21cclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueCA9IF9yLnggKyBfci53IC0gcjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QueSA9IF9yLmggKyBfci55IC0gYjtcclxuICAgICAgICAgICAgdGhpcy51dnJlY3QudyA9IHI7XHJcbiAgICAgICAgICAgIHRoaXMudXZyZWN0LmggPSBiO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LnggPSByZWN0LnggKyByZWN0LncgLSBib3JkZXIucjtcclxuICAgICAgICAgICAgdGhpcy50cmVjdC55ID0gcmVjdC55ICsgcmVjdC5oIC0gYm9yZGVyLmI7XHJcbiAgICAgICAgICAgIHRoaXMudHJlY3QudyA9IGJvcmRlci5yO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWN0LmggPSBib3JkZXIuYjtcclxuICAgICAgICAgICAgYS50ZXh0dXJlLmRyYXdDdXN0b20odGhpcy5zcHJpdGVCYXRjaGVyLCBfbWF0LCB0aGlzLnV2cmVjdCwgdGhpcy50cmVjdCwgY29sb3IsIGNvbG9yMik7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBzcHJpdGVSZWN0IHV2cmVjdCA9IG5ldyBzcHJpdGVSZWN0KCk7XHJcblxyXG4gICAgICAgIHNwcml0ZVJlY3QgdHJlY3QgPSBuZXcgc3ByaXRlUmVjdCgpOy8vbmVzc1xyXG5cclxuICAgICAgICAvL+e7mOWItuWtl+S9k++8jOWPqueUu+S4gOihjO+8jOWtl+S9k+ayv+edgOW3puS4iuinkuWvuem9kO+8jOWmgumcgOWFtuS7lu+8jOWPguiAg+a6kOeggeiHquWItlxyXG4gICAgICAgIHB1YmxpYyB2b2lkIGRyYXdUZXh0KHN0cmluZyBmb250ICwgc3RyaW5nIHRleHQgLCBzcHJpdGVSZWN0IHJlY3QgLCBzcHJpdGVDb2xvciBjb2xvciA9IG51bGwsIHNwcml0ZUNvbG9yIGNvbG9yMiA9IG51bGwpXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZiAoY29sb3IgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yID0gc3ByaXRlQ29sb3Iud2hpdGU7XHJcbiAgICAgICAgICAgIGlmIChjb2xvcjIgPT0gbnVsbClcclxuICAgICAgICAgICAgICAgIGNvbG9yMiA9IHNwcml0ZUNvbG9yLmJsYWNrO1xyXG4gICAgICAgICAgICB2YXIgZiA9IGZvbnRNZ3IuSW5zdGFuY2UoKS5sb2FkKHRoaXMud2ViZ2wsIGZvbnQpO1xyXG4gICAgICAgICAgICBpZiAoZiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChmLmNtYXAgPT0gU2NyaXB0LlVuZGVmaW5lZCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgeGFkZCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGV4dC5MZW5ndGg7IGkrKylcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSB0ZXh0LkNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHZhciBjaW5mbyA9IGYuY21hcFtjXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaW5mbyA9PSBTY3JpcHQuVW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHMgPSByZWN0LmggLyBmLmxpbmVIZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC54ID0gcmVjdC54ICsgeGFkZCArIGNpbmZvLnhPZmZzZXQgKiBzOy8veGFkZCDmqKrnp7vvvIxjaW5mby54T2Zmc2V0ICogcyDlgY/np7tcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRyZWN0LnkgPSByZWN0LnkgLSBjaW5mby55T2Zmc2V0ICogcyArIGYuYmFzZWxpbmUgKiBzO1xyXG4gICAgICAgICAgICAgICAgLy9jaW5mby55T2Zmc2V0ICogcyDlgY/np7tcclxuICAgICAgICAgICAgICAgIC8vZi5iYXNlbGluZSAqIHPlrZfkvZPln7rnur/vvIzkuI3nrqHlrZfkvZPln7rnur/lrZfkvZPnmoTpm7bpm7bngrnlnKjlrZfkvZPlt6bkuIvop5LvvIznjrDlnKjpnIDopoHlt6bkuIrohJrvvIzpnIDopoHlhbbku5blr7npvZDmlrnlvI/lj6bor7RcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC5oID0gcyAqIGNpbmZvLnlTaXplO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50cmVjdC53ID0gcyAqIGNpbmZvLnhTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIHhhZGQgKz0gY2luZm8ueEFkZHZhbmNlICogcztcclxuICAgICAgICAgICAgICAgIGlmICh4YWRkID49IHJlY3QudylcclxuICAgICAgICAgICAgICAgICAgICBicmVhazsvL+i2heWHuue7mOWItumZkOWumuahhu+8jOS4jeeUu+S6hlxyXG4gICAgICAgICAgICAgICAgZi5kcmF3KHRoaXMuc3ByaXRlQmF0Y2hlciwgY2luZm8sIHRoaXMudHJlY3QsIGNvbG9yLCBjb2xvcjIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdCn0K
