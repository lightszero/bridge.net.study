using Bridge;
using Bridge.Html5;
using Bridge.WebGL;
//v0.6
namespace lighttool
{
    public enum canvaspointevent
    {
        NONE,
        POINT_DOWN,
        POINT_UP,
        POINT_MOVE,
    }
    public interface canvasAction
    {
        //resize 事件
        void onresize(spriteCanvas c);
        void ondraw(spriteCanvas c);
        bool onpointevent(spriteCanvas c, canvaspointevent e, float x, float yk);
    }
    public class spriteCanvas
    {
        public WebGLRenderingContext webgl;
        //panel size
        public float width;
        public float height;
        public spriteCanvas(WebGLRenderingContext webgl, float width, float height)
        {
            this.webgl = webgl;
            this.width = width;
            this.height = height;
            this.spriteBatcher = new spriteBatcher(webgl, lighttool.shaderMgr.parserInstance());//ness
        }
        public spriteBatcher spriteBatcher;

        //draw tools
        public void drawTexture(spriteTexture texture, spriteRect rect, spriteRect uvrect , spriteColor color = null)
        {
            //if (uvrect == null)
            //    uvrect = spriteRect.one;
            if (color == null)
                color = spriteColor.white;
            texture.draw(this.spriteBatcher, uvrect, rect, color);
        }
        public void drawTextureCustom(spriteTexture texture, spriteMat _mat, spriteRect rect, spriteRect uvrect , spriteColor color = null, spriteColor color2 = null)
        {
            //if (uvrect == null)
            //    uvrect = spriteRect.one;
            if (color == null)
                color = spriteColor.white;
            if (color2 == null)
                color2 = spriteColor.white;
            texture.drawCustom(this.spriteBatcher, _mat, uvrect, rect, color, color2);
        }
        public void drawSprite(string atlas, string sprite, spriteRect rect, spriteColor color = null)
        {
            if (color == null)
                color = spriteColor.white;

            var a = atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null) return;
            var r = a.sprites[sprite];
            if (r == Script.Undefined) return;
            if (a.texture == null) return;

            a.texture.draw(this.spriteBatcher, r.ToRect(), rect, color);
        }
        public void drawSpriteCustom(string atlas, string sprite, spriteMat _mat, spriteRect rect, spriteColor color = null, spriteColor color2 = null)
        {
            if (color == null)
                color = spriteColor.white;
            if (color2 == null)
                color2 = spriteColor.white;
            var a = atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null) return;
            var r = a.sprites[sprite];
            if (r == Script.Undefined) return;
            if (a.texture == null) return;

            a.texture.drawCustom(this.spriteBatcher, _mat, r.ToRect(), rect, color, color2);
        }
        public void drawSprite9(string atlas, string sprite, spriteRect rect, spriteBorder border, spriteColor color = null)
        {
            if (color == null)
                color = spriteColor.white;
            var a = atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null) return;
            var _r = a.sprites[sprite];
            if (_r == Script.Undefined) return;

            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;

            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;

            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;

            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.draw(this.spriteBatcher, this.uvrect, this.trect, color);

        }
        public void drawSprite9Custom(string atlas, string sprite, spriteMat _mat, spriteRect rect, spriteBorder border, spriteColor color = null, spriteColor color2 = null)
        {
            if (color == null)
                color = spriteColor.white;
            if (color2 == null)
                color2 = spriteColor.white;
            var a = atlasMgr.Instance().load(this.webgl, atlas);
            if (a == null) return;
            var _r = a.sprites[sprite];
            if (_r == Script.Undefined) return;

            var l = (border.l - 1) / a.texturewidth;
            var r = (border.r - 1) / a.texturewidth;
            var t = (border.t - 1) / a.textureheight;
            var b = (border.b - 1) / a.textureheight;
            //left top
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y;
            this.uvrect.w = l;
            this.uvrect.h = t;

            this.trect.x = rect.x;
            this.trect.y = rect.y;
            this.trect.w = border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

            //top
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = t;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right top
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y;
            this.uvrect.w = r;
            this.uvrect.h = t;

            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y;
            this.trect.w = border.r;
            this.trect.h = border.t;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //left
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = l;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //center
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + border.t;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.y + t;
            this.uvrect.w = r;
            this.uvrect.h = _r.h - t - b;

            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + border.t;
            this.trect.w = border.r;
            this.trect.h = rect.h - border.t - border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

            //left bottom
            this.uvrect.x = _r.x;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = l;
            this.uvrect.h = b;

            this.trect.x = rect.x;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //bottom
            this.uvrect.x = _r.x + l;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = _r.w - r - l;
            this.uvrect.h = b;

            this.trect.x = rect.x + border.l;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = rect.w - border.r - border.l;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);
            //right bottom
            this.uvrect.x = _r.x + _r.w - r;
            this.uvrect.y = _r.h + _r.y - b;
            this.uvrect.w = r;
            this.uvrect.h = b;
            this.trect.x = rect.x + rect.w - border.r;
            this.trect.y = rect.y + rect.h - border.b;
            this.trect.w = border.r;
            this.trect.h = border.b;
            a.texture.drawCustom(this.spriteBatcher, _mat, this.uvrect, this.trect, color, color2);

        }
        spriteRect uvrect = new spriteRect();

        spriteRect trect = new spriteRect();//ness

        //绘制字体，只画一行，字体沿着左上角对齐，如需其他，参考源码自制
        public void drawText(string font , string text , spriteRect rect , spriteColor color = null, spriteColor color2 = null)
        {
            if (color == null)
                color = spriteColor.white;
            if (color2 == null)
                color2 = spriteColor.black;
            var f = fontMgr.Instance().load(this.webgl, font);
            if (f == null) return;
            if (f.cmap == Script.Undefined) return;
            var xadd = 0;
            for (var i = 0; i < text.Length; i++)
            {
                var c = text.CharAt(i);
                var cinfo = f.cmap[c];
                if (cinfo == Script.Undefined)
                {
                    continue;
                }
                var s = rect.h / f.lineHeight;

                this.trect.x = rect.x + xadd + cinfo.xOffset * s;//xadd 横移，cinfo.xOffset * s 偏移

                this.trect.y = rect.y - cinfo.yOffset * s + f.baseline * s;
                //cinfo.yOffset * s 偏移
                //f.baseline * s字体基线，不管字体基线字体的零零点在字体左下角，现在需要左上脚，需要其他对齐方式另说


                this.trect.h = s * cinfo.ySize;
                this.trect.w = s * cinfo.xSize;

                xadd += cinfo.xAddvance * s;
                if (xadd >= rect.w)
                    break;//超出绘制限定框，不画了
                f.draw(this.spriteBatcher, cinfo, this.trect, color, color2);
            }
        }
    }

}