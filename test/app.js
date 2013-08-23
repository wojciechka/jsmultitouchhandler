var mth = new multiTouchHandler();
var isShown = [0,0,0,0,0,0,0,0,0,0];

$(document).ready(function() {
    mth.initialize(); 
    f = function(e) {
        touches = mth.touches;
        for (var i = 0 ; i < 10; i++) {
            if (i < touches.length) {
                var t = touches[i];
                h = "@" + t.x + "," + t.y + " (" + t.id + ")";
                $("#touch" + i).html(h);

                $("#ts" + i).css({left: t.x, top: t.y});
                if (!isShown[i]) {
                    $("#ts" + i).show();
                    isShown[i] = 1;
                }
            }  else  {
                if (isShown[i]) {
                    $("#touch" + i).html("");
                    $("#ts" + i).hide();
                    isShown[i] = 0;
                }
            }
        }
    };
    mth.bind("start", f);
    mth.bind("move", f);
    mth.bind("end", f);
});
