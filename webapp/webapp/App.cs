using Bridge;
using Bridge.WebGL;
using Bridge.Html5;
using Newtonsoft.Json;
using System;
using lighttool;
using System.Collections.Generic;

namespace app
{
    public class App
    {
        public static void Main()
        {

            // Write a message to the Console
            Console.WriteLine("Welcome to Bridge.NET 2018");

            var canvas = Bridge.Html5.Document.GetElementById("renderCanvas") as HTMLCanvasElement;
            App.webgl = (WebGLRenderingContext)canvas.GetContext("webgl");
            if (webgl == null)
                webgl = (WebGLRenderingContext)canvas.GetContext("experimental-webgl");

            LoadRes(webgl);

            lighttool.Native.canvasAdapter.CreateScreenCanvas(webgl, new MyCanvasAction());
        }
        static WebGLRenderingContext webgl;

        public static void LoadRes(WebGLRenderingContext webgl)
        {          //webglCanvas 使用流程
            //01.初始化材质，这个文件里配置了所有现阶段使用的shader，也可以放在不同的文件中，多执行几次parseUrl就行了
            //初始化材质
            //lighttool.shaderMgr.parserInstance().parseUrl(webgl, "shader/test.shader.txt?" + Math.random());
            //手动加载接口
            lighttool.loadTool.loadText("shader/test.shader.txt?" + Math.Random(), (txt, err) =>
            {
                lighttool.shaderMgr.parserInstance().parseDirect(webgl, txt);
            }
            );

            //02.初始化资源，这里只注册一个关系，到用到的时候才会真的去加载
            //注册贴图
            //贴图用 url 作为名字，提供一个 urladd，如果你想要价格random 啥的
            //lighttool.textureMgr.Instance().reg("tex/1.jpg", "?" + Math.random(), lighttool.textureformat.RGBA, true, true);

            //lighttool.textureMgr.Instance().reg("tex/1.jpg", "", lighttool.textureformat.RGBA, true, true);

            var img = new HTMLImageElement();// Image();
            img.Src = "tex/1.jpg";
            img.OnLoad = (e) =>
            {
                var _spimg = lighttool.spriteTexture.fromRaw(webgl, img, lighttool.textureformat.RGBA, true, true);
                lighttool.textureMgr.Instance().regDirect("tex/1.jpg", _spimg);
            };

            //注册图集(对应的贴图会自动注册到textureMgr),图集使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
            lighttool.atlasMgr.Instance().reg("2", "atlas/2.json.txt?" + Math.Random(), "tex/2.png", "?" + Math.Random());


            var img2 = new HTMLImageElement();
            img2.Src = "tex/1.png?" + Math.Random();
            img2.OnLoad = (e) =>
            {
                var _spimg2 = lighttool.spriteTexture.fromRaw(webgl, img2, lighttool.textureformat.RGBA, true, true);
                lighttool.textureMgr.Instance().regDirect("tex/1.png", _spimg2);

                lighttool.loadTool.loadText("atlas/1.json.txt?" + Math.Random(), (txt, err) =>
                {
                    var _atlas = lighttool.spriteAtlas.fromRaw(webgl, txt, _spimg2);
                    lighttool.atlasMgr.Instance().regDirect("1", _atlas);
                }
                );
            };
            //注册字体(对应的贴图会自动注册到textureMgr),字体使用一个指定的名字，你注册给他啥名字，后面就用这个名字去使用
            //lighttool.fontMgr.Instance().reg("f1", "font/STXINGKA.font.json.txt", "tex/STXINGKA.font.png", "");
            var img3 = new HTMLImageElement();
            img3.Src = "tex/STXINGKA.font.png?" + Math.Random();
            img3.OnLoad = (e) =>
            {
                var _spimg3 = lighttool.spriteTexture.fromRaw(webgl, img3, lighttool.textureformat.RGBA, true, true);
                lighttool.textureMgr.Instance().regDirect("tex/STXINGKA.font.png", _spimg3);
                lighttool.loadTool.loadText("font/STXINGKA.font.json.txt", (txt, err) =>
                {
                    var _font = lighttool.spriteFont.fromRaw(webgl, txt, _spimg3);
                    lighttool.fontMgr.Instance().regDirect("f1", _font);
                }
                );
            }
                ;

        }
        public class MyCanvasAction : lighttool.canvasAction
        {
            lighttool.spriteRect trect = new spriteRect();
            List<string> spritenames = new List<string>();
            float timer = 0;
            lighttool.spriteRect trectBtn = new lighttool.spriteRect(50, 150, 200, 50);
            bool btndown = false;
            string showtxt = "";
            public void ondraw(spriteCanvas c)
            {
                this.timer += 0.015f;
                if (this.timer > 2.0f)
                    this.timer -= 2.0f;
                //get all sprite in atlas who named "1"
                if (this.spritenames.Count == 0)
                {
                    var atlas = lighttool.atlasMgr.Instance().load(c.webgl, "1");
                    if (atlas != null)
                    {
                        foreach (var iname in atlas.sprites.Keys)
                        {
                            this.spritenames.Add(iname);
                        }

                        //init for drawer
                        //for (var cc = 0; cc < 10; cc++)
                        //{
                        //    this.cdDrawer.push(new coolDownDrawer(atlas, this.spritenames[cc]));
                        //    this.cdDrawer[cc].setDestRect(new lighttool.spriteRect(50 * cc, 50, 50, 50));
                        //}
                    }
                }

                var t = lighttool.textureMgr.Instance().load(c.webgl, "tex/1.jpg");
                if (t != null)
                {
                    this.trect.x = 0;
                    this.trect.y = 0;
                    this.trect.w = c.width;
                    this.trect.h = c.height;
                    c.drawTexture(t, this.trect, lighttool.spriteRect.one, new lighttool.spriteColor(1, 1, 1, 1.0f));
                }

                //draw atlas
                if (this.spritenames.Count > 0)
                {
                    //this.spriteBatcher.begindraw(this.atlas.mat);
                    for (var i = 0; i < 30; i++)
                    {
                        var x = (float)Math.Random() * 500;
                        var y = (float)Math.Random() * 500;
                        var si = (int)(Math.Random() * this.spritenames.Count);
                        this.trect.x = x;
                        this.trect.y = y;
                        this.trect.w = 100;
                        this.trect.h = 100;
                        //canvas 做法
                        c.drawSprite("1", this.spritenames[si], this.trect); //等同于下面的两行
                                                                             //var atlas = lighttool.atlasMgr.Instance().load(c.webgl, "1");
                                                                             //atlas.draw(c.spriteBatcher, this.spritenames[si], this.trect, this.white);
                    }
                }

                //draw font（底层方法）
                var font = lighttool.fontMgr.Instance().load(c.webgl, "f1");
                if (font != null && font.cmap != null)
                {
                    this.trect.x = 50;
                    this.trect.y = 50;
                    this.trect.w = 50;
                    this.trect.h = 50;
                    font.drawChar(c.spriteBatcher, "古", this.trect, lighttool.spriteColor.white, lighttool.spriteColor.gray);
                    this.trect.x = 100;
                    this.trect.y = 50;
                    font.drawChar(c.spriteBatcher, "老", this.trect, new lighttool.spriteColor(0.1f, 0.8f, 0.2f, 0.8f), new lighttool.spriteColor(1, 1, 1, 0));
                }

                //drawfont canvas 方法
                this.trect.x = 50;
                this.trect.y = 150;
                this.trect.w = 200;
                this.trect.h = 50;
                if (t != null)
                    c.drawTexture(t, this.trectBtn, lighttool.spriteRect.one, this.btndown ? lighttool.spriteColor.white : new lighttool.spriteColor(1, 1, 1, 0.5f));
                c.drawText("f1", "this is Btn", this.trectBtn, this.btndown ? new lighttool.spriteColor(1, 0, 0, 1) : lighttool.spriteColor.white);

                this.trect.x = 0;
                this.trect.y = 0;
                this.trect.w = 500;
                this.trect.h = 25;
                c.drawText("f1", this.showtxt, this.trect);
            }

            public bool onpointevent(spriteCanvas c, canvaspointevent e, float x, float y)
            {
                bool skipevent = false;

                this.showtxt = "point=   " + x + " |,| " + y;
                if (x > this.trectBtn.x && y > this.trectBtn.y && x < (this.trectBtn.x + this.trectBtn.w)
                    && y < (this.trectBtn.y + this.trectBtn.h))
                {
                    this.btndown = true;
                }
                else
                {
                    this.btndown = false;
                }
                return skipevent;
            }

            public void onresize(spriteCanvas c)
            {
                //throw new NotImplementedException();
            }
        }

    }
}