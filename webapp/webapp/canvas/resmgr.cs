using System;
using Bridge;
using Bridge.Html5;
using Bridge.WebGL;

//v0.4
namespace lighttool
{
    public class texutreMgrItem
    {
        public spriteTexture tex;
        public string url;
        public string urladd;
        public textureformat format;
        public bool mipmap;
        public bool linear;
    }
    public class textureMgr
    {

        private static textureMgr g_this;
        public static textureMgr Instance()
        {
            if (textureMgr.g_this == null)
                textureMgr.g_this = new textureMgr();//ness

            return textureMgr.g_this;
        }
        System.Collections.Generic.Dictionary<string, texutreMgrItem> mapInfo = new System.Collections.Generic.Dictionary<string, texutreMgrItem>();

        public void reg(string url, string urladd, textureformat format, bool mipmap, bool linear)
        {
            //重复注册处理
            var item = this.mapInfo[url];
            if (item != Script.Undefined)
            {
                throw new Exception("you can't reg the same name");//ness
            }
            item = new texutreMgrItem();//ness

            this.mapInfo[url] = item;
            item.url = url;
            item.urladd = urladd;
            item.format = format;
            item.mipmap = mipmap;
            item.linear = linear;
        }
        public void regDirect(string url, spriteTexture tex)
        {
            var item = this.mapInfo[url];
            if (item != Script.Undefined)
            {
                throw new Exception("you can't reg the same name");//ness
            }
            item = new texutreMgrItem();//ness

            this.mapInfo[url] = item;
            item.url = url;
            item.tex = tex;
        }
        public void unreg(string url)
        {
            var item = this.mapInfo[url];
            if (item == Script.Undefined) return;
            this.unload(url);

            this.mapInfo[url] = null;
        }
        public void unload(string url)
        {
            var item = this.mapInfo[url];
            if (item == Script.Undefined) return;

            item.tex.dispose();
            item.tex = null;
        }
        public spriteTexture load(WebGLRenderingContext webgl, string url)
        {
            var item = this.mapInfo[url];
            if (item == Script.Undefined) return null;
            if (item.tex == null)
            {
                item.tex = new spriteTexture(webgl, item.url + item.urladd, item.format, item.mipmap, item.linear);//ness
            }
            return item.tex;
        }
    }
    public class atlasMgrItem
    {
        public spriteAtlas atals;
        public string url;
        public string urlatalstex;
        public string urlatalstex_add;
    }
    public class atlasMgr
    {
        private static g_this: atlasMgr;
        public static atlasMgr Instance()
        {
            if (atlasMgr.g_this == null)
                atlasMgr.g_this = new atlasMgr();//ness

            return atlasMgr.g_this;
        }

        System.Collections.Generic.Dictionary<string, atlasMgrItem> mapInfo = new System.Collections.Generic.Dictionary<string, atlasMgrItem>();

        public void reg(name: string, urlatlas: string, urlatalstex: string, urlatalstex_add: string)
        {
            //重复注册处理
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new atlasMgrItem();//ness

            this.mapInfo[name] = item;
            item.url = urlatlas;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        }
        public void unreg(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;
            this.unload(name, disposetex);

            this.mapInfo[name] = undefined;

        }
        public void regDirect(name: string, atlas: spriteAtlas)
        {
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new atlasMgrItem();//ness

            this.mapInfo[name] = item;
            item.atals = atlas;
        }
        public void unload(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;

            if (disposetex)
            {
                item.atals.texture.dispose();
                item.atals.texture = null;
            }
            item.atals = null;
        }

        public spriteAtlas load(webgl: WebGLRenderingContext, name: string)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return null;
            if (item.atals == null)
            {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined)
                {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add,
                        lighttool.textureformat.RGBA, false, true);

                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.atals = new spriteAtlas(webgl, item.url, tex);//ness
            }
            return item.atals;

        }
    }
    public class fontMgrItem
    {
        font: spriteFont;
        url: string;
        urlatalstex: string;
        urlatalstex_add: string;
    }
    public class fontMgr
    {
        private static fontMgr g_this;
        public static fontMgr Instance()
        {
            if (fontMgr.g_this == null)
                fontMgr.g_this = new fontMgr();//ness

            return fontMgr.g_this;
        }

        System.Collections.Generic.Dictionary<string, fontMgrItem> mapInfo = new System.Collections.Generic.Dictionary<string, fontMgrItem>();

        public void reg(name: string, urlfont: string, urlatalstex: string, urlatalstex_add: string)
        {
            //重复注册处理
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new fontMgrItem();//ness

            this.mapInfo[name] = item;
            item.url = urlfont;
            item.urlatalstex = urlatalstex;
            item.urlatalstex_add = urlatalstex_add;
        }
        public void regDirect(name: string, font: spriteFont)
        {
            let item = this.mapInfo[name];
            if (item != undefined)
            {
                throw new Error("you can't reg the same name");//ness
            }
            item = new fontMgrItem();//ness

            this.mapInfo[name] = item;
            item.font = font;
        }
        public void unreg(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;
            this.unload(name, disposetex);

            this.mapInfo[name] = undefined;

        }

        public void unload(name: string, disposetex: boolean)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return;

            if (disposetex)
            {
                item.font.texture.dispose();
                item.font.texture = null;
            }
            item.font = null;
        }

        public spriteFont load(webgl: WebGLRenderingContext, name: string)
        {
            var item = this.mapInfo[name];
            if (item == undefined) return null;
            if (item.font == null)
            {
                var tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                if (tex == undefined)
                {
                    textureMgr.Instance().reg(item.urlatalstex, item.urlatalstex_add,
                        lighttool.textureformat.GRAY, false, true);

                    tex = textureMgr.Instance().load(webgl, item.urlatalstex);
                }
                item.font = new spriteFont(webgl, item.url, tex);//ness
            }
            return item.font;

        }
    }
    public class shaderMgr
    {
        private static lighttool.shaderParser g_shaderParser;
        public static lighttool.shaderParser parserInstance()
        {
            if (shaderMgr.g_shaderParser == null)
                shaderMgr.g_shaderParser = new lighttool.shaderParser();//ness
            return shaderMgr.g_shaderParser;
        }
    }
}