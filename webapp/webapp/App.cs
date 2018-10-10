using Bridge;
using Bridge.WebGL;
using Bridge.Html5;
using Newtonsoft.Json;
using System;

namespace app
{
    public class App
    {
        public static void Main()
        {

            // Write a message to the Console
            Console.WriteLine("Welcome to Bridge.NET 2018");

            var canvas = Bridge.Html5.Document.GetElementById("renderCanvas") as HTMLCanvasElement;
            var webgl = (WebGLRenderingContext)canvas.GetContext("webgl");
            if (webgl == null)
                webgl = (WebGLRenderingContext)canvas.GetContext("experimental-webgl");
            //webglCanvas 使用流程
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

        }
    }
}