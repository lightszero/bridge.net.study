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
        public Dictionary<string, shadercode> mapshader = new Dictionary<string, shadercode>();
        //    mapshader: { [id: string]: shadercode
        //} = {};
        void _parser(string txt)
        {
            var s1 = txt.Split(new[] { "<--" }, StringSplitOptions.RemoveEmptyEntries);
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
                if (this.mapshader.ContainsKey(lastname) == false)
                    this.mapshader[lastname] = new shadercode();//ness
                if (lasttag == 1)
                    this.mapshader[lastname].vscode = sshader;
                else if (lasttag == 2)
                    this.mapshader[lastname].fscode = sshader;

            }
        }
        public void parseUrl(WebGLRenderingContext webgl, string url)
        {
            lighttool.loadTool.loadText(url, (txt, err) =>
            {
                this._parser(txt);
                this.compile(webgl);
                //spriteBatcher
            }
            );
        }
        public void parseDirect(WebGLRenderingContext webgl, string txt)
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
        public static spriteColor white
        {
            get
            {
                return new spriteColor(1, 1, 1, 1);//ness
            }
        }
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
        public spriteColor col0;
        public spriteColor col1;
    }
    public class stateRecorder
    {
        public WebGLRenderingContext webgl;
        public stateRecorder(WebGLRenderingContext webgl)
        {
            this.webgl = webgl;
        }
        public bool DEPTH_WRITEMASK;
        public bool DEPTH_TEST;
        public int DEPTH_FUNC;
        public bool BLEND;
        public int BLEND_EQUATION;
        public int BLEND_SRC_RGB;
        public int BLEND_SRC_ALPHA;
        public int BLEND_DST_RGB;
        public int BLEND_DST_ALPHA;
        public WebGLProgram CURRENT_PROGRAM;
        public WebGLBuffer ARRAY_BUFFER;
        public int ACTIVE_TEXTURE;
        public WebGLTexture TEXTURE_BINDING_2D;
        public void record()
        {

            //记录状态
            this.DEPTH_WRITEMASK = (bool)this.webgl.GetParameter(this.webgl.DEPTH_WRITEMASK);
            this.DEPTH_TEST = (bool)this.webgl.GetParameter(this.webgl.DEPTH_TEST);
            this.DEPTH_FUNC = (int)this.webgl.GetParameter(this.webgl.DEPTH_FUNC);
            //alphablend ，跟着mat走
            this.BLEND = (bool)this.webgl.GetParameter(this.webgl.BLEND);
            this.BLEND_EQUATION = (int)this.webgl.GetParameter(this.webgl.BLEND_EQUATION);
            this.BLEND_SRC_RGB = (int)this.webgl.GetParameter(this.webgl.BLEND_SRC_RGB);
            this.BLEND_SRC_ALPHA = (int)this.webgl.GetParameter(this.webgl.BLEND_SRC_ALPHA);
            this.BLEND_DST_RGB = (int)this.webgl.GetParameter(this.webgl.BLEND_DST_RGB);
            this.BLEND_DST_ALPHA = (int)this.webgl.GetParameter(this.webgl.BLEND_DST_ALPHA);
            //    this.webgl.blendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
            //        this.webgl.SRC_ALPHA, this.webgl.ONE);
            this.CURRENT_PROGRAM = (WebGLProgram)this.webgl.GetParameter(this.webgl.CURRENT_PROGRAM);
            this.ARRAY_BUFFER = (WebGLBuffer)this.webgl.GetParameter(this.webgl.ARRAY_BUFFER_BINDING);

            this.ACTIVE_TEXTURE = (int)this.webgl.GetParameter(this.webgl.ACTIVE_TEXTURE);
            this.TEXTURE_BINDING_2D = (WebGLTexture)this.webgl.GetParameter(this.webgl.TEXTURE_BINDING_2D);

        }
        public void restore()
        {
            //恢复状态
            this.webgl.DepthMask(this.DEPTH_WRITEMASK);
            if (this.DEPTH_TEST)
                this.webgl.Enable(this.webgl.DEPTH_TEST);//这是ztest
            else
                this.webgl.Disable(this.webgl.DEPTH_TEST);//这是ztest
            this.webgl.DepthFunc(this.DEPTH_FUNC);//这是ztest方法

            if (this.BLEND)
            {
                this.webgl.Enable(this.webgl.BLEND);
            }
            else
            {
                this.webgl.Disable(this.webgl.BLEND);
            }
            this.webgl.BlendEquation(this.BLEND_EQUATION);

            this.webgl.BlendFuncSeparate(this.BLEND_SRC_RGB, this.BLEND_DST_RGB,
                this.BLEND_SRC_ALPHA, this.BLEND_DST_ALPHA);

            this.webgl.UseProgram(this.CURRENT_PROGRAM);
            this.webgl.BindBuffer(this.webgl.ARRAY_BUFFER, this.ARRAY_BUFFER);

            this.webgl.ActiveTexture(this.ACTIVE_TEXTURE);
            this.webgl.BindTexture(this.webgl.TEXTURE_2D, this.TEXTURE_BINDING_2D);

        }
    }
    public class spriteBatcher
    {
        public WebGLRenderingContext webgl;
        public shaderParser shaderparser;
        public WebGLBuffer vbo;
        //data: number[] = [];
        public Float32Array matrix;
        public bool ztest = true;
        public stateRecorder recorder;
        public spriteBatcher(WebGLRenderingContext webgl, shaderParser shaderparser)
        {
            this.webgl = webgl;
            this.shaderparser = shaderparser;
            this.vbo = webgl.CreateBuffer();
            var asp = (this.webgl.DrawingBufferWidth / this.webgl.DrawingBufferHeight);
            //this.matrix=
            float[] array ={
                1.0f / asp, 0, 0, 0,//去掉asp的影响
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            };//ness
            this.matrix = new Float32Array(array);

            this.recorder = new stateRecorder(webgl);//ness
        }
        public void begindraw()
        {
            this.recorder.record();
        }
        public void enddraw()
        {
            this.endbatch();

            this.recorder.restore();
        }
        public shadercode shadercode = null;
        //begindraw 和 setmat 到底要不要分开，这是需要再思考一下的
        public spriteMat mat;
        public void setMat(spriteMat mat)
        {
            if (mat == this.mat) return;
            this.endbatch();

            this.webgl.Disable(this.webgl.CULL_FACE);

            this.mat = mat;
            this.shadercode = this.shaderparser.mapshader[this.mat.shader];
            if (this.shadercode == null) return;
            //指定shader和vbo

            //关于深度 ，跟着spritebatcher走
            this.webgl.DepthMask(false);//这是zwrite

            if (this.ztest)
            {
                this.webgl.Enable(this.webgl.DEPTH_TEST);//这是ztest
                this.webgl.DepthFunc(this.webgl.LEQUAL);//这是ztest方法
            }
            else
            {
                this.webgl.Disable(this.webgl.DEPTH_TEST);//这是ztest
            }

            if (this.mat.transparent)
            {
                //alphablend ，跟着mat走
                this.webgl.Enable(this.webgl.BLEND);
                this.webgl.BlendEquation(this.webgl.FUNC_ADD);
                //this.webgl.blendFunc(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA);
                this.webgl.BlendFuncSeparate(this.webgl.ONE, this.webgl.ONE_MINUS_SRC_ALPHA,
                    this.webgl.SRC_ALPHA, this.webgl.ONE);
            }
            else
            {
                this.webgl.Disable(this.webgl.BLEND);
            }

            this.webgl.UseProgram(this.shadercode.program);
            this.webgl.BindBuffer(this.webgl.ARRAY_BUFFER, this.vbo);


            //指定固定的数据结构，然后根据存在program的数据去绑定咯。

            //绑定vbo和shader顶点格式，这部分应该要区分材质改变与参数改变，可以少切换一些状态
            if (this.shadercode.posPos >= 0)
            {
                this.webgl.EnableVertexAttribArray(this.shadercode.posPos);
                //28 是数据步长(字节)，就是数据结构的长度
                //12 是数据偏移（字节）
                this.webgl.VertexAttribPointer(this.shadercode.posPos, 3, this.webgl.FLOAT, false, 52, 0);
            }
            if (this.shadercode.posColor >= 0)
            {
                this.webgl.EnableVertexAttribArray(this.shadercode.posColor);
                this.webgl.VertexAttribPointer(this.shadercode.posColor, 4, this.webgl.FLOAT, false, 52, 12);
            }
            if (this.shadercode.posColor2 >= 0)
            {
                this.webgl.EnableVertexAttribArray(this.shadercode.posColor2);
                this.webgl.VertexAttribPointer(this.shadercode.posColor2, 4, this.webgl.FLOAT, false, 52, 28);
            }
            if (this.shadercode.posUV >= 0)
            {
                this.webgl.EnableVertexAttribArray(this.shadercode.posUV);
                this.webgl.VertexAttribPointer(this.shadercode.posUV, 2, this.webgl.FLOAT, false, 52, 44);
            }

            if (this.shadercode.uniMatrix != null)
            {
                this.webgl.UniformMatrix4fv(this.shadercode.uniMatrix, false, (Array)(object)this.matrix);
            }
            if (this.shadercode.uniTex0 != null)
            {
                this.webgl.ActiveTexture(this.webgl.TEXTURE0);
                var tex = this.mat.tex0;
                this.webgl.BindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.Uniform1i(this.shadercode.uniTex0, 0);
                //console.log("settex");
            }
            if (this.shadercode.uniTex1 != null)
            {
                this.webgl.ActiveTexture(this.webgl.TEXTURE1);
                var tex = this.mat.tex1;
                this.webgl.BindTexture(this.webgl.TEXTURE_2D, tex == null ? null : tex.texture);
                this.webgl.Uniform1i(this.shadercode.uniTex1, 1);
                //console.log("settex");
            }
            if (this.shadercode.uniCol0 != null)
            {
                this.webgl.Uniform4f(this.shadercode.uniCol0, mat.col0.r, mat.col0.g, mat.col0.b, mat.col0.a);
                //console.log("settex");
            }
            if (this.shadercode.uniCol1 != null)
            {
                this.webgl.Uniform4f(this.shadercode.uniCol1, mat.col1.r, mat.col1.g, mat.col1.b, mat.col1.a);
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
            this.webgl.BufferData(this.webgl.ARRAY_BUFFER, this.array, this.webgl.DYNAMIC_DRAW);
            //绘制
            this.webgl.DrawArrays(this.webgl.TRIANGLES, 0, this.dataseek);
            //清理状态，可以不干
            //this.webgl.bindBuffer(this.webgl.ARRAY_BUFFER, null);

            //this.data.length = 0;
            this.dataseek = 0;
        }
        public void addQuad(spritePoint[] ps)//添加四边形，必须是四的倍数，不接受裁剪
        {
            if (this.shadercode == null) return;

            for (var jc = 0; jc < 6; jc++)
            {
                var j = jc < 3 ? jc : 6 - jc;// 0->0 1->1 2->2
                                             // if (j > 2) j = 6 - jc; // 3->3 4->2 5->1

                var i = this.dataseek * 13;

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
            if (this.shadercode == null) return;

            {
                for (var j = 0; j < 3; j++)
                {
                    var i = this.dataseek * 13;
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
            if (this.shadercode == Script.Undefined) return;

            if (this.rectClip != null) //使用裁剪
            {
                var xmin = ps[0].x;
                var xmax = ps[3].x;
                var ymin = ps[0].y;
                var ymax = ps[3].y;
                var umin = ps[0].u;
                var umax = ps[3].u;
                var vmin = ps[0].v;
                var vmax = ps[3].v;
                var wsize = xmax - xmin;
                var hsize = ymax - ymin;
                var usize = umax - umin;
                var vsize = vmax - vmin;
                var xl = Math.Max(xmin, this.rectClip.x);
                var xr = Math.Min(xmax, this.rectClip.x + this.rectClip.w);
                var yt = Math.Max(ymin, this.rectClip.y);
                var yb = Math.Min(ymax, this.rectClip.y + this.rectClip.h);
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

                    var i = this.dataseek * 13;

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

                    var i = this.dataseek * 13;

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
        public void setRectClip(spriteRect rect)
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
        public texReader(WebGLRenderingContext webgl, WebGLTexture texRGBA, int width, int height, bool gray = true)
        {
            this.gray = gray;
            this.width = width;
            this.height = height;

            var fbo = webgl.CreateFramebuffer();
            WebGLFramebuffer fbold = webgl.GetParameter(webgl.FRAMEBUFFER_BINDING) as WebGLFramebuffer;
            webgl.BindFramebuffer(webgl.FRAMEBUFFER, fbo);
            webgl.FramebufferTexture2D(webgl.FRAMEBUFFER, webgl.COLOR_ATTACHMENT0, webgl.TEXTURE_2D,
                texRGBA, 0);

            var readData = new Uint8Array(this.width * this.height * 4);
            readData[0] = 2;
            webgl.ReadPixels(0, 0, this.width, this.height, webgl.RGBA, webgl.UNSIGNED_BYTE,
                readData);
            webgl.DeleteFramebuffer(fbo);
            webgl.BindFramebuffer(webgl.FRAMEBUFFER, fbold);

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
        public int width;
        public int height;
        public Uint8Array data;
        public bool gray;
        public object getPixel(float u, float v)
        {
            int x = (int)(u * this.width);
            int y = (int)(v * this.height);
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
        public spriteTexture(WebGLRenderingContext webgl, string url = null, textureformat format = textureformat.RGBA, bool mipmap = false, bool linear = true)
        {
            this.webgl = webgl;
            this.format = format;

            this.mat = new spriteMat();//ness
            this.mat.tex0 = this;
            this.mat.transparent = true;
            this.mat.shader = "spritedefault";

            if (url == null)//不给定url 则 texture 不加载
                return;
            this.texture = webgl.CreateTexture();

            this.img = new Bridge.Html5.HTMLImageElement();// Image();// HTMLImageElement(); //ness
            this.img.Src = url;
            this.img.OnLoad = (e) =>
            {
                if (this.disposeit)
                {
                    this.img = null;
                    return;
                }
                this._loadimg(mipmap, linear);
            };

        }
        private void _loadimg(bool mipmap, bool linear)
        {
            this.width = this.img.Width;
            this.height = this.img.Height;
            this.loaded = true;
            this.webgl.PixelStorei(this.webgl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            this.webgl.PixelStorei(this.webgl.UNPACK_FLIP_Y_WEBGL, 0);


            this.webgl.BindTexture(this.webgl.TEXTURE_2D, this.texture);
            var formatGL = this.webgl.RGBA;
            if (this.format == textureformat.RGB)
                formatGL = this.webgl.RGB;
            else if (this.format == textureformat.GRAY)
                formatGL = this.webgl.LUMINANCE;
            this.webgl.TexImage2D(this.webgl.TEXTURE_2D,
                0,
                formatGL,
                formatGL,
                //最后这个type，可以管格式
                this.webgl.UNSIGNED_BYTE
                , this.img);

            if (mipmap)
            {
                //生成mipmap
                this.webgl.GenerateMipmap(this.webgl.TEXTURE_2D);

                if (linear)
                {
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR_MIPMAP_LINEAR);
                }
                else
                {
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST_MIPMAP_NEAREST);

                }
            }
            else
            {
                if (linear)
                {
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.LINEAR);
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.LINEAR);
                }
                else
                {
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MAG_FILTER, this.webgl.NEAREST);
                    this.webgl.TexParameteri(this.webgl.TEXTURE_2D, this.webgl.TEXTURE_MIN_FILTER, this.webgl.NEAREST);

                }
            }
            this.img = null;



        }
        public WebGLRenderingContext webgl;
        public HTMLImageElement img = null;
        public bool loaded = false;
        public WebGLTexture texture;
        public textureformat format;
        public int width = 0;
        public int height = 0;
        static public spriteTexture fromRaw(WebGLRenderingContext webgl, HTMLImageElement img, textureformat format = textureformat.RGBA, bool mipmap = false, bool linear = true)
        {
            var st = new spriteTexture(webgl, null, format, mipmap, linear);
            st.texture = webgl.CreateTexture();
            st.img = img;
            st._loadimg(mipmap, linear);

            return st;

        }
        public spriteMat mat = null;
        //创建读取器，有可能失败
        public texReader reader;
        public texReader getReader(bool redOnly)
        {
            if (this.reader != null)
            {
                if (this.reader.gray != redOnly)
                    throw new System.Exception("get param diff with this.reader");
                return this.reader;
            }
            if (this.format != textureformat.RGBA)
                throw new System.Exception("only rgba texture can read");
            if (this.texture == null) return null;
            if (this.reader == null)
                this.reader = new texReader(this.webgl, this.texture, this.width, this.height, redOnly);

            return this.reader;
        }
        public bool disposeit = false;
        public void dispose()
        {
            if (this.texture == null && this.img != null)
                this.disposeit = true;

            if (this.texture != null)
            {
                this.webgl.DeleteTexture(this.texture);
            }
        }
        public spritePoint[] pointbuf = {
            new spritePoint(){ x=0, y= 0, z= 0, r= 0, g=0, b= 0, a= 0, r2=0, g2=0, b2= 0, a2= 0, u=0, v=0 },
            new spritePoint(){ x= 0, y= 0, z= 0, r= 0, g= 0, b= 0, a= 0, r2=0, g2= 0, b2= 0, a2= 0, u=0, v=0 },
            new spritePoint(){ x=0, y= 0, z= 0, r= 0, g= 0, b= 0, a= 0, r2= 0, g2= 0, b2= 0, a2= 0, u=0, v= 0 },
            new spritePoint(){ x=0, y=0, z=0, r= 0, g= 0, b= 0, a= 0, r2= 0, g2=0, b2= 0, a2=0, u=0, v= 0 },
        };

        public void draw(spriteBatcher spriteBatcher, spriteRect uv, spriteRect rect, spriteColor c)
        {

            {


                var p = this.pointbuf[0];
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

        public void drawCustom(spriteBatcher spriteBatcher, spriteMat _mat, spriteRect uv, spriteRect rect, spriteColor c, spriteColor c2)
        {
            _mat.tex0 = this;
            {
                var p = this.pointbuf[0];
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

    public class sprite : spriteRect
    {
        //public float x;
        //public float y;
        //public float w;
        //public float h;
        public float xsize;
        public float ysize;
    }
    //atlas
    public class spriteAtlas
    {
        public WebGLRenderingContext webgl;
        public spriteAtlas(WebGLRenderingContext webgl, string atlasurl = null, spriteTexture texture = null)
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
        public static spriteAtlas fromRaw(WebGLRenderingContext webgl, string txt, spriteTexture texture = null)
        {
            var sa = new spriteAtlas(webgl, null, texture);
            sa._parse(txt);

            return sa;
        }
        public string textureurl;
        public int texturewidth;
        public int textureheight;
        public spriteTexture texture;
        public System.Collections.Generic.Dictionary<string, sprite> sprites = new Dictionary<string, sprite>();
        private void _parse(string txt)
        {
            var json = JSON.Parse(txt).ToDynamic();
            this.textureurl = json["t"];
            this.texturewidth = json["w"];
            this.textureheight = json["h"];
            var s = (object[])json["s"];

            for (var i = 0; i < s.Length; i++)
            {
                var ss = (object[])s[i];
                var r = new sprite();//ness
                r.x = ((float)ss[1] + 0.5f) / this.texturewidth;
                r.y = ((float)ss[2] + 0.5f) / this.textureheight;
                r.w = ((float)ss[3] - 1f) / this.texturewidth;
                r.h = ((float)ss[4] - 1f) / this.textureheight;
                r.xsize = (float)ss[3];
                r.ysize = (float)ss[4];
                this.sprites[(string)ss[0]] = r;
            }

        }
        public void drawByTexture(spriteBatcher sb, string sname, spriteRect rect, spriteColor c)
        {
            if (this.texture == null) return;
            var r = this.sprites[sname];
            if (r == Script.Undefined) return;

            this.texture.draw(sb, r, rect, c);
        }

    }

    //font
    public class charinfo
    {
        public float x;//uv
        public float y;
        public float w;
        public float h;
        public float xSize;
        public float ySize;
        public float xOffset;//偏移
        public float yOffset;
        public float xAddvance;//字符宽度
    }
    public class spriteFont
    {
        public WebGLRenderingContext webgl;
        public spriteTexture texture;
        public spriteMat mat;

        public dynamic cmap;
        public string fontname;
        public float pointSize;//像素尺寸
        public float padding;//间隔
        public float lineHeight;//行高
        public float baseline;//基线
        public float atlasWidth;
        public float atlasHeight;
        public spriteFont(WebGLRenderingContext webgl, string urlconfig, spriteTexture texture)
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
        public static spriteFont fromRaw(WebGLRenderingContext webgl, string txt, spriteTexture texture = null)
        {
            var sf = new spriteFont(webgl, null, texture);
            sf._parse(txt);
            return sf;
        }
        public void _parse(string txt)
        {
            var d1 = new Date().ValueOf();
            var json = JSON.Parse(txt);

            //parse fontinfo
            var font = (object[])json["font"];
            this.fontname = (string)font[0];
            this.pointSize = (float)font[1];
            this.padding = (float)font[2];
            this.lineHeight = (float)font[3];
            this.baseline = (float)font[4];
            this.atlasWidth = (float)font[5];
            this.atlasHeight = (float)font[6];

            //parse char map
            this.cmap = new object();
            var map = json["map"];
            foreach (var c in Script.GetOwnPropertyNames(map))
            {
                var finfo = new charinfo();//ness
                this.cmap[c] = finfo;
                finfo.x = map[c].As<float[]>()[0] / this.atlasWidth;
                finfo.y = map[c].As<float[]>()[1] / this.atlasHeight;
                finfo.w = map[c].As<float[]>()[2] / this.atlasWidth;
                finfo.h = map[c].As<float[]>()[3] / this.atlasHeight;
                finfo.xSize = map[c].As<float[]>()[2];
                finfo.ySize = map[c].As<float[]>()[3];
                finfo.xOffset = map[c].As<float[]>()[4];
                finfo.yOffset = map[c].As<float[]>()[5];
                finfo.xAddvance = map[c].As<float[]>()[6];
            }
            map = null;
            json = null;


            var d2 = new Date().ValueOf();
            var n = d2 - d1;
            Console.WriteLine("json time=" + n);

        }
        spritePoint[] pointbuf = {
                  new spritePoint  { x=0, y= 0, z= 0, r= 0, g=0, b=0, a=0, r2=0, g2= 0, b2=0, a2=0, u=0,v = 0 },
             new spritePoint{ x= 0, y=0, z=0, r=0, g= 0, b= 0, a=0, r2=0, g2= 0, b2= 0, a2=0, u=0, v= 0 },
             new spritePoint{ x= 0, y= 0, z= 0, r= 0, g= 0, b= 0, a= 0, r2= 0, g2= 0, b2= 0, a2= 0, u= 0, v= 0 },
             new spritePoint{ x= 0, y= 0, z=0, r= 0, g=0, b= 0, a= 0, r2= 0, g2= 0, b2=0, a2= 0, u= 0, v= 0 },
        };
        public void draw(spriteBatcher sb, charinfo r, spriteRect rect, spriteColor c = null, spriteColor colorBorder = null)
        {
            if (c == null)
                c = spriteColor.white;
            if (colorBorder == null)
                colorBorder = new spriteColor(0f, 0f, 0f, 0.5f);
            //if (r==null)
            {
                var p = this.pointbuf[0];
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

        public void drawChar(spriteBatcher sb, string cname, spriteRect rect, spriteColor c = null, spriteColor colorBorder = null)
        {
            var r = this.cmap[cname];
            if (r == Script.Undefined) return;
            if (c == null)
                c = spriteColor.white;
            if (colorBorder == null)
                colorBorder = new spriteColor(0f, 0f, 0f, 0.5f);
            {
                var p = this.pointbuf[0];
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