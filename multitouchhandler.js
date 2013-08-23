function multiTouchHandler(type) {
    this.type = type;
    this._uniqueId = 0;
    this.touches = [];
    this.initialized = 0;
    this.touchOnly = true;

    this.onChanged = function() {};
    this._events = {"start": [], "move": [], "end": []};

    this.bind = function(t, h) {
        if ((t != "start") && (t != "move") && (t != "end")) {
            throw "Invalid event \"" + t + "\"";
        }
        this.unbind(t, h);
        this._events[t][this._events[t].length] = h;
        return this;
    };
    this.unbind = function(t, h) {
        if ((t != "start") && (t != "move") && (t != "end")) {
            throw "Invalid event \"" + t + "\"";
        }
        oh = this._events[t];
        nh = []
        for (var i = 0 ; i < oh.length ; i++) {
            if (oh[i] != h) {
                nh[nh.length] = oh[i];
            }
        }
        this._events[i] = nh;
    }
    this._call = function(t, e) {
        hl = this._events[t];
        for (var i = 0 ; i < hl.length ; i++) {
            try {
                hl[i](e);
            } catch (err) {
                if (window.console) console.error('Error running multiTouchHandler event: ' + err);
            }
        }
    };

    this._eventHandler = function(id, type, x, y, e) {
        uid = -1;
        changed = 0;
        if (type === 0) {
            // start
            uid = this._uniqueId++;
            to = new Object();
            to.x = x;
            to.y = y;
            to.internalId = id;
            to.id = uid;
            this.touches[this.touches.length] = to;
            changed = 1;
            type = "start";
        } else if (type === 1) {
            // move
            for (var i = 0 ; i < this.touches.length ; i++) {
                if (this.touches[i].internalId === id)
                {
                    uid = this.touches[i].id;
                    this.touches[i].x = x;
                    changed = 1;
                    this.touches[i].y = y;
                }
            }
            type = "move";
        } else if (type === 2) {
            // end
            newTouches = [];
            for (var i = 0 ; i < this.touches.length ; i++) {
                if (this.touches[i].internalId === id)
                {
                    uid = this.touches[i].id;
                    changed = 1;
                }
                else
                {
                    newTouches[newTouches.length] = this.touches[i];
                }
            }
            this.touches = newTouches;
            type = "end";
        }

        // try the constructor; fall back to init otherwise
        if (changed) {
            eventDetail = new Object();
            eventDetail.id = uid;
            eventDetail.type = type;
            this._call(type, eventDetail);
        }
    };
    this.initialize = function() {
        o = this;
        if (!o.initialized)
        {
            document.addEventListener('touchstart', function(e) {
                for (var i = 0; i<e.changedTouches.length; i++){ var t=e.changedTouches[i]; 
                    o._eventHandler(t.identifier, 0, t.clientX, t.clientY, e);
                }
            });
            document.addEventListener('touchmove', function(e) {
                for (var i = 0; i<e.changedTouches.length; i++){ var t=e.changedTouches[i]; 
                    o._eventHandler(t.identifier, 1, t.clientX, t.clientY, e);
                }
            });
            document.addEventListener('touchend', function(e) {
                for (var i = 0; i<e.changedTouches.length; i++){ var t=e.changedTouches[i]; 
                    o._eventHandler(t.identifier, 2, -1, -1, e);
                }
            });
            document.addEventListener('MSPointerDown', function(e) {
                if(!o.touchOnly || (e.pointerType == e.MSPOINTER_TYPE_TOUCH)) {
                    o._eventHandler(e.pointerId, 0, e.pageX, e.pageY, e);
                }
            });
            document.addEventListener('MSPointerMove', function(e) {
                if(!o.touchOnly || (e.pointerType == e.MSPOINTER_TYPE_TOUCH)) {
                    o._eventHandler(e.pointerId, 1, e.pageX, e.pageY, e);
                }
            });
            document.addEventListener('MSPointerUp', function(e) {
                if(!o.touchOnly || (e.pointerType == e.MSPOINTER_TYPE_TOUCH)) {
                    o._eventHandler(e.pointerId, 2, -1, -1, e);
                }
            });
        }
    };
};

