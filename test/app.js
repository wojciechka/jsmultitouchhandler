var mth = new multiTouchHandler();

$(document).ready(function() {
    mth.initialize(); 
    f = function(e) {
        touches = mth.touches;
        for (var i = 0 ; i < 10; i++) {
            if (i < touches.length) {
                var t = touches[i];
                h = "@" + t.x + "," + t.y + " (" + t.id + ")";
            }  else  {
                h = "";
            }
            $("#touch" + i).html(h);
        }
    };
    mth.bind("start", f);
    mth.bind("move", f);
    mth.bind("end", f);
});
