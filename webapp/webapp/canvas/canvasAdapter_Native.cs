using System;
using Bridge;
using Bridge.Html5;
using Bridge.WebGL;

namespace lighttool.Native
{
    public class canvasAdapter
    {
        public static spriteCanvas CreateScreenCanvas(WebGLRenderingContext webgl, canvasAction useraction)
        {
            var el = webgl.Canvas;
            el.Width = el.ClientWidth;
            el.Height = el.ClientHeight;

            var c = new spriteCanvas(webgl, webgl.DrawingBufferWidth, webgl.DrawingBufferHeight);
            //var asp = range.width / range.height;
            c.spriteBatcher.matrix = new Float32Array(new float[] {
                    1.0f * 2 / c.width, 0, 0, 0,//去掉asp的影响
                    0, 1 * -1 * 2 / c.height, 0, 0,
                    0, 0, 1, 0,
                    -1, 1, 0, 1
            });
            c.spriteBatcher.ztest = false;//最前不需要ztest

            var ua = useraction;
            Bridge.Html5.Window.SetInterval(() =>
               {
                   webgl.Viewport(0, 0, webgl.DrawingBufferWidth, webgl.DrawingBufferHeight);
                   webgl.Clear(webgl.COLOR_BUFFER_BIT | webgl.DEPTH_BUFFER_BIT);
                   webgl.ClearColor(1.0, 0.0, 1.0, 1.0);

                   c.spriteBatcher.begindraw();

                   ua.ondraw(c);

                   c.spriteBatcher.enddraw();


                   //webgl.Flush();

               }, 20);
            Window.AddEventListener("resize", () =>
            {
                var sel = webgl.Canvas;
                sel.Width = sel.ClientWidth;
                sel.Height = sel.ClientHeight;
                sel.Width = sel.ClientWidth;
                sel.Height = sel.ClientHeight;

                c.width = sel.Width;
                c.height = sel.Height;
                c.spriteBatcher.matrix = new Float32Array(new float[]{
                1.0f * 2 / c.width, 0, 0, 0,//去掉asp的影响
                0, 1 * -1 * 2 / c.height, 0, 0,
                0, 0, 1, 0,
                -1, 1, 0, 1
            });
                ////do resize func
                ua.onresize(c);
            });


            el.OnMouseMove = (ev) =>
            {
                ua.onpointevent(c, canvaspointevent.POINT_MOVE,(float) ev["offsetX"], (float)ev["offsetY"]);
            };
            el.OnMouseUp = ( MouseEvent<HTMLCanvasElement> ev) =>
            {
                ua.onpointevent(c, canvaspointevent.POINT_UP, (float)ev["offsetX"], (float)ev["offsetY"]);
            };
            el.OnMouseDown = (MouseEvent<HTMLCanvasElement> ev) =>
            {
                ua.onpointevent(c, canvaspointevent.POINT_DOWN, (float)ev["offsetX"], (float)ev["offsetY"]);
            };
            //scene.onPointerObservable.add((pinfo: BABYLON.PointerInfo, state: BABYLON.EventState) =>
            //{
            //    var range = scene.getEngine().getRenderingCanvasClientRect();
            //    //输入
            //    var e: lighttool.canvaspointevent = lighttool.canvaspointevent.NONE;
            //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERDOWN)
            //        e = lighttool.canvaspointevent.POINT_DOWN;
            //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERMOVE)
            //        e = lighttool.canvaspointevent.POINT_MOVE;
            //    if (pinfo.type == BABYLON.PointerEventTypes.POINTERUP)
            //        e = lighttool.canvaspointevent.POINT_UP;

            //    //缩放到canvas size
            //    var x = pinfo.event.offsetX / range.width * c.width;
            //    var y = pinfo.event.offsetY / range.height * c.height;

            //    var skip: boolean = ua.onpointevent(c, e, x, y);
            //    //对 babylon，来说 2d在这里输入，3d 要 pick 以后咯

            //    state.skipNextObservers = skip;//是否中断事件
            //}
            //);

            return c;
        }


    }

}