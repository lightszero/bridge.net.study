using System;
using System.Collections.Generic;
using System.Linq;
using Bridge;
using Bridge.Html5;
using Bridge.WebGL;

namespace lighttool
{
    //加载工具

    public class loadTool
    {
        public static void loadText(string url, Action<string, Bridge.Error> fun)
        {
            var req = new XMLHttpRequest();//ness
            req.Open("GET", url);
            req.OnReadyStateChange = () =>
            {
                if (req.ReadyState == Bridge.Html5.AjaxReadyState.Done)
                {
                    fun(req.ResponseText, null);
                }
            };
            req.OnError = (e) =>
                        {
                            var err = new Bridge.Error();
                            err.Message = "onerr in req:";
                            fun(null, err);//ness
                        };
            req.Send();
        }


        public static void loadArrayBuffer(string url, Action<Bridge.Html5.ArrayBuffer, Bridge.Error> fun)
        {
            var req = new XMLHttpRequest();//ness

            req.Open("GET", url);
            req.ResponseType = XMLHttpRequestResponseType.ArrayBuffer;// "arraybuffer";//ie 一定要在open之后修改responseType
            req.OnReadyStateChange = () =>
            {
                if (req.ReadyState == AjaxReadyState.Done)
                {
                    //console.log("got bin:" + typeof (req.response) + req.responseType);
                    fun(req.Response as ArrayBuffer, null);
                }
            };
            req.OnError = (e) =>
                                {
                                    var err = new Error();
                                    err.Message = "onerr in req:";
                                    fun(null, err);//ness
                                };
            req.Send();
        }

        public static void loadBlob(string url, Action<Blob, Error> fun)
        {
            var req = new XMLHttpRequest();//ness

            req.Open("GET", url);
            req.ResponseType = XMLHttpRequestResponseType.Blob;// "blob";//ie 一定要在open之后修改responseType
            req.OnReadyStateChange = () =>
            {
                if (req.ReadyState == AjaxReadyState.Done)
                {
                    //console.log("got _blob:" + typeof (req.response) + req.responseType);
                    fun(req.Response as Blob, null);
                }
            };
            req.OnError = (e) =>
                                {
                                    var err = new Error();
                                    err.Message = "onerr in req:";
                                    fun(null, err);//ness
                                };
            req.Send();
        }


    }
    //shader
    public class shadercode
    {
        public string vscode;
        public string fscode;
        public WebGLShader vs;
        public WebGLShader fs;
        public WebGLProgram program;

        public int posPos = -1;
        public int posColor = -1;
        public int posColor2 = -1;
        public int posUV = -1;
        public WebGLUniformLocation uniMatrix = null;
        public WebGLUniformLocation uniTex0 = null;
        public WebGLUniformLocation uniTex1 = null;
        public WebGLUniformLocation uniCol0 = null;
        public WebGLUniformLocation uniCol1 = null;
        public void compile(WebGLRenderingContext webgl)
        {
            this.vs = webgl.CreateShader(webgl.VERTEX_SHADER);
            this.fs = webgl.CreateShader(webgl.FRAGMENT_SHADER);

            //分别编译shader
            webgl.ShaderSource(this.vs, this.vscode);
            webgl.CompileShader(this.vs);
            var r1 = webgl.GetShaderParameter(this.vs, webgl.COMPILE_STATUS);
            if (r1.As<bool>() == false)
            {
                alert(webgl.GetShaderInfoLog(this.vs));
            }
            //
            webgl.ShaderSource(this.fs, this.fscode);
            webgl.CompileShader(this.fs);
            var r2 = webgl.GetShaderParameter(this.fs, webgl.COMPILE_STATUS);
            if (r2.As<bool>() == false)
            {
                alert(webgl.GetShaderInfoLog(this.fs));
            }

            //program link
            this.program = webgl.CreateProgram().As<WebGLProgram>();

            webgl.AttachShader(this.program, this.vs);
            webgl.AttachShader(this.program, this.fs);

            webgl.LinkProgram(this.program);
            var r3 = webgl.GetProgramParameter(this.program, webgl.LINK_STATUS);
            if (r3.As<bool>() == false)
            {
                alert(webgl.GetProgramInfoLog(this.program));
            }


            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            this.posPos = webgl.GetAttribLocation(this.program, "position");
            this.posColor = webgl.GetAttribLocation(this.program, "color");
            this.posColor2 = webgl.GetAttribLocation(this.program, "color2");

            this.posUV = webgl.GetAttribLocation(this.program, "uv");

            this.uniMatrix = webgl.GetUniformLocation(this.program, "matrix");
            this.uniTex0 = webgl.GetUniformLocation(this.program, "tex0");
            this.uniTex1 = webgl.GetUniformLocation(this.program, "tex1");
            this.uniCol0 = webgl.GetUniformLocation(this.program, "col0");
            this.uniCol1 = webgl.GetUniformLocation(this.program, "col1");


        }

        private void alert(string p)
        {
            throw new NotImplementedException();
        }
    }
    public class shaderParser
    {
        Dictionary<string, shadercode> mapshader = new Dictionary<string, shadercode>();
        //    mapshader: { [id: string]: shadercode
        //} = {};
        void _parser(string txt)
        {
            var s1 = txt.Split("<--");
            for (var i = 0; i < s1.Length; i++)
            {
                var s2 = s1[i].Split("-->");
                var stag = s2[0].Split(" ");//tags;
                var sshader = s2[1];//正文
                var lastname = "";
                var lasttag = 0;

                for (var j = 0; j < stag.Length; j++)
                {
                    var t = stag[j];
                    if (t.Length == 0) continue;
                    if (t == "vs")//vectexshader
                    {
                        lasttag = 1;
                    }
                    else if (t == "fs")//fragmentshader
                    {
                        lasttag = 2;
                    }
                    else
                    {
                        lastname = t.Substring(1, t.Length - 1);
                    }
                }
                if (lastname.Length == 0) continue;
                if (this.mapshader[lastname] == null)
                    this.mapshader[lastname] = new shadercode();//ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;

            }
        }
        void parseUrl(WebGLRenderingContext webgl, string url)
        {
            lighttool.loadTool.loadText(url, (txt, err) =>
            {
                this._parser(txt);
                this.compile(webgl);
                //spriteBatcher
            }
            );
        }
        void parseDirect(WebGLRenderingContext webgl, string txt)
        {
            this._parser(txt);
            this.compile(webgl);
        }
        void dump()
        {
            foreach (var name in this.mapshader.Keys)
            {
                Console.WriteLine("shadername:" + name);
                Console.WriteLine("vs:" + this.mapshader[name].vscode);
                Console.WriteLine("fs:" + this.mapshader[name].fscode);
            }

        }
        void compile(WebGLRenderingContext webgl)
        {
            foreach (var name in this.mapshader.Keys)
            {
                this.mapshader[name].compile(webgl);
            }
        }
    }
    //sprite 基本数据结构
    public class spriteRect
    {
        public spriteRect(float x = 0, float y = 0, float w = 0, float h = 0)
        {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        public float x;
        public float y;
        public float w;
        public float h;
        public static readonly spriteRect one = new spriteRect(0, 0, 1, 1);//ness
        public static readonly spriteRect zero = new spriteRect(0, 0, 0, 0);//ness
    }
    public class spriteBorder
    {
        public spriteBorder(float l = 0, float t = 0, float r = 0, float b = 0)
        {
            this.l = l;
            this.t = t;
            this.r = r;
            this.b = b;
        }
        public float l;
        public float t;
        public float r;
        public float b;
        public static readonly spriteBorder zero = new spriteBorder(0, 0, 0, 0);//ness

    }
    public class spriteColor
    {
        public spriteColor(float r = 1, float g = 1, float b = 1, float a = 1)
        {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        public float r;
        public float g;
        public float b;
        public float a;
        public static readonly spriteColor white = new spriteColor(1, 1, 1, 1);//ness
        public static readonly spriteColor black = new spriteColor(0, 0, 0, 1);//ness
        public static readonly spriteColor gray = new spriteColor(0.5f, 0.5f, 0.5f, 1);//ness
    }
    public class spritePoint
    {
        public float x;
        public float y;
        public float z;

        public float r;
        public float g;
        public float b;
        public float a;

        public float r2;
        public float g2;
        public float b2;
        public float a2;

        public float u;
        public float v;
    }


    //sprite材质
    public class spriteMat
    {
        public string shader;
        public bool transparent;
        public spriteTexture tex0;
        public spriteTexture tex1;
        public spriteColor col0:;
        public spriteColor col1;
    }
    public class stateRecorder
    {
        webgl: WebGLRenderingContext;
        constructor(webgl: WebGLRenderingContext)
        {
            this.webgl = webgl;
        }
        DEPTH_WRITEMASK: boolean;
        DEPTH_TEST: boolean;
        DEPTH_FUNC: number;
        BLEND: boolean;
        BLEND_EQUATION: number;
        BLEND_SRC_RGB: number;
        BLEND_SRC_ALPHA: number;
        BLEND_DST_RGB: number;
        BLEND_DST_ALPHA: number;
        CURRENT_PROGRAM: any;
        ARRAY_BUFFER: any;
        ACTIVE_TEXTURE: number;
        TEXTURE_BINDING_2D: any;
        record()
        {

            //记录状态
            this.DEPTH_WRITEMASK = this.webgl.getParameter(this.webgl.DEPTH_WRITEMASK);
            this.DEPTH_TEST = this.webgl.getParameter(this.webgl.DEPTH_TEST);
            this.DEPTH_FUNC = this.webgl.getParameter(this.webgl.DEPTH_FUNC);
            //alphablend ，跟着mat走
            this.BLEND = this.webgl.getParameter(this.webgl.BLEND);
            this.BLEND_EQUATION = this.webgl.getParameter(this.webgl.BLEND_EQUATION);
            this.BLEND_SRC_RGB = this.webgl.getParameter(this.webgl.BLEND_SRC_RGB);
            this.BLEND_SRC_ALPHA = this.webgl.getParameter(this.webgl.BLEND_SRC_ALPHA);
            this.BLEND_DST_RGB = this.webgl.getParameter(this.webgl.BLEND_DST_RGB);
            this.BLEND_DST_ALPHA = this.webgl.getParameter(this.webgl.BLEND_DST_ALPHA);
            //    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
            //        this.webgl.SRC_ALPHA, this.webgl.ONE);
            this.CURRENT_PROGRAM = this.webgl.getParameter(this.webgl.CURRENT_PROGRAM);
            this.ARRAY_BUFFER = this.webgl.getParameter(this.webgl.ARRAY_BUFFER_BINDING);

            this.ACTIVE_TEXTURE = this.webgl.getParameter(this.webgl.ACTIVE_TEXTURE);
            this.TEXTURE_BINDING_2D = this.webgl.getParameter(this.webgl.TEXTURE_BINDING_2D);

        }
        restore()
        {
            //恢复状态
            this.webgl.depthMask(this.DEPTH_WRITEMASK);
            if (this.DEPTH_TEST)
                this.webgl.enable(this.webgl.DEPTH_TEST);//这是ztest
            else
                this.webgl.disable(this.webgl.DEPTH_TEST);//这是ztest
            this.webgl.depthFunc(this.DEPTH_FUNC);//这是ztest方法

            if (this.BLEND)
            {
                this.webgl.enable(this.webgl.BLEND);
            }
            else
            {
                this.webgl.disable(this.webgl.BLEND);
            }
            this.webgl.blendEquation(this.BLEND_EQUATION);

            this.webgl.blendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB,
                this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);

            this.webgl.useProgram(this.CURRENT_PROGRAM);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.ARRAY_BUFFER);

            this.webgl.activeTexture(this.ACTIVE_TEXTURE);
            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.TEXTURE_BINDING_2D);

        }
    }
    public class spriteBatcher
    {
        webgl: WebGLRenderingContext;
        shaderparser: shaderParser;
        vbo: WebGLBuffer;
        //data: number[] = [];
        matrix: Float32Array;
        ztest: boolean = true;
        recorder: stateRecorder;
        constructor(webgl: WebGLRenderingContext, shaderparser: shaderParser)
        {
            this.webgl = webgl;
            this.shaderparser = shaderparser;
            this.vbo = webgl.createBuffer();
            var asp = (this.webgl.drawingBufferWidth / this.webgl.drawingBufferHeight);
            this.matrix = new Float32Array([
                1.0 / asp, 0, 0, 0,//去掉asp的影响
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);//ness
            this.recorder = new stateRecorder(webgl);//ness
        }
        begindraw()
        {
            this.recorder.record();
        }
        enddraw()
        {
            this.endbatch();

            this.recorder.restore();
        }
        shadercode: shadercode;
        //begindraw 和 setmat 到底要不要分开，这是需要再思考一下的
        mat: spriteMat;
        public void setMat(spriteMat mat)
        {
            if (mat == this.mat) return;
            this.endbatch();

            this.webgl.disable(this.webgl.CULL_FACE);

            this.mat = mat;
            this.shadercode = this.shaderparser.mapshader[this.mat.shader];
            if (this.shadercode == undefined) return;
            //指定shader和vbo

            //关于深度 ，跟着spritebatcher走
            this.webgl.depthMask(false);//这是zwrite

            if (this.ztest)
            {
                this.webgl.enable(this.webgl.DEPTH_TEST);//这是ztest
                this.webgl.depthFunc(this.webgl.LEQUAL);//这是ztest方法
            }
            else
            {
                this.webgl.disable(this.webgl.DEPTH_TEST);//这是ztest
            }

            if (this.mat.transparent)
            {
                //alphablend ，跟着mat走
                this.webgl.enable(this.webgl.BLEND);
                this.webgl.blendEquation(this.webgl.FUNC_ADD);
                //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
                    this.webgl.SRC_ALPHA, this.webgl.ONE);
            }
            else
            {
                this.webgl.disable(this.webgl.BLEND);
            }

            this.webgl.useProgram(this.shadercode.program);
            this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, this.vbo);


            //指定固定的数据结构，然后根据存在program的数据去绑定咯。

            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            if (this.shadercode.posPos >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posPos);
                //28 是数据步长(字节)，就是数据结构的长度
                //12 是数据偏移（字节）
                this.webgl.vertexAttribPointer(this.shadercode.posPos, 3, this.webgl.FLOAT, false, 52, 0);
            }
            if (this.shadercode.posColor >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor);
                this.webgl.vertexAttribPointer(this.shadercode.posColor, 4, this.webgl.FLOAT, false, 52, 12);
            }
            if (this.shadercode.posColor2 >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posColor2);
                this.webgl.vertexAttribPointer(this.shadercode.posColor2, 4, this.webgl.FLOAT, false, 52, 28);
            }
            if (this.shadercode.posUV >= 0)
            {
                this.webgl.enableVertexAttribArray(this.shadercode.posUV);
                this.webgl.vertexAttribPointer(this.shadercode.posUV, 2, this.webgl.FLOAT, false, 52, 44);
            }

            if (this.shadercode.uniMatrix != null)
            {
                this.webgl.uniformMatrix4fv(this.shadercode.uniMatrix, false, this.matrix);
            }
            if (this.shadercode.uniTex0 != null)
            {
                this.webgl.activeTexture(this.webgl.TEXTURE0);
                var tex = < spriteTexture > this.mat.tex0;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex0, 0);
                //console.log("settex");
            }
            if (this.shadercode.uniTex1 != null)
            {
                this.webgl.activeTexture(this.webgl.TEXTURE1);
                var tex = < spriteTexture > this.mat.tex1;
                this.webgl.bindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.uniform1i(this.shadercode.uniTex1, 1);
                //console.log("settex");
            }
            if (this.shadercode.uniCol0 != null)
            {
                this.webgl.uniform4f(this.shadercode.uniCol0, mat.col0.r, mat.col0.g, mat.col0.b, mat.col0.a);
                //console.log("settex");
            }
            if (this.shadercode.uniCol1 != null)
            {
                this.webgl.uniform4f(this.shadercode.uniCol1, mat.col1.r, mat.col1.g, mat.col1.b, mat.col1.a);
                //console.log("settex");
            }

        }
        Float32Array array = new Float32Array(1024 * 13);//ness
        int dataseek = 0;
        public void endbatch()
        {
            this.mat = null;
            if (this.dataseek == 0)
                return;
            //填充vbo
            this.webgl.bufferData(this.webgl.ARRAY_BUFFER, this.array, this.webgl.DYNAMIC_DRAW);
            //绘制
            this.webgl.drawArrays(this.webgl.TRIANGLES, 0, this.dataseek);
            //清理状态，可以不干
            //this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, null);

            //this.data.length = 0;
            this.dataseek = 0;
        }
        public void addQuad(spritePoint[] ps)//添加四边形，必须是四的倍数，不接受裁剪
        {
            if (this.shadercode == undefined) return;

            for (var jc = 0; jc < 6; jc++)
            {
                var j = jc < 3 ? jc : 6 - jc;// 0->0 1->1 2->2
                                             // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1

                let i = this.dataseek * 13;

                this.array[i++] = ps[j].x;
                this.array[i++] = ps[j].y;
                this.array[i++] = ps[j].z;
                this.array[i++] = ps[j].r;
                this.array[i++] = ps[j].g;
                this.array[i++] = ps[j].b;
                this.array[i++] = ps[j].a;
                this.array[i++] = ps[j].r2;
                this.array[i++] = ps[j].g2;
                this.array[i++] = ps[j].b2;
                this.array[i++] = ps[j].a2;
                this.array[i++] = ps[j].u;
                this.array[i++] = ps[j].v;

                this.dataseek++;
            }

            if (this.dataseek >= 1000)
            {
                this.endbatch();
            }
        }
        public void addTri(spritePoint[] ps)//添加三角形，必须是三的倍数 ,三角形不支持硬裁剪
        {
            if (this.shadercode == undefined) return;

            {
                for (var j = 0; j < 3; j++)
                {
                    let i = this.dataseek * 13;
                    //for (var e in ps[j])
                    //{
                    //    this.array[i++] = ps[j][e];
                    //}
                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;

                    this.dataseek++;
                    //this.data.push(ps[j].x);
                    //this.data.push(ps[j].y);
                    //this.data.push(ps[j].z);
                    //this.data.push(ps[j].r);
                    //this.data.push(ps[j].g);
                    //this.data.push(ps[j].b);
                    //this.data.push(ps[j].a);
                    //this.data.push(ps[j].r);
                    //this.data.push(ps[j].g);
                    //this.data.push(ps[j].b);
                    //this.data.push(ps[j].a);
                    //this.data.push(ps[j].u);
                    //this.data.push(ps[j].v);

                }
            }
            if (this.dataseek >= 1000)
            {
                this.endbatch();
            }

        }

        //这个接口接受裁剪
        public void addRect(spritePoint[] ps) //添加四边形，必须是四的倍数
        {
            if (this.shadercode == undefined) return;

            if (this.rectClip != null) //使用裁剪
            {
                var xmin = ps[0].x;
                var xmax = ps[3].x;
                var ymin = ps[0].y;
                var ymax = ps[3].y;
                var umin = ps[0].u
                var umax = ps[3].u;
                var vmin = ps[0].v;
                var vmax = ps[3].v;
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
                for (var jc = 0; jc < 6; jc++)
                {
                    var j = jc < 3 ? jc : 6 - jc;// 0->0 1->1 2->2
                                                 // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1

                    let i = this.dataseek * 13;

                    var x = ps[j].x;
                    if (x < xl) x = xl;
                    if (x > xr) x = xr;
                    var y = ps[j].y;
                    if (y < yt) y = yt;
                    if (y > yb) y = yb;
                    var u = ps[j].u;
                    if (u < umin) u = umin;
                    if (u > umax) u = umax;
                    var v = ps[j].v;
                    if (v < vmin) v = vmin;
                    if (v > vmax) v = vmax;
                    this.array[i++] = x;
                    this.array[i++] = y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = u;
                    this.array[i++] = v;

                    this.dataseek++;
                }
            }
            else
            {
                for (var jc = 0; jc < 6; jc++)
                {
                    var j = jc < 3 ? jc : 6 - jc;// 0->0 1->1 2->2
                                                 // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1

                    let i = this.dataseek * 13;

                    this.array[i++] = ps[j].x;
                    this.array[i++] = ps[j].y;
                    this.array[i++] = ps[j].z;
                    this.array[i++] = ps[j].r;
                    this.array[i++] = ps[j].g;
                    this.array[i++] = ps[j].b;
                    this.array[i++] = ps[j].a;
                    this.array[i++] = ps[j].r2;
                    this.array[i++] = ps[j].g2;
                    this.array[i++] = ps[j].b2;
                    this.array[i++] = ps[j].a2;
                    this.array[i++] = ps[j].u;
                    this.array[i++] = ps[j].v;

                    this.dataseek++;
                }
            }
            if (this.dataseek >= 1000)
            {
                this.endbatch();
            }
        }

        public spriteRect rectClip = null;
        public void setRectClip(rect: spriteRect)
        {
            this.rectClip = rect;
        }
        public void closeRectClip()
        {
            this.rectClip = null;
        }
    }

    //texture
    public enum textureformat
    {
        RGBA = 1,// WebGLRenderingContext.RGBA,
        RGB = 2,//WebGLRenderingContext.RGB,
        GRAY = 3,//WebGLRenderingContext.LUMINANCE,
        //ALPHA = this.webgl.ALPHA,
    }
    public class texReader
    {
        constructor(webgl: WebGLRenderingContext, texRGBA: WebGLTexture, width: number, height: number, gray: boolean = true)
        {
            this.gray = gray;
            this.width = width;
            this.height = height;

            var fbo = webgl.createFramebuffer();
            var fbold = webgl.getParameter(webgl.FRAMEBUFFER_BINDING);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.framebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
                texRGBA, 0);

            var readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;
            webgl.readPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE,
                readData);
            webgl.deleteFramebuffer(fbo);
            webgl.bindFramebuffer(webgl.FRAMEBUFFER, fbold);

            if (gray)
            {
                this.data = new Uint8Array(this.width * this.height);
                for (var i = 0; i < width * height; i++)
                {
                    this.data[i] = readData[i * 4];
                }
            }
            else
            {
                this.data = readData;
            }
        }
        width: number;
        height: number;
        data: Uint8Array;
        gray: boolean;
        object getPixel(u: number, v: number)
        {
            var x = (u * this.width) | 0;
            var y = (v * this.height) | 0;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;
            if (this.gray)
            {
                return this.data[y * this.width + x];
            }
            else
            {
                var i = (y * this.width + x) * 4;
                return new spriteColor(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3]);
            }
        }
    }
    public class spriteTexture
    {
        public spriteTexture(webgl: WebGLRenderingContext, url: string = null, format: textureformat = textureformat.RGBA, mipmap: boolean = false, linear: boolean = true)
        {
            this.webgl = webgl;
            this.format = format;

            this.mat = new spriteMat();//ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";

            if (url == null)//不给定url 则 texture 不加载
                return;
            this.texture = webgl.createTexture();

            this.img = new Image();// HTMLImageElement(); //ness
            this.img.src = url;
            this.img.onload = () =>
            {
                if (this.disposeit)
                {
                    this.img = null;
                    return;
                }
                this._loadimg(mipmap, linear);
            }

        }
        private void _loadimg(mipmap: boolean, linear: boolean)
        {
            this.width = this.img.width;
            this.height = this.img.height;
            this.loaded = true;
            this.webgl.pixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            this.webgl.pixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);


            this.webgl.bindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            this.webgl.texImage2D(this.webgl.TEXTURE_2D,
                0,
                formatGL,
                formatGL,
                //最后这个type，可以管格式
                this.webgl.UNSIGNED_BYTE
                , this.img);

            if (mipmap)
            {
                //生成mipmap
                this.webgl.generateMipmap(this.webgl.TEXTURE_2D);

                if (linear)
                {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else
                {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

                }
            }
            else
            {
                if (linear)
                {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else
                {
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.texParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

                }
            }
            this.img = null;



        }
        webgl: WebGLRenderingContext;
        img: HTMLImageElement = null;
        loaded: boolean = false;
        texture: WebGLTexture;
        format: textureformat;
        width: number = 0;
        height: number = 0;
        static public spriteTexture fromRaw(webgl: WebGLRenderingContext, img: HTMLImageElement, format: textureformat = textureformat.RGBA, mipmap: boolean = false, linear: boolean = true)
        {
            var st = new spriteTexture(webgl, null, format, mipmap, linear);
            st.texture = webgl.createTexture();
            st.img = img;
            st._loadimg(mipmap, linear);

            return st;

        }
        mat: spriteMat = null;
        //创建读取器，有可能失败
        reader: texReader;
        public texReader getReader(redOnly: boolean)
        {
            if (this.reader != null)
            {
                if (this.reader.gray != redOnly)
                    throw new Error("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != textureformat.RGBA)
                throw new Error("only rgba texture can read");
            if (this.texture == null) return null;
            if (this.reader == null)
                this.reader = new texReader(this.webgl, this.texture, this.width, this.height, redOnly);

            return this.reader;
        }
        disposeit: boolean = false;
        public void dispose()
        {
            if (this.texture == null && this.img != null)
                this.disposeit = true;

            if (this.texture != null)
            {
                this.webgl.deleteTexture(this.texture);
            }
        }
        public spritePoint[] pointbuf = {
                   new spritePoint() { x=0, y= 0, z= 0, r= 0, g=0, b= 0, a= 0, r2=0, g2=0, b2= 0, a2= 0, u=0, v=0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        };

        public void draw(spriteBatcher spriteBatcher, uv: spriteRect, rect: spriteRect, c: spriteColor)
        {

            {


                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = uv.x; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
            }
            spriteBatcher.setMat(this.mat);
            spriteBatcher.addRect(this.pointbuf);

        }

        public void drawCustom(spriteBatcher: spriteBatcher, _mat: spriteMat, uv: spriteRect, rect: spriteRect, c: spriteColor, c2: spriteColor)
        {
            _mat.tex0 = this;
            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = uv.x; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = uv.x + uv.w; p.v = uv.y + uv.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
            }
            spriteBatcher.setMat(_mat);
            spriteBatcher.addRect(this.pointbuf);

        }
    }

    public class sprite
    {
        x: number;
        y: number;
        w: number;
        h: number;
        xsize: number;
        ysize: number;
    }
    //atlas
    public class spriteAtlas
    {
        webgl: WebGLRenderingContext;
        public spriteAtlas(webgl: WebGLRenderingContext, atlasurl: string = null, texture: spriteTexture = null)
        {
            this.webgl = webgl;
            if (atlasurl == null)
            {
            }
            else
            {
                lighttool.loadTool.loadText(atlasurl, (txt, err) =>
                {
                    this._parse(txt);
                }
                );
            }
            this.texture = texture;
        }
        public static spriteAtlas fromRaw(webgl: WebGLRenderingContext, txt: string, texture: spriteTexture = null)
        {
            var sa = new spriteAtlas(webgl, null, texture);
            sa._parse(txt);

            return sa;
        }
        textureurl: string;
        texturewidth: number;
        textureheight: number;
        texture: spriteTexture;
        System.Collections.Generic.Dictionary<string, sprite> sprites = new Dictionary<string, sprite>();
        private void _parse(txt: string)
        {
            var json = JSON.parse(txt);
            this.textureurl = json["t"];
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = <[] > json["s"];

            for (var i in s)
            {
                var ss = <[] > s[i];
                var r: sprite = new sprite();//ness
                r.x = (< number > ss[1] + 0.5) / this.texturewidth;
                r.y = (< number > ss[2] + 0.5) / this.textureheight;
                r.w = (< number > ss[3] - 1) / this.texturewidth;
                r.h = (< number > ss[4] - 1) / this.textureheight;
                r.xsize = < number > ss[3];
                r.ysize = < number > ss[4];
                this.sprites[< string > ss[0]] = r;
            }

        }
        public void drawByTexture(sb: spriteBatcher, sname: string, rect: spriteRect, c: spriteColor)
        {
            if (this.texture == null) return;
            let r = this.sprites[sname];
            if (r == undefined) return;

            this.texture.draw(sb, r, rect, c);
        }

    }

    //font
    public class charinfo
    {
        x: number;//uv
        y: number;
        w: number;
        h: number;
        xSize: number;
        ySize: number;
        xOffset: number;//偏移
        yOffset: number;
        xAddvance: number;//字符宽度
    }
    public class spriteFont
    {
        webgl: WebGLRenderingContext;
        texture: spriteTexture;
        mat: spriteMat;

        Dictionary<string, charinfo> cmap;
        fontname: string;
        pointSize: number;//像素尺寸
        padding: number;//间隔
        lineHeight: number;//行高
        baseline: number;//基线
        atlasWidth: number;
        atlasHeight: number;
        public spriteFont(webgl: WebGLRenderingContext, urlconfig: string, texture: spriteTexture)
        {
            this.webgl = webgl;
            if (urlconfig != null)
            {
                lighttool.loadTool.loadText(urlconfig, (txt, err) =>
                {
                    this._parse(txt);
                }
                );
            }
            this.texture = texture;
            this.mat = new spriteMat();//ness
            this.mat.shader = "spritefont";
            this.mat.tex0 = this.texture;
            this.mat.transparent = true;
        }
        public static spriteFont fromRaw(webgl: WebGLRenderingContext, txt: string, texture: spriteTexture = null)
        {
            var sf = new spriteFont(webgl, null, texture);
            sf._parse(txt);
            return sf;
        }
        public void _parse(txt: string)
        {
            let d1 = new Date().valueOf();
            let json = JSON.parse(txt);

            //parse fontinfo
            var font = <[] > json["font"];
            this.fontname = < string > font[0];
            this.pointSize = < number > font[1];
            this.padding = < number > font[2];
            this.lineHeight = < number > font[3];
            this.baseline = < number > font[4];
            this.atlasWidth = < number > font[5];
            this.atlasHeight = < number > font[6];

            //parse char map
            this.cmap = { };
            let map = json["map"];
            for (var c in map)
            {
                let finfo = new charinfo();//ness
                this.cmap[c] = finfo;
                finfo.x = map[c][0] / this.atlasWidth;
                finfo.y = map[c][1] / this.atlasHeight;
                finfo.w = map[c][2] / this.atlasWidth;
                finfo.h = map[c][3] / this.atlasHeight;
                finfo.xSize = map[c][2];
                finfo.ySize = map[c][3];
                finfo.xOffset = map[c][4];
                finfo.yOffset = map[c][5];
                finfo.xAddvance = map[c][6];
            }
            map = null;
            json = null;


            let d2 = new Date().valueOf();
            let n = d2 - d1;
            console.log("json time=" + n);

        }
        spritePoint[] pointbuf = {
                    { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
            { x: 0, y: 0, z: 0, r: 0, g: 0, b: 0, a: 0, r2: 0, g2: 0, b2: 0, a2: 0, u: 0, v: 0 },
        };
        public void draw(sb: spriteBatcher, r: charinfo, rect: spriteRect, c: spriteColor = spriteColor.white, colorBorder: spriteColor = new spriteColor(0, 0, 0, 0.5))
        {
            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x + r.w; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = r.x; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = r.x + r.w; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;
            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        }

        public void drawChar(sb: spriteBatcher, cname: string, rect: spriteRect, c: spriteColor = spriteColor.white, colorBorder: spriteColor = new spriteColor(0, 0, 0, 0.5))
        {
            var r = this.cmap[cname];
            if (r == undefined) return;

            {
                let p = this.pointbuf[0];
                p.x = rect.x; p.y = rect.y; p.z = 0;
                p.u = r.x; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[1];
                p.x = rect.x + rect.w; p.y = rect.y; p.z = 0;
                p.u = r.x + r.w; p.v = r.y;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[2];
                p.x = rect.x; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

                p = this.pointbuf[3];
                p.x = rect.x + rect.w; p.y = rect.y + rect.h; p.z = 0;
                p.u = r.x + r.w; p.v = r.y + r.h;
                p.r = c.r; p.g = c.g; p.b = c.b; p.a = c.a;
                p.r2 = colorBorder.r; p.g2 = colorBorder.g; p.b2 = colorBorder.b; p.a2 = colorBorder.a;

            }
            sb.setMat(this.mat);
            sb.addRect(this.pointbuf);
        }
    }
}